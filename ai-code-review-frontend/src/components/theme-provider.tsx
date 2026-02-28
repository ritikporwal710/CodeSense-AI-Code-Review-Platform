import { createContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  attribute?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: "system",
  setTheme: () => null,
});

export function ThemeProvider({
  children,
  defaultTheme = "system",
  attribute = "class",
  enableSystem = true,
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("ui-theme") as Theme) || defaultTheme,
  );

  useEffect(() => {
    const root = window.document.documentElement;

    if (disableTransitionOnChange) {
      root.classList.add("no-transitions");
    }

    if (attribute === "class") {
      root.classList.remove("light", "dark");

      let effectiveTheme = theme;
      if (theme === "system" && enableSystem) {
        effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
      }
      root.classList.add(effectiveTheme);
    }

    if (disableTransitionOnChange) {
      setTimeout(() => root.classList.remove("no-transitions"), 0);
    }
  }, [theme, attribute, enableSystem, disableTransitionOnChange]);

  return (
    <ThemeProviderContext.Provider
      value={{
        theme,
        setTheme: (t) => {
          localStorage.setItem("ui-theme", t);
          setTheme(t);
        },
      }}
    >
      {children}
    </ThemeProviderContext.Provider>
  );
}

export { ThemeProviderContext };
