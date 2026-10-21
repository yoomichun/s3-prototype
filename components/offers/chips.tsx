"use client";

import Box from "@mui/material/Box";
import type { OfferStatus } from "@/data/offers";

export function OfferNumberChip({ number }: { number: string }) {
  return (
    <Box
      component="span"
      sx={(t) => ({
        display: "inline-flex",
        px: 1,
        py: 0.5,
        borderRadius: `${t.custom.radius.pill}px`,
        bgcolor: t.palette.slate[100],
        ...t.typography.caption,
        color: "text.primary",
      })}
    >
      #{number}
    </Box>
  );
}

// Dot colors follow the Figma status chips: blue for new, gray for declined, green for accepted, yellow for negotiated
const dotColor: Record<OfferStatus, (t: import("@mui/material/styles").Theme) => string> = {
  New: (t) => t.palette.accent.teal.main,
  "Buyer Declined": (t) => t.palette.slate[500],
  "Seller Declined": (t) => t.palette.slate[500],
  "Seller Accepted": (t) => t.palette.success.main,
  "Seller Negotiated": (t) => t.palette.warning.main,
};

export function OfferStatusChip({ status }: { status: OfferStatus }) {
  return (
    <Box
      component="span"
      sx={(t) => ({
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        px: 1.5,
        py: 1,
        borderRadius: `${t.custom.radius.pill}px`,
        bgcolor: t.palette.slate[100],
        ...t.typography.caption,
        color: "text.primary",
        whiteSpace: "nowrap",
      })}
    >
      <Box component="span" sx={(t) => ({ width: 8, height: 8, borderRadius: "50%", bgcolor: dotColor[status](t) })} />
      {status}
    </Box>
  );
}
