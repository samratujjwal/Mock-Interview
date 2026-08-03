import { Mic, Video, FileText, Briefcase, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

function StatusRow({ icon: Icon, label, value, ok }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </span>
      <span
        className={
          ok
            ? "text-sm font-medium text-emerald-500"
            : "text-sm font-medium text-muted-foreground"
        }
      >
        {value}
      </span>
    </div>
  );
}

export default function InterviewLobby({ config, onStart }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-4 py-10">
      <div className="mb-6 flex items-center gap-2 text-primary">
        <Sparkles className="h-6 w-6" />
        <span className="text-sm font-semibold uppercase tracking-wide">
          Interview Lobby
        </span>
      </div>

      <h1 className="mb-6 text-2xl font-semibold text-foreground">
        Ready for your {config.type} interview?
      </h1>

      <div className="space-y-3">
        <StatusRow
          icon={Briefcase}
          label="Interview type"
          value={config.type}
          ok
        />
        <StatusRow
          icon={Sparkles}
          label="Estimated duration"
          value={`~${config.estimatedMinutes} min`}
          ok
        />
        <StatusRow
          icon={Mic}
          label="AI interviewer"
          value={config.companyMode}
          ok
        />
        <StatusRow icon={Video} label="Devices" value="Text mode ready" ok />
        <StatusRow
          icon={FileText}
          label="Resume"
          value={config.resumeUsed ? "Attached" : "Not attached"}
          ok={config.resumeUsed}
        />
        <StatusRow
          icon={FileText}
          label="Job description"
          value={config.jdUsed ? "Attached" : "Not attached"}
          ok={config.jdUsed}
        />
      </div>

      <Button size="lg" className="mt-8" onClick={onStart}>
        Start Interview
      </Button>
    </div>
  );
}
