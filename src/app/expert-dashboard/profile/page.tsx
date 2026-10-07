"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  BookOpen,
  Globe,
  Link2,
  Lock,
  MessageSquareText,
  Pencil,
  Save,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/icons/SocialIcons";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { getExpertAnalytics } from "@/lib/stats";
import { formatCompactNumber } from "@/lib/format";
import { cn } from "@/lib/cn";

const SOCIAL_LINKS = [
  { key: "tiktok", label: "TikTok", icon: TikTokIcon, posts: 46, linked: true },
  { key: "instagram", label: "Instagram", icon: InstagramIcon, posts: 128, linked: true },
  { key: "facebook", label: "Facebook", icon: FacebookIcon, posts: 0, linked: false },
];

export default function ExpertProfilePage() {
  const toast = useToast();
  const session = useAppStore((s) => s.session);
  const experts = useAppStore((s) => s.experts);
  const questions = useAppStore((s) => s.questions);
  const updateExpert = useAppStore((s) => s.updateExpert);

  const expert = experts.find((e) => e.id === session?.id);
  const [editing, setEditing] = useState(false);
  const [headline, setHeadline] = useState(expert?.headline ?? "");
  const [bio, setBio] = useState(expert?.bio ?? "");
  const [linkedinUrl, setLinkedinUrl] = useState(expert?.linkedinUrl ?? "");
  const [website, setWebsite] = useState(expert?.website ?? "");

  if (!expert) return null;

  const analytics = getExpertAnalytics(expert.id, questions);
  const myQuestions = questions.filter((q) => q.expertId === expert.id);
  const publicAnswers = myQuestions.filter(
    (q) => q.status === "answered" && q.privacy === "public"
  ).length;
  const privateAnswers = myQuestions.filter(
    (q) => q.status === "answered" && q.privacy === "private"
  ).length;

  function handleSave() {
    updateExpert(expert!.id, {
      headline: headline.trim() || expert!.headline,
      bio: bio.trim() || expert!.bio,
      linkedinUrl: linkedinUrl.trim() || undefined,
      website: website.trim() || undefined,
    });
    setEditing(false);
    toast("Profile updated.");
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-fg">Profile</h1>
      <p className="mt-1 text-sm text-fg-muted">This is what people see on WitHub.</p>

      <Card className="mt-6 overflow-hidden p-0">
        <div className="h-28 bg-profile-banner sm:h-36" />

        <div className="px-6 pb-6 sm:px-7">
          <div className="-mt-10 flex items-end justify-between sm:-mt-12">
            <Avatar
              name={expert.name}
              seed={expert.gradientSeed}
              size="xl"
              className="ring-4 ring-surface"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => (editing ? handleSave() : setEditing(true))}
            >
              {editing ? <Save className="size-4" /> : <Pencil className="size-4" />}
              {editing ? "Save" : "Edit"}
            </Button>
          </div>

          <div className="mt-4 flex items-center gap-1.5">
            <h2 className="font-display text-lg font-semibold text-fg">{expert.name}</h2>
            {expert.verification === "verified" ? (
              <Badge variant="brand">
                <BadgeCheck className="size-3.5" /> Verified
              </Badge>
            ) : (
              <Badge variant="warning">Verification pending</Badge>
            )}
          </div>

          {editing ? (
            <Input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="mt-2 max-w-sm"
            />
          ) : (
            <p className="text-sm text-fg-muted">{expert.headline}</p>
          )}
          {expert.company && <p className="text-xs text-fg-subtle">{expert.company}</p>}

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-fg-muted">
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-3.5" /> {formatCompactNumber(expert.followersCount)} Followers
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Star className="size-3.5" /> {expert.rating.toFixed(1)} Rating
            </span>
            <span className="inline-flex items-center gap-1.5">
              <TrendingUp className="size-3.5" /> {expert.responseRate}% response rate
            </span>
          </div>

          <Link
            href={`/expert/${expert.id}`}
            className="mt-2 inline-flex items-center gap-1.5 text-sm text-brand hover:underline"
          >
            <Link2 className="size-3.5" /> withub.com/expert/{expert.id}
          </Link>

          {editing ? (
            <Textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mt-4"
            />
          ) : (
            <p className="mt-4 text-sm text-fg-muted">{expert.bio}</p>
          )}

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-fg-muted">LinkedIn</label>
              {editing ? (
                <Input
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="linkedin.com/in/you"
                />
              ) : expert.linkedinUrl ? (
                <a
                  href={expert.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-brand hover:underline"
                >
                  {expert.linkedinUrl.replace("https://", "")}
                </a>
              ) : (
                <p className="text-sm text-fg-subtle">Not added</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-fg-muted">Website</label>
              {editing ? (
                <Input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="yoursite.com"
                />
              ) : expert.website ? (
                <a
                  href={expert.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-brand hover:underline"
                >
                  <Globe className="size-3.5" /> {expert.website.replace("https://", "")}
                </a>
              ) : (
                <p className="text-sm text-fg-subtle">Not added</p>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatBox icon={BookOpen} value={`${analytics.knowledgeCount}`} label="Knowledge" />
            <StatBox icon={MessageSquareText} value={`${publicAnswers}`} label="Public answers" />
            <StatBox icon={Lock} value={`${privateAnswers}`} label="Private answers" />
            <StatBox
              icon={TrendingUp}
              value={`${expert.responseRate}%`}
              label="Answer rate"
              tone="positive"
            />
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium text-fg">Social</p>
            <div className="mt-3 flex flex-col gap-2">
              {SOCIAL_LINKS.map((s) => (
                <div
                  key={s.key}
                  className="flex items-center gap-3 rounded-xl border border-border bg-bg-elevated px-4 py-3"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-hover text-fg-muted">
                    <s.icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-fg">{s.label}</p>
                    <p className="text-xs text-fg-subtle">
                      {s.linked ? `${s.posts} Posts` : "Not connected"}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      toast(
                        s.linked
                          ? `${s.label} is already linked.`
                          : `Connecting ${s.label} isn't available in this demo.`,
                        "info"
                      )
                    }
                    className={cn(
                      "text-xs font-medium",
                      s.linked ? "text-fg-subtle" : "text-brand hover:underline"
                    )}
                  >
                    {s.linked ? "Linked" : "Connect"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function StatBox({
  icon: Icon,
  value,
  label,
  tone = "default",
}: {
  icon: typeof Users;
  value: string;
  label: string;
  tone?: "default" | "positive";
}) {
  return (
    <div className="rounded-xl border border-border bg-bg-elevated p-4 text-center">
      <Icon className={cn("mx-auto size-4", tone === "positive" ? "text-positive" : "text-fg-subtle")} />
      <p
        className={cn(
          "mt-2 font-display text-lg font-semibold",
          tone === "positive" ? "text-positive" : "text-fg"
        )}
      >
        {value}
      </p>
      <p className="mt-0.5 text-xs text-fg-subtle">{label}</p>
    </div>
  );
}
