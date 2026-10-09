"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Slider from "@mui/material/Slider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ArrowBackOutlined from "@mui/icons-material/ArrowBackOutlined";
import AttachMoneyOutlined from "@mui/icons-material/AttachMoneyOutlined";
import CancelOutlined from "@mui/icons-material/CancelOutlined";
import {
  calculate,
  currentPrice,
  defaultConcessions,
  formatPriceK,
  holdingCostPerDay,
  priceRange,
  suggestedPrice,
} from "@/data/priceCalculator";
import NoteHotspot from "@/components/notes/NoteHotspot";
import { formatUsd } from "@/data/priceReductions";
import { address } from "@/data/property";

const maxDigits = 7;

const toNumber = (text: string) => Number(text.replace(/\D/g, "").slice(0, maxDigits));
const formatNumber = (n: number) => (n ? n.toLocaleString("en-US") : "");
const position = (value: number) => ((value - priceRange.min) / (priceRange.max - priceRange.min)) * 100;
const clamp = (n: number) => Math.min(priceRange.max, Math.max(priceRange.min, n));

function Tile({ value, label }: { value: string; label: string }) {
  return (
    <Box
      sx={(t) => ({
        p: 2,
        bgcolor: "background.paper",
        borderRadius: `${t.custom.radius.md}px`,
        boxShadow: 1,
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
      })}
    >
      <Typography variant="body1" sx={{ fontWeight: "fontWeightMedium", color: "text.primary" }}>
        {value}
      </Typography>
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        {label}
      </Typography>
    </Box>
  );
}

function Marker({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: `${position(value)}%`,
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        color,
      }}
    >
      <Typography variant="caption" sx={{ whiteSpace: "nowrap", color: "inherit" }}>
        {label}
      </Typography>
      <Box sx={{ width: 2, height: 16, bgcolor: "currentColor" }} />
    </Box>
  );
}

function MoneyField({ label, value, onChange, onBlur }: { label: string; value: string; onChange: (v: string) => void; onBlur?: () => void }) {
  return (
    <TextField
      fullWidth
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      slotProps={{
        inputLabel: { shrink: true },
        htmlInput: { inputMode: "numeric" },
        input: {
          startAdornment: (
            <InputAdornment position="start" sx={{ color: "text.primary" }}>
              <AttachMoneyOutlined />
            </InputAdornment>
          ),
          sx: { "& input": { py: 1.5 } },
        },
      }}
    />
  );
}

function CalculatorBody({ onClose, onApprove }: { onClose: () => void; onApprove: (price: number) => void }) {
  const [price, setPrice] = useState(suggestedPrice);
  const [concessions, setConcessions] = useState(defaultConcessions);

  const result = calculate(price, concessions);
  const valid = price >= priceRange.min && price <= priceRange.max;

  return (
    <Box sx={{ position: "relative", p: 2, display: "flex", flexDirection: "column", gap: 3 }}>
      <NoteHotspot id="calculator" />
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton aria-label="Back" onClick={onClose} sx={{ p: 0, color: "text.primary" }}>
            <ArrowBackOutlined />
          </IconButton>
          <Typography id="calculator-title" variant="body1" sx={{ fontWeight: "fontWeightMedium", color: "text.primary" }}>
            Adjust price
          </Typography>
        </Box>
        <IconButton aria-label="Close" onClick={onClose} sx={{ p: 0, color: "text.primary" }}>
          <CancelOutlined />
        </IconButton>
      </Box>

      <Typography variant="h5" sx={{ color: "text.primary" }}>
        {address}
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 2 }} aria-live="polite">
        <Tile value={formatUsd(result.netProceeds)} label="Net proceeds" />
        <Tile value={`${result.daysToContract} days`} label="Days to contract" />
        <Tile value={formatUsd(result.holdingCost)} label="Holding cost" />
        <Tile value={`${result.vsUnderwritten.percent}% ${result.vsUnderwritten.direction}`} label="Vs. underwritten value" />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <MoneyField
          label="List price"
          value={formatNumber(price)}
          onChange={(v) => setPrice(toNumber(v))}
          onBlur={() => setPrice((p) => clamp(p))}
        />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ position: "relative", height: 64 }}>
            <Marker value={suggestedPrice} label={`Suggested ${formatPriceK(suggestedPrice)}`} color="primary.main" />
            <Marker value={currentPrice} label={`Current ${formatPriceK(currentPrice)}`} color="slate.600" />
            <Slider
              aria-label="List price"
              min={priceRange.min}
              max={priceRange.max}
              step={priceRange.step}
              value={clamp(price)}
              onChange={(_, v) => setPrice(v)}
              sx={{ position: "absolute", left: 0, right: 0, top: 40 }}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", color: "text.secondary" }}>
            <Typography variant="body2">{formatPriceK(priceRange.min)}</Typography>
            <Typography variant="body2">{formatPriceK(priceRange.max)}</Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "text.primary" }}>
            Holding cost is about {formatUsd(holdingCostPerDay)} per day on market.
          </Typography>
        </Box>
        <MoneyField label="Seller concessions" value={formatNumber(concessions)} onChange={(v) => setConcessions(toNumber(v))} />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" disabled={!valid} onClick={() => onApprove(price)}>
          Approve at {formatPriceK(price)}
        </Button>
      </Box>
    </Box>
  );
}

export default function CalculatorModal({
  open,
  onClose,
  onApprove,
}: {
  open: boolean;
  onClose: () => void;
  onApprove: (price: number) => void;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="calculator-title"
      fullWidth
      maxWidth={false}
      slotProps={{ paper: { sx: (t) => ({ overflow: "visible", maxWidth: 560, borderRadius: `${t.custom.radius.md}px` }) } }}
    >
      <CalculatorBody onClose={onClose} onApprove={onApprove} />
    </Dialog>
  );
}
