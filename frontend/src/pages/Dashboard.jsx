import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Activity, Sparkles, ChartBar, TrendingUp, Trophy } from 'lucide-react';
import useAuthStore from '../store/useAuthStore.js';
import api from '../services/api.js';
import { Button } from '@/components/ui/button';

const fetchDashboard = async () => {
  const res = await api.get("/dashboard");
  return res.data?.data?.summary || {};
};

const fetchWeekly = async () => {
  const res = await api.get("/dashboard/weekly");
  return res.data?.data || { weekly: [], meta: {} };
};

const fetchMonthly = async () => {
  const res = await api.get("/dashboard/monthly");
  return res.data?.data || { monthly: [], meta: {} };
};

const fetchStrongTopics = async () => {
  const res = await api.get("/dashboard/topics/strong");
  return res.data?.data?.topics || [];
};

const fetchWeakTopics = async () => {
  const res = await api.get("/dashboard/topics/weak");
  return res.data?.data?.topics || [];
};

const formatHours = (value) => `${value.toFixed(1)}h`;

const buildBars = (data, valueKey, labelKey, fallbackLabel) => {
  if (!data || !data.length) {
    return (
      <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
        {fallbackLabel}
      </div>
    );
  }

  const maxValue = Math.max(...data.map((entry) => entry[valueKey] || 0), 1);

  return (
    <div className="space-y-3">
      {data.map((entry, index) => {
        const value = entry[valueKey] ?? 0;
        const percent = Math.round((value / maxValue) * 100);
        return (
          <div key={`${labelKey}-${index}`}>
            <div className="flex items-center justify-between text-sm text-slate-700">
              <span>{entry[labelKey]}</span>
              <span>{formatHours(value)}</span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-slate-200">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const {
    data: summary = {},
    isLoading: summaryLoading,
    isError: summaryError,
  } = useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: fetchDashboard,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: weeklyData = { weekly: [], meta: {} },
    isLoading: weeklyLoading,
  } = useQuery({
    queryKey: ["dashboard", "weekly"],
    queryFn: fetchWeekly,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: monthlyData = { monthly: [], meta: {} },
    isLoading: monthlyLoading,
  } = useQuery({
    queryKey: ["dashboard", "monthly"],
    queryFn: fetchMonthly,
    staleTime: 1000 * 60 * 5,
  });

  const { data: strongTopics = [], isLoading: strongLoading } = useQuery({
    queryKey: ["dashboard", "strongTopics"],
    queryFn: fetchStrongTopics,
    staleTime: 1000 * 60 * 5,
  });

  const { data: weakTopics = [], isLoading: weakLoading } = useQuery({
    queryKey: ["dashboard", "weakTopics"],
    queryFn: fetchWeakTopics,
    staleTime: 1000 * 60 * 5,
  });

  const loading =
    summaryLoading ||
    weeklyLoading ||
    monthlyLoading ||
    strongLoading ||
    weakLoading;

  const cards = useMemo(
    () => [
      {
        label: "Interviews",
        value: summary.totalInterviews ?? 0,
        icon: Activity,
        description: "Completed interviews",
      },
      {
        label: "Practice Hours",
        value: formatHours(summary.practiceHours ?? 0),
        icon: Sparkles,
        description: "Total practice time",
      },
      {
        label: "Average Score",
        value: `${summary.averageScore?.toFixed?.(1) ?? 0}%`,
        icon: TrendingUp,
        description: "Performance score",
      },
      {
        label: "Streak",
        value: `${summary.streakDays ?? 0} days`,
        icon: Trophy,
        description: "Active streak",
      },
      {
        label: "XP",
        value: summary.xp ?? 0,
        icon: ArrowRight,
        description: "Experience points",
      },
      {
        label: "Level",
        value: summary.level ?? 1,
        icon: ChartBar,
        description: "Current level",
      },
    ],
    [summary],
  );

  return (
    <div className="space-y-8 p-6">
      <header className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm shadow-slate-200/50 backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-950/80">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Dashboard
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Welcome back, {user?.name || "interviewer"}.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              Your practice summary, progress charts, and recommended actions
              are on this home page. Keep pushing your interview readiness
              forward.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <a href="/interview">Start interview</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/coding">Coding practice</a>
            </Button>
          </div>
        </div>
      </header>

      {summaryError ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
          Unable to load dashboard data. Please refresh the page or try again
          later.
        </div>
      ) : (
        <>
          <section className="grid gap-4 xl:grid-cols-3">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-950/80"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {card.label}
                      </p>
                      <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">
                        {card.value}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-primary/20">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
            <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-950/80">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Weekly progress
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Track how many hours you practiced across recent weeks.
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {weeklyData.weekly?.length || 0} weeks
                </span>
              </div>
              {loading ? (
                <div className="rounded-3xl border border-dashed border-slate-300/80 bg-slate-50 p-8 text-center text-sm text-slate-500 dark:border-slate-700/80 dark:bg-slate-900/50">
                  Loading charts...
                </div>
              ) : (
                buildBars(
                  weeklyData.weekly.map((item) => ({
                    ...item,
                    label: new Date(item.weekStart).toLocaleDateString(
                      undefined,
                      { month: "short", day: "numeric" },
                    ),
                  })),
                  "hours",
                  "label",
                  "No weekly practice logged yet.",
                )
              )}
            </div>

            <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-950/80">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Strong topics
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Areas where you are performing well.
                </p>
              </div>
              {strongLoading ? (
                <div className="rounded-3xl border border-dashed border-slate-300/80 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-slate-700/80 dark:bg-slate-900/50">
                  Loading topics...
                </div>
              ) : strongTopics.length ? (
                <div className="grid gap-2">
                  {strongTopics.map((topic) => (
                    <div
                      key={topic}
                      className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
                    >
                      {topic}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300/80 bg-slate-50 p-6 text-sm text-slate-500 dark:border-slate-700/80 dark:bg-slate-900/50">
                  No strong topic data yet. Complete more interviews to unlock
                  insights.
                </div>
              )}
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[0.6fr_1.4fr]">
            <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-950/80">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Weak topics
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Focus on opportunities to improve.
                </p>
              </div>
              {weakLoading ? (
                <div className="rounded-3xl border border-dashed border-slate-300/80 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-slate-700/80 dark:bg-slate-900/50">
                  Loading topics...
                </div>
              ) : weakTopics.length ? (
                <div className="grid gap-2">
                  {weakTopics.map((topic) => (
                    <div
                      key={topic}
                      className="rounded-2xl bg-rose-100 px-4 py-3 text-sm font-medium text-rose-700 dark:bg-rose-950/50 dark:text-rose-200"
                    >
                      {topic}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300/80 bg-slate-50 p-6 text-sm text-slate-500 dark:border-slate-700/80 dark:bg-slate-900/50">
                  No weak topic data yet. Practice interviews to uncover weaker
                  areas.
                </div>
              )}
            </div>

            <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-950/80">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Monthly practice
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Recent performance over the last months.
                </p>
              </div>
              {monthlyLoading ? (
                <div className="rounded-3xl border border-dashed border-slate-300/80 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-slate-700/80 dark:bg-slate-900/50">
                  Loading monthly progress...
                </div>
              ) : (
                buildBars(
                  monthlyData.monthly.map((item) => ({
                    ...item,
                    label: item.month,
                  })),
                  "hours",
                  "label",
                  "No monthly practice logged yet.",
                )
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-950/80">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Quick actions
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Access your next interview, coding practice, or profile
                  settings.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <a href="/interview">Resume interview</a>
                </Button>
                <Button variant="secondary" asChild>
                  <a href="/profile">Profile settings</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/reports">View reports</a>
                </Button>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
