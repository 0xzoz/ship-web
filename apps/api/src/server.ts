import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import projectsRoutes from "./routes/projects.routes";
import usersRoutes from "./routes/users.routes";
import { loggerMiddleware } from "./middleware/logger.middleware";
import { errorMiddleware } from "./middleware/error.middleware";

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

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Ship API running on http://localhost:${port}`);
});
