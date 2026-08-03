function formatTime(totalSeconds) {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function InterviewHUD({
  elapsedSeconds,
  estimatedMinutes,
  questionsAnswered,
  questionCount,
}) {
  const totalSeconds = estimatedMinutes * 60;
  const remainingSeconds = totalSeconds - elapsedSeconds;
  const currentQuestion = Math.min(Math.max(questionsAnswered + 1, 1), questionCount);
  const progress = Math.min(
    100,
    Math.round((questionsAnswered / Math.max(questionCount, 1)) * 100),
  );

  return (
    <div className="rounded-3xl border border-border/80 bg-card/95 p-4 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium uppercase tracking-[0.24em] text-primary">
            Live session
          </span>
          <span>
            Question {currentQuestion} of {questionCount}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            {formatTime(elapsedSeconds)} elapsed
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            {formatTime(remainingSeconds)} remaining
          </span>
        </div>
      </div>
      <div className="mt-3 h-2 rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-primary transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
