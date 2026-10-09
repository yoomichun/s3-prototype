"use client";

import NextLink from "next/link";
import NoteHotspot from "@/components/notes/NoteHotspot";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ChevronRightOutlined from "@mui/icons-material/ChevronRightOutlined";
import { recommendedActions } from "@/data/dashboard";
import CardHeader from "./CardHeader";

const headerCellSx = {
  height: 56,
  p: 2,
  typography: "body2",
  fontWeight: "fontWeightMedium",
  color: "text.primary",
  borderColor: "divider",
} as const;

const cellSx = { height: 64, p: 2, typography: "body2", color: "text.primary", borderColor: "divider" } as const;

export default function RecommendedActions() {
  return (
    <Box sx={{ position: "relative", display: "flex", flexDirection: "column", gap: 3 }}>
      <NoteHotspot id="recommended-actions" />
      <CardHeader
        title="Recommended actions"
        subtitle="Found by reviewing all your properties. Approve to add to your task queue."
      />
      <Table sx={{ tableLayout: "fixed" }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ ...headerCellSx, width: 122 }} />
            <TableCell sx={headerCellSx}>Recommendation</TableCell>
            <TableCell sx={headerCellSx}>Impact</TableCell>
            <TableCell sx={{ ...headerCellSx, width: 60 }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {recommendedActions.map((row) => (
            <TableRow key={row.type}>
              <TableCell sx={cellSx}>
                <Box
                  sx={(t) => ({
                    width: 90,
                    py: 0.5,
                    textAlign: "center",
                    border: 1,
                    borderColor: t.palette.slate[400],
                    borderRadius: `${t.custom.radius.pill}px`,
                    bgcolor: "background.paper",
                    ...t.typography.caption,
                  })}
                >
                  {row.type}
                </Box>
              </TableCell>
              <TableCell sx={cellSx}>{row.recommendation}</TableCell>
              <TableCell sx={cellSx}>{row.impact}</TableCell>
              <TableCell sx={cellSx}>
                <IconButton
                  aria-label={`Open ${row.type.toLowerCase()} recommendation`}
                  {...(row.href ? { component: NextLink, href: row.href } : {})}
                  sx={{ color: "text.primary" }}
                >
                  <ChevronRightOutlined />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
