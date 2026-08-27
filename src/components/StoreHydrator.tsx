"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";

export function StoreHydrator() {
  useEffect(() => {
    const result = useAppStore.persist.rehydrate();
    if (result && typeof (result as Promise<unknown>).finally === "function") {
      (result as Promise<unknown>).finally(() => {
        useAppStore.getState().setHasHydrated(true);
      });
    } else {
      useAppStore.getState().setHasHydrated(true);
    }
  }, []);

  return null;
}
