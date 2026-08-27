"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";

export default function ExpertSettingsPage() {
  const router = useRouter();
  const toast = useToast();
  const resetDemoData = useAppStore((s) => s.resetDemoData);

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [newQuestionAlerts, setNewQuestionAlerts] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-fg">Settings</h1>
      <p className="mt-1 text-sm text-fg-muted">Manage how WitHub works for you.</p>

      <Card className="mt-6 divide-y divide-border p-2">
        <SettingRow
          title="Email notifications"
          description="Get emailed when a new question or review comes in."
          checked={emailNotifs}
          onChange={setEmailNotifs}
        />
        <SettingRow
          title="New question alerts"
          description="Show a badge on the bell icon for unanswered questions."
          checked={newQuestionAlerts}
          onChange={setNewQuestionAlerts}
        />
        <SettingRow
          title="Public profile"
          description="Let your profile be discovered through search and categories."
          checked={publicProfile}
          onChange={setPublicProfile}
        />
      </Card>

      <Card className="mt-6 border-danger/25 p-5">
        <p className="text-sm font-medium text-fg">Reset demo data</p>
        <p className="mt-1 text-sm text-fg-muted">
          Restores every question, answer and earning to its original demo
          state and signs you out.
        </p>
        <Button
          variant="danger"
          size="sm"
          className="mt-4"
          onClick={() => {
            resetDemoData();
            toast("Demo data has been reset.", "info");
            router.push("/");
          }}
        >
          <RotateCcw className="size-4" /> Reset demo data
        </Button>
      </Card>
    </div>
  );
}

function SettingRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-4 p-4">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-fg">{title}</p>
        <p className="mt-0.5 text-xs text-fg-muted">{description}</p>
      </div>
      <Switch checked={checked} onChange={onChange} label={title} />
    </div>
  );
}
