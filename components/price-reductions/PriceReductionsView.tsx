"use client";

import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import SuccessAlert from "@/components/SuccessAlert";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import ArrowForwardOutlined from "@mui/icons-material/ArrowForwardOutlined";
import { formatUsd, priceReductions } from "@/data/priceReductions";
import PriceReductionsTable from "./PriceReductionsTable";

type FilterKey = "stale" | "pending" | "high";

const staleDays = 14;

const filters: { key: FilterKey; label: string; match: (r: (typeof priceReductions)[number]) => boolean }[] = [
  { key: "stale", label: "No price reduction in 14 days+", match: (r) => r.dom >= staleDays },
  { key: "pending", label: "Pending price reduction requests", match: (r) => r.pending },
  { key: "high", label: "High-confidence price reductions", match: (r) => r.confidence === "High" },
];

const highConfidence = priceReductions.filter((r) => r.confidence === "High");

function StatCard({ label, value, action }: { label: string; value: number; action?: React.ReactNode }) {
  return (
    <Box
      sx={(t) => ({
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        p: 3,
        bgcolor: "background.paper",
        borderRadius: `${t.custom.radius.md}px`,
        boxShadow: 1,
        textAlign: "center",
      })}
    >
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {label}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography variant="h1" sx={{ color: "text.primary" }}>
          {value}
        </Typography>
        {action}
      </Box>
    </Box>
  );
}

function FilterChip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <ButtonBase
      onClick={onClick}
      aria-pressed={selected}
      sx={(t) => ({
        px: 1.5,
        py: 1,
        borderRadius: `${t.custom.radius.pill}px`,
        ...t.typography.body2,
        lineHeight: "16px",
        bgcolor: selected ? "primary.light" : "background.paper",
        color: selected ? "primary.main" : "text.primary",
        border: 1,
        borderColor: selected ? "primary.light" : t.palette.slate[400],
      })}
    >
      {label}
    </ButtonBase>
  );
}

export default function PriceReductionsView() {
  const [filter, setFilter] = useState<FilterKey | null>("stale");
  const [approvedIds, setApprovedIds] = useState<ReadonlySet<string>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const rows = useMemo(() => {
    const active = filters.find((f) => f.key === filter);
    return active ? priceReductions.filter(active.match) : priceReductions;
  }, [filter]);

  const allHighApproved = highConfidence.every((r) => approvedIds.has(r.id));

  const approveHigh = () => {
    setApprovedIds((prev) => new Set([...prev, ...highConfidence.map((r) => r.id)]));
    setConfirmOpen(false);
    setToast(`Approved ${highConfidence.length} high-confidence price reductions`);
  };

  return (
    <Box sx={{ gridColumn: 1, gridRow: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 5 }}>
      <Tabs value="advisory" aria-label="Price reduction sections" sx={{ borderBottom: 1, borderColor: "divider", alignSelf: "flex-start" }}>
        <Tab value="advisory" label="Price reduction advisory" sx={{ px: 2, py: 1.5, typography: "body1", color: "text.primary" }} />
        <Tab value="activity" label="On market activity" sx={{ px: 2, py: 1.5, typography: "body1", color: "text.primary" }} />
      </Tabs>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", columnGap: 4 }}>
        <StatCard label="No price reduction for 14 days+" value={priceReductions.filter((r) => r.dom >= staleDays).length} />
        <StatCard label="Pending price reduction requests" value={priceReductions.filter((r) => r.pending).length} />
        <StatCard
          label="High-confidence price reductions"
          value={highConfidence.length}
          action={
            <Button
              disabled={allHighApproved}
              onClick={() => setConfirmOpen(true)}
              sx={{ px: 1, py: 0.25, color: "primary.main" }}
            >
              Approve all
            </Button>
          }
        />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          {filters.map((f) => (
            <FilterChip key={f.key} label={f.label} selected={filter === f.key} onClick={() => setFilter(filter === f.key ? null : f.key)} />
          ))}
        </Box>
        <Button onClick={() => setFilter(null)} sx={{ px: 1, py: 0.25, color: "primary.main" }}>
          Clear filters
        </Button>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography variant="h5" sx={{ color: "text.primary" }}>
            Suggested price reductions
          </Typography>
          <Typography variant="body1" sx={{ color: "text.primary" }}>
            Sorted by days on market. Approve to add to your task queue.
          </Typography>
        </Box>
        <Box sx={(t) => ({ p: 3, bgcolor: "background.paper", borderRadius: `${t.custom.radius.md}px`, boxShadow: 1 })}>
          <PriceReductionsTable rows={rows} approvedIds={approvedIds} />
        </Box>
      </Box>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle variant="h4">Approve high-confidence price reductions</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 2 }}>
            These {highConfidence.length} reductions will be added to your task queue.
          </Typography>
          <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "flex", flexDirection: "column" }}>
            {highConfidence.map((r) => (
              <Box
                component="li"
                key={r.id}
                sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, py: 1.5, borderBottom: 1, borderColor: "divider" }}
              >
                <Box>
                  <Typography variant="body2" sx={{ color: "text.primary" }}>
                    {r.street}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {r.cityStateZip}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, typography: "body2", color: "text.primary" }}>
                  {formatUsd(r.listPrice)}
                  <ArrowForwardOutlined sx={{ fontSize: 16, color: "text.secondary" }} />
                  <Box component="span" sx={{ fontWeight: "fontWeightMedium" }}>
                    {formatUsd(r.suggestedPrice)}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={approveHigh}>
            Approve
          </Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  );
}
