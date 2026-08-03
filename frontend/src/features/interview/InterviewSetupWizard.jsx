import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "../../services/api";

const TYPE_MAP = {
  Technical: "technical",
  Behavioral: "behavioral",
  "System Design": "system_design",
  Mixed: "mixed",
};
const COMPANY_MODE_MAP = {
  Product: "product",
  Startup: "startup",
  FAANG: "faang",
  "Scale-up": "scale-up",
};

const STEPS = [
  {
    key: "role",
    title: "Role",
    subtitle: "Choose the role you want to practice for.",
  },
  {
    key: "experience",
    title: "Experience",
    subtitle: "Pick the experience band that best matches your target.",
  },
  {
    key: "companyMode",
    title: "Company Mode",
    subtitle: "Select the interview style you want to simulate.",
  },
  {
    key: "type",
    title: "Interview Type",
    subtitle: "Choose the kind of interview round to practice.",
  },
  {
    key: "difficulty",
    title: "Difficulty",
    subtitle: "Set the challenge level for this session.",
  },
  {
    key: "resume",
    title: "Resume",
    subtitle: "Optional: bring your resume context into the interview.",
  },
  {
    key: "jd",
    title: "Job Description",
    subtitle: "Optional: add a job description to tailor the questions.",
  },
  {
    key: "summary",
    title: "Summary",
    subtitle: "Review before starting the session.",
  },
];

const ROLE_OPTIONS = [
  "Frontend Engineer",
  "Backend Engineer",
  "Full Stack Engineer",
  "Data Engineer",
  "SDE-II",
  "System Design Engineer",
];
const EXPERIENCE_OPTIONS = [
  "0-1 years",
  "1-3 years",
  "3-5 years",
  "5-8 years",
  "8+ years",
];
const COMPANY_OPTIONS = ["Product", "Startup", "FAANG", "Scale-up"];
const TYPE_OPTIONS = ["Technical", "Behavioral", "System Design", "Mixed"];
const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard"];
const RESUME_OPTIONS = ["Skip", "Upload now", "Use existing resume"];
const JD_OPTIONS = ["Skip", "Upload now", "Use existing JD"];

const lookupSummary = (config) => {
  const questionCount =
    config.difficulty === "Hard" ? 9 : config.difficulty === "Medium" ? 7 : 5;
  const estimatedMinutes =
    config.type === "System Design" ? 35 : config.type === "Mixed" ? 30 : 22;

  return {
    questionCount,
    estimatedMinutes,
  };
};

const StepContent = ({ step, config, updateConfig, setStep, totalSteps }) => {
  const renderOptionCards = (items, value, field, variant = "outline") => (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => {
        const isActive = value === item;
        return (
          <button
            key={item}
            type="button"
            onClick={() => updateConfig(field, item)}
            className={`rounded-2xl border px-4 py-3 text-left transition-all ${
              isActive
                ? "border-primary bg-primary/10 text-primary shadow-sm"
                : "border-slate-200 bg-white text-slate-700 hover:border-primary/40 hover:bg-slate-50"
            }`}
          >
            <div className="text-sm font-semibold">{item}</div>
          </button>
        );
      })}
    </div>
  );

  if (step.key === "role") {
    return renderOptionCards(ROLE_OPTIONS, config.role, "role");
  }

  if (step.key === "experience") {
    return renderOptionCards(
      EXPERIENCE_OPTIONS,
      config.experience,
      "experience",
    );
  }

  if (step.key === "companyMode") {
    return renderOptionCards(
      COMPANY_OPTIONS,
      config.companyMode,
      "companyMode",
    );
  }

  if (step.key === "type") {
    return renderOptionCards(TYPE_OPTIONS, config.type, "type");
  }

  if (step.key === "difficulty") {
    return renderOptionCards(
      DIFFICULTY_OPTIONS,
      config.difficulty,
      "difficulty",
    );
  }

  if (step.key === "resume") {
    return renderOptionCards(RESUME_OPTIONS, config.resume, "resume");
  }

  if (step.key === "jd") {
    return renderOptionCards(JD_OPTIONS, config.jd, "jd");
  }

  const summary = lookupSummary(config);
  return (
    <div className="space-y-4 rounded-3xl bg-slate-50 p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Role
          </p>
          <p className="mt-2 text-base font-semibold text-slate-900">
            {config.role || "Not set"}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Experience
          </p>
          <p className="mt-2 text-base font-semibold text-slate-900">
            {config.experience || "Not set"}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Company mode
          </p>
          <p className="mt-2 text-base font-semibold text-slate-900">
            {config.companyMode || "Not set"}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Interview type
          </p>
          <p className="mt-2 text-base font-semibold text-slate-900">
            {config.type || "Not set"}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Difficulty
          </p>
          <p className="mt-2 text-base font-semibold text-slate-900">
            {config.difficulty || "Not set"}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Resume
          </p>
          <p className="mt-2 text-base font-semibold text-slate-900">
            {config.resume || "Skipped"}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Job description
          </p>
          <p className="mt-2 text-base font-semibold text-slate-900">
            {config.jd || "Skipped"}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Estimated session
          </p>
          <p className="mt-2 text-base font-semibold text-slate-900">
            {summary.questionCount} questions · {summary.estimatedMinutes} mins
          </p>
        </div>
      </div>
    </div>
  );
};

