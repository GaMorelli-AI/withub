"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { categories } from "@/data/categories";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";

const COUNTRIES = [
  "United States",
  "Brazil",
  "Portugal",
  "Canada",
  "United Kingdom",
  "Germany",
  "Sweden",
  "Japan",
  "South Korea",
  "Other",
];

export default function SignupUserPage() {
  const router = useRouter();
  const toast = useToast();
  const addUser = useAppStore((s) => s.addUser);
  const login = useAppStore((s) => s.login);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [interests, setInterests] = useState<string[]>([]);

  function toggleInterest(slug: string) {
    setInterests((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const id = `usr-${name.trim().toLowerCase().replace(/\s+/g, "-") || "member"}-${Date.now().toString().slice(-4)}`;
    addUser({
      id,
      name: name.trim() || "New Member",
      email,
      country,
      interests,
      savedExpertIds: [],
      joinedAt: new Date().toISOString(),
      gradientSeed: Math.floor(Math.random() * 6),
    });
    login("user", id);
    toast(`Welcome to WitHub, ${name.trim().split(" ")[0] || "there"}!`);
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto flex max-w-lg flex-1 flex-col justify-center px-4 py-14 sm:px-6">
      <StepIndicator steps={["Account", "Interests"]} current={interests.length > 0 || name ? 1 : 0} className="mb-8" />
      <h1 className="font-display text-2xl font-semibold text-fg">
        Create your User account
      </h1>
      <p className="mt-1 text-sm text-fg-muted">
        Start asking experts in just a couple of minutes.
      </p>

      <Card className="mt-6 p-6 sm:p-7">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Name">
            <Input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
          </Field>
          <Field label="Email">
            <Input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </Field>
          <Field label="Password">
            <Input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </Field>
          <Field label="Country">
            <Select value={country} onChange={(e) => setCountry(e.target.value)}>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>

          <div>
            <label className="mb-2 block text-xs font-medium text-fg-muted">
              Interests — pick a few topics you care about
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => {
                const active = interests.includes(c.slug);
                return (
                  <button
                    type="button"
                    key={c.slug}
                    onClick={() => toggleInterest(c.slug)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                      active
                        ? "border-brand bg-brand/10 text-brand"
                        : "border-border text-fg-muted hover:border-border-hover"
                    )}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>

          <Button type="submit" className="mt-2 w-full">
            Create my account
          </Button>
        </form>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-fg-muted">
        {label}
      </label>
      {children}
    </div>
  );
}
