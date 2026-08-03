import { useEffect, useMemo, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Activity, Code2, Cpu, Fullscreen, Play, SendHorizonal, Sparkles, TimerReset, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchCodingQuestion, optimizeCode, reviewCode, runCode, submitCode } from '../services/codingService';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', monaco: 'javascript', starter: `function twoSum(nums, target) {
  const map = new Map();

  for (let index = 0; index < nums.length; index += 1) {
    const complement = target - nums[index];
    if (map.has(complement)) {
      return [map.get(complement), index];
    }
    map.set(nums[index], index);
  }

  return [];
}` },
  { value: 'python', label: 'Python', monaco: 'python', starter: `def two_sum(nums, target):
    seen = {}
    for index, value in enumerate(nums):
        complement = target - value
        if complement in seen:
            return [seen[complement], index]
        seen[value] = index
    return []
` },
  { value: 'java', label: 'Java', monaco: 'java', starter: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int index = 0; index < nums.length; index += 1) {
            int complement = target - nums[index];
            if (seen.containsKey(complement)) {
                return new int[] { seen.get(complement), index };
            }
            seen.put(nums[index], index);
        }
        return new int[] {};
    }
}` },
  { value: 'cpp', label: 'C++', monaco: 'cpp', starter: `#include <unordered_map>
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int index = 0; index < nums.size(); index += 1) {
            int complement = target - nums[index];
            if (seen.count(complement)) {
                return {seen[complement], index};
            }
            seen[nums[index]] = index;
        }
        return {};
    }
};
` },
];

const FALLBACK_QUESTION = {
  _id: 'fallback-question',
  title: 'Two Sum',
  description: 'Given an array of integers and a target value, return the indices of the two numbers that add up to the target.',
  difficulty: 'Easy',
  constraints: ['Each input has exactly one solution.', 'You may not use the same element twice.'],
  examples: [
    { input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]' },
  ],
  starterCode: LANGUAGES[0].starter,
};

const getLanguageConfig = (value) => LANGUAGES.find((item) => item.value === value) || LANGUAGES[0];

const getStatusTone = (status) => {
  if (!status) {
    return 'text-slate-600 dark:text-slate-300';
  }

  const normalized = String(status).toLowerCase();
  if (normalized.includes('accepted') || normalized.includes('passed')) {
    return 'text-emerald-600 dark:text-emerald-400';
  }
  if (normalized.includes('error') || normalized.includes('failed')) {
    return 'text-rose-600 dark:text-rose-400';
  }
  return 'text-amber-600 dark:text-amber-400';
};

const formatResultSummary = (result) => {
  if (!result) {
    return 'No execution yet.';
  }

  const statusDescription = result.status?.description || result.status || 'Completed';
  const stdout = result.stdout?.trim();
  const stderr = result.stderr?.trim();
  const compileOutput = result.compileOutput?.trim();

  return [statusDescription, stdout || stderr || compileOutput].filter(Boolean).join(' — ');
};

