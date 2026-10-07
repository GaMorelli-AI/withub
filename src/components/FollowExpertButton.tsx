"use client";

import { UserPlus, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { useI18n } from "@/lib/i18n";

export function FollowExpertButton({
  expertId,
  expertName,
}: {
  expertId: string;
  expertName: string;
}) {
  const { t } = useI18n();
  const session = useAppStore((s) => s.session);
  const users = useAppStore((s) => s.users);
  const toggleFollowExpert = useAppStore((s) => s.toggleFollowExpert);
  const toast = useToast();

  const currentUser =
    session?.type === "user" ? users.find((u) => u.id === session.id) : null;
  const following = currentUser?.followingExpertIds.includes(expertId) ?? false;

  if (session && session.type !== "user") return null;

  function handleClick() {
    if (!session) {
      toast("Sign in as a User to follow experts.", "info");
      return;
    }
    toggleFollowExpert(session.id, expertId);
    toast(
      following
        ? `Unfollowed ${expertName}.`
        : `You're now following ${expertName}.`,
      "success"
    );
  }

  return (
    <Button variant={following ? "secondary" : "primary"} size="md" onClick={handleClick}>
      {following ? (
        <UserCheck className="size-4 text-brand" />
      ) : (
        <UserPlus className="size-4" />
      )}
      {following ? t("common.following") : t("common.follow")}
    </Button>
  );
}
