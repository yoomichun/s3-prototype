"use client";

import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import type { Metric } from "@/data/dashboard";

// Plot geometry from the Figma chart foundation (451 x 245)
const WIDTH = 451;
const HEIGHT = 245;
const PLOT_TOP = 10;
const PLOT_HEIGHT = 214;
const PLOT_LEFT = 75;
const PLOT_RIGHT = 451;
const GRID_LEFT = 65;
const AXIS_LABEL_WIDTH = 50;

export default function MetricChart({ metric }: { metric: Metric }) {
  const t = useTheme();
  const max = metric.yTicks[0].value;
  const min = metric.yTicks[metric.yTicks.length - 1].value;
  const y = (v: number) => PLOT_TOP + PLOT_HEIGHT * (1 - (v - min) / (max - min));
  const steps = metric.xLabels.length - 1;
  const x = (i: number) => PLOT_LEFT + ((PLOT_RIGHT - PLOT_LEFT) * i) / steps;

  const series = [
    { key: "Benchmark", color: t.palette.accent.purple.main, values: metric.xLabels.map(() => metric.benchmark), dashed: true },
    { key: "You", color: t.palette.info.main, values: metric.you, dashed: false },
    { key: "Others", color: t.palette.warning.main, values: metric.others, dashed: false },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "flex-end", width: "100%" }}>
      <Box sx={{ position: "relative", width: WIDTH, height: HEIGHT, maxWidth: "100%" }}>
        <svg width="100%" style={{ display: "block", height: "auto" }} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={`${metric.title} over the last 7 days`}>
          {metric.yTicks.map((tick) => (
            <line key={tick.label} x1={GRID_LEFT} x2={PLOT_RIGHT} y1={y(tick.value)} y2={y(tick.value)} stroke={t.palette.divider} />
          ))}
          {metric.xLabels.map((label, i) => (
            <line key={label} x1={x(i)} x2={x(i)} y1={PLOT_TOP} y2={PLOT_TOP + PLOT_HEIGHT} stroke={t.palette.divider} />
          ))}
          {metric.yTicks.map((tick) => (
            <text
              key={tick.label}
              x={AXIS_LABEL_WIDTH}
              y={y(tick.value)}
              textAnchor="end"
              dominantBaseline="central"
              fill={t.palette.text.secondary}
              style={{ ...t.typography.body2, fontSize: t.typography.body2.fontSize as number }}
            >
              {tick.label}
            </text>
          ))}
          {metric.xLabels.map((label, i) => (
            <text
              key={label}
              x={x(i)}
              y={HEIGHT - 10}
              textAnchor="middle"
              dominantBaseline="central"
              fill={t.palette.text.secondary}
              style={{ ...t.typography.body2, fontSize: t.typography.body2.fontSize as number }}
            >
              {label}
            </text>
          ))}
          {series.map((s) => (
            <g key={s.key}>
              <polyline
                fill="none"
                stroke={s.color}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeDasharray={s.dashed ? "2 2" : undefined}
                points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(" ")}
              />
              {s.values.map((v, i) => (
                <circle key={i} cx={x(i)} cy={y(v)} r={2} fill={s.color} />
              ))}
            </g>
          ))}
        </svg>
      </Box>
      <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
        {series.map((s) => (
          <Box key={s.key} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Box
              sx={{
                width: 24,
                height: 0,
                borderTop: `2px ${s.dashed ? "dotted" : "solid"} ${s.color}`,
              }}
            />
            <Box component="span" sx={{ ...t.typography.caption, color: "text.primary" }}>
              {s.key}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
