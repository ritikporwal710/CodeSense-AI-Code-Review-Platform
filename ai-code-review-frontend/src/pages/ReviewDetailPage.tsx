import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  Code2,
  Loader2,
  XCircle,
  Trophy,
  ThumbsUp,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Copy,
  Check,
  ArrowLeft,
} from "lucide-react";
import { getReviewById } from "@/services/reviewService";
import { ROUTES } from "@/constants/routes";
import type { CodeReview, ReviewIssue } from "@/types/review";

const SEVERITY_CONFIG = {
  critical: {
    icon: XCircle,
    label: "Critical",
    className: "text-red-400 border-red-500/30 bg-red-500/10",
    dot: "bg-red-500",
  },
  major: {
    icon: AlertCircle,
    label: "Major",
    className: "text-orange-400 border-orange-500/30 bg-orange-500/10",
    dot: "bg-orange-500",
  },
  minor: {
    icon: AlertTriangle,
    label: "Minor",
    className: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
    dot: "bg-yellow-500",
  },
  info: {
    icon: Info,
    label: "Info",
    className: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    dot: "bg-blue-400",
  },
};

// const getScoreGradient = (score: number) => {
//   if (score >= 80) return "from-green-500 to-emerald-500";
//   if (score >= 60) return "from-yellow-500 to-amber-500";
//   return "from-red-500 to-rose-500";
// };

const getScoreLabel = (score: number) => {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Good";
  if (score >= 60) return "Fair";
  if (score >= 40) return "Needs work";
  return "Significant issues";
};

