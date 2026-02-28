import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
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

const getScoreGradient = (score: number) => {
  if (score >= 80) return "from-green-500 to-emerald-500";
  if (score >= 60) return "from-yellow-500 to-amber-500";
  return "from-red-500 to-rose-500";
};

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
    <div className={`rounded-xl border ${config.className} overflow-hidden`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-3 p-4 text-left hover:opacity-90 transition-opacity"
      >
        <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-semibold text-sm">{issue.title}</span>
            {issue.line && (
              <span className="text-xs font-mono opacity-60">
                line {issue.line}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs opacity-70">{issue.category}</span>
            <span
              className={`inline-block w-1.5 h-1.5 rounded-full ${config.dot} opacity-70`}
            />
            <span className="text-xs font-semibold opacity-80">
              {config.label}
            </span>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 opacity-60 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 opacity-60 flex-shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-current/10 pt-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide opacity-60 mb-1">
              Problem
            </p>
            <p className="text-sm opacity-90">{issue.description}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide opacity-60 mb-1">
              Suggestion
            </p>
            <div className="bg-black/20 rounded-lg p-3 font-mono text-xs whitespace-pre-wrap leading-relaxed">
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-violet-500" />
          <p className="text-muted-foreground text-sm">Loading review…</p>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground font-semibold mb-2">Review not found</p>
          <Link
            to={ROUTES.DASHBOARD}
            className="text-sm text-violet-400 hover:text-violet-300"
          >
            ← Back to dashboard
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <Link
            to={ROUTES.DASHBOARD}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-sm font-medium text-foreground truncate">
            {review.title}
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Score hero */}
        {feedback && review.status === "completed" && (
          <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 p-8">
            <div className="absolute inset-0 opacity-5">
              <div
                className={`w-full h-full bg-gradient-to-br ${getScoreGradient(feedback.overallScore)}`}
              />
            </div>
            <div className="relative flex flex-col sm:flex-row items-center gap-6">
              {/* Score circle */}
              <div className="relative flex-shrink-0">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-muted/30"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(feedback.overallScore / 100) * 251} 251`}
                    className={`bg-gradient-to-r ${getScoreGradient(feedback.overallScore)}`}
                    stroke={
                      feedback.overallScore >= 80
                        ? "#22c55e"
                        : feedback.overallScore >= 60
                          ? "#eab308"
                          : "#ef4444"
                    }
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-foreground">
                    {feedback.overallScore}
                  </span>
                  <span className="text-xs text-muted-foreground">/100</span>
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="text-2xl font-bold text-foreground">
                    {getScoreLabel(feedback.overallScore)}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mb-4 max-w-lg">
                  {feedback.summary}
                </p>

                {/* Issue count badges */}
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {severityOrder.map((s: ReviewIssue["severity"]) => {
                    const count = issuesByGroup?.[s]?.length ?? 0;
                    if (count === 0) return null;
                    const cfg = SEVERITY_CONFIG[s];
                    return (
                      <span
                        key={s}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-semibold ${cfg.className}`}
                      >
                        {count} {cfg.label}
                      </span>
                    );
                  })}
                  {feedback.issues.length === 0 && (
                    <span className="text-xs px-2.5 py-1 rounded-lg border text-green-400 border-green-500/30 bg-green-500/10 font-semibold">
                      ✓ No issues found
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {review.status === "failed" && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">
            <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-red-400 font-semibold">Review failed</p>
            <p className="text-sm text-muted-foreground mt-1">
              Something went wrong during analysis. Please try again.
            </p>
          </div>
        )}

        {review.status === "pending" && (
          <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-6 text-center">
            <Loader2 className="w-8 h-8 text-yellow-400 mx-auto mb-2 animate-spin" />
            <p className="text-yellow-400 font-semibold">
              Analysis in progress…
            </p>
          </div>
        )}

        {feedback && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strengths */}
            {feedback.strengths.length > 0 && (
              <div className="bg-card/60 border border-border/50 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-xl bg-green-500/15">
                    <ThumbsUp className="w-4 h-4 text-green-400" />
                  </div>
                  <h2 className="font-semibold text-foreground">Strengths</h2>
                </div>
                <ul className="space-y-2">
                  {feedback.strengths.map((s: string, i: number) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improvements */}
            {feedback.improvements.length > 0 && (
              <div className="bg-card/60 border border-border/50 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-xl bg-cyan-500/15">
                    <Lightbulb className="w-4 h-4 text-cyan-400" />
                  </div>
                  <h2 className="font-semibold text-foreground">
                    Suggested Improvements
                  </h2>
                </div>
                <ul className="space-y-2">
                  {feedback.improvements.map((imp: string, i: number) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs flex items-center justify-center flex-shrink-0 font-bold mt-0.5">
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
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Issues Found
            </h2>
            <div className="space-y-3">
              {severityOrder.map((sev: ReviewIssue["severity"]) => {
                const group = issuesByGroup?.[sev] ?? [];
                if (group.length === 0) return null;
                return (
                  <div key={sev}>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      {SEVERITY_CONFIG[sev].label} ({group.length})
                    </p>
                    <div className="space-y-2">
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
        <div className="bg-card/60 border border-border/50 rounded-2xl overflow-hidden">
          {/* Tab bar */}
          <div className="flex items-center border-b border-border/50">
            <button
              onClick={() => setCodeTab("original")}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors border-b-2 -mb-px
                ${
                  codeTab === "original"
                    ? "text-foreground border-violet-500"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
            >
              <Code2 className="w-4 h-4" />
              Original Code
              <span className="text-xs text-muted-foreground font-normal">
                {review.code.split("\n").length} lines
              </span>
            </button>

            {review.optimizedCode && (
              <button
                onClick={() => setCodeTab("optimized")}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors border-b-2 -mb-px
                  ${
                    codeTab === "optimized"
                      ? "text-foreground border-violet-500"
                      : "text-muted-foreground border-transparent hover:text-foreground"
                  }`}
              >
                <Sparkles className="w-4 h-4 text-violet-400" />
                Optimized Code
                <span className="text-xs px-1.5 py-0.5 rounded-md bg-violet-500/20 text-violet-400 font-normal">
                  AI improved
                </span>
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground
                  hover:text-foreground hover:bg-muted/40 transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-green-400">Copied!</span>
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
              <pre className="p-6 bg-[#0d0d14] text-green-300/80 font-mono text-sm overflow-x-auto leading-relaxed max-h-[600px] overflow-y-auto">
                <code>{review.code}</code>
              </pre>
            ) : (
              <div className="relative">
                <div className="flex items-center gap-2 px-4 py-2 bg-violet-500/10 border-b border-violet-500/20">
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  <span className="text-xs text-violet-400 font-medium">
                    AI-optimized version — all issues fixed, best practices
                    applied
                  </span>
                </div>
                <pre className="p-6 bg-[#0d0d14] text-cyan-300/90 font-mono text-sm overflow-x-auto leading-relaxed max-h-[600px] overflow-y-auto">
                  <code>{review.optimizedCode}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
