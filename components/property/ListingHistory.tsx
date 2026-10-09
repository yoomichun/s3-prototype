"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import type { Comp } from "@/data/property";
import { Card, DataRow, StatusChip, emptyCell, formatMoney, formatReduction } from "./parts";

const previewCount = 2;
const compAddress = (c: Comp) => `${c.street} ${c.cityStateZip}`;

export function ListingHistoryPanel({ comp }: { comp: Comp }) {
  const [expanded, setExpanded] = useState(false);
  const entries = expanded ? comp.history : comp.history.slice(0, previewCount);

  return (
    <Card>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <Typography variant="h5" sx={{ color: "text.primary" }}>
            Listing history
          </Typography>
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
        </Box>
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {compAddress(comp)}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {entries.map((e) => (
          <Box key={e.date} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <DataRow label="Date">{e.date}</DataRow>
            <DataRow label="Status">
              <StatusChip status={e.status} />
            </DataRow>
            <DataRow label="Current list price">{formatMoney(e.price)}</DataRow>
            <DataRow label="Reduction amount">{formatReduction(e.reductionAmount, e.reductionPercent)}</DataRow>
            <DataRow label="Pending/UC date">{e.pendingDate ?? emptyCell}</DataRow>
          </Box>
        ))}
        <Button onClick={() => setExpanded((v) => !v)} sx={{ alignSelf: "flex-start", px: 0 }}>
          {expanded ? "Show less" : "Show more"}
        </Button>
      </Box>
    </Card>
  );
}

const headerCellSx = {
  p: 2,
  typography: "body2",
  lineHeight: "24px",
  fontWeight: "fontWeightMedium",
  color: "text.primary",
  borderColor: "divider",
  borderTop: 1,
  borderTopColor: "divider",
} as const;

const cellSx = { p: 2, typography: "body2", lineHeight: "24px", color: "text.primary", borderColor: "divider" } as const;
const numeric = { textAlign: "right" } as const;

export function ListingHistoryTable({ comp }: { comp: Comp }) {
  return (
    <Card>
      <Typography variant="h5" sx={{ color: "text.secondary" }}>
        Listing history:{" "}
        <Box component="span" sx={{ color: "text.primary" }}>
          {compAddress(comp)}
        </Box>
      </Typography>
      <Table sx={{ tableLayout: "fixed" }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ ...headerCellSx, ...numeric, width: 108 }}>Date</TableCell>
            <TableCell sx={headerCellSx}>Status</TableCell>
            <TableCell sx={{ ...headerCellSx, ...numeric }}>Current list price</TableCell>
            <TableCell sx={{ ...headerCellSx, ...numeric }}>Reduction amount</TableCell>
            <TableCell sx={{ ...headerCellSx, ...numeric }}>Pending / UC date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {comp.history.map((e) => (
            <TableRow key={e.date}>
              <TableCell sx={{ ...cellSx, ...numeric }}>{e.date}</TableCell>
              <TableCell sx={cellSx}>
                <StatusChip status={e.status} />
              </TableCell>
              <TableCell sx={{ ...cellSx, ...numeric }}>{formatMoney(e.price)}</TableCell>
              <TableCell sx={{ ...cellSx, ...numeric }}>{formatReduction(e.reductionAmount, e.reductionPercent)}</TableCell>
              <TableCell sx={{ ...cellSx, ...numeric }}>{e.pendingDate ?? emptyCell}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
