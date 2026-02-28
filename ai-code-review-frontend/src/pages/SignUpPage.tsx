import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Code2, Loader2, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { ROUTES } from "@/constants/routes";

export default function SignUpPage() {
  const { signUp, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name || form.name.length < 2)
      e.name = "Name must be at least 2 characters";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email))
      e.email = "Invalid email address";
    if (!form.password || form.password.length < 8)
      e.password = "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    const ok = await signUp(form.email, form.password, form.name);
    if (ok) navigate(ROUTES.DASHBOARD);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="relative w-full max-w-md px-4">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/30">
              <Code2 className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              CodeReview AI
            </span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Create your account
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Start reviewing code like a senior engineer
          </p>
        </div>

        <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl shadow-black/20">
          <form onSubmit={handleSubmit} className="space-y-4" id="sign-up-form">
            {/* Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="text-sm font-medium text-foreground"
              >
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  className={`w-full pl-9 pr-4 py-2.5 rounded-xl bg-background border text-sm transition-all outline-none
                    focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500
                    ${errors.name ? "border-red-500" : "border-border"}`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-400">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className={`w-full px-4 py-2.5 rounded-xl bg-background border text-sm transition-all outline-none
                  focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500
                  ${errors.email ? "border-red-500" : "border-border"}`}
              />
              {errors.email && (
                <p className="text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="Minimum 8 characters"
                  className={`w-full px-4 py-2.5 pr-11 rounded-xl bg-background border text-sm transition-all outline-none
                    focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500
                    ${errors.password ? "border-red-500" : "border-border"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-foreground"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                placeholder="Repeat your password"
                className={`w-full px-4 py-2.5 rounded-xl bg-background border text-sm transition-all outline-none
                  focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500
                  ${errors.confirmPassword ? "border-red-500" : "border-border"}`}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              id="sign-up-submit"
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm text-white mt-2
                bg-gradient-to-r from-violet-600 to-indigo-600
                hover:from-violet-500 hover:to-indigo-500
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-all duration-200 shadow-lg shadow-violet-500/30
                flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to={ROUTES.SIGN_IN}
              className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
