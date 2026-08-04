import { useState } from "react";
import { Lightbulb, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "../../services/api.js";

export default function AnswerPanel({
  sessionId,
  question,
  practiceMode,
  disabled,
  onSubmit,
  onTyping,
  value,
  onChange,
}) {
  const [hints, setHints] = useState([]);
  const [hintLoading, setHintLoading] = useState(false);

  const response = value ?? "";

  const handleChange = (e) => {
    onChange?.(e.target.value);
    onTyping?.(true);
  };

  const handleSubmit = () => {
    if (!response.trim() || !question?.questionId) return;
    onSubmit(question.questionId, response.trim());
    onChange?.("");
    setHints([]);
  };

  const handleHint = async () => {
    if (!question?.questionId || hintLoading) return;
    setHintLoading(true);
    try {
      const res = await api.post(
        `/interviews/${sessionId}/questions/${question.questionId}/hint`,
        {
          answer: response,
        },
      );
      const hint = res.data?.data?.hint;
      if (hint) setHints((h) => [...h, hint]);
    } catch (err) {
      // Non-fatal — hint just won't appear.
    } finally {
      setHintLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-border/80 bg-card/95 p-6 shadow-sm backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Your response</h3>
        <span className="rounded-full border border-border/70 bg-muted/70 px-2.5 py-1 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
          Focus mode
        </span>
      </div>

      <textarea
        value={response}
        onChange={handleChange}
        onBlur={() => onTyping?.(false)}
        disabled={disabled}
        rows={8}
        placeholder="Type your answer…"
        className="w-full resize-none rounded-2xl border border-border/70 bg-background/90 p-4 text-sm text-foreground transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />

      {hints.length > 0 && (
        <div className="mt-3 space-y-2">
          {hints.map((hint, i) => (
            <p
              key={i}
              className="rounded-xl border border-amber-200 bg-amber-500/10 px-3 py-2 text-sm text-amber-700"
            >
              💡 {hint.text}
            </p>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {practiceMode ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleHint}
            disabled={hintLoading || disabled}
          >
            <Lightbulb className="mr-2 h-4 w-4" />
            {hintLoading ? "Thinking…" : "Get a hint"}
          </Button>
        ) : (
          <p className="text-sm text-muted-foreground">
            Feedback appears only after the interview ends.
          </p>
        )}

        <Button onClick={handleSubmit} disabled={disabled || !response.trim()}>
          <Send className="mr-2 h-4 w-4" />
          Submit Answer
        </Button>
      </div>
    </div>
  );
}
