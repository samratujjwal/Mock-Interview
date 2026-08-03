import { aiService } from '../services/ai/ai.service.js';
import { formatAIResponse } from '../services/ai/response.service.js';
import { promptService } from '../services/prompt.service.js';
import { evaluateInterviewAnswer } from '../services/interview/answerEvaluation.service.js';
import { generateFollowUpQuestion } from '../services/interview/followUpEngine.service.js';
import { generateInterviewQuestions } from '../services/interview/questionGenerator.service.js';

function success(res, data = {}, message = 'Success') {
  return res.json({ success: true, message, data });
}

export async function createCompletion(req, res) {
  try {
    const {
      prompt,
      promptTemplateKey,
      promptTemplateVersion,
      promptTemplateData,
      model,
      temperature,
      maxTokens,
      provider,
    } = req.body;

    let finalPrompt = null;
    if (promptTemplateKey) {
      finalPrompt = promptService.renderPrompt({
        key: promptTemplateKey,
        version: promptTemplateVersion,
        values: promptTemplateData || {},
      });
    }

    if (!finalPrompt && prompt) {
      finalPrompt = String(prompt).trim();
    }

    if (!finalPrompt) {
      return res.status(422).json({ success: false, message: 'Prompt or prompt template key is required' });
    }

    const userId = req.user?._id ? String(req.user._id) : undefined;
    const rawResult = await aiService.request({
      prompt: finalPrompt,
      model: model ? String(model).trim() : undefined,
      temperature: temperature == null ? 0.2 : Number(temperature),
      maxTokens: maxTokens == null ? 512 : Number(maxTokens),
      provider: provider ? String(provider).trim().toLowerCase() : undefined,
      userId,
      metadata: {
        route: 'ai.completions',
        promptTemplateKey: promptTemplateKey || null,
        promptTemplateVersion: promptTemplateVersion || null,
        timestamp: new Date().toISOString(),
      },
    });

    const formattedResult = formatAIResponse(rawResult);

    return success(res, { completion: formattedResult }, 'AI completion created');
  } catch (err) {
    console.error('AI completion error', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to generate completion' });
  }
}

export async function generateQuestions(req, res) {
  try {
    const userId = req.user?._id ? String(req.user._id) : null;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthenticated' });
    }

    const { type: requestedType } = req.params;
    const {
      type,
      difficulty,
      companyMode,
      personality,
      topic,
      role,
      resumeSummary,
      jobDescriptionSummary,
      previousQuestions,
      count,
      useAi,
      memory,
    } = req.body;

    const questionType = requestedType || type || 'technical';
    const questions = await generateInterviewQuestions({
      type: questionType,
      difficulty,
      companyMode,
      personality,
      topic,
      role,
      resumeSummary,
      jobDescriptionSummary,
      previousQuestions,
      count,
      useAi,
      memory,
      userId,
    });

    return success(res, { questions }, 'Interview questions generated');
  } catch (err) {
    console.error('Generate interview questions error', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to generate interview questions' });
  }
}

export async function evaluateAnswer(req, res) {
  try {
    const userId = req.user?._id ? String(req.user._id) : null;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthenticated' });
    }

    const { role, type, difficulty, companyMode, personality, question, answer, memory } = req.body;
    if (!question || !String(question).trim()) {
      return res.status(422).json({ success: false, message: 'Question is required' });
    }
    if (!answer || !String(answer).trim()) {
      return res.status(422).json({ success: false, message: 'Answer is required' });
    }

    const evaluation = await evaluateInterviewAnswer({
      role,
      type,
      difficulty,
      companyMode,
      personality,
      question,
      answer,
      memory,
    });

    return success(res, { evaluation }, 'Answer evaluation generated');
  } catch (err) {
    console.error('Evaluate interview answer error', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to evaluate interview answer' });
  }
}

export async function generateFollowUp(req, res) {
  try {
    const userId = req.user?._id ? String(req.user._id) : null;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthenticated' });
    }

    const { role, type, difficulty, companyMode, personality, currentQuestion, answer, memory } = req.body;
    if (!currentQuestion || !String(currentQuestion).trim()) {
      return res.status(422).json({ success: false, message: 'Current question is required' });
    }
    if (!answer || !String(answer).trim()) {
      return res.status(422).json({ success: false, message: 'Answer is required' });
    }

    const followUp = await generateFollowUpQuestion({
      role,
      type,
      difficulty,
      companyMode,
      personality,
      currentQuestion,
      answer,
      memory,
    });

    return success(res, { question: followUp }, 'Follow-up question generated');
  } catch (err) {
    console.error('Generate follow-up question error', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to generate follow-up question' });
  }
}
