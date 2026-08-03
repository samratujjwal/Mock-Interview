import { CodingSubmission } from '../models/CodingSubmission.js';
import { CodingQuestion } from '../models/CodingQuestion.js';
import { judge0Service } from '../services/coding/judge0.service.js';
import { optimizeCode, reviewCode } from '../services/coding/review.service.js';

// POST /coding/run
export async function runCode(req, res) {
  try {
    const user = req.user;
    const { questionId, sourceCode, language, stdin } = req.body || {};

    if (!sourceCode || !language) {
      return res.status(400).json({ success: false, message: 'sourceCode and language are required' });
    }

    // Create a submission record (running)
    const submission = await CodingSubmission.create({
      userId: user._id,
      questionId: questionId || null,
      language,
      sourceCode,
      status: 'running',
    });

    // Execute against sample input (if provided by caller) — runSubmission will poll until completion
    const result = await judge0Service.runSubmission({ sourceCode, language, stdin });

    // Map judge result to submission fields
    const execMs = result.time != null ? Number(result.time) * 1000 : null; // judge0 time often seconds

    const statusLabel = (result.status && result.status.id === 3) ? 'passed' : (result.status && result.status.id >= 4 ? 'failed' : 'error');

    submission.executionTimeMs = execMs;
    submission.memoryUsedKb = result.memory || null;
    submission.status = statusLabel;
    submission.judgeResult = result;
    submission.passedTests = (result.status && result.status.id === 3) ? 1 : 0;
    submission.totalTests = 1;

    await submission.save();

    return res.json({ success: true, message: 'Run completed', data: { submissionId: submission._id, result } });
  } catch (err) {
    console.error('runCode error', err);
    return res.status(500).json({ success: false, message: 'Run failed', errors: [err.message] });
  }
}

// POST /coding/submit
export async function submitCode(req, res) {
  try {
    const user = req.user;
    const { questionId, sourceCode, language } = req.body || {};

    if (!questionId || !sourceCode || !language) {
      return res.status(400).json({ success: false, message: 'questionId, sourceCode and language are required' });
    }

    const question = await CodingQuestion.findById(questionId).lean().exec();
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });

    const hidden = Array.isArray(question.hiddenTestCases) ? question.hiddenTestCases : [];

    // Persist initial submission
    const submission = await CodingSubmission.create({
      userId: user._id,
      questionId,
      language,
      sourceCode,
      status: 'running',
      totalTests: hidden.length || 0,
    });

    let passed = 0;
    const results = [];

    for (const tc of hidden) {
      const stdin = tc.input || '';
      const expectedOutput = tc.output || '';
      try {
        const r = await judge0Service.runSubmission({ sourceCode, language, stdin, expectedOutput });
        const stdout = (r.stdout || '').trim();
        const expected = (r.expectedOutput || expectedOutput || '').trim();
        const passedThis = stdout === expected && r.status && r.status.id === 3;
        if (passedThis) passed += 1;
        results.push({ test: tc, result: r, passed: passedThis });
      } catch (err) {
        results.push({ test: tc, error: String(err.message || err) });
      }
    }

    submission.passedTests = passed;
    submission.status = (passed === submission.totalTests) ? 'passed' : 'failed';
    submission.judgeResult = { results, passed, total: submission.totalTests };
    submission.submittedAt = new Date();

    await submission.save();

    return res.json({ success: true, message: 'Submit completed', data: { submissionId: submission._id, passed, total: submission.totalTests, results } });
  } catch (err) {
    console.error('submitCode error', err);
    return res.status(500).json({ success: false, message: 'Submit failed', errors: [err.message] });
  }
}

export async function reviewCodeReview(req, res) {
  try {
    const { sourceCode, language, questionDescription } = req.body || {};

    const feedback = await reviewCode({
      sourceCode,
      language,
      questionDescription,
    });

    return res.json({ success: true, message: 'Code review generated', data: feedback });
  } catch (err) {
    console.error('reviewCodeReview error', err);
    return res.status(500).json({ success: false, message: 'Code review failed', errors: [err.message] });
  }
}

export async function optimizeCodeReview(req, res) {
  try {
    const { sourceCode, language, questionDescription } = req.body || {};

    const feedback = await optimizeCode({
      sourceCode,
      language,
      questionDescription,
    });

    return res.json({ success: true, message: 'Optimization guidance generated', data: feedback });
  } catch (err) {
    console.error('optimizeCodeReview error', err);
    return res.status(500).json({ success: false, message: 'Optimization guidance failed', errors: [err.message] });
  }
}
