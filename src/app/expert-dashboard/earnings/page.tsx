"use client";

import { useState } from "react";
import { Clock, Wallet, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { formatDate, formatPrice } from "@/lib/format";

export default function EarningsPage() {
  const toast = useToast();
  const session = useAppStore((s) => s.session);
  const earningsTx = useAppStore((s) => s.earningsTx);
  const questions = useAppStore((s) => s.questions);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const myTx = earningsTx
    .filter((t) => t.expertId === session?.id)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  const available = myTx.filter((t) => t.status === "paid").reduce((s, t) => s + t.amount, 0);
  const pending = questions
    .filter((q) => q.expertId === session?.id && q.status === "waiting")
    .reduce((s, q) => s + q.expertEarnings, 0);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-fg">Earnings</h1>
      <p className="mt-1 text-sm text-fg-muted">
        Track how your answers are turning into income.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Wallet} label="Available Balance" value={formatPrice(available)} accent />
        <StatCard icon={Clock} label="Pending" value={formatPrice(pending)} />
        <StatCard icon={TrendingUp} label="Total Earnings" value={formatPrice(available)} />
      </div>

      <div className="mt-6">
        <Button onClick={() => setWithdrawOpen(true)}>Withdraw</Button>
      </div>

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold text-fg">History</h2>
        {myTx.length > 0 ? (
          <Card className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-fg-subtle">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Question</th>
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {myTx.map((t) => (
                  <tr key={t.id} className="border-b border-border last:border-0">
                    <td className="whitespace-nowrap px-4 py-3 text-fg-muted">
                      {formatDate(t.date)}
                    </td>
                    <td className="max-w-[280px] truncate px-4 py-3 text-fg">
                      {t.questionText}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-fg-muted">
                      {t.userName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-fg">
                      {formatPrice(t.amount)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <Badge variant={t.status === "paid" ? "success" : "warning"}>
                        {t.status === "paid" ? "Paid" : "Pending"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        ) : (
          <EmptyState
            className="mt-3"
            icon={Wallet}
            title="No earnings yet"
            description="Answer a question to start building your earnings history."
          />
        )}
      </section>

      <Modal open={withdrawOpen} onClose={() => setWithdrawOpen(false)} title="Withdraw funds">
        <p className="text-sm text-fg-muted">
          You&apos;re about to withdraw{" "}
          <span className="font-medium text-fg">{formatPrice(available)}</span> to your
          connected bank account.
        </p>
        <p className="mt-2 text-xs text-fg-subtle">
          This is a demo — no real payout is processed.
        </p>
        <div className="mt-5 flex justify-end gap-2.5">
          <Button variant="secondary" onClick={() => setWithdrawOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              setWithdrawOpen(false);
              toast("Withdrawal requested — funds typically arrive in 2-3 business days.");
            }}
          >
            Confirm withdrawal
          </Button>
        </div>
      </Modal>
    </div>
  );
}
