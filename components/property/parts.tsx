import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { HistoryStatus } from "@/data/property";

export const emptyCell = "-";

export function Card({ children, sx }: { children: React.ReactNode; sx?: object }) {
  return (
    <Box
      sx={(t) => ({
        p: 3,
        bgcolor: "background.paper",
        borderRadius: `${t.custom.radius.md}px`,
        boxShadow: 1,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        minWidth: 0,
        ...sx,
      })}
    >
      {children}
    </Box>
  );
}

export function DataRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
      <Typography variant="body1" sx={{ width: 130, flexShrink: 0, color: "text.secondary" }}>
        {label}
      </Typography>
      <Box sx={{ flex: 1, minWidth: 0, typography: "body1", color: "text.primary" }}>{children}</Box>
    </Box>
  );
}

const statusBg = {
  Sold: "accent.purple.light",
  "Under contract": "accent.pink.light",
  Pending: "warning.light",
  Listed: "success.light",
} as const;

export function StatusChip({ status }: { status: HistoryStatus }) {
  return (
    <Box
      sx={(t) => ({
        display: "inline-flex",
        px: 1,
        py: 0.5,
        borderRadius: `${t.custom.radius.pill}px`,
        bgcolor: statusBg[status],
        ...t.typography.caption,
        color: "text.primary",
      })}
    >
      {status}
    </Box>
  );
}

const money = (n: number) => `$${n.toLocaleString("en-US")}`;
export const formatMoney = money;
export const formatReduction = (amount: number, percent: number) => `${money(amount)} / ${percent}%`;
