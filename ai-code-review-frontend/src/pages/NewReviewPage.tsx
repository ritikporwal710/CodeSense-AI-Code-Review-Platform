import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Code2, Loader2, Sparkles, ChevronDown, ArrowLeft, XCircle } from "lucide-react";
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
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const review = await submitCodeReview(form);
      navigate(ROUTES.REVIEW_DETAIL.replace(":id", review.id));
    } catch {
      setErrors({ root: "Failed to submit review. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-8 text-xs font-semibold uppercase tracking-wider">
        <Link
          to={ROUTES.DASHBOARD}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-violet-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
        </Link>
        <span className="text-white/10">/</span>
        <span className="text-violet-400">New Review</span>
      </div>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Start New Review
          </h1>
        </div>
        <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed">
          Submit your code to receive comprehensive AI feedback on security,
          performance, readability, and more. Our AI will provide a quality
          score and an optimized version of your code.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8" id="new-review-form">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Title */}
          <div className="sm:col-span-2 space-y-2">
            <label
              htmlFor="title"
              className="text-sm font-semibold text-foreground flex items-center gap-1.5"
            >
              Review title
              <span className="text-violet-400">*</span>
            </label>
            <input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. User authentication module"
              className={`w-full px-4 py-3 rounded-xl bg-card/60 backdrop-blur border text-sm transition-all outline-none
                focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/50
                ${errors.title ? "border-red-500/50" : "border-white/5 hover:border-white/10"}`}
            />
            {errors.title && (
              <p className="text-xs text-red-400 font-medium px-1">
                {errors.title}
              </p>
            )}
          </div>

          {/* Language */}
          <div className="space-y-2">
            <label
              htmlFor="language"
              className="text-sm font-semibold text-foreground"
            >
              Language
            </label>
            <div className="relative">
              <select
                id="language"
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                className="w-full appearance-none px-4 py-3 pr-10 rounded-xl bg-card/60 backdrop-blur border border-white/5
                  text-sm text-foreground transition-all outline-none hover:border-white/10
                  focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/50 cursor-pointer"
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Code editor */}
        <div className="space-y-2">
          <label
            htmlFor="code"
            className="text-sm font-semibold text-foreground flex items-center gap-1.5"
          >
            Source Code
            <span className="text-violet-400">*</span>
          </label>
          <div
            className={`rounded-2xl border transition-all shadow-xl overflow-hidden ${errors.code ? "border-red-500/50" : "border-white/5"}`}
          >
            {/* Fake editor header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#16161e] border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/40 shadow-sm" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40 shadow-sm" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/40 shadow-sm" />
              </div>
              <div className="flex-1 flex items-center gap-2 ml-4">
                <Code2 className="w-3.5 h-3.5 text-muted-foreground/60" />
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest font-mono">
                  {form.language.toLowerCase()}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground/40 font-mono">
                {form.code.split("\n").length} lines
              </span>
            </div>
            <textarea
              id="code"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              placeholder={`// Paste your ${form.language} code here...\n// The AI will review it like a senior engineer mentor`}
              rows={18}
              spellCheck={false}
              className="w-full px-6 py-6 bg-[#0d0d14] text-green-300/80 font-mono text-sm
                outline-none resize-none leading-relaxed scrollbar-thin scrollbar-thumb-white/5
                placeholder:text-white/10 transition-colors focus:bg-[#0a0a0f]"
            />
          </div>
          {errors.code && (
            <p className="text-xs text-red-400 font-medium px-1">
              {errors.code}
            </p>
          )}
        </div>

        {errors.root && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 flex items-center gap-3">
            <XCircle className="w-4 h-4 flex-shrink-0" />
            {errors.root}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 justify-end pt-4 border-t border-white/5">
          <Link
            to={ROUTES.DASHBOARD}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground
              hover:text-white hover:bg-white/5 transition-all"
          >
            Cancel
          </Link>
          <button
            id="submit-review-btn"
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white
              bg-gradient-to-r from-violet-600 to-indigo-600
              hover:from-violet-500 hover:to-indigo-500
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-all shadow-xl shadow-violet-500/20 active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Review My Code
              </>
            )}
          </button>
        </div>
      </form>
    </main>
  );
}
