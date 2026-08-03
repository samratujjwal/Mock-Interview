import { motion, AnimatePresence } from "framer-motion";
import { Bot } from "lucide-react";

export default function AICard({ question, thinking }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Bot className="h-5 w-5" />
        </div>
        <span className="text-sm font-medium text-muted-foreground">
          AI Interviewer
        </span>
      </div>

      <AnimatePresence mode="wait">
        {thinking ? (
          <motion.p
            key="thinking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-lg text-muted-foreground italic"
          >
            AI is preparing the next question…
          </motion.p>
        ) : (
          <motion.p
            key={question?.questionId || "question"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="text-lg font-medium leading-relaxed text-foreground"
          >
            {question?.prompt || "Waiting for your first question…"}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
