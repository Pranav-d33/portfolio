import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

type NavigationToastProps = {
  message: string;
};

export function NavigationToast({ message }: NavigationToastProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-none fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full border border-border-dim bg-background/95 px-4 py-2 shadow-lg backdrop-blur-md"
        >
          <Sparkles className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium text-t1">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
