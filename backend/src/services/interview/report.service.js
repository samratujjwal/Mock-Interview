function normalizeScore(score) {
  const numeric = Number(score);
  return Number.isFinite(numeric) ? numeric : null;
}

export function generateSessionReport(session = {}) {
  const answeredQuestions = Array.isArray(session.questions)
    ? session.questions.filter((question) => Boolean(question?.answer?.response))
    : [];

  const scores = answeredQuestions
    .map((question) => normalizeScore(question?.answer?.score))
    .filter((value) => value !== null);

  const averageScore =
    scores.length > 0
      ? Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length)
      : null;

  const hintsUsed = answeredQuestions.reduce(
    (sum, question) => sum + (Array.isArray(question?.hints) ? question.hints.length : 0),
    0,
  );

  const strengths = [];
  const improvementAreas = [];

  if (session.role) {
    strengths.push(`Role focus: ${session.role}`);
  }

  if (session.companyMode) {
    strengths.push(`Style: ${session.companyMode}`);
  }

  if (averageScore !== null) {
    strengths.push(`Average answer score: ${averageScore}`);
  } else {
    improvementAreas.push("Add more scored answers to improve evaluation quality.");
  }

  if (hintsUsed > 0) {
    improvementAreas.push(`Used ${hintsUsed} hint${hintsUsed === 1 ? "" : "s"} during practice mode.`);
  } else {
    strengths.push("Completed without relying on hints.");
  }

  return {
    generatedAt: new Date().toISOString(),
    totalScore: averageScore,
    answeredQuestionCount: answeredQuestions.length,
    hintUsageCount: hintsUsed,
    summary: `Completed a ${session.type || "mock"} interview for ${session.role || "the candidate"}.`,
    strengths,
    improvementAreas,
    sessionStatus: session.status || "Completed",
  };
}
