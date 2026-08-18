import { useState, useCallback } from "react";
import { executeTool, ToolCall } from "./executeTools";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

type SendMessageOptions = {
  context?: string;
};

function buildContextualMessage(userInput: string, context?: string) {
  if (!context?.trim()) return userInput;

  return `The user selected this text from your portfolio:
"${context.trim()}"

Their question: ${userInput}

Answer in context of what they selected.
Be specific to that excerpt, not generic.`;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const sendMessage = useCallback(async (text: string, options?: SendMessageOptions) => {
    if (!text.trim() || isStreaming) return;

    const userMessage: Message = { role: "user", content: text };
    const newMessages = [...messages, userMessage];
    const apiMessages = [
      ...messages,
      {
        role: "user" as const,
        content: buildContextualMessage(text, options?.context),
      },
    ];
    setMessages(newMessages);
    setInput("");
    setIsStreaming(true);

    setMessages(prev => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (res.status === 429) {
        const retryAfter = Number(res.headers.get("Retry-After"));
        const retryHint =
          Number.isFinite(retryAfter) && retryAfter > 0
            ? ` Try again in ${retryAfter}s.`
            : "";

        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].content = 
            `Moving a bit fast. Give it a second and try again.${retryHint}`;
          return updated;
        });
        setIsStreaming(false);
        return;
      }

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let raw = "";
      let markerIndex = -1;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        raw += decoder.decode(value, { stream: true });

        markerIndex = raw.indexOf("__TOOL_CALL__");
        const visible =
          markerIndex === -1 ? raw : raw.slice(0, markerIndex);
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].content = visible;
          return updated;
        });
      }

      markerIndex = raw.indexOf("__TOOL_CALL__");
      const content = markerIndex === -1 ? raw : raw.slice(0, markerIndex);
      if (markerIndex !== -1) {
        const payload = raw.slice(markerIndex + "__TOOL_CALL__".length);
        try {
          executeTool(JSON.parse(payload) as ToolCall, setToastMsg);
        } catch (e) {
          console.error("Failed to parse tool payload", e);
        }
      }

      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1].content = content;
        return updated;
      });
    } catch (err) {
      console.error(err);
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1].content = 
          "Something went wrong — try again.";
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  }, [messages, isStreaming]);

  return { messages, setMessages, input, setInput, sendMessage, isStreaming, toastMsg, setToastMsg };
}
