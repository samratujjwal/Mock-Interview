import { useState } from "react";
import { Lightbulb, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "../../services/api";

export default function AnswerPanel({
  sessionId,
  question,
  practiceMode,
  disabled,
  onSubmit,
  onTyping,
}) {
  const [response, setResponse] = useState("");
  const [hints, setHints] = useState([]);
  const [hintLoading, setHintLoading] = useState(false);

  const handleChange = (e) => {
    setResponse(e.target.value);
    onTyping?.(true);
  };

  const handleSubmit = () => {
    if (!response.trim() || !question?.questionId) return;
    onSubmit(question.questionId, response.trim());
    setResponse("");
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
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <textarea
        value={response}
        onChange={handleChange}
        onBlur={() => onTyping?.(false)}
        disabled={disabled}
        rows={6}
        placeholder="Type your answer…"
        className="w-full resize-none rounded-lg border border-input bg-background p-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />

      {hints.length > 0 && (
        <div className="mt-3 space-y-2">
          {hints.map((hint, i) => (
            <p
              key={i}
              className="rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-amber-600"
            >
              💡 {hint.text}
            </p>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
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
          <span />
        )}

        <Button onClick={handleSubmit} disabled={disabled || !response.trim()}>
          <Send className="mr-2 h-4 w-4" />
          Submit Answer
        </Button>
      </div>
    </div>
  );
}
