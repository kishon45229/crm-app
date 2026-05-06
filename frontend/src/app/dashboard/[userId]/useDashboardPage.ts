"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { refreshAccessToken } from "@/features/auth/api";
import {
  clearAccessToken,
  getAccessToken,
  getAccessTokenUserId,
  isAccessTokenExpired,
} from "@/features/auth/token";

import { useLeads } from "@/features/leads/useLeads";

import type { DashboardSectionKey } from "./components/LeadSidebar";

export type UseDashboardPageResult = {
  isReady: boolean;
  activeSection: DashboardSectionKey;
  setActiveSection: React.Dispatch<React.SetStateAction<DashboardSectionKey>>;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSelectSection: (key: DashboardSectionKey) => void;
  leadState: ReturnType<typeof useLeads>;
};

export function useDashboardPage(userId: string): UseDashboardPageResult {
  const router = useRouter();

  const [isReady, setIsReady] = React.useState(false);
  const [activeSection, setActiveSection] =
    React.useState<DashboardSectionKey>("home");
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const leadState = useLeads(userId);

  React.useEffect(() => {
    if (!isReady) return;
    void leadState.refreshFromServer();
  }, [isReady, leadState]);

  React.useEffect(() => {
    let cancelled = false;

    async function ensureAuthenticated() {
      let token = getAccessToken();

      if (!token) {
        try {
          token = await refreshAccessToken();
        } catch {
          router.replace("/login");
          return;
        }
      }

      if (isAccessTokenExpired(token)) {
        try {
          await refreshAccessToken();
        } catch {
          clearAccessToken();
          router.replace("/login");
          return;
        }
      }

      const currentToken = getAccessToken();
      if (!currentToken) {
        router.replace("/login");
        return;
      }

      const tokenUserId = getAccessTokenUserId(currentToken);
      if (!tokenUserId || tokenUserId !== userId) {
        router.replace("/login");
        return;
      }

      if (!cancelled) setIsReady(true);
    }

    void ensureAuthenticated();

    return () => {
      cancelled = true;
    };
  }, [router, userId]);

  const onSelectSection = React.useCallback((key: DashboardSectionKey) => {
    setActiveSection(key);
  }, []);

  return {
    isReady,
    activeSection,
    setActiveSection,
    sidebarOpen,
    setSidebarOpen,
    onSelectSection,
    leadState,
  };
}
