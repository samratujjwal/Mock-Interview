export const CLIENT_EVENTS = {
  JOIN_INTERVIEW: "joinInterview",
  LEAVE_INTERVIEW: "leaveInterview",
  SUBMIT_ANSWER: "submitAnswer",
  TYPING: "typing",
  VOICE_CHUNK: "voiceChunk",
  CAMERA_STATUS: "cameraStatus",
  HEARTBEAT: "heartbeat",
};

export const SERVER_EVENTS = {
  QUESTION_GENERATED: "questionGenerated",
  FOLLOW_UP_QUESTION: "followUpQuestion",
  ANSWER_EVALUATED: "answerEvaluated",
  TIMER_UPDATED: "timerUpdated",
  INTERVIEW_COMPLETED: "interviewCompleted",
  VOICE_RESPONSE: "voiceResponse",
  WARNING: "warning",
  ERROR: "error",
};

export function interviewRoom(sessionId) {
  return `interview:${sessionId}`;
}
