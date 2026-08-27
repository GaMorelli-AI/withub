"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/cn";

type ToastVariant = "success" | "info";

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx.toast;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, variant: ToastVariant = "success") => {
      counter.current += 1;
      const id = counter.current;
      setItems((prev) => [...prev, { id, message, variant }]);
      setTimeout(() => remove(id), 4000);
    },
    [remove]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:items-end sm:px-6">
        {items.map((t) => (
          <div
            key={t.id}
            className="animate-slide-up pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl border border-border bg-bg-elevated px-4 py-3 shadow-2xl backdrop-blur"
          >
            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full",
                t.variant === "success"
                  ? "bg-positive/15 text-positive"
                  : "bg-brand/15 text-brand"
              )}
            >
              {t.variant === "success" ? (
                <CheckCircle2 className="size-4" />
              ) : (
                <Info className="size-4" />
              )}
            </span>
            <p className="flex-1 text-sm text-fg">{t.message}</p>
            <button
              onClick={() => remove(t.id)}
              className="text-fg-subtle hover:text-fg"
              aria-label="Dismiss"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
