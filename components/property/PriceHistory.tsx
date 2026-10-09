"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import ArrowDownwardOutlined from "@mui/icons-material/ArrowDownwardOutlined";
import { advisory, historyMetrics, priceHistory } from "@/data/property";
import { formatMoney } from "./parts";

// Plot geometry from the Figma chart foundation (686 x 240, grid 621 x 200 at x 65, y 10)
const WIDTH = 686;
const HEIGHT = 240;
const GRID_LEFT = 65;
const GRID_WIDTH = 621;
const PLOT_TOP = 10;
const PLOT_HEIGHT = 200;
const PLOT_INSET = 10;
const AXIS_LABEL_RIGHT = 60;
const X_LABEL_Y = 230;

const { days, reductionDay, originalPrice, currentPrice, yMin, yMax, yStep } = priceHistory;
const yTicks = Array.from({ length: (yMax - yMin) / yStep + 1 }, (_, i) => yMax - i * yStep);
const xLabels = [1, 5, 10, 15, 20, 25, 30, reductionDay, 35, 40, 45];

const x = (day: number) => GRID_LEFT + PLOT_INSET + ((day - 1) / (days - 1)) * (GRID_WIDTH - 2 * PLOT_INSET);
const y = (price: number) => PLOT_TOP + PLOT_HEIGHT * (1 - (price - yMin) / (yMax - yMin));
const dayRange = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
const priceOn = (day: number) => (day < reductionDay ? originalPrice : currentPrice);

function Metric({ value, label, alert }: { value: string; label: string; alert?: boolean }) {
  return (
    <Box>
      <Typography variant="h5" sx={{ color: alert ? "error.main" : "text.secondary" }}>
        {value}
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", display: "inline-block", borderBottom: 1, borderBottomStyle: "dashed", borderColor: "text.secondary" }}>
        {label}
      </Typography>
    </Box>
  );
}

function Chart() {
  const t = useTheme();
  const labelStyle = { ...t.typography.body2, fontSize: t.typography.body2.fontSize as number };
  const dark = dayRange(1, reductionDay - 1);
  const red = dayRange(reductionDay - 1, days);

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ width: "100%", maxWidth: WIDTH, height: "auto" }} role="img" aria-label="Price reduction history over 45 days">
      {yTicks.map((tick) => (
        <g key={tick}>
          <line x1={GRID_LEFT} x2={GRID_LEFT + GRID_WIDTH} y1={y(tick)} y2={y(tick)} stroke={t.palette.divider} />
          <text x={AXIS_LABEL_RIGHT} y={y(tick)} textAnchor="end" dominantBaseline="central" fill={t.palette.text.secondary} style={labelStyle}>
            {formatMoney(tick)}
          </text>
        </g>
      ))}
      {xLabels.map((day) => (
        <g key={day}>
          <line x1={x(day)} x2={x(day)} y1={PLOT_TOP} y2={PLOT_TOP + PLOT_HEIGHT} stroke={t.palette.divider} />
          <text
            x={x(day)}
            y={X_LABEL_Y}
            textAnchor="middle"
            dominantBaseline="central"
            fill={day >= reductionDay ? t.palette.error.main : t.palette.text.secondary}
            style={labelStyle}
          >
            {day}
          </text>
        </g>
      ))}
      <polyline fill="none" stroke={t.palette.text.primary} strokeWidth={2} strokeLinejoin="round" points={dark.map((d) => `${x(d)},${y(priceOn(d))}`).join(" ")} />
      <polyline fill="none" stroke={t.palette.error.main} strokeWidth={2} strokeLinejoin="round" points={red.map((d) => `${x(d)},${y(priceOn(d))}`).join(" ")} />
      {dayRange(1, days).map((d) => (
        <circle key={d} cx={x(d)} cy={y(priceOn(d))} r={2} fill={d >= reductionDay ? t.palette.error.main : t.palette.text.primary} />
      ))}
    </svg>
  );
}

export default function PriceHistory() {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 286px", columnGap: 3, alignItems: "start" }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25, minWidth: 0 }}>
        <Typography variant="h5" sx={{ color: "text.primary" }}>
          Price reduction history
        </Typography>
        <Box sx={{ display: "flex", gap: 3 }}>
          {historyMetrics.map((m) => (
            <Metric key={m.label} {...m} />
          ))}
        </Box>
        <Chart />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, justifyContent: "center" }}>
        <Typography variant="h5" sx={{ color: "text.primary" }}>
          Advisory
        </Typography>
        {advisory.map((row) => (
          <Box key={row.label} sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body1" sx={{ width: 180, flexShrink: 0, color: "text.secondary" }}>
              {row.label}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, typography: "body1", color: "text.primary", whiteSpace: "nowrap" }}>
              {row.value}
              {row.falling && <ArrowDownwardOutlined aria-label="Falling" sx={{ fontSize: 16, color: "error.main" }} />}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
