"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { FormError } from "../ui/FormError";
import { Toast, ToastProvider } from "../ui/Toast";
import { completeDiscovery, fetchDiscoveryMessages, type DiscoveryMessage } from "../../lib/discovery";
import { getErrorMessage } from "../../lib/error-handler";

type SocketMessage =
  | { type: "assistant_message"; content: string }
  | { type: "typing"; value: boolean }
  | { type: "error"; message: string };

const MIN_QUESTIONS = 3;
const TARGET_QUESTIONS = 5;

export function DiscoveryChat() {
  const params = useParams<{ id: string }>();
  const projectId = params.id;
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<DiscoveryMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [toast, setToast] = useState<{
    title: string;
    description?: string;
    variant?: "success" | "error";
  } | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const { data, error } = useQuery({
    queryKey: ["discovery", projectId],
    queryFn: () => fetchDiscoveryMessages(projectId),
    enabled: Boolean(projectId),
  });

  useEffect(() => {
    if (data) {
      setMessages(data);
    }
  }, [data]);

  useEffect(() => {
    if (!projectId) {
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
    const wsUrl = apiUrl.replace(/^http/, "ws") + `/ws?projectId=${projectId}`;
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.addEventListener("message", (event) => {
      try {
        const payload = JSON.parse(event.data) as SocketMessage;
        if (payload.type === "assistant_message") {
          setMessages((prev) => [
            ...prev,
            {
              id: `assistant-${Date.now()}`,
              projectId,
              phase: "discovery",
              role: "assistant",
              content: payload.content,
              createdAt: new Date().toISOString(),
            },
          ]);
        }
        if (payload.type === "typing") {
          setIsTyping(payload.value);
        }
        if (payload.type === "error") {
          setToast({
            title: "Claude error",
            description: payload.message,
            variant: "error",
          });
        }
      } catch {
        setToast({
          title: "Message error",
          description: "Failed to parse response.",
          variant: "error",
        });
      }
    });

    socket.addEventListener("close", () => {
      setIsTyping(false);
    });

    return () => {
      socket.close();
    };
  }, [projectId]);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  const userCount = useMemo(
    () => messages.filter((message) => message.role === "user").length,
    [messages]
  );

  const progressText = `${Math.min(userCount, TARGET_QUESTIONS)} of ${TARGET_QUESTIONS} questions`;

  const completeMutation = useMutation({
    mutationFn: () => completeDiscovery(projectId),
    onSuccess: () => {
      setToast({
        title: "Discovery saved",
        description: "DISCOVERY.md has been generated.",
        variant: "success",
      });
    },
    onError: (err) => {
      setToast({
        title: "Discovery failed",
        description: getErrorMessage(err, "Try again."),
        variant: "error",
      });
    },
  });

  const handleSend = () => {
    const content = draft.trim();
    if (!content) {
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        projectId,
        phase: "discovery",
        role: "user",
        content,
        createdAt: new Date().toISOString(),
      },
    ]);
    setDraft("");

    socketRef.current?.send(
      JSON.stringify({ type: "user_message", content })
    );
  };

  return (
    <ToastProvider>
      <div className="grid gap-6 lg:grid-cols-[2.2fr_1fr]">
        <div className="flex h-[70vh] flex-col rounded-3xl border border-slate-700 bg-slate-800/60">
          <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4 text-xs uppercase tracking-[0.3em] text-slate-400">
            <span>Discovery log</span>
            <span>{progressText}</span>
          </div>
          <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isTyping && (
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold">
                  C
                </span>
                Claude is typing...
              </div>
            )}
          </div>
          <div className="border-t border-slate-700 px-6 py-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Share your idea or answer Claude"
              />
              <Button onClick={handleSend}>Send</Button>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-700 bg-slate-800/60 p-6 text-sm text-slate-400">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Captain tips
            </p>
            <ul className="mt-3 space-y-2">
              <li>Be specific about who the app is for.</li>
              <li>Call out the most important workflow.</li>
              <li>Mention where it will be used (mobile/desktop).</li>
            </ul>
          </div>

          <Button
            className="w-full"
            disabled={userCount < MIN_QUESTIONS || completeMutation.isPending}
            isLoading={completeMutation.isPending}
            onClick={() => completeMutation.mutate()}
          >
            Done with discovery
          </Button>

          {error && (
            <FormError message={getErrorMessage(error, "Failed to load")} />
          )}
        </aside>
      </div>

      <Toast
        open={Boolean(toast)}
        onOpenChange={(open) => {
          if (!open) {
            setToast(null);
          }
        }}
        title={toast?.title ?? ""}
        description={toast?.description}
        variant={toast?.variant}
      />
    </ToastProvider>
  );
}

function MessageBubble({ message }: { message: DiscoveryMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
          isUser
            ? "bg-beacon-amber/20 text-warm-white"
            : "bg-slate-700/60 text-slate-200"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
