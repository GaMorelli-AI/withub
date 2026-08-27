"use client";

import { Home, Inbox, MessageSquareText, Settings, User, Wallet } from "lucide-react";
import { AuthGuard } from "@/components/AuthGuard";
import { Sidebar } from "@/components/Sidebar";

const ITEMS = [
  { href: "/expert-dashboard", label: "Overview", icon: Home },
  { href: "/expert-dashboard/questions", label: "Questions", icon: Inbox },
  { href: "/expert-dashboard/answers", label: "Answers", icon: MessageSquareText },
  { href: "/expert-dashboard/earnings", label: "Earnings", icon: Wallet },
  { href: "/expert-dashboard/profile", label: "Profile", icon: User },
  { href: "/expert-dashboard/settings", label: "Settings", icon: Settings },
];

export default function ExpertDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard role="expert">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col md:flex-row">
        <Sidebar items={ITEMS} />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </AuthGuard>
  );
}
