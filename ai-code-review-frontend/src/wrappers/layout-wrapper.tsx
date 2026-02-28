import type { ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Code2,
  Plus,
  LogOut,
  LayoutDashboard,
  Github,
  Search,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { ROUTES } from "@/constants/routes";

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.SIGN_IN);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-foreground flex flex-col font-sans selection:bg-violet-500/30">
      {/* Premium Gradient Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[#0a0a0f]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo Section */}
          <Link
            to={ROUTES.DASHBOARD}
            className="flex items-center gap-3 group transition-all shrink-0"
          >
            <div className="relative">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 opacity-40 blur-sm group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-2 rounded-xl bg-[#12121e] border border-white/10 group-hover:border-violet-500/50 transition-colors">
                <Code2 className="w-5 h-5 text-violet-400 group-hover:text-white transition-colors" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-tight bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent group-hover:to-violet-400 transition-all duration-300">
                CODEREVIEW
              </span>
              <span className="text-[10px] font-bold text-violet-500/80 tracking-widest -mt-1 uppercase">
                Intelligent Assistant
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
            <Link
              to={ROUTES.DASHBOARD}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2
                ${
                  location.pathname === ROUTES.DASHBOARD
                    ? "bg-violet-600/10 text-violet-400 border border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              to={ROUTES.NEW_REVIEW}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2
                ${
                  location.pathname === ROUTES.NEW_REVIEW
                    ? "bg-violet-600/10 text-violet-400 border border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                }`}
            >
              <Plus className="w-4 h-4" />
              New Review
            </Link>
          </nav>

          {/* User Section */}
          <div className="flex items-center gap-3">
            {/* Search - Decorative for now */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 bg-white/5 text-muted-foreground hover:border-white/10 transition-colors cursor-pointer group">
              <Search className="w-3.5 h-3.5 group-hover:text-violet-400 transition-colors" />
              <span className="text-xs font-medium text-muted-foreground/60">
                Search reviews...
              </span>
              <span className="bg-white/5 px-1.5 py-0.5 rounded text-[10px] border border-white/5 text-muted-foreground/40 font-mono">
                ⌘K
              </span>
            </div>

            <div className="h-8 w-px bg-white/10 hidden sm:block mx-1" />

            <div className="flex items-center gap-3 group/user cursor-pointer">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-bold text-white leading-tight">
                  {user?.name}
                </span>
                <span className="text-[10px] font-medium text-muted-foreground">
                  Pro Account
                </span>
              </div>
              <div className="relative">
                <div className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-600 opacity-20 group-hover/user:opacity-100 blur-[2px] transition-opacity" />
                <div className="relative w-9 h-9 rounded-full bg-[#1a1a2e] border border-white/10 flex items-center justify-center text-violet-400 text-sm font-black shadow-inner overflow-hidden">
                  {user?.name?.[0]?.toUpperCase() ?? "U"}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all border border-transparent hover:border-red-400/20"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto relative">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[120px] opacity-30" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[100px] opacity-20" />
        </div>

        <div className="relative z-10 w-full">{children}</div>
      </main>

      {/* Simple Footer */}
      <footer className="py-6 border-t border-white/5 bg-[#0a0a0f]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
              Status:{" "}
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
              Operational
            </span>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-white/10" />
            <span className="hover:text-white transition-colors cursor-pointer text-muted-foreground">
              Documentation
            </span>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-white/10" />
            <span className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-muted-foreground">
              <Github className="w-3 h-3" /> GitHub
            </span>
          </div>
          <p className="text-[10px] font-bold tracking-widest text-white/20 uppercase">
            © 2026 AI Code Review
          </p>
        </div>
      </footer>
    </div>
  );
}
