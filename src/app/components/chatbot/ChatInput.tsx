import { Send } from "lucide-react";

type ChatInputProps = {
  input: string;
  setInput: (value: string) => void;
  onSend: (text: string) => void;
  disabled: boolean;
  placeholder?: string;
  autoFocus?: boolean;
};

export function ChatInput({
  input,
  setInput,
  onSend,
  disabled,
  placeholder = "Ask anything...",
  autoFocus = false,
}: ChatInputProps) {
  return (
    <div className="relative border-t border-border-dim bg-background p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSend(input);
        }}
        className="relative flex items-center"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full rounded-full border border-border-dim bg-white/5 py-3 pl-4 pr-12 text-sm text-t1 placeholder-t3 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-teal-400 text-background transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          aria-label="Send message"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
