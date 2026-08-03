import { motion, AnimatePresence } from "framer-motion";
import { Bot } from "lucide-react";

export default function AICard({ question, thinking }) {
  return (
    <div className="rounded-3xl border border-border/80 bg-card/95 p-6 shadow-sm backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">AI Interviewer</p>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              live prompt
            </p>
          </div>
        </div>
        <div className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium uppercase tracking-[0.24em] text-primary">
          Live
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-muted/70 via-background to-muted/40 p-5">
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
    </div>
  );
}
