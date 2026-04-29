import { motion } from "framer-motion";
import { Message } from "@/lib/useChat";

type ChatMessageProps = {
  message: Message;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] px-4 py-2.5 text-[15px] leading-relaxed tracking-wide ${
          isUser
            ? "bg-brand text-background rounded-2xl rounded-br-sm"
            : "bg-foreground/5 text-t2 rounded-2xl rounded-bl-sm"
        }`}
      >
        {message.content}
        {!isUser && !message.content && (
          <span className="inline-block h-4 w-4 animate-pulse rounded-full bg-brand/50 align-middle" />
        )}
      </div>
    </motion.div>
  );
}
