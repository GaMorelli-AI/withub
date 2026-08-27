"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Skeleton } from "@/components/ui/Skeleton";

export function AuthGuard({
  role,
  children,
}: {
  role: "user" | "expert";
  children: React.ReactNode;
}) {
  const router = useRouter();
  const hasHydrated = useAppStore((s) => s.hasHydrated);
  const session = useAppStore((s) => s.session);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!session || session.type !== role) {
      router.replace("/login");
    }
  }, [hasHydrated, session, role, router]);

  if (!hasHydrated || !session || session.type !== role) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col gap-4 p-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return <>{children}</>;
}
