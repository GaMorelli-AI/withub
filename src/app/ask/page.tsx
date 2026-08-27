import { Suspense } from "react";
import { AskFlow } from "@/components/ask/AskFlow";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata = { title: "Ask a question — WitHub" };

export default function AskPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl flex-1 px-4 py-12 sm:px-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-6 h-96 w-full" />
        </div>
      }
    >
      <AskFlow />
    </Suspense>
  );
}
