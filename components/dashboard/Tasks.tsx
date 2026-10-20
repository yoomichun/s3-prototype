"use client";

import { useState } from "react";
import NoteHotspot from "@/components/notes/NoteHotspot";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import FlagOutlined from "@mui/icons-material/FlagOutlined";
import AccessTimeOutlined from "@mui/icons-material/AccessTimeOutlined";
import AltRouteOutlined from "@mui/icons-material/AltRouteOutlined";
import ViewListOutlined from "@mui/icons-material/ViewListOutlined";
import type { SvgIconComponent } from "@mui/icons-material";
import { activeTaskTab, bpoTasks, onMarketTasks, otherTasks, preListingTasks, taskTabs, type TaskRow } from "@/data/dashboard";
import CardHeader from "./CardHeader";
import CountBadge from "./CountBadge";

const tabIcons: Record<string, SvgIconComponent> = {
  "Pre-listing tasks": AccessTimeOutlined,
  "On market tasks": FlagOutlined,
  "Other tasks": AltRouteOutlined,
  "BPO as a service": ViewListOutlined,
};

const tabRows: Record<string, TaskRow[]> = {
  "Pre-listing tasks": preListingTasks,
  "On market tasks": onMarketTasks,
  "Other tasks": otherTasks,
  "BPO as a service": bpoTasks,
};

export default function Tasks() {
  const [tab, setTab] = useState(activeTaskTab);
  const active = taskTabs.find((t) => t.label === tab) ?? taskTabs[1];
  const rows = tabRows[active.label] ?? [];
  const TabIcon = tabIcons[active.label] ?? FlagOutlined;
  const twoColumns = active.label === "Pre-listing tasks";
  return (
    <Box sx={{ position: "relative", display: "flex", flexDirection: "column", gap: 3 }}>
      <CardHeader title="MLS disposition tasks" subtitle="Complete to-dos by following the links under each task category." />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box role="tablist" sx={(t) => ({ position: "relative", display: "flex", alignSelf: "flex-start", boxShadow: `inset 0 -1px 0 ${t.palette.divider}` })}>
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
          <NoteHotspot id="task-queue" top="calc(50% - 12px)" left="calc(100% + 8px)" />
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
                <TabIcon sx={{ color: "primary.main" }} />
                <Typography variant="body1" sx={{ color: "text.secondary", fontWeight: "fontWeightMedium" }}>
                  {active.label}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 700, letterSpacing: "2.1px", textTransform: "uppercase", lineHeight: "16px" }}>
                {active.cardCount ?? active.count}
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
