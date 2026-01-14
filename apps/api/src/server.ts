import express from "express";
import http from "node:http";
import { WebSocketServer, WebSocket } from "ws";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import projectsRoutes from "./routes/projects.routes";
import usersRoutes from "./routes/users.routes";
import connectionsRoutes from "./routes/connections.routes";
import discoveryRoutes from "./routes/discovery.routes";
import { loggerMiddleware } from "./middleware/logger.middleware";
import { errorMiddleware } from "./middleware/error.middleware";
import { prisma } from "./config/database";
import { connectionService } from "./services/connection.service";
import { decryptSecret } from "./services/credential-vault.service";
import { createClaudeClient, defaultClaudeModel } from "./services/claude.service";

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3001;
const webOrigin = process.env.WEB_ORIGIN ?? "http://localhost:3000";

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", webOrigin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});
app.use(express.json());
app.use(cookieParser());
app.use(loggerMiddleware);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/connections", connectionsRoutes);
app.use("/api/discovery", discoveryRoutes);

app.use(errorMiddleware);

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });

const sessionCookieNames = [
  "__Secure-authjs.session-token",
  "authjs.session-token",
  "__Secure-next-auth.session-token",
  "next-auth.session-token",
];

function parseCookies(cookieHeader?: string) {
  if (!cookieHeader) {
    return {};
  }
  return cookieHeader.split(";").reduce<Record<string, string>>((acc, part) => {
    const [key, ...rest] = part.trim().split("=");
    if (key) {
      acc[key] = decodeURIComponent(rest.join("="));
    }
    return acc;
  }, {});
}

const projectClients = new Map<string, Set<WebSocket>>();

wss.on("connection", async (socket, request) => {
  const url = new URL(request.url ?? "", `http://${request.headers.host}`);
  const projectId = url.searchParams.get("projectId");
  const cookies = parseCookies(request.headers.cookie);
  const sessionToken = sessionCookieNames
    .map((name) => cookies[name])
    .find(Boolean);

  if (!projectId || !sessionToken) {
    socket.close();
    return;
  }

  const session = await prisma.session.findUnique({
    where: { sessionToken },
  });

  if (!session) {
    socket.close();
    return;
  }

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: session.userId },
  });

  if (!project) {
    socket.close();
    return;
  }

  const clientSet = projectClients.get(projectId) ?? new Set();
  clientSet.add(socket);
  projectClients.set(projectId, clientSet);

  socket.on("close", () => {
    clientSet.delete(socket);
    if (clientSet.size === 0) {
      projectClients.delete(projectId);
    }
  });

  socket.on("message", async (data) => {
    try {
      const payload = JSON.parse(data.toString()) as {
        type: string;
        content?: string;
      };
      if (payload.type !== "user_message" || !payload.content) {
        return;
      }

      await prisma.chatMessage.create({
        data: {
          projectId,
          phase: "discovery",
          role: "user",
          content: payload.content,
        },
      });

      const sendToClients = (message: object) => {
        const encoded = JSON.stringify(message);
        for (const client of projectClients.get(projectId) ?? []) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(encoded);
          }
        }
      };

      sendToClients({ type: "typing", value: true });

      const connection = await connectionService.get(session.userId, "claude");
      if (!connection) {
        sendToClients({ type: "error", message: "Claude connection required" });
        sendToClients({ type: "typing", value: false });
        return;
      }

      const apiKey = decryptSecret(connection.encryptedApiKey);
      const client = createClaudeClient(apiKey);

      const history = await prisma.chatMessage.findMany({
        where: { projectId, phase: "discovery" },
        orderBy: { createdAt: "asc" },
        take: 20,
      });

      const response = await client.messages.create({
        model: defaultClaudeModel,
        max_tokens: 400,
        system:
          "You are Claude, Ship's discovery partner. Ask concise clarifying questions and reflect back what you learn.",
        messages: history.map((message) => ({
          role: message.role === "user" ? "user" : "assistant",
          content: message.content,
        })),
      });

      const reply =
        response.content[0]?.type === "text" ? response.content[0].text : "";

      await prisma.chatMessage.create({
        data: {
          projectId,
          phase: "discovery",
          role: "assistant",
          content: reply,
        },
      });

      sendToClients({ type: "assistant_message", content: reply });
      sendToClients({ type: "typing", value: false });
    } catch {
      socket.send(
        JSON.stringify({ type: "error", message: "Failed to send message" })
      );
      socket.send(JSON.stringify({ type: "typing", value: false }));
    }
  });
});

server.listen(port, () => {
  console.log(`Ship API running on http://localhost:${port}`);
});
