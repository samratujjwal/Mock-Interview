import {
  getInterviewSessionById,
  getCurrentQuestion,
  submitInterviewAnswer,
  assertSessionIsAnswerable,
  finishInterviewSession,
  addQuestionToSession,
  advanceToNextQuestion,
  InvalidTransitionError,
} from "../services/interview/session.service.js";
import { generateFollowUpQuestion } from "../services/interview/followUpEngine.service.js";
import { CLIENT_EVENTS, SERVER_EVENTS, interviewRoom } from "./events.js";
import { startRoomTimer, stopRoomTimer } from "./timerManager.js";

function emitError(socket, message) {
  socket.emit(SERVER_EVENTS.ERROR, { message });
}

// FEATURES 17.8 (P0): never reveal correctness/score mid-interview. Strip
// answer.score/feedback/aiEvaluation from every question before emitting —
// not just hiding it in the UI, so it never reaches the client at all.
function stripMidInterviewFeedback(session) {
  if (!session) return session;
  return {
    ...session,
    questions: (session.questions || []).map((q) => ({
      ...q,
      answer: q.answer
        ? {
            ...q.answer,
            score: undefined,
            feedback: undefined,
            aiEvaluation: undefined,
          }
        : q.answer,
    })),
  };
}

export function registerInterviewHandlers(namespace) {
  namespace.on("connection", (socket) => {
    const userId = String(socket.user._id);
    let activeSessionId = null;

    socket.on(CLIENT_EVENTS.JOIN_INTERVIEW, async ({ sessionId } = {}) => {
      try {
        if (!sessionId) return emitError(socket, "sessionId is required");

        const session = await getInterviewSessionById(userId, sessionId);
        if (!session) return emitError(socket, "Interview session not found");

        const room = interviewRoom(sessionId);
        socket.join(room);
        activeSessionId = sessionId;

        const current = await getCurrentQuestion(userId, sessionId);
        socket.emit(SERVER_EVENTS.QUESTION_GENERATED, {
          ...current,
          session: stripMidInterviewFeedback(current?.session),
        });

        if (session.status === "Active" && session.startedAt) {
          startRoomTimer(namespace, room, session.startedAt);
        }
      } catch (err) {
        console.error("joinInterview error", err);
        emitError(socket, "Failed to join interview session");
      }
    });

    socket.on(CLIENT_EVENTS.LEAVE_INTERVIEW, ({ sessionId } = {}) => {
      const targetId = sessionId || activeSessionId;
      if (!targetId) return;
      const room = interviewRoom(targetId);
      socket.leave(room);
      stopRoomTimer(room);
      if (targetId === activeSessionId) activeSessionId = null;
    });

    socket.on(
      CLIENT_EVENTS.SUBMIT_ANSWER,
      async ({ sessionId, questionId, response } = {}) => {
        try {
          const targetId = sessionId || activeSessionId;
          if (!targetId || !questionId || !response?.trim()) {
            return emitError(
              socket,
              "sessionId, questionId, and response are required",
            );
          }

          const existingSession = await getInterviewSessionById(
            userId,
            targetId,
          );
          if (!existingSession)
            return emitError(socket, "Interview session not found");

          try {
            assertSessionIsAnswerable(existingSession);
          } catch (transitionErr) {
            if (transitionErr instanceof InvalidTransitionError) {
              return emitError(
                socket,
                `Cannot submit an answer: session status is "${transitionErr.from}".`,
              );
            }
            throw transitionErr;
          }

          const session = await submitInterviewAnswer(
            userId,
            targetId,
            questionId,
            { response },
          );
          if (!session)
            return emitError(socket, "Interview session or question not found");

          const room = interviewRoom(targetId);
          namespace.to(room).emit(SERVER_EVENTS.ANSWER_EVALUATED, {
            session: stripMidInterviewFeedback(session),
          });

          const answeredQuestion = session.questions?.find(
            (q) => String(q.questionId) === String(questionId),
          );
          const followUpQuestion = await generateFollowUpQuestion({
            role: session.role,
            type: session.type,
            difficulty: session.difficulty,
            companyMode: session.companyMode,
            currentQuestion: answeredQuestion?.prompt || response,
            answer: response,
            memory: session.memory,
          });

          // Persist the follow-up as a real question and advance the pointer
          // to it — otherwise the next submitAnswer would reference a
          // questionId that was never saved.
          await addQuestionToSession(userId, targetId, followUpQuestion);
          await advanceToNextQuestion(userId, targetId);

          namespace
            .to(room)
            .emit(SERVER_EVENTS.FOLLOW_UP_QUESTION, followUpQuestion);
        } catch (err) {
          console.error("submitAnswer socket error", err);
          emitError(socket, "Failed to submit answer");
        }
      },
    );

    socket.on(CLIENT_EVENTS.TYPING, ({ sessionId, isTyping } = {}) => {
      const targetId = sessionId || activeSessionId;
      if (!targetId) return;
      socket
        .to(interviewRoom(targetId))
        .emit(CLIENT_EVENTS.TYPING, { userId, isTyping: Boolean(isTyping) });
    });

    socket.on(CLIENT_EVENTS.VOICE_CHUNK, () => {
      // Voice interview (M6, T-065/T-066) isn't built yet — accept the event
      // so the client contract is stable, but don't fake a response.
      socket.emit(SERVER_EVENTS.WARNING, {
        message: "Voice mode is not available yet.",
      });
    });

    socket.on(CLIENT_EVENTS.CAMERA_STATUS, () => {
      // Webcam/integrity checks (M10) aren't built yet.
      socket.emit(SERVER_EVENTS.WARNING, {
        message: "Camera monitoring is not available yet.",
      });
    });

    socket.on(CLIENT_EVENTS.HEARTBEAT, (_, ack) => {
      if (typeof ack === "function") ack({ ok: true, at: Date.now() });
    });

    socket.on("disconnect", () => {
      if (activeSessionId) stopRoomTimer(interviewRoom(activeSessionId));
    });
  });
}

export async function finishInterviewOverSocket(namespace, userId, sessionId) {
  const session = await finishInterviewSession(userId, sessionId);
  if (session) {
    const room = interviewRoom(sessionId);
    namespace.to(room).emit(SERVER_EVENTS.INTERVIEW_COMPLETED, { session });
    stopRoomTimer(room);
  }
  return session;
}
