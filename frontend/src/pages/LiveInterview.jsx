import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import api from "../services/api";
import useInterviewSocket from "../hooks/useInterviewSocket";
import InterviewLobby from "../components/interview/InterviewLobby";
import AICard from "../components/interview/AICard";
import AnswerPanel from "../components/interview/AnswerPanel";
import InterviewHUD from "../components/interview/InterviewHUD";
import EndInterviewDialog from "../components/interview/EndInterviewDialog";

const DEFAULT_CONFIG = {
  type: "technical",
  companyMode: "product",
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

  const handleSubmitAnswer = (questionId, response) => {
    setAwaitingNext(true);
    socket.submitAnswer(questionId, response);
  };

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
      <div className="flex min-h-screen items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={countdown}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.4 }}
            transition={{ duration: 0.4 }}
            className="text-7xl font-bold text-primary"
          >
            {countdown || "Go!"}
          </motion.span>
        </AnimatePresence>
      </div>
    );
  }

  if (phase === "ended") {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-semibold text-foreground">
          Interview completed
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your responses have been saved. Detailed scoring and report generation
          are coming in a future update.
        </p>
        <Button className="mt-6" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-8">
      <InterviewHUD
        elapsedSeconds={socket.elapsedSeconds}
        estimatedMinutes={config.estimatedMinutes}
        questionsAnswered={socket.questionsAnswered}
        questionCount={config.questionCount}
      />

      {socket.warning && (
        <p className="rounded-lg bg-amber-500/10 px-4 py-2 text-sm text-amber-600">
          {socket.warning}
        </p>
      )}
      {socket.socketError && (
        <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-500">
          {socket.socketError}
        </p>
      )}

      <AICard question={socket.currentQuestion} thinking={awaitingNext} />

      <AnswerPanel
        sessionId={sessionId}
        question={socket.currentQuestion}
        practiceMode={config.practiceMode}
        disabled={awaitingNext || !socket.currentQuestion}
        onSubmit={handleSubmitAnswer}
        onTyping={socket.setTyping}
      />

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
  );
}
