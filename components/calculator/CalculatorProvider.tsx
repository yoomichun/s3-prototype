"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import SuccessAlert from "@/components/SuccessAlert";
import { formatUsd } from "@/data/priceReductions";
import CalculatorModal from "./CalculatorModal";

type CalculatorContextValue = {
  openCalculator: () => void;
  approvedPrice: number | null;
  approvePrice: (price: number) => void;
};

const CalculatorContext = createContext<CalculatorContextValue | null>(null);

export function useCalculator() {
  const ctx = useContext(CalculatorContext);
  if (!ctx) throw new Error("useCalculator must be used inside CalculatorProvider");
  return ctx;
}

// Lives at the app level so the dashboard conversation and the property page open the same modal
export default function CalculatorProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [approvedPrice, setApprovedPrice] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const openCalculator = useCallback(() => setOpen(true), []);
  const approvePrice = useCallback((price: number) => {
    setApprovedPrice(price);
    setOpen(false);
    setToast(`Price reduction approved at ${formatUsd(price)}`);
  }, []);

  const value = useMemo(() => ({ openCalculator, approvedPrice, approvePrice }), [openCalculator, approvedPrice, approvePrice]);

  return (
    <CalculatorContext.Provider value={value}>
      {children}
      <CalculatorModal open={open} onClose={() => setOpen(false)} onApprove={approvePrice} />
      <Snackbar
        open={toast !== null}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <SuccessAlert onClose={() => setToast(null)}>
          {toast}
        </SuccessAlert>
      </Snackbar>
    </CalculatorContext.Provider>
  );
}
