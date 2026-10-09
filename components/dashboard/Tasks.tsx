"use client";

import { useState } from "react";
import NoteHotspot from "@/components/notes/NoteHotspot";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import FlagOutlined from "@mui/icons-material/FlagOutlined";
import AccessTimeOutlined from "@mui/icons-material/AccessTimeOutlined";
import { activeTaskTab, onMarketTasks, preListingTasks, taskTabs } from "@/data/dashboard";
import CardHeader from "./CardHeader";
import CountBadge from "./CountBadge";

export default function Tasks() {
  const [tab, setTab] = useState(activeTaskTab);
  const active = taskTabs.find((t) => t.label === tab) ?? taskTabs[1];
  const rows = active.label === "On market tasks" ? onMarketTasks : active.label === "Pre-listing tasks" ? preListingTasks : [];
  const twoColumns = active.label === "Pre-listing tasks";
  return (
    <Box sx={{ position: "relative", display: "flex", flexDirection: "column", gap: 3 }}>
      <NoteHotspot id="task-queue" />
      <CardHeader title="MLS disposition tasks" subtitle="Complete to-dos by following the links under each task category." />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box role="tablist" sx={(t) => ({ display: "flex", alignSelf: "flex-start", boxShadow: `inset 0 -1px 0 ${t.palette.divider}` })}>
          {taskTabs.map((t) => {
            const selected = t.label === tab;
            return (
              <ButtonBase
                key={t.label}
                role="tab"
                aria-selected={selected}
                onClick={() => setTab(t.label)}
                sx={{
                  px: 2,
                  height: 48,
                  boxSizing: "border-box",
                  gap: 1,
                  color: selected ? "primary.main" : "text.primary",
                  borderBottom: selected ? 2 : 0,
                  borderColor: "primary.main",
                  typography: "body1",
                }}
              >
                {t.label}
                <CountBadge count={t.count} />
              </ButtonBase>
            );
          })}
        </Box>
        <Box
          sx={(t) => ({
            bgcolor: "background.paper",
            p: 3,
            boxShadow: 1,
            borderRadius: `${t.custom.radius.md}px`,
            borderTopRightRadius: 0,
          })}
        >
          <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 0.75 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {active.label === "Pre-listing tasks" ? <AccessTimeOutlined sx={{ color: "primary.main" }} /> : <FlagOutlined sx={{ color: "primary.main" }} />}
                <Typography variant="body1" sx={{ color: "text.secondary", fontWeight: "fontWeightMedium" }}>
                  {active.label}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 700, letterSpacing: "2.1px", textTransform: "uppercase", lineHeight: "16px" }}>
                {active.count}
              </Typography>
            </Box>
            <Box
              sx={
                twoColumns
                  ? { display: "grid", gridAutoFlow: "column", gridTemplateRows: "repeat(5, auto)", gridTemplateColumns: "1fr 1fr", columnGap: 5, rowGap: 1.5, minHeight: 208 }
                  : { display: "flex", flexDirection: "column", gap: 1.5, minHeight: 208 }
              }
            >
              {rows.map((row) => (
                <ButtonBase
                  key={row.label}
                  sx={(t) => ({
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    textAlign: "left",
                    px: 0.75,
                    py: 0.75,
                    borderRadius: `${t.custom.radius.sm}px`,
                    bgcolor: "transparent",
                    color: "text.primary",
                    typography: "body2",
                    transition: "background-color 120ms ease, color 120ms ease",
                    "&:hover": { bgcolor: "primary.dark", color: "common.white", borderRadius: `${t.custom.radius.md}px` },
                  })}
                >
                  {row.label}
                  <CountBadge count={row.count} />
                </ButtonBase>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