export default function InterviewSetupWizard() {
  const [stepIndex, setStepIndex] = useState(0);
  const [config, setConfig] = useState({
    role: "",
    experience: "",
    companyMode: "Product",
    type: "Technical",
    difficulty: "Medium",
    resume: "Skip",
    jd: "Skip",
  });
  const [error, setError] = useState("");

  const currentStep = STEPS[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;

  const progress = useMemo(
    () => Math.round(((stepIndex + 1) / STEPS.length) * 100),
    [stepIndex],
  );

  const updateConfig = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const validateCurrentStep = () => {
    if (stepIndex === 0 && !config.role) {
      setError("Please choose a role before continuing.");
      return false;
    }
    if (stepIndex === 1 && !config.experience) {
      setError("Please select an experience level before continuing.");
      return false;
    }
    if (stepIndex === 2 && !config.companyMode) {
      setError("Please choose a company mode before continuing.");
      return false;
    }
    if (stepIndex === 3 && !config.type) {
      setError("Please choose an interview type before continuing.");
      return false;
    }
    if (stepIndex === 4 && !config.difficulty) {
      setError("Please choose a difficulty before continuing.");
      return false;
    }

    return true;
  };

  const nextStep = () => {
    if (!validateCurrentStep()) return;

    if (stepIndex < STEPS.length - 1) {
      setStepIndex((prev) => prev + 1);
    }
  };

  const previousStep = () => {
    setStepIndex((prev) => Math.max(0, prev - 1));
    setError("");
  };

  const navigate = useNavigate();
  const [starting, setStarting] = useState(false);

  const handleStart = async () => {
    if (!validateCurrentStep()) return;
    setError("");
    setStarting(true);

    try {
      const { questionCount, estimatedMinutes } = lookupSummary(config);
      const res = await api.post("/interviews", {
        role: config.role,
        type: TYPE_MAP[config.type] || "technical",
        difficulty: (config.difficulty || "medium").toLowerCase(),
        companyMode: COMPANY_MODE_MAP[config.companyMode] || "product",
      });

      const sessionId = res.data?.data?.sessionId;
      if (!sessionId) throw new Error("No session id returned");

      navigate(`/interview/session/${sessionId}`, {
        state: {
          type: config.type,
          companyMode: config.companyMode,
          estimatedMinutes,
          questionCount,
          resumeUsed: config.resume !== "Skip",
          jdUsed: config.jd !== "Skip",
          practiceMode: false,
        },
      });
    } catch (err) {
      setError("Failed to start the interview. Please try again.");
      setStarting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto max-w-4xl rounded-[32px] border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/50 backdrop-blur xl:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-[0.24em]">
                Interview Setup
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              Build your next mock interview
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Configure the role, interview style, and context sources that will
              shape the AI interviewer’s questions.
            </p>
          </div>
          <div className="w-full max-w-xs rounded-2xl bg-slate-800/70 p-3">
            <div className="mb-2 flex items-center justify-between text-xs text-slate-300">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-700">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-white/10 bg-slate-950/40 p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Step {stepIndex + 1}
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-white">
                  {currentStep.title}
                </h2>
              </div>
              <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
                {currentStep.subtitle}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <StepContent
                  step={currentStep}
                  config={config}
                  updateConfig={updateConfig}
                />
              </motion.div>
            </AnimatePresence>

            {error ? (
              <p className="mt-4 rounded-2xl bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error}
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <Button
                variant="outline"
                onClick={previousStep}
                disabled={stepIndex === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>

              {isLastStep ? (
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={handleStart}
                    disabled={starting}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    {starting ? "Starting…" : "Start interview"}
                  </Button>
                </div>
              ) : (
                <Button onClick={nextStep}>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <aside className="space-y-4 rounded-[28px] border border-white/10 bg-slate-900/60 p-5">
            <h3 className="text-lg font-semibold text-white">
              Session Snapshot
            </h3>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="rounded-2xl bg-slate-800/70 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Current configuration
                </p>
                <div className="mt-2 space-y-1">
                  <p>
                    <span className="text-slate-500">Role:</span>{" "}
                    {config.role || "Pending"}
                  </p>
                  <p>
                    <span className="text-slate-500">Experience:</span>{" "}
                    {config.experience || "Pending"}
                  </p>
                  <p>
                    <span className="text-slate-500">Company mode:</span>{" "}
                    {config.companyMode}
                  </p>
                  <p>
                    <span className="text-slate-500">Type:</span> {config.type}
                  </p>
                  <p>
                    <span className="text-slate-500">Difficulty:</span>{" "}
                    {config.difficulty}
                  </p>
                </div>
              </div>
              <div className="rounded-2xl bg-slate-800/70 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Estimated format
                </p>
                <p className="mt-2 text-base font-semibold text-white">
                  {lookupSummary(config).questionCount} questions ·{" "}
                  {lookupSummary(config).estimatedMinutes} minutes
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
