"use client";

import NoteAnchor from "@/components/notes/NoteAnchor";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import CheckCircleOutlineOutlined from "@mui/icons-material/CheckCircleOutlineOutlined";
import { formatUsd, type PriceReduction } from "@/data/priceReductions";

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

const cellSx = {
  height: 80,
  p: 2,
  typography: "body2",
  lineHeight: "24px",
  color: "text.primary",
  borderColor: "divider",
} as const;

const numeric = { textAlign: "right" } as const;

function ApprovedChip() {
  return (
    <Box
      sx={(t) => ({
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        px: 1,
        py: 0.5,
        borderRadius: "24px",
        bgcolor: "success.light",
        ...t.typography.caption,
        color: "text.primary",
      })}
    >
      <CheckCircleOutlineOutlined sx={{ fontSize: 12, color: "success.main" }} />
      Approved
    </Box>
  );
}

function LinkText({ href, children, sx }: { href?: string; children: React.ReactNode; sx?: object }) {
  return (
    <Typography
      variant="body2"
      {...(href ? { component: NextLink, href } : {})}
      sx={{ color: "primary.main", textDecoration: "none", ...sx }}
    >
      {children}
    </Typography>
  );
}

export default function PriceReductionsTable({
  rows,
  approvedIds,
}: {
  rows: PriceReduction[];
  approvedIds: ReadonlySet<string>;
}) {
  return (
    <Table sx={{ tableLayout: "fixed" }}>
      <TableHead>
        <TableRow>
          <TableCell sx={headerCellSx}>Address</TableCell>
          <TableCell sx={{ ...headerCellSx, ...numeric, width: 94 }}>List price</TableCell>
          <TableCell sx={{ ...headerCellSx, ...numeric, width: 65 }}>DOM</TableCell>
          <TableCell sx={{ ...headerCellSx, ...numeric, width: 100 }}>Suggested</TableCell>
          <TableCell sx={headerCellSx}>Reason</TableCell>
          <TableCell sx={{ ...headerCellSx, width: 104 }}>Confidence</TableCell>
          <TableCell sx={{ ...headerCellSx, width: 110 }}>Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.id}>
            <TableCell sx={{ ...cellSx, py: "18px" }}>
              <LinkText>{r.street}</LinkText>
              <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: "24px" }}>
                {r.cityStateZip}
              </Typography>
            </TableCell>
            <TableCell sx={{ ...cellSx, ...numeric }}>{formatUsd(r.listPrice)}</TableCell>
            <TableCell sx={{ ...cellSx, ...numeric }}>{r.dom}</TableCell>
            <TableCell sx={{ ...cellSx, ...numeric }}>{formatUsd(r.suggestedPrice)}</TableCell>
            <TableCell sx={cellSx}>{r.reason}</TableCell>
            <TableCell sx={cellSx}>{r.confidence}</TableCell>
            <TableCell sx={cellSx}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0.5 }}>
                {(() => {
                  const action = approvedIds.has(r.id) ? (
                    <ApprovedChip />
                  ) : (
                    <LinkText href={r.href} sx={{ fontWeight: "fontWeightMedium" }}>
                      View details
                    </LinkText>
                  );
                  return r.id === "8110" ? (
                    <NoteAnchor id="price-reductions" side="right">
                      {action}
                    </NoteAnchor>
                  ) : (
                    action
                  );
                })()}
              </Box>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
