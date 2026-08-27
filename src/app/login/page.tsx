"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();
  const loginDemo = useAppStore((s) => s.loginDemo);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    loginDemo("user");
    toast(`Welcome back${email ? `, ${email.split("@")[0]}` : ""}.`);
    router.push("/dashboard");
  }

  function handleDemo(type: "user" | "expert") {
    loginDemo(type);
    toast(type === "user" ? "Signed in as Lucas Estevam (demo User)." : "Signed in as Sarah Mason (demo Expert).");
    router.push(type === "user" ? "/dashboard" : "/expert-dashboard");
  }

  return (
    <div className="mx-auto flex max-w-md flex-1 flex-col justify-center px-4 py-14 sm:px-6">
      <h1 className="text-center font-display text-2xl font-semibold text-fg">
        Welcome back to WitHub
      </h1>
      <p className="mt-2 text-center text-sm text-fg-muted">
        Sign in to ask questions, track answers and manage your account.
      </p>

      <Card className="mt-8 p-6 sm:p-7">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-fg-muted">
              Email
            </label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-fg-muted">
              Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-fg-muted">
              <Checkbox
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => toast("Password reset isn't available in this demo.", "info")}
              className="text-brand hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <Button type="submit" className="mt-1 w-full">
            Sign in
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs text-fg-subtle">or</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <button
          onClick={() => toast("Google sign-in isn't available in this demo.", "info")}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border bg-bg-elevated text-sm font-medium text-fg transition-colors hover:border-border-hover"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <p className="mt-5 text-center text-sm text-fg-muted">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-brand hover:underline">
            Create account
          </Link>
        </p>
      </Card>

      <div className="mt-6 rounded-2xl border border-dashed border-border p-5">
        <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-fg-subtle">
          <Sparkles className="size-3.5" /> Demo access
        </p>
        <p className="mt-1.5 text-sm text-fg-muted">
          Skip the form and jump straight into a populated dashboard.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <Button variant="secondary" onClick={() => handleDemo("user")}>
            <GraduationCap className="size-4" /> Demo as User
          </Button>
          <Button variant="secondary" onClick={() => handleDemo("expert")}>
            <Sparkles className="size-4" /> Demo as Expert
          </Button>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29A11.96 11.96 0 000 12c0 1.93.46 3.76 1.29 5.38l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}
