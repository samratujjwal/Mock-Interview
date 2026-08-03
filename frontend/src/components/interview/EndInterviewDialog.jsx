import { Button } from "@/components/ui/button";

export default function EndInterviewDialog({
  open,
  onConfirm,
  onCancel,
  finishing,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-foreground">
          End this interview?
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your progress will be saved. You won't be able to answer more
          questions in this session.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel} disabled={finishing}>
            Keep going
          </Button>
          <Button onClick={onConfirm} disabled={finishing}>
            {finishing ? "Finishing…" : "Finish Interview"}
          </Button>
        </div>
      </div>
    </div>
  );
}
