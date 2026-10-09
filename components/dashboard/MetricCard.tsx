"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import AttachMoneyOutlined from "@mui/icons-material/AttachMoneyOutlined";
import OpenInFullOutlined from "@mui/icons-material/OpenInFullOutlined";
import TrendingUpOutlined from "@mui/icons-material/TrendingUpOutlined";
import TrendingDownOutlined from "@mui/icons-material/TrendingDownOutlined";
import type { Comparison, Metric } from "@/data/dashboard";
import MetricChart from "./MetricChart";

function ComparisonRow({ row }: { row: Comparison }) {
  const up = row.direction === "up";
  const Icon = up ? TrendingUpOutlined : TrendingDownOutlined;
  const color = up ? "success.main" : "error.main";
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", columnGap: 5, rowGap: 0.5, alignItems: "center" }}>
      <Box sx={{ display: "flex", gap: 1, width: 175, typography: "body2" }}>
        <Box component="span" sx={{ width: 100, color: "text.secondary" }}>
          {row.label}
        </Box>
        <Box component="span" sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
          {row.value}
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 0.5, alignItems: "center", typography: "caption" }}>
        <Icon sx={{ fontSize: 16, color }} />
        <Box component="span" sx={{ color, fontWeight: "fontWeightMedium", whiteSpace: "nowrap" }}>
          {row.lead}{" "}
          <Box component="span" sx={{ color: "text.primary", fontWeight: "fontWeightRegular" }}>
            {row.connector}
          </Box>
        </Box>
        <Box
          component="span"
          sx={{ color: "text.primary", fontWeight: row.subjectBold ? "fontWeightMedium" : "fontWeightRegular", whiteSpace: "nowrap" }}
        >
          {row.subject}
        </Box>
      </Box>
    </Box>
  );
}

export default function MetricCard({ metric }: { metric: Metric }) {
  const Icon = metric.icon === "home" ? HomeOutlined : AttachMoneyOutlined;
  return (
    <Box
      sx={(t) => ({
        flex: "0 0 var(--metric-card-width)",
        minWidth: 0,
        minHeight: 529,
        p: 3,
        bgcolor: "background.paper",
        borderRadius: `${t.custom.radius.md}px`,
        boxShadow: 1,
      })}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={(t) => ({
                width: 24,
                height: 24,
                borderRadius: `${t.custom.radius.pill}px`,
                bgcolor: "secondary.dark",
                color: "common.white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              })}
            >
              <Icon sx={{ fontSize: 16 }} />
            </Box>
            <Typography variant="h5" sx={{ color: "text.primary" }}>
              {metric.title}
            </Typography>
          </Box>
          <OpenInFullOutlined sx={{ fontSize: 14, color: "text.primary" }} />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="h1" sx={{ color: "text.primary", lineHeight: "normal" }}>
                {metric.value}
              </Typography>
              {metric.select && (
                <Select
                  variant="standard"
                  size="small"
                  value={metric.select}
                  inputProps={{ "aria-label": "Status" }}
                  sx={(t) => ({
                    ...t.typography.body2,
                    px: 1.5,
                    "&:before": { borderBottomColor: t.palette.slate[400] },
                  })}
                >
                  <MenuItem value={metric.select}>{metric.select}</MenuItem>
                </Select>
              )}
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {metric.comparisons.map((row) => (
                <ComparisonRow key={row.label} row={row} />
              ))}
            </Box>
          </Box>
          <MetricChart metric={metric} />
        </Box>
      </Box>
    </Box>
  );
}
