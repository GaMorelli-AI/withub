"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type ThemeMode = "dark" | "light" | "system";
type ResolvedTheme = "dark" | "light";

const STORAGE_KEY = "withub-theme";

function resolve(mode: ThemeMode): ResolvedTheme {
  if (mode === "system") {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: light)").matches
    ) {
      return "light";
    }
    return "dark";
  }
  return mode;
}

interface ThemeContextValue {
  mode: ThemeMode;
  resolved: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("dark");

  useEffect(() => {
    // One-time sync from localStorage after mount: the default "dark" must
    // match what the server (and the blocking head script) rendered, so this
    // can't be a lazy initializer.
    const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (stored === "dark" || stored === "light" || stored === "system") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setModeState(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", resolve(mode));
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () =>
      document.documentElement.setAttribute("data-theme", resolve("system"));
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode]);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  return (
    <ThemeContext.Provider value={{ mode, resolved: resolve(mode), setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = window.localStorage.getItem("${STORAGE_KEY}");
    var mode = stored === "light" || stored === "dark" || stored === "system" ? stored : "dark";
    var resolved = mode === "system"
      ? (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
      : mode;
    document.documentElement.setAttribute("data-theme", resolved);
  } catch (e) {}
})();
`;
