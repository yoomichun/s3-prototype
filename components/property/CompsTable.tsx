"use client";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import ChevronRightOutlined from "@mui/icons-material/ChevronRightOutlined";
import { comps, subject, type Comp } from "@/data/property";
import { emptyCell, formatMoney } from "./parts";

const NUMBER_COL = 48;
const ADDRESS_COL = 224;
const THUMB = 64;
const BADGE = 18;
const ROW_HEIGHT = 80;
const HEADER_HEIGHT = 56;

const num = (n: number) => n.toLocaleString("en-US");
const perSqft = (price: number, sqft: number) => `$${Math.round(price / sqft).toLocaleString("en-US")}`;

type Column = { label: string; width: number; align?: "right" | "center"; cell: (c: Comp) => React.ReactNode; subject?: React.ReactNode };

const columns: Column[] = [
  {
    label: "Changes",
    width: 80,
    align: "center",
    cell: (c) => (c.hasChanges ? <ChevronRightOutlined sx={{ color: "primary.main", verticalAlign: "middle" }} /> : emptyCell),
    subject: emptyCell,
  },
  { label: "Distance", width: 72, align: "right", cell: (c) => `${c.distanceMi.toFixed(1).replace(/^0/, "")} m`, subject: emptyCell },
  { label: "Status", width: 112, cell: (c) => <StatusDot comp={c} />, subject: "" },
  { label: "Units", width: 72, align: "right", cell: (c) => c.units, subject: subject.units },
  { label: "Bed", width: 72, align: "right", cell: (c) => c.beds, subject: subject.beds },
  { label: "Baths", width: 72, align: "right", cell: (c) => c.baths, subject: subject.baths },
  { label: "Sq ft", width: 88, align: "right", cell: (c) => num(c.sqft), subject: num(subject.sqft) },
  { label: "Year", width: 80, align: "right", cell: (c) => c.year, subject: subject.yearBuilt },
  { label: "Lot size", width: 96, align: "right", cell: (c) => num(c.lotSqft), subject: num(subject.lotSqft) },
  { label: "Pool", width: 72, align: "right", cell: (c) => (c.pool ? "Yes" : "No"), subject: "No" },
  { label: "List date", width: 104, align: "right", cell: (c) => c.listDate, subject: emptyCell },
  { label: "List price", width: 104, align: "right", cell: (c) => formatMoney(c.listPrice), subject: emptyCell },
  { label: "Sold date", width: 104, align: "right", cell: (c) => c.soldDate ?? emptyCell, subject: emptyCell },
  { label: "Sold price", width: 104, align: "right", cell: (c) => (c.soldPrice ? formatMoney(c.soldPrice) : emptyCell), subject: emptyCell },
  { label: "ACT DOM", width: 88, align: "right", cell: (c) => c.dom, subject: emptyCell },
  { label: "TOT DOM", width: 88, align: "right", cell: (c) => c.dom, subject: emptyCell },
  { label: "SP $ / sq ft", width: 104, align: "right", cell: (c) => (c.soldPrice ? perSqft(c.soldPrice, c.sqft) : emptyCell), subject: emptyCell },
  { label: "LP $ / sq ft", width: 104, align: "right", cell: (c) => perSqft(c.listPrice, c.sqft), subject: emptyCell },
];

const tableWidth = NUMBER_COL + ADDRESS_COL + columns.reduce((sum, c) => sum + c.width, 0);

function StatusDot({ comp }: { comp: Comp }) {
  return (
    <Box
      sx={(t) => ({
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        px: 1,
        py: 0.5,
        borderRadius: `${t.custom.radius.pill}px`,
        bgcolor: "slate.100",
        ...t.typography.caption,
        color: "text.primary",
      })}
    >
      <Box component="span" sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: comp.status === "Sold" ? "accent.purple.main" : "accent.teal.main" }} />
      {comp.status}
    </Box>
  );
}

