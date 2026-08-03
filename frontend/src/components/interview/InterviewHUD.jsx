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
  const progress = Math.min(
    100,
    Math.round((questionsAnswered / Math.max(questionCount, 1)) * 100),
  );

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Question {questionsAnswered + 1} of {questionCount}
        </span>
        <span>
          {formatTime(elapsedSeconds)} elapsed · {formatTime(remainingSeconds)}{" "}
          remaining
        </span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-primary transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