export default function CodingInterview() {
  const [question, setQuestion] = useState(FALLBACK_QUESTION);
  const [language, setLanguage] = useState('javascript');
  const [sourceCode, setSourceCode] = useState(FALLBACK_QUESTION.starterCode);
  const [stdin, setStdin] = useState('');
  const [result, setResult] = useState(null);
  const [submitSummary, setSubmitSummary] = useState(null);
  const [loadingQuestion, setLoadingQuestion] = useState(true);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [reviewResult, setReviewResult] = useState(null);
  const [optimizeResult, setOptimizeResult] = useState(null);
  const [error, setError] = useState('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setElapsedSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        const generatedQuestion = await fetchCodingQuestion({ difficulty: 'medium', companyMode: 'product', topic: 'arrays', count: 1, useAi: true, persist: false });
        if (generatedQuestion) {
          setQuestion(generatedQuestion);
          const starterCode = generatedQuestion.starterCode || getLanguageConfig(language).starter;
          setSourceCode(starterCode);
          setResult(null);
          setSubmitSummary(null);
          setError('');
        }
      } catch (requestError) {
        setError(requestError?.response?.data?.message || 'Could not load a fresh coding question. Showing a curated fallback instead.');
      } finally {
        setLoadingQuestion(false);
      }
    };

    loadQuestion();
  }, []);

  useEffect(() => {
    const storageKey = `coding-studio:${question?._id || 'default'}`;
    const savedState = window.localStorage.getItem(storageKey);

    if (!savedState) {
      setSourceCode(question?.starterCode || getLanguageConfig(language).starter);
      setHydrated(true);
      return;
    }

    try {
      const parsed = JSON.parse(savedState);
      setLanguage(parsed.language || 'javascript');
      setSourceCode(parsed.sourceCode || question?.starterCode || getLanguageConfig(language).starter);
      setStdin(parsed.stdin || '');
      setLastSavedAt(parsed.savedAt ? new Date(parsed.savedAt) : null);
    } catch {
      setSourceCode(question?.starterCode || getLanguageConfig(language).starter);
    } finally {
      setHydrated(true);
    }
  }, [question]);

  useEffect(() => {
    if (!hydrated || !question) {
      return;
    }

    const storageKey = `coding-studio:${question._id || 'default'}`;
    const payload = {
      language,
      sourceCode,
      stdin,
      savedAt: new Date().toISOString(),
    };

    window.localStorage.setItem(storageKey, JSON.stringify(payload));
    setLastSavedAt(new Date(payload.savedAt));
  }, [hydrated, question, language, sourceCode, stdin]);

  const selectedLanguage = useMemo(() => getLanguageConfig(language), [language]);

  const handleLanguageChange = (event) => {
    const nextLanguage = event.target.value;
    const nextConfig = getLanguageConfig(nextLanguage);
    setLanguage(nextLanguage);
    setSourceCode(nextConfig.starter);
    setResult(null);
    setSubmitSummary(null);
    setError('');
  };

  const handleRun = async () => {
    if (!question) {
      return;
    }

    setRunning(true);
    setError('');
    setSubmitSummary(null);

    try {
      const payload = await runCode({
        questionId: question._id,
        sourceCode,
        language,
        stdin,
      });
      setResult(payload?.result || payload);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Run failed. Please review your code and try again.');
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!question) {
      return;
    }

    setSubmitting(true);
    setError('');
    setResult(null);

    try {
      const payload = await submitCode({
        questionId: question._id,
        sourceCode,
        language,
      });
      setSubmitSummary(payload);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Submission failed. Please try again in a moment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReview = async () => {
    setReviewing(true);
    setError('');
    setReviewResult(null);

    try {
      const payload = await reviewCode({
        sourceCode,
        language,
        questionDescription: question?.description,
      });
      setReviewResult(payload);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Review failed. Please try again in a moment.');
    } finally {
      setReviewing(false);
    }
  };

  const handleOptimize = async () => {
    setOptimizing(true);
    setError('');
    setOptimizeResult(null);

    try {
      const payload = await optimizeCode({
        sourceCode,
        language,
        questionDescription: question?.description,
      });
      setOptimizeResult(payload);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Optimization guidance failed. Please try again in a moment.');
    } finally {
      setOptimizing(false);
    }
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
      return;
    }

    await document.exitFullscreen();
    setIsFullscreen(false);
  };

  const formatElapsedTime = () => {
    const minutes = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
    const seconds = String(elapsedSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="space-y-6">
      <header className="rounded-[28px] border border-slate-200/80 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-xl shadow-slate-900/20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-medium text-slate-100 backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Coding interview studio
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">Practice under pressure with a Monaco-powered workspace.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Pull a fresh coding prompt, iterate in real time, and run or submit your solution against the platform backend.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-slate-100 backdrop-blur">
              <div className="flex items-center gap-2">
                <TimerReset className="h-4 w-4" />
                <span className="font-medium">Timer</span>
              </div>
              <div className="mt-1 text-xl font-semibold">{formatElapsedTime()}</div>
            </div>
            <Button variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20" onClick={toggleFullscreen}>
              <Fullscreen className="mr-2 h-4 w-4" />
              {isFullscreen ? 'Exit full screen' : 'Full screen'}
            </Button>
          </div>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <aside className="space-y-4 rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-sm shadow-slate-200/40 dark:border-slate-700/80 dark:bg-slate-950/80">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Question</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">{question?.title || 'Loading question…'}</h2>
            </div>
            <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {question?.difficulty || 'Medium'}
            </div>
          </div>

          {loadingQuestion ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/60">
              Preparing your coding prompt...
            </div>
          ) : (
            <>
              <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4 text-sm leading-7 text-slate-700 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
                {question?.description}
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Constraints</p>
                  <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    {question?.constraints?.map((constraint) => (
                      <li key={constraint} className="flex gap-2">
                        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                        <span>{constraint}</span>
                      </li>
                    )) || <li>No constraints provided yet.</li>}
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Examples</p>
                  <div className="mt-2 space-y-2">
                    {question?.examples?.map((example) => (
                      <div key={example.input} className="rounded-2xl bg-slate-100 p-3 text-sm text-slate-700 dark:bg-slate-900/80 dark:text-slate-300">
                        <p className="font-medium">Input: {example.input}</p>
                        <p className="mt-1">Output: {example.output}</p>
                      </div>
                    )) || <p className="text-sm text-slate-500">No examples supplied.</p>}
                  </div>
                </div>
              </div>
            </>
          )}
        </aside>

        <div className="space-y-4 rounded-[28px] border border-slate-200/80 bg-white/90 p-4 shadow-sm shadow-slate-200/40 dark:border-slate-700/80 dark:bg-slate-950/80">
          <div className="flex flex-col gap-3 rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4 dark:border-slate-800/70 dark:bg-slate-900/60 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
                <Code2 className="h-4 w-4" />
                <select
                  aria-label="Select programming language"
                  className="bg-transparent outline-none"
                  value={language}
                  onChange={handleLanguageChange}
                >
                  {LANGUAGES.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </label>
              <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                <span className="font-medium">Autosave</span> on every change
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={handleRun} disabled={running || !question}>
                <Play className="mr-2 h-4 w-4" />
                {running ? 'Running…' : 'Run'}
              </Button>
              <Button variant="default" onClick={handleSubmit} disabled={submitting || !question}>
                <SendHorizonal className="mr-2 h-4 w-4" />
                {submitting ? 'Submitting…' : 'Submit'}
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-[24px] border border-slate-200/70 bg-slate-950 shadow-inner dark:border-slate-800/70">
            <Editor
              height="420px"
              language={selectedLanguage.monaco}
              value={sourceCode}
              onChange={(value) => setSourceCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                automaticLayout: true,
                wordWrap: 'on',
                padding: { top: 12, bottom: 12 },
              }}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4 dark:border-slate-800/70 dark:bg-slate-900/60">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                <Cpu className="h-4 w-4" />
                Sample input
              </div>
              <textarea
                value={stdin}
                onChange={(event) => setStdin(event.target.value)}
                placeholder="Enter sample input for run mode"
                className="mt-3 min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-700 outline-none ring-0 focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
              />
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Stored locally for this question</span>
                <span>{lastSavedAt ? `Saved ${lastSavedAt.toLocaleTimeString()}` : 'Not saved yet'}</span>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4 dark:border-slate-800/70 dark:bg-slate-900/60">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  <Sparkles className="h-4 w-4" />
                  AI coach
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={handleReview} disabled={reviewing || optimizing || !sourceCode}>
                    {reviewing ? 'Reviewing…' : 'Review'}
                  </Button>
                  <Button variant="ghost" onClick={handleOptimize} disabled={reviewing || optimizing || !sourceCode}>
                    {optimizing ? 'Optimizing…' : 'Optimize'}
                  </Button>
                </div>
              </div>

              {reviewResult ? (
                <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                  <div className="font-semibold">Review</div>
                  <p className="mt-2 leading-7">{reviewResult.review?.summary}</p>
                  <div className="mt-3 space-y-2">
                    <div>
                      <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Strengths</div>
                      <ul className="mt-1 list-disc space-y-1 pl-5">
                        {reviewResult.review?.strengths?.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Improvements</div>
                      <ul className="mt-1 list-disc space-y-1 pl-5">
                        {reviewResult.review?.improvements?.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 rounded-2xl bg-slate-100 p-3 text-sm dark:bg-slate-900/70">
                    <div className="font-medium">Estimated complexity</div>
                    <p className="mt-1">Time: {reviewResult.complexity?.estimatedTimeComplexity || 'Unknown'} • Space: {reviewResult.complexity?.estimatedSpaceComplexity || 'Unknown'}</p>
                    <p className="mt-1 text-xs text-slate-500">{reviewResult.complexity?.explanation || ''}</p>
                  </div>
                </div>
              ) : null}

              {optimizeResult ? (
                <div className="mt-3 rounded-2xl border border-primary/20 bg-primary/5 p-3 text-sm text-slate-700 dark:text-slate-300">
                  <div className="font-semibold">Optimization guidance</div>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {optimizeResult.optimizationHints?.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  <div className="mt-3 rounded-2xl bg-white/70 p-3 text-sm dark:bg-slate-900/60">
                    <div className="font-medium">Debugging hints</div>
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      {optimizeResult.debuggingHints?.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                </div>
              ) : null}
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                <Activity className="h-4 w-4" />
                Console & results
              </div>

              {error ? (
                <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
                  {error}
                </div>
              ) : null}

              <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">Execution summary</span>
                  <span className={`font-semibold ${getStatusTone(result?.status?.description || submitSummary?.status || '')}`}>
                    {result?.status?.description || submitSummary?.status || 'Waiting'}
                  </span>
                </div>
                <p className="mt-3 leading-7">
                  {result ? formatResultSummary(result) : submitSummary ? `Passed ${submitSummary.passed || 0} / ${submitSummary.total || 0}` : 'Run or submit your solution to inspect sample and hidden test feedback.'}
                </p>
              </div>

              {submitSummary ? (
                <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300">
                  <div className="font-medium">Submission report</div>
                  <p className="mt-1">Passed {submitSummary.passed || 0} of {submitSummary.total || 0} hidden tests.</p>
                  {submitSummary.results?.slice(0, 3).map((item, index) => (
                    <div key={`${item.test?.input || index}`} className="mt-2 rounded-xl bg-white/70 p-2 text-xs dark:bg-slate-900/60">
                      {item.passed ? '✓' : '✕'} {item.test?.input || `Case ${index + 1}`}
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="mt-3 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Wand2 className="h-4 w-4" />
                <span>Ideal for debugging edge cases, hidden tests, and interview pacing.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
