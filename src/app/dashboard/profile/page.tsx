"use client";

import { useState } from "react";
import { Bookmark, MessageSquareText, Pencil, Save } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/lib/store";
import { getUserById } from "@/data/users";
import { categories } from "@/data/categories";
import { useToast } from "@/components/ui/Toast";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";

export default function UserProfilePage() {
  const toast = useToast();
  const session = useAppStore((s) => s.session);
  const users = useAppStore((s) => s.users);
  const questions = useAppStore((s) => s.questions);
  const updateUser = useAppStore((s) => s.updateUser);

  const user = session ? users.find((u) => u.id === session.id) ?? getUserById(session.id) : null;
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [interests, setInterests] = useState<string[]>(user?.interests ?? []);

  if (!user) return null;

  const questionsAsked = questions.filter((q) => q.askerId === user.id).length;
  const savedExperts = user.savedExpertIds.length;

  function toggleInterest(slug: string) {
    setInterests((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }

  function handleSave() {
    updateUser(user!.id, { name: name.trim() || user!.name, interests });
    setEditing(false);
    toast("Profile updated.");
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-fg">Profile</h1>
      <p className="mt-1 text-sm text-fg-muted">Manage your account details.</p>

      <Card className="mt-6 overflow-hidden p-0">
        <div className="h-28 bg-profile-banner sm:h-36" />

        <div className="px-6 pb-6 sm:px-7">
          <div className="-mt-10 flex items-end justify-between sm:-mt-12">
            <Avatar
              name={user.name}
              seed={user.gradientSeed}
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

          <div className="mt-4">
            {editing ? (
              <Input value={name} onChange={(e) => setName(e.target.value)} className="max-w-xs" />
            ) : (
              <h2 className="font-display text-lg font-semibold text-fg">{user.name}</h2>
            )}
            <p className="text-sm text-fg-muted">{user.email}</p>
            <p className="mt-0.5 text-xs text-fg-subtle">
              {user.country} &middot; Member since {formatDate(user.joinedAt)}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-bg-elevated p-4 text-center">
              <MessageSquareText className="mx-auto size-4 text-fg-subtle" />
              <p className="mt-2 font-display text-lg font-semibold text-fg">{questionsAsked}</p>
              <p className="mt-0.5 text-xs text-fg-subtle">Questions asked</p>
            </div>
            <div className="rounded-xl border border-border bg-bg-elevated p-4 text-center">
              <Bookmark className="mx-auto size-4 text-fg-subtle" />
              <p className="mt-2 font-display text-lg font-semibold text-fg">{savedExperts}</p>
              <p className="mt-0.5 text-xs text-fg-subtle">Saved experts</p>
            </div>
          </div>

          <div className="mt-6 border-t border-border pt-5">
            <p className="text-sm font-medium text-fg">Interests</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((c) => {
                const active = interests.includes(c.slug);
                return (
                  <button
                    key={c.slug}
                    type="button"
                    disabled={!editing}
                    onClick={() => toggleInterest(c.slug)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                      active
                        ? "border-brand bg-brand/10 text-brand"
                        : "border-border text-fg-muted",
                      editing && !active && "hover:border-border-hover",
                      !editing && "opacity-80"
                    )}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
