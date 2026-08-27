"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";

export function SaveExpertButton({
  expertId,
  expertName,
}: {
  expertId: string;
  expertName: string;
}) {
  const session = useAppStore((s) => s.session);
  const users = useAppStore((s) => s.users);
  const toggleSaveExpert = useAppStore((s) => s.toggleSaveExpert);
  const toast = useToast();

  const currentUser =
    session?.type === "user" ? users.find((u) => u.id === session.id) : null;
  const saved = currentUser?.savedExpertIds.includes(expertId) ?? false;

  if (session && session.type !== "user") return null;

  function handleClick() {
    if (!session) {
      toast("Sign in as a user to save experts.", "info");
      return;
    }
    toggleSaveExpert(session.id, expertId);
    toast(
      saved ? `Removed ${expertName} from saved experts.` : `Saved ${expertName} to your experts.`,
      "success"
    );
  }

  return (
    <Button variant="secondary" size="md" onClick={handleClick}>
      {saved ? (
        <BookmarkCheck className="size-4 text-brand" />
      ) : (
        <Bookmark className="size-4" />
      )}
      {saved ? "Saved" : "Save expert"}
    </Button>
  );
}
