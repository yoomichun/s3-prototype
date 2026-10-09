"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type DashboardResetValue = { resetKey: number; resetDashboard: () => void };

const DashboardResetContext = createContext<DashboardResetValue>({ resetKey: 0, resetDashboard: () => {} });

export function DashboardResetProvider({ children }: { children: React.ReactNode }) {
  const [resetKey, setResetKey] = useState(0);
  const resetDashboard = useCallback(() => {
    setResetKey((k) => k + 1);
    window.scrollTo({ top: 0 });
  }, []);
  const value = useMemo(() => ({ resetKey, resetDashboard }), [resetKey, resetDashboard]);
  return <DashboardResetContext.Provider value={value}>{children}</DashboardResetContext.Provider>;
}

export const useDashboardReset = () => useContext(DashboardResetContext);

// Remounts its children each time the Dashboard nav item is clicked, which returns them to their default state.
export function DashboardResetBoundary({ children }: { children: React.ReactNode }) {
  const { resetKey } = useDashboardReset();
  return <div key={resetKey} style={{ display: "contents" }}>{children}</div>;
}