function Badge({ comp }: { comp?: Comp }) {
  return (
    <Box
      sx={(t) => ({
        width: BADGE,
        height: BADGE,
        p: "2px",
        boxSizing: "border-box",
        borderRadius: `${t.custom.radius.pill}px`,
        bgcolor: "background.paper",
        boxShadow: 1,
        display: "inline-flex",
      })}
    >
      <Box
        sx={(t) => ({
          flex: 1,
          borderRadius: `${t.custom.radius.pill}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: !comp ? "accent.orange.main" : comp.status === "Sold" ? "accent.purple.main" : "accent.teal.main",
          color: "common.white",
          fontSize: t.typography.caption.fontSize,
          lineHeight: 1,
          fontWeight: t.typography.fontWeightMedium,
        })}
      >
        {comp ? comp.id : <Box component="img" src="/assets/subject-star.svg" alt="Subject" sx={{ width: "100%", height: "100%" }} />}
      </Box>
    </Box>
  );
}

const headerSx = { height: HEADER_HEIGHT } as const;

const cellBase = {
  p: 2,
  typography: "body2",
  lineHeight: "24px",
  color: "text.primary",
  borderColor: "divider",
  whiteSpace: "nowrap",
} as const;

export default function CompsTable({ selectedId, onSelect }: { selectedId: number; onSelect: (id: number) => void }) {
  const stickyLeft = (left: number) => ({ position: "sticky", left, zIndex: 1, bgcolor: "inherit" }) as const;

  return (
    <Box sx={{ overflowX: "auto" }}>
      <Table sx={{ tableLayout: "fixed", width: tableWidth, bgcolor: "background.paper" }}>
        <TableHead>
          <TableRow sx={{ bgcolor: "background.paper" }}>
            <TableCell sx={{ ...cellBase, ...headerSx, width: NUMBER_COL, borderTop: 1, borderTopColor: "divider", ...stickyLeft(0) }} />
            <TableCell sx={{ ...cellBase, ...headerSx, width: ADDRESS_COL, fontWeight: "fontWeightMedium", borderTop: 1, borderTopColor: "divider", ...stickyLeft(NUMBER_COL) }}>
              Address
            </TableCell>
            {columns.map((col) => (
              <TableCell
                key={col.label}
                sx={{ ...cellBase, ...headerSx, width: col.width, textAlign: col.align, fontWeight: "fontWeightMedium", borderTop: 1, borderTopColor: "divider" }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow sx={{ bgcolor: "background.paper" }}>
            <Cells address={{ street: subject.street, cityStateZip: subject.cityStateZip }} badge={<Badge />} cells={columns.map((c) => c.subject)} />
          </TableRow>
          {comps.map((c) => (
            <TableRow
              key={c.id}
              hover
              selected={c.id === selectedId}
              onClick={() => onSelect(c.id)}
              aria-selected={c.id === selectedId}
              sx={(t) => ({
                cursor: "pointer",
                bgcolor: c.id === selectedId ? t.palette.slate[50] : "background.paper",
                "&.Mui-selected, &.Mui-selected:hover": { bgcolor: t.palette.slate[50] },
                "&.MuiTableRow-hover:hover": { bgcolor: t.palette.slate[50] },
              })}
            >
              <Cells address={{ street: c.street, cityStateZip: c.cityStateZip }} badge={<Badge comp={c} />} cells={columns.map((col) => col.cell(c))} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

function Cells({ address, badge, cells }: { address: { street: string; cityStateZip: string }; badge: React.ReactNode; cells: React.ReactNode[] }) {
  const sticky = (left: number) => ({ position: "sticky", left, zIndex: 1, bgcolor: "inherit" }) as const;
  return (
    <>
      <TableCell sx={{ ...cellBase, height: ROW_HEIGHT, textAlign: "center", px: 2, py: 1.5, ...sticky(0) }}>{badge}</TableCell>
      <TableCell sx={{ ...cellBase, height: ROW_HEIGHT, py: 2, ...sticky(NUMBER_COL) }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ width: THUMB, height: THUMB, borderRadius: "4px", overflow: "hidden", flexShrink: 0 }}>
            <Box component="img" src="/assets/comp-house.png" alt="" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </Box>
          <Box>
            <Typography variant="body2" sx={{ lineHeight: "24px", color: "text.primary" }}>
              {address.street}
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: "24px", color: "text.secondary" }}>
              {address.cityStateZip}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      {cells.map((content, i) => (
        <TableCell key={columns[i].label} sx={{ ...cellBase, height: ROW_HEIGHT, textAlign: columns[i].align }}>
          {content}
        </TableCell>
      ))}
    </>
  );
}
