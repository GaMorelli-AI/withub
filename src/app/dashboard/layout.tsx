"use client";

import { Bell, Bookmark, Compass, Home, MessageSquareText, User } from "lucide-react";
import { AuthGuard } from "@/components/AuthGuard";
import { Sidebar } from "@/components/Sidebar";

const ITEMS = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/categories", label: "Explore", icon: Compass },
  { href: "/dashboard/questions", label: "My Questions", icon: MessageSquareText },
  { href: "/dashboard/experts", label: "Saved Experts", icon: Bookmark },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard role="user">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col md:flex-row">
        <Sidebar items={ITEMS} />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </AuthGuard>
  );
}