function IssueCard({ issue }: { issue: ReviewIssue }) {
  const [expanded, setExpanded] = useState(false);
  const config = SEVERITY_CONFIG[issue.severity];
  const Icon = config.icon;

  return (
    <div
      className={`rounded-xl border ${config.className} overflow-hidden shadow-sm shadow-black/20`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-4 p-4 text-left hover:bg-white/5 transition-all"
      >
        <div className={`p-1.5 rounded-lg ${config.className} border-none`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-bold text-sm tracking-tight">
              {issue.title}
            </span>
            {issue.line && (
              <span className="text-[10px] font-mono opacity-50 bg-black/20 px-1.5 py-0.5 rounded border border-white/5">
                L{issue.line}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium opacity-60 uppercase tracking-wider">
              {issue.category}
            </span>
            <span
              className={`inline-block w-1 h-1 rounded-full ${config.dot} opacity-70`}
            />
            <span className="text-xs font-bold opacity-80 uppercase tracking-widest">
              {config.label}
            </span>
          </div>
        </div>
        <div className="p-1 rounded-md bg-white/5 opacity-40 group-hover:opacity-100 transition-opacity">
          {expanded ? (
            <ChevronUp className="w-4 h-4 flex-shrink-0" />
          ) : (
            <ChevronDown className="w-4 h-4 flex-shrink-0" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-5 space-y-4 border-t border-current/10 pt-4 bg-[#0a0a0f]/40 backdrop-blur-sm">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-2">
              The Issue
            </p>
            <p className="text-sm leading-relaxed opacity-80">
              {issue.description}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-2">
              AI Suggestion
            </p>
            <div className="bg-[#050508] border border-white/5 rounded-xl p-4 font-mono text-xs whitespace-pre-wrap leading-relaxed shadow-inner">
              {issue.suggestion}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReviewDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [review, setReview] = useState<CodeReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [codeTab, setCodeTab] = useState<"original" | "optimized">("original");
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (!id) return;
    getReviewById(id)
      .then(setReview)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-violet-600/20 blur-2xl animate-pulse" />
          <Loader2 className="w-12 h-12 animate-spin text-violet-500 relative" />
        </div>
        <p className="text-muted-foreground text-sm font-medium animate-pulse">
          Analyzing Review...
        </p>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center bg-card/40 p-10 rounded-3xl border border-white/5">
          <p className="text-foreground font-bold text-xl mb-4">
            Review not found
          </p>
          <Link
            to={ROUTES.DASHBOARD}
            className="inline-flex items-center gap-2 text-sm font-bold text-violet-400 hover:text-white transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const feedback = review.reviewFeedback;
  const issuesByGroup = feedback?.issues.reduce(
    (acc: Record<string, ReviewIssue[]>, issue: ReviewIssue) => {
      acc[issue.severity] = [...(acc[issue.severity] ?? []), issue];
      return acc;
    },
    {} as Record<string, ReviewIssue[]>,
  );

  const severityOrder: Array<ReviewIssue["severity"]> = [
    "critical",
    "major",
    "minor",
    "info",
  ];

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
        <Link
          to={ROUTES.DASHBOARD}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-violet-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
        </Link>
        <span className="text-white/10">/</span>
        <span className="text-violet-400 max-w-[200px] truncate">
          {review.title}
        </span>
      </div>

      {/* Score hero */}
      {feedback && review.status === "completed" && (
        <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-8 lg:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-violet-600/10 to-transparent pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-center gap-8 lg:gap-12">
            {/* Score circle */}
            <div className="relative flex-shrink-0 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/30 to-indigo-600/30 blur-3xl rounded-full opacity-50 group-hover:opacity-80 transition-opacity" />
              <svg
                className="w-40 h-40 -rotate-90 relative"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-white/[0.03]"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(feedback.overallScore / 100) * 264} 264`}
                  className={`transition-all duration-1000 ease-out`}
                  stroke={
                    feedback.overallScore >= 80
                      ? "#8b5cf6"
                      : feedback.overallScore >= 60
                        ? "#f59e0b"
                        : "#ef4444"
                  }
                  filter="drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-white tracking-tight">
                  {feedback.overallScore}
                </span>
                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] -mt-1">
                  Score
                </span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                <span
                  className={`text-[10px] font-black uppercase tracking-[0.3em] px-3 py-1 bg-white/5 border border-white/10 rounded-full text-violet-400`}
                >
                  AI Analysis
                </span>
                <Trophy className="w-5 h-5 text-yellow-500 animate-bounce shadow-glow" />
              </div>
              <h2 className="text-3xl font-black text-white mb-3 tracking-tight">
                {getScoreLabel(feedback.overallScore)} Result
              </h2>
              <p className="text-muted-foreground text-sm mb-6 max-w-xl leading-relaxed">
                {feedback.summary}
              </p>

              {/* Issue count badges */}
              <div className="flex flex-wrap gap-2.5 justify-center md:justify-start">
                {severityOrder.map((s: ReviewIssue["severity"]) => {
                  const count = issuesByGroup?.[s]?.length ?? 0;
                  if (count === 0) return null;
                  const cfg = SEVERITY_CONFIG[s];
                  return (
                    <div
                      key={s}
                      className={`text-[10px] px-3 py-1.5 rounded-lg border font-black uppercase tracking-wider ${cfg.className}`}
                    >
                      {count} {cfg.label}
                    </div>
                  );
                })}
                {feedback.issues.length === 0 && (
                  <div className="text-[10px] px-3 py-1.5 rounded-lg border text-emerald-400 border-emerald-500/20 bg-emerald-500/5 font-black uppercase tracking-wider">
                    Perfect Submission
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {review.status === "failed" && (
        <div className="rounded-3xl border border-red-500/30 bg-red-500/5 p-12 text-center shadow-xl">
          <div className="p-4 rounded-full bg-red-500/20 w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-white font-bold text-xl mb-2">Analysis Failed</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Our AI engines encountered an unexpected error while analyzing this
            code snippet.
          </p>
        </div>
      )}

      {review.status === "pending" && (
        <div className="rounded-3xl border border-yellow-500/30 bg-yellow-500/5 p-12 text-center shadow-xl">
          <div className="p-4 rounded-full bg-yellow-500/20 w-16 h-16 flex items-center justify-center mx-auto mb-4 animate-spin">
            <Loader2 className="w-8 h-8 text-yellow-500" />
          </div>
          <h3 className="text-white font-bold text-xl mb-2">
            Processing Code...
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Our AI models are performing a deep analysis of your submission.
            This usually takes 5-10 seconds.
          </p>
        </div>
      )}

      {feedback && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Strengths */}
          {feedback.strengths.length > 0 && (
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <ThumbsUp className="w-4 h-4 text-emerald-400" />
                </div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Code Strengths
                </h2>
              </div>
              <ul className="space-y-4">
                {feedback.strengths.map((s: string, i: number) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Improvements */}
          {feedback.improvements.length > 0 && (
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <Lightbulb className="w-4 h-4 text-cyan-400" />
                </div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  AI Insights
                </h2>
              </div>
              <ul className="space-y-4">
                {feedback.improvements.map((imp: string, i: number) => (
                  <li
                    key={i}
                    className="flex items-start gap-4 text-sm text-muted-foreground"
                  >
                    <span className="w-5 h-5 rounded bg-cyan-500/10 text-cyan-400 text-[10px] flex items-center justify-center flex-shrink-0 font-black border border-cyan-500/20 mt-0.5">
                      {i + 1}
                    </span>
                    {imp}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Issues */}
      {feedback && feedback.issues.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-400/10 border border-red-400/20">
              <AlertCircle className="w-4 h-4 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Areas for Correction
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {severityOrder.map((sev: ReviewIssue["severity"]) => {
              const group = issuesByGroup?.[sev] ?? [];
              if (group.length === 0) return null;
              return (
                <div key={sev} className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 ml-1">
                    {SEVERITY_CONFIG[sev].label} Tier
                  </p>
                  <div className="space-y-3">
                    {group.map((issue: ReviewIssue, i: number) => (
                      <IssueCard key={i} issue={issue} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Code viewer — Original vs Optimized tabs */}
      <div className="bg-[#0d0d14] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        {/* Tab bar */}
        <div className="flex items-center bg-[#16161e]/50 border-b border-white/5 px-2">
          <button
            onClick={() => setCodeTab("original")}
            className={`flex items-center gap-2.5 px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 -mb-px
              ${
                codeTab === "original"
                  ? "text-white border-violet-500 bg-white/[0.02]"
                  : "text-muted-foreground border-transparent hover:text-white"
              }`}
          >
            <Code2 className="w-4 h-4" />
            Original
          </button>

          {review.optimizedCode && (
            <button
              onClick={() => setCodeTab("optimized")}
              className={`flex items-center gap-2.5 px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 -mb-px
                ${
                  codeTab === "optimized"
                    ? "text-white border-violet-500 bg-white/[0.02]"
                    : "text-muted-foreground border-transparent hover:text-white"
                }`}
            >
              <Sparkles className="w-4 h-4 text-violet-400" />
              Optimized
            </button>
          )}

          {/* Copy button */}
          <div className="ml-auto pr-4">
            <button
              onClick={() =>
                handleCopy(
                  codeTab === "optimized" && review.optimizedCode
                    ? review.optimizedCode
                    : review.code,
                )
              }
              className="flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground
                hover:text-white hover:bg-white/5 transition-all border border-white/5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Code content */}
        <div className="relative">
          {codeTab === "original" ? (
            <pre className="p-8 text-green-300/80 font-mono text-sm overflow-x-auto leading-relaxed max-h-[700px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/5">
              <code>{review.code}</code>
            </pre>
          ) : (
            <div className="relative">
              <div className="flex items-center gap-3 px-8 py-3 bg-violet-600/10 border-b border-violet-500/10">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-[10px] text-violet-400 font-black uppercase tracking-[0.2em]">
                  AI Refactored Version
                </span>
                <span className="ml-auto text-[10px] text-violet-400/60 font-medium italic">
                  Production ready, fixes all issues above
                </span>
              </div>
              <pre className="p-8 text-cyan-300/90 font-mono text-sm overflow-x-auto leading-relaxed max-h-[700px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/5">
                <code>{review.optimizedCode}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
