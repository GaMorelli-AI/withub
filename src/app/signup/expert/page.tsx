"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, BadgeCheck, Camera, Check, Image as ImageIcon } from "lucide-react";
import { LinkedinIcon } from "@/components/icons/SocialIcons";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { Avatar } from "@/components/ui/Avatar";
import { categories } from "@/data/categories";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";

const STEPS = ["Personal", "Professional", "Expertise", "Profile", "Review"];

const COUNTRIES = [
  "United States",
  "Brazil",
  "Portugal",
  "Canada",
  "United Kingdom",
  "Germany",
  "Sweden",
  "Japan",
  "Other",
];

const LANGUAGES = ["English", "Portuguese", "Spanish", "German", "French", "Hindi", "Arabic", "Swedish"];

export default function SignupExpertPage() {
  const router = useRouter();
  const toast = useToast();
  const addExpert = useAppStore((s) => s.addExpert);
  const login = useAppStore((s) => s.login);

  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [languages, setLanguages] = useState<string[]>(["English"]);

  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [bio, setBio] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [website, setWebsite] = useState("");
  const [otherSocialUrl, setOtherSocialUrl] = useState("");

  const [categorySlugs, setCategorySlugs] = useState<string[]>([]);
  const [topicInput, setTopicInput] = useState("");
  const [topics, setTopics] = useState<string[]>([]);

  const [headline, setHeadline] = useState("");
  const [profileBio, setProfileBio] = useState("");

  function toggleLanguage(lang: string) {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  }

  function toggleCategory(slug: string) {
    setCategorySlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  function addTopic() {
    const t = topicInput.trim();
    if (t && !topics.includes(t)) setTopics((prev) => [...prev, t]);
    setTopicInput("");
  }

  const canContinue = [
    name.trim() && email.trim(),
    jobTitle.trim() && linkedin.trim(),
    categorySlugs.length > 0,
    headline.trim() && profileBio.trim(),
    true,
  ][step];

  function next() {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
  }
  function back() {
    if (step > 0) setStep((s) => s - 1);
  }

  function handleCreate() {
    const id = `exp-${name.trim().toLowerCase().replace(/\s+/g, "-") || "expert"}-${Date.now().toString().slice(-4)}`;
    addExpert({
      id,
      name: name.trim() || "New Expert",
      headline: headline.trim(),
      company: company.trim() || undefined,
      location: country,
      country,
      languages: languages.length ? languages : ["English"],
      bio: profileBio.trim(),
      experience: bio.trim() || "New on WitHub.",
      categorySlugs,
      tags: topics.length ? topics : categorySlugs.map((s) => s),
      linkedinUrl: linkedin.trim() || undefined,
      website: website.trim() || undefined,
      otherSocialUrl: otherSocialUrl.trim() || undefined,
      rating: 5,
      answersCount: 0,
      followersCount: 0,
      responseRate: 100,
      verification: "pending",
      joinedAt: new Date().toISOString(),
      gradientSeed: Math.floor(Math.random() * 6),
    });
    login("expert", id);
    toast("Your Expert profile was created — verification pending.");
    router.push("/expert-dashboard");
  }

  return (
    <div className="mx-auto max-w-2xl flex-1 px-4 py-12 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-fg">
        Become an Expert
      </h1>
      <p className="mt-1 text-sm text-fg-muted">
        A few steps to start turning your knowledge into an asset.
      </p>

      <StepIndicator steps={STEPS} current={step} className="mt-6" />

      <Card className="mt-6 p-6 sm:p-7">
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <Field label="Full name">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
            </Field>
            <Field label="Email">
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </Field>
            <Field label="Country">
              <Select value={country} onChange={(e) => setCountry(e.target.value)}>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </Field>
            <div>
              <label className="mb-2 block text-xs font-medium text-fg-muted">Languages</label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((lang) => (
                  <Chip key={lang} active={languages.includes(lang)} onClick={() => toggleLanguage(lang)}>
                    {lang}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <Field label="Job title">
              <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Growth Marketing Lead" />
            </Field>
            <Field label="Company">
              <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. VP of Growth at Fintra" />
            </Field>
            <Field label="Professional bio / experience">
              <Textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Summarize your experience and credentials." />
            </Field>
            <Field label="LinkedIn URL">
              <div className="relative">
                <LinkedinIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-fg-subtle" />
                <Input
                  className="pl-10"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="linkedin.com/in/you"
                />
              </div>
              <p className="mt-1 text-xs text-fg-subtle">
                Your LinkedIn is a key trust signal on your public profile.
              </p>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Website (optional)">
                <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="yoursite.com" />
              </Field>
              <Field label="Other social (optional)">
                <Input value={otherSocialUrl} onChange={(e) => setOtherSocialUrl(e.target.value)} placeholder="instagram.com/you" />
              </Field>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div>
              <label className="mb-2 block text-xs font-medium text-fg-muted">
                Domains you can answer in
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <Chip key={c.slug} active={categorySlugs.includes(c.slug)} onClick={() => toggleCategory(c.slug)}>
                    {c.name}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium text-fg-muted">
                Specific topics (optional)
              </label>
              <div className="flex gap-2">
                <Input
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTopic();
                    }
                  }}
                  placeholder="e.g. Growth Marketing"
                />
                <Button type="button" variant="secondary" onClick={addTopic}>Add</Button>
              </div>
              {topics.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {topics.map((t) => (
                    <Badge key={t} variant="brand">{t}</Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Avatar name={name || "New Expert"} size="xl" />
              <button
                type="button"
                onClick={() => toast("Photo upload will be available soon.", "info")}
                className="flex items-center gap-2 rounded-full border border-border px-3.5 py-2 text-xs font-medium text-fg-muted hover:border-border-hover"
              >
                <Camera className="size-4" /> Upload photo
              </button>
            </div>
            <button
              type="button"
              onClick={() => toast("Cover upload will be available soon.", "info")}
              className="flex h-20 items-center justify-center gap-2 rounded-xl border border-dashed border-border text-xs font-medium text-fg-muted hover:border-border-hover"
            >
              <ImageIcon className="size-4" /> Upload cover image
            </button>
            <Field label="Headline">
              <Input value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="e.g. Growth & Marketing Expert" />
            </Field>
            <Field label="Bio">
              <Textarea rows={4} value={profileBio} onChange={(e) => setProfileBio(e.target.value)} placeholder="What can people ask you about?" />
            </Field>
          </div>
        )}

        {step === 4 && (
          <div>
            <Card className="p-5">
              <div className="flex items-start gap-3">
                <Avatar name={name || "New Expert"} size="lg" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="truncate font-display text-base font-semibold text-fg">
                      {name || "Your name"}
                    </h3>
                  </div>
                  <p className="truncate text-sm text-fg-muted">{headline || "Your headline"}</p>
                  {company && <p className="truncate text-xs text-fg-subtle">{company}</p>}
                  {linkedin && (
                    <p className="mt-1 flex items-center gap-1 truncate text-xs text-brand">
                      <LinkedinIcon className="size-3" /> {linkedin}
                    </p>
                  )}
                </div>
              </div>
              <p className="mt-3 text-sm text-fg-muted">{profileBio || "Your bio will appear here."}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(topics.length ? topics : categorySlugs).slice(0, 4).map((t) => (
                  <Badge key={t} variant="outline">{t}</Badge>
                ))}
              </div>
            </Card>
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-warning/25 bg-warning/10 px-4 py-3 text-sm text-warning">
              <BadgeCheck className="size-4 shrink-0" />
              Your profile will show as &ldquo;Verification pending&rdquo; until our team reviews it.
            </div>
          </div>
        )}

        <div className="mt-7 flex items-center justify-between border-t border-border pt-5">
          <Button variant="ghost" onClick={back} disabled={step === 0}>
            <ArrowLeft className="size-4" /> Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={next} disabled={!canContinue}>
              Continue <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button onClick={handleCreate}>
              <Check className="size-4" /> Create Expert Profile
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-fg-muted">{label}</label>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-brand bg-brand/10 text-brand"
          : "border-border text-fg-muted hover:border-border-hover"
      )}
    >
      {children}
    </button>
  );
}
