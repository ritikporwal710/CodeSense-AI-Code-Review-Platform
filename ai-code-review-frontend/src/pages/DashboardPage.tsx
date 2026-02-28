import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Code2,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  BarChart3,
  TrendingUp,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { getMyReviews } from "@/services/reviewService";
import { ROUTES } from "@/constants/routes";
import type { CodeReviewSummary } from "@/types/review";

const LANGUAGE_COLORS: Record<string, string> = {
  typescript: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  javascript: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  python: "bg-green-500/20 text-green-400 border-green-500/30",
  java: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  rust: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  go: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  default: "bg-violet-500/20 text-violet-400 border-violet-500/30",
};

const getScoreColor = (score: number | null) => {
  if (score === null) return "text-muted-foreground";
  if (score >= 80) return "text-green-400";
  if (score >= 60) return "text-yellow-400";
  return "text-red-400";
};

const getScoreBg = (score: number | null) => {
  if (score === null) return "from-muted/40 to-muted/20";
  if (score >= 80) return "from-green-500/20 to-emerald-500/10";
  if (score >= 60) return "from-yellow-500/20 to-amber-500/10";
  return "from-red-500/20 to-rose-500/10";
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<CodeReviewSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyReviews()
      .then(setReviews)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total: reviews.length,
    completed: reviews.filter((r) => r.status === "completed").length,
    avgScore:
      reviews.filter((r) => r.overallScore !== null).length > 0
        ? Math.round(
            reviews
              .filter((r) => r.overallScore !== null)
              .reduce((a, r) => a + (r.overallScore ?? 0), 0) /
              reviews.filter((r) => r.overallScore !== null).length,
          )
        : null,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/25">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              CodeReview AI
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                {user?.name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <span className="text-sm font-medium text-foreground">
                {user?.name}
              </span>
            </div>
            <Link
              to={ROUTES.NEW_REVIEW}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-white
                bg-gradient-to-r from-violet-600 to-indigo-600
                hover:from-violet-500 hover:to-indigo-500
                transition-all shadow-lg shadow-violet-500/25"
            >
              <Plus className="w-4 h-4" />
              New Review
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Greeting */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Good day, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's an overview of your code reviews
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card/60 backdrop-blur border border-border/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-violet-500/15">
                <BarChart3 className="w-5 h-5 text-violet-400" />
              </div>
              <span className="text-sm text-muted-foreground font-medium">
                Total Reviews
              </span>
            </div>
            <p className="text-4xl font-bold text-foreground">{stats.total}</p>
          </div>

          <div className="bg-card/60 backdrop-blur border border-border/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-green-500/15">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-sm text-muted-foreground font-medium">
                Completed
              </span>
            </div>
            <p className="text-4xl font-bold text-foreground">
              {stats.completed}
            </p>
          </div>

          <div className="bg-card/60 backdrop-blur border border-border/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/15">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-sm text-muted-foreground font-medium">
                Avg. Score
              </span>
            </div>
            <p
              className={`text-4xl font-bold ${getScoreColor(stats.avgScore)}`}
            >
              {stats.avgScore !== null ? `${stats.avgScore}` : "—"}
            </p>
          </div>
        </div>

        {/* Reviews list */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">
              Recent Reviews
            </h2>
            {reviews.length > 0 && (
              <Link
                to={ROUTES.NEW_REVIEW}
                className="text-sm text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1"
              >
                New review <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="p-5 rounded-2xl bg-violet-500/10 mb-4">
                <Code2 className="w-10 h-10 text-violet-400" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                No reviews yet
              </h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                Submit your first piece of code and get a senior-level review
                powered by AI.
              </p>
              <Link
                to={ROUTES.NEW_REVIEW}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white
                  bg-gradient-to-r from-violet-600 to-indigo-600
                  hover:from-violet-500 hover:to-indigo-500 transition-all
                  shadow-lg shadow-violet-500/25"
              >
                Submit your first review
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => {
                const langKey = review.language.toLowerCase();
                const langClass =
                  LANGUAGE_COLORS[langKey] ?? LANGUAGE_COLORS.default;
                return (
                  <Link
                    key={review.id}
                    to={ROUTES.REVIEW_DETAIL.replace(":id", review.id)}
                    className="group flex items-center gap-4 bg-card/60 backdrop-blur border border-border/50
                      rounded-2xl p-5 hover:border-violet-500/40 hover:bg-card/80 transition-all"
                  >
                    {/* Score badge */}
                    <div
                      className={`hidden sm:flex w-16 h-16 rounded-xl bg-gradient-to-br ${getScoreBg(review.overallScore)}
                        items-center justify-center flex-shrink-0 border border-white/5`}
                    >
                      <span
                        className={`text-2xl font-bold ${getScoreColor(review.overallScore)}`}
                      >
                        {review.overallScore !== null
                          ? review.overallScore
                          : "—"}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-1">
                        <h3 className="font-semibold text-foreground truncate">
                          {review.title}
                        </h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-md border font-medium flex-shrink-0 ${langClass}`}
                        >
                          {review.language}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {review.status === "completed" ? (
                          <span className="flex items-center gap-1 text-green-400">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                          </span>
                        ) : review.status === "pending" ? (
                          <span className="flex items-center gap-1 text-yellow-400">
                            <Clock className="w-3.5 h-3.5" /> Processing…
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-400">
                            <XCircle className="w-3.5 h-3.5" /> Failed
                          </span>
                        )}
                        <span>•</span>
                        <span>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-violet-400 transition-colors flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
