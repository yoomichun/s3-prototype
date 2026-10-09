"use client";

import NextLink from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import KeyboardArrowDownOutlined from "@mui/icons-material/KeyboardArrowDownOutlined";
import ArrowDropDownOutlined from "@mui/icons-material/ArrowDropDownOutlined";
import FirstPageOutlined from "@mui/icons-material/FirstPageOutlined";
import LastPageOutlined from "@mui/icons-material/LastPageOutlined";
import ChevronLeftOutlined from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlined from "@mui/icons-material/ChevronRightOutlined";
import ErrorOutlineOutlined from "@mui/icons-material/ErrorOutlineOutlined";
import CheckCircleOutlineOutlined from "@mui/icons-material/CheckCircleOutlineOutlined";
import { properties, type Property } from "@/data/properties";

const headerCellSx = {
  height: 56,
  p: 2,
  typography: "body2",
  fontWeight: "fontWeightMedium",
  color: "text.primary",
  borderColor: "divider",
} as const;

const cellSx = { height: 78, p: 2, typography: "body2", color: "text.primary", borderColor: "divider" } as const;

function StatusChip({ property }: { property: Property }) {
  const { status, needsAttention } = property;
  const underContract = status === "Under Contract";
  return (
    <Box
      sx={(t) => ({
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        px: 1,
        py: 0.5,
        borderRadius: "24px",
        bgcolor: needsAttention ? "error.light" : underContract ? "success.light" : t.palette.slate[100],
        ...t.typography.caption,
        color: "text.primary",
      })}
    >
      {needsAttention ? (
        <ErrorOutlineOutlined sx={{ fontSize: 12, color: "error.main" }} />
      ) : underContract ? (
        <CheckCircleOutlineOutlined sx={{ fontSize: 12, color: "success.main" }} />
      ) : (
        <Box
          sx={(t) => ({
            width: 8,
            height: 8,
            borderRadius: "50%",
            bgcolor: status === "On Market" ? t.palette.success.main : t.palette.accent.teal.main,
          })}
        />
      )}
      {status}
    </Box>
  );
}

function FilterButton({ label }: { label: string }) {
  return (
    <Button
      variant="outlined"
      color="secondary"
      endIcon={<KeyboardArrowDownOutlined />}
      sx={(t) => ({
        px: 2,
        py: 1,
        borderRadius: `${t.custom.radius.sm}px`,
        borderColor: "secondary.main",
        color: "secondary.main",
        gap: 1,
        "& .MuiButton-endIcon": { m: 0 },
      })}
    >
      {label}
    </Button>
  );
}

function Pagination() {
  const iconSx = { p: 0.5, color: "text.primary" } as const;
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 3, px: 2, py: 1, typography: "body2" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        Properties per page:
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          10
          <ArrowDropDownOutlined />
        </Box>
      </Box>
      <Box>1 - 10 of 100</Box>
      <Box sx={{ display: "flex", gap: 1 }}>
        <IconButton aria-label="First page" disabled sx={iconSx}>
          <FirstPageOutlined />
        </IconButton>
        <IconButton aria-label="Previous page" disabled sx={iconSx}>
          <ChevronLeftOutlined />
        </IconButton>
        <IconButton aria-label="Next page" sx={iconSx}>
          <ChevronRightOutlined />
        </IconButton>
        <IconButton aria-label="Last page" sx={iconSx}>
          <LastPageOutlined />
        </IconButton>
      </Box>
    </Box>
  );
}

export default function PropertiesTable() {
  return (
    <Box
      sx={(t) => ({
        display: "flex",
        flexDirection: "column",
        gap: 3,
        p: 2,
        bgcolor: "background.paper",
        borderRadius: `${t.custom.radius.md}px`,
        boxShadow: 1,
      })}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
        <Typography variant="h3" sx={{ color: "text.primary", flex: 1 }}>
          Properties
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <FilterButton label="Status" />
          <FilterButton label="Market" />
          <FilterButton label="Search" />
          <Button sx={{ px: 1, py: 0.25, color: "primary.dark" }}>Clear filters</Button>
        </Box>
      </Box>
      <Box
        sx={(t) => ({
          display: "flex",
          flexDirection: "column",
          gap: 2,
          p: 3,
          bgcolor: "background.paper",
          borderRadius: `${t.custom.radius.md}px`,
          boxShadow: 1,
        })}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={headerCellSx}>Address</TableCell>
              <TableCell sx={{ ...headerCellSx, width: 250 }}>Market</TableCell>
              <TableCell sx={{ ...headerCellSx, width: 250 }}>Current state</TableCell>
              <TableCell sx={{ ...headerCellSx, width: 150 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {properties.map((p) => {
              const href = p.street === "8110 N 10th St" ? "/price-reductions/8110-n-10th-st" : undefined;
              return (
                <TableRow key={p.street}>
                  <TableCell sx={{ ...cellSx, py: 2 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <Typography
                        variant="body2"
                       
                        {...(href ? { component: NextLink, href } : {})}
                        sx={{ color: "primary.main", textDecoration: "none" }}
                      >
                        {p.street}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: "24px" }}>
                        {p.cityStateZip}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={cellSx}>{p.market}</TableCell>
                  <TableCell sx={cellSx}>{p.currentState}</TableCell>
                  <TableCell sx={cellSx}>
                    <StatusChip property={p} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Pagination />
      </Box>
    </Box>
  );
}
