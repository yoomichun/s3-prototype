"use client";

import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ArrowBackOutlined from "@mui/icons-material/ArrowBackOutlined";
import ArrowForwardOutlined from "@mui/icons-material/ArrowForwardOutlined";
import { metrics } from "@/data/dashboard";
import CardHeader from "./CardHeader";
import MetricCard from "./MetricCard";

const CARD_GAP = 24;

const arrowSx = {
  p: 0.5,
  bgcolor: "primary.light",
  color: "text.primary",
  "&:hover": { bgcolor: "primary.light" },
} as const;

export default function EfficiencyMetrics() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const updateEdge = () => {
    const el = trackRef.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft <= 1, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1 });
  };
  const page = (dir: 1 | -1) => {
    const el = trackRef.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.offsetWidth + CARD_GAP), behavior: "smooth" });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 3 }}>
        <CardHeader
          title="Efficiency metrics"
          subtitle={
            <>
              These metrics are based on the last{" "}
              <Box component="span" sx={{ color: "text.primary" }}>
                30 day
              </Box>{" "}
              rolling window
            </>
          }
        />
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <IconButton aria-label="Previous metric" disabled={edge.start} onClick={() => page(-1)} sx={arrowSx}>
            <ArrowBackOutlined sx={{ fontSize: 16 }} />
          </IconButton>
          <IconButton aria-label="Next metric" disabled={edge.end} onClick={() => page(1)} sx={arrowSx}>
            <ArrowForwardOutlined sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </Box>
      <Box
        ref={trackRef}
        onScroll={updateEdge}
        sx={{
          "--metric-card-width": `calc((100% - ${CARD_GAP}px) / 2)`,
          display: "flex",
          gap: `${CARD_GAP}px`,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
          p: "4px",
          m: "-4px",
          "& > *": { scrollSnapAlign: "start" },
        }}
      >
        {metrics.map((m) => (
          <MetricCard key={m.id} metric={m} />
        ))}
      </Box>
    </Box>
  );
}
