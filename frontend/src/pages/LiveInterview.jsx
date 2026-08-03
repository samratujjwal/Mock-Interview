import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Clock3, Radio, CheckCircle2 } from "lucide-react";
import api from "../services/api";
import useInterviewSocket from "../hooks/useInterviewSocket";
import InterviewLobby from "../components/interview/InterviewLobby";
import AICard from "../components/interview/AICard";
import AnswerPanel from "../components/interview/AnswerPanel";
import InterviewHUD from "../components/interview/InterviewHUD";
import EndInterviewDialog from "../components/interview/EndInterviewDialog";

const RECOVERY_STORAGE_PREFIX = "mock-interview-recovery";

function getRecoveryKey(sessionId) {
  return `${RECOVERY_STORAGE_PREFIX}:${sessionId}`;
}

function readRecoverySnapshot(sessionId) {
  if (!sessionId) return null;
  try {
    const raw = localStorage.getItem(getRecoveryKey(sessionId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeRecoverySnapshot(sessionId, snapshot) {
  if (!sessionId) return;
  try {
    localStorage.setItem(getRecoveryKey(sessionId), JSON.stringify(snapshot));
  } catch {
    // Ignore storage write failures so the interview can still run.
  }
}

function deriveCurrentQuestion(session, fallbackQuestion) {
  if (!session) return fallbackQuestion || null;
  const questions = Array.isArray(session.questions) ? session.questions : [];
  if (questions.length === 0) return fallbackQuestion || null;
  const index = Math.max(0, Number(session.currentQuestionIndex) || 0);
  const safeIndex = Math.min(index, questions.length - 1);
  return questions[safeIndex] || questions[0] || fallbackQuestion || null;
}

const DEFAULT_CONFIG = {
  type: "technical",
  companyMode: "product",
  personality: "professional",
  estimatedMinutes: 25,
  questionCount: 6,
  resumeUsed: false,
  jdUsed: false,
  practiceMode: false,
};

export default function LiveInterview() {
  const { sessionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const config = { ...DEFAULT_CONFIG, ...(location.state || {}) };

  const [phase, setPhase] = useState("lobby"); // lobby | countdown | interviewing | ended
  const [countdown, setCountdown] = useState(3);
  const [awaitingNext, setAwaitingNext] = useState(false);
  const [endDialogOpen, setEndDialogOpen] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [draftAnswer, setDraftAnswer] = useState("");
  const [recoveredQuestion, setRecoveredQuestion] = useState(null);
  const [recoveredProgress, setRecoveredProgress] = useState({
    questionsAnswered: 0,
    elapsedSeconds: 0,
  });

  const socket = useInterviewSocket(
    phase === "interviewing" ? sessionId : null,
  );

  useEffect(() => {
    if (phase !== "countdown") return undefined;
    if (countdown === 0) {
      setPhase("interviewing");
      return undefined;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, countdown]);

  useEffect(() => {
    if (socket.currentQuestion) setAwaitingNext(false);
  }, [socket.currentQuestion]);

  useEffect(() => {
    if (!sessionId) return undefined;

    const storedSnapshot = readRecoverySnapshot(sessionId);
    if (storedSnapshot) {
      setPhase(storedSnapshot.phase || "interviewing");
      setCountdown(storedSnapshot.countdown ?? 3);
      setDraftAnswer(storedSnapshot.draftAnswer || "");
      setRecoveredQuestion(storedSnapshot.currentQuestion || null);
      setRecoveredProgress({
        questionsAnswered: storedSnapshot.questionsAnswered || 0,
        elapsedSeconds: storedSnapshot.elapsedSeconds || 0,
      });
    }

    const loadSession = async () => {
      try {
        const response = await api.get(`/interviews/${sessionId}`);
        const session = response?.data?.data?.session;
        if (!session) return;

        const currentQuestion = deriveCurrentQuestion(session, storedSnapshot?.currentQuestion || null);
        const questionsAnswered = (session.questions || []).filter(
          (question) => question.answer?.submittedAt,
        ).length;

        setRecoveredQuestion(currentQuestion);
        setRecoveredProgress((prev) => ({
          ...prev,
          questionsAnswered: questionsAnswered || prev.questionsAnswered || 0,
        }));
      } catch {
        // Fall back to locally cached recovery state if the server cannot be reached.
      }
    };

    loadSession();
    return undefined;
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return undefined;

    if (phase === "ended") {
      try {
        localStorage.removeItem(getRecoveryKey(sessionId));
      } catch {
        // Ignore cleanup failures.
      }
      return undefined;
    }

    const nextQuestionsAnswered =
      socket.questionsAnswered > 0
        ? socket.questionsAnswered
        : recoveredProgress.questionsAnswered || 0;
    const nextElapsedSeconds =
      socket.elapsedSeconds > 0
        ? socket.elapsedSeconds
        : recoveredProgress.elapsedSeconds || 0;

    setRecoveredProgress((prev) => {
      if (
        prev.questionsAnswered === nextQuestionsAnswered &&
        prev.elapsedSeconds === nextElapsedSeconds
      ) {
        return prev;
      }
      return {
        ...prev,
        questionsAnswered: nextQuestionsAnswered,
        elapsedSeconds: nextElapsedSeconds,
      };
    });

    if (socket.currentQuestion || recoveredQuestion) {
      setRecoveredQuestion((prev) => {
        const nextQuestion = socket.currentQuestion || recoveredQuestion || prev;
        return nextQuestion === prev ? prev : nextQuestion;
      });
    }

    const snapshot = {
      phase,
      countdown,
      draftAnswer,
      currentQuestion: socket.currentQuestion || recoveredQuestion,
      questionsAnswered: nextQuestionsAnswered,
      elapsedSeconds: nextElapsedSeconds,
      updatedAt: Date.now(),
    };

    writeRecoverySnapshot(sessionId, snapshot);
    return undefined;
  }, [
    sessionId,
    phase,
    countdown,
    draftAnswer,
    socket.currentQuestion,
    socket.questionsAnswered,
    socket.elapsedSeconds,
    recoveredQuestion,
    recoveredProgress.questionsAnswered,
    recoveredProgress.elapsedSeconds,
  ]);

  const handleSubmitAnswer = (questionId, response) => {
    setAwaitingNext(true);
    setDraftAnswer("");
    socket.submitAnswer(questionId, response);
  };

  const currentQuestion = socket.currentQuestion || recoveredQuestion;
  const questionsAnswered = Math.max(
    socket.questionsAnswered,
    recoveredProgress.questionsAnswered,
  );
  const elapsedSeconds =
    recoveredProgress.elapsedSeconds || socket.elapsedSeconds || 0;

  const handleFinish = async () => {
    setFinishing(true);
    try {
      await api.patch(`/interviews/${sessionId}/finish`);
      setPhase("ended");
    } catch (err) {
      // Leave the dialog open so the user can retry.
    } finally {
      setFinishing(false);
      setEndDialogOpen(false);
    }
  };

  if (phase === "lobby") {
    return (
      <InterviewLobby config={config} onStart={() => setPhase("countdown")} />
    );
  }

  if (phase === "countdown") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_60%)] px-4 py-10">
        <div className="w-full max-w-xl rounded-3xl border border-border/80 bg-card/95 p-8 text-center shadow-xl backdrop-blur">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
          </div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Starting soon
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-foreground">
            Your mock interview is about to begin
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Focus on clarity, structure, and confidence. You’ll receive a live prompt and can answer at your own pace.
          </p>
          <div className="mt-8 flex justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={countdown}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.3 }}
                transition={{ duration: 0.35 }}
                className="flex h-24 w-24 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-4xl font-semibold text-primary"
              >
                {countdown || "Go"}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "ended") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_60%)] px-4 py-10">
        <div className="w-full max-w-lg rounded-3xl border border-border/80 bg-card/95 p-8 text-center shadow-xl backdrop-blur">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold text-foreground">
            Interview completed
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your responses have been saved. Detailed scoring and report generation are coming in a future update.
          </p>
          <Button className="mt-6" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_60%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4">
        <div className="rounded-3xl border border-border/80 bg-card/95 p-4 shadow-sm backdrop-blur sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Mock interview session
              </p>
              <h1 className="mt-1 text-2xl font-semibold text-foreground">
                {config.type === "technical" ? "Technical interview" : "Interview session"}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {config.companyMode ? `${config.companyMode} style` : "Live practice"} · {config.personality || "professional"} tone
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1.5">
                <Radio className="h-4 w-4 text-primary" />
                {socket.connected ? "Connected" : "Connecting"}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1.5">
                <Clock3 className="h-4 w-4 text-primary" />
                {config.estimatedMinutes} min plan
              </span>
            </div>
          </div>
        </div>

        <InterviewHUD
          elapsedSeconds={elapsedSeconds}
          estimatedMinutes={config.estimatedMinutes}
          questionsAnswered={questionsAnswered}
          questionCount={config.questionCount}
        />

        {(socket.warning || socket.socketError) && (
          <div className="space-y-2">
            {socket.warning && (
              <p className="rounded-2xl border border-amber-200 bg-amber-500/10 px-4 py-3 text-sm text-amber-700">
                {socket.warning}
              </p>
            )}
            {socket.socketError && (
              <p className="rounded-2xl border border-red-200 bg-red-500/10 px-4 py-3 text-sm text-red-600">
                {socket.socketError}
              </p>
            )}
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <AICard question={currentQuestion} thinking={awaitingNext} />
          <AnswerPanel
            sessionId={sessionId}
            question={currentQuestion}
            practiceMode={config.practiceMode}
            disabled={awaitingNext || !currentQuestion}
            onSubmit={handleSubmitAnswer}
            onTyping={socket.setTyping}
            value={draftAnswer}
            onChange={setDraftAnswer}
          />
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => setEndDialogOpen(true)}>
            End Interview
          </Button>
        </div>

        <EndInterviewDialog
          open={endDialogOpen}
          finishing={finishing}
          onConfirm={handleFinish}
          onCancel={() => setEndDialogOpen(false)}
        />
      </div>
    </div>
  );
}
