import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Code2, Loader2, Sparkles, ChevronDown } from "lucide-react";
import { submitCodeReview } from "@/services/reviewService";
import { ROUTES } from "@/constants/routes";

const LANGUAGES = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Java",
  "Go",
  "Rust",
  "C#",
  "C++",
  "PHP",
  "Ruby",
  "Swift",
  "Kotlin",
  "Other",
];

export default function NewReviewPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    language: "TypeScript",
    code: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.code.trim() || form.code.length < 10)
      e.code = "Please provide at least 10 characters of code";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    console.log("Submitting review...");
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      console.log("Submitting review...", form);
      const review = await submitCodeReview(form);
      navigate(ROUTES.REVIEW_DETAIL.replace(":id", review.id));
    } catch {
      setErrors({ root: "Failed to submit review. Please try again." });
    } finally {
      setLoading(false);
    }
  };

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
          <span className="text-sm font-medium text-foreground">
            New Review
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              AI Code Review
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Paste your code below and receive a senior-level review powered by
            GPT-4o. The AI will identify bugs, security issues, performance
            problems, and more.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          id="new-review-form"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Title */}
            <div className="sm:col-span-2 space-y-1.5">
              <label
                htmlFor="title"
                className="text-sm font-medium text-foreground"
              >
                Review title
              </label>
              <input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. User authentication module"
                className={`w-full px-4 py-2.5 rounded-xl bg-card border text-sm transition-all outline-none
                  focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500
                  ${errors.title ? "border-red-500" : "border-border"}`}
              />
              {errors.title && (
                <p className="text-xs text-red-400">{errors.title}</p>
              )}
            </div>

            {/* Language */}
            <div className="space-y-1.5">
              <label
                htmlFor="language"
                className="text-sm font-medium text-foreground"
              >
                Language
              </label>
              <div className="relative">
                <select
                  id="language"
                  value={form.language}
                  onChange={(e) =>
                    setForm({ ...form, language: e.target.value })
                  }
                  className="w-full appearance-none px-4 py-2.5 pr-9 rounded-xl bg-card border border-border
                    text-sm text-foreground transition-all outline-none
                    focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 cursor-pointer"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Code editor */}
          <div className="space-y-1.5">
            <label
              htmlFor="code"
              className="text-sm font-medium text-foreground"
            >
              Your code
            </label>
            <div
              className={`rounded-xl border overflow-hidden ${errors.code ? "border-red-500" : "border-border"}`}
            >
              {/* Fake editor header */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-card/80 border-b border-border/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 flex items-center gap-2 ml-2">
                  <Code2 className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-mono">
                    {form.language.toLowerCase()}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {form.code.split("\n").length} lines
                </span>
              </div>
              <textarea
                id="code"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder={`// Paste your ${form.language} code here...\n// The AI will review it like a senior engineer`}
                rows={20}
                spellCheck={false}
                className="w-full px-4 py-4 bg-[#0d0d14] text-green-300/90 font-mono text-sm
                  outline-none resize-none leading-relaxed
                  placeholder:text-muted-foreground/30"
              />
            </div>
            {errors.code && (
              <p className="text-xs text-red-400">{errors.code}</p>
            )}
          </div>

          {errors.root && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
              {errors.root}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 justify-end">
            <Link
              to={ROUTES.DASHBOARD}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground
                hover:text-foreground hover:bg-muted/50 transition-all"
            >
              Cancel
            </Link>
            <button
              id="submit-review-btn"
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white
                bg-gradient-to-r from-violet-600 to-indigo-600
                hover:from-violet-500 hover:to-indigo-500
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-all shadow-lg shadow-violet-500/25"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing code…
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Review my code
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
