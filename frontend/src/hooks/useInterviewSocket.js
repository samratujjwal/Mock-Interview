import { useEffect, useRef, useState, useCallback } from "react";
import { createInterviewSocket } from "../services/socket";
import useAuthStore from "../store/useAuthStore";

const EMPTY_STATE = {
  connected: false,
  currentQuestion: null,
  questionsAnswered: 0,
  elapsedSeconds: 0,
  sessionStatus: null,
  warning: null,
  socketError: null,
};

export default function useInterviewSocket(sessionId) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const socketRef = useRef(null);
  const [state, setState] = useState(EMPTY_STATE);

  useEffect(() => {
    if (!sessionId || !accessToken) return undefined;

    const socket = createInterviewSocket(accessToken);
    socketRef.current = socket;

    const join = () => socket.emit("joinInterview", { sessionId });

    socket.on("connect", () => {
      setState((s) => ({ ...s, connected: true, socketError: null, warning: null }));
      join();
    });

    socket.on("connect_error", () => {
      setState((s) => ({ ...s, connected: false, socketError: "Unable to connect to the interview session." }));
    });

    socket.on("reconnect", () => {
      setState((s) => ({ ...s, connected: true, socketError: null, warning: null }));
      join();
    });

    socket.on("disconnect", () => {
      setState((s) => ({ ...s, connected: false }));
    });

    socket.on("questionGenerated", (payload) => {
      const questionsAnswered = (payload?.session?.questions || []).filter(
        (q) => q.answer?.submittedAt,
      ).length;
      setState((s) => ({
        ...s,
        currentQuestion: payload?.question || payload?.currentQuestion || null,
        sessionStatus: payload?.session?.status || s.sessionStatus,
        questionsAnswered,
      }));
    });

    socket.on("followUpQuestion", (question) => {
      setState((s) => ({ ...s, currentQuestion: question || null }));
    });

    socket.on("answerEvaluated", (payload) => {
      const questionsAnswered = (payload?.session?.questions || []).filter(
        (q) => q.answer?.submittedAt,
      ).length;
      setState((s) => ({
        ...s,
        sessionStatus: payload?.session?.status || s.sessionStatus,
        questionsAnswered,
      }));
    });

    socket.on("timerUpdated", ({ elapsedSeconds }) => {
      setState((s) => ({ ...s, elapsedSeconds }));
    });

    socket.on("interviewCompleted", () => {
      setState((s) => ({ ...s, sessionStatus: "Completed" }));
    });

    socket.on("warning", ({ message }) => {
      setState((s) => ({ ...s, warning: message }));
    });

    socket.on("error", ({ message }) => {
      setState((s) => ({ ...s, socketError: message }));
    });

    socket.connect();

    return () => {
      socket.emit("leaveInterview", { sessionId });
      socket.disconnect();
      socketRef.current = null;
    };
  }, [sessionId, accessToken]);

  const submitAnswer = useCallback(
    (questionId, response) => {
      socketRef.current?.emit("submitAnswer", {
        sessionId,
        questionId,
        response,
      });
    },
    [sessionId],
  );

  const setTyping = useCallback(
    (isTyping) => {
      socketRef.current?.emit("typing", { sessionId, isTyping });
    },
    [sessionId],
  );

  return { ...state, submitAnswer, setTyping };
}
