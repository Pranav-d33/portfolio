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
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].content = 
            "Moving a bit fast — give it a second and try again.";
          return updated;
        });
        setIsStreaming(false);
        return;
      }

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantMsg = "";
      let hasTriggeredTool = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        
        if (chunk.includes("__TOOL_CALL__")) {
           const parts = chunk.split("__TOOL_CALL__");
           assistantMsg += parts[0];
           if (!hasTriggeredTool) {
               try {
                   const toolPayload = JSON.parse(parts[1]) as ToolCall;
                   executeTool(toolPayload, setToastMsg);
                   hasTriggeredTool = true;
               } catch(e) {
                   console.error("Failed to parse tool payload", e);
               }
           }
        } else {
           assistantMsg += chunk;
        }

        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].content = assistantMsg;
          return updated;
        });
      }
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
