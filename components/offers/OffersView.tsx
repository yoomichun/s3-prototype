"use client";

import { useState } from "react";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import ButtonBase from "@mui/material/ButtonBase";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import FavoriteOutlined from "@mui/icons-material/FavoriteOutlined";
import KeyboardArrowDownOutlined from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlined from "@mui/icons-material/KeyboardArrowUpOutlined";
import {
  isOpen,
  isStrongOffer,
  longDate,
  money,
  newOfferCount,
  offerProperties,
  shortDate,
  type Offer,
  type OfferProperty,
} from "@/data/offers";
import NoteHotspot from "@/components/notes/NoteHotspot";
import { OfferNumberChip, OfferStatusChip } from "./chips";

const headerCellSx = {
  height: 56,
  p: 2,
  typography: "body2",
  fontWeight: "fontWeightMedium",
  color: "text.primary",
  borderColor: "divider",
  borderTop: 1,
  borderTopColor: "divider",
} as const;

const cellSx = { height: 68, p: 2, typography: "body2", color: "text.primary", borderColor: "divider" } as const;

function OfferRows({ property, offers }: { property: OfferProperty; offers: Offer[] }) {
  return (
    <Table sx={{ tableLayout: "fixed" }}>
      <TableHead>
        <TableRow>
          <TableCell sx={{ ...headerCellSx, width: 140 }}>Offer #</TableCell>
          <TableCell sx={{ ...headerCellSx, textAlign: "right" }}>Offer Price</TableCell>
          <TableCell sx={{ ...headerCellSx, width: 170 }}>Status</TableCell>
          <TableCell sx={headerCellSx}>Offer Date</TableCell>
          <TableCell sx={headerCellSx}>Offer Exp.</TableCell>
          <TableCell sx={{ ...headerCellSx, width: 128, borderLeft: 1, borderLeftColor: "divider" }}>View Offer</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {offers.map((offer) => {
          const strong = isStrongOffer(offer.price, property.listPrice);
          const reduced = property.reducedOnDaysAgo !== undefined && offer.status === "Seller Negotiated";
          const price = <Box component="span">{money(offer.price)}</Box>;
          return (
            <TableRow key={offer.number}>
              <TableCell sx={cellSx}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <OfferNumberChip number={offer.number} />
                  {strong && isOpen(offer.status) && (
                    <FavoriteOutlined aria-label="Strong offer" sx={{ fontSize: 16, color: "primary.main" }} />
                  )}
                </Box>
              </TableCell>
              <TableCell sx={{ ...cellSx, textAlign: "right" }}>
                {reduced ? (
                  <Tooltip title={`List price reduced ${longDate(-(property.reducedOnDaysAgo ?? 0))}`} placement="top" arrow>
                    {price}
                  </Tooltip>
                ) : (
                  price
                )}
              </TableCell>
              <TableCell sx={cellSx}>
                <OfferStatusChip status={offer.status} />
              </TableCell>
              <TableCell sx={cellSx}>{shortDate(-offer.offeredDaysAgo)}</TableCell>
              <TableCell sx={cellSx}>{shortDate(-offer.offeredDaysAgo + offer.validForDays)}</TableCell>
              <TableCell sx={{ ...cellSx, borderLeft: 1, borderLeftColor: "divider" }}>
                <Button variant="outlined" size="small" component={NextLink} href={`/offers/${offer.number}`} sx={{ px: 1.5, py: 0.25 }}>
                  View Offer
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function PropertyAccordion({ property, offers, defaultOpen }: { property: OfferProperty; offers: Offer[]; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = `offers-${property.slug}`;
  return (
    <Box sx={{ position: "relative" }}>
      {property.slug === "330-meadowbrook-lane" && <NoteHotspot id="offers-list" top={12} left={-32} />}
    <Box sx={(t) => ({ bgcolor: "background.paper", borderRadius: "4px", boxShadow: 1, overflow: "hidden", p: 0, ...t.typography.body1 })}>
      <ButtonBase
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        sx={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", textAlign: "left", p: 1.5, minHeight: 48 }}
      >
        <Typography variant="body1" sx={{ color: "text.primary" }}>
          <Box component="span" sx={{ fontWeight: "fontWeightMedium" }}>
            {property.street}
          </Box>{" "}
          {property.cityStateZip}
        </Typography>
        {open ? <KeyboardArrowUpOutlined /> : <KeyboardArrowDownOutlined />}
      </ButtonBase>
      <Collapse in={open} unmountOnExit>
        <Box id={panelId} sx={{ px: 1.5, pb: 3, pt: 1 }}>
          {offers.length ? (
            <OfferRows property={property} offers={offers} />
          ) : (
            <Typography variant="body2" sx={{ color: "text.secondary", p: 2 }}>
              No open offers.
            </Typography>
          )}
        </Box>
      </Collapse>
    </Box>
    </Box>
  );
}

export default function OffersView() {
  const [openOnly, setOpenOnly] = useState(false);
  const properties = offerProperties
    .map((p) => ({ property: p, offers: openOnly ? p.offers.filter((o) => isOpen(o.status)) : p.offers }))
    .filter((x) => !openOnly || x.offers.length > 0);

  return (
    <Box sx={{ gridColumn: 1, gridRow: 1, minWidth: 0 }}>
      <Box sx={(t) => ({ bgcolor: "background.paper", borderRadius: `${t.custom.radius.md}px`, p: 3, display: "flex", flexDirection: "column", gap: 3 })}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Breadcrumbs aria-label="Breadcrumb" sx={{ typography: "body2", color: "text.secondary", "& .MuiBreadcrumbs-separator": { mx: 1 } }}>
            <Typography component={NextLink} href="/" variant="body2" sx={{ color: "text.secondary", textDecoration: "none" }}>
              Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: "text.primary" }}>
              Offers
            </Typography>
          </Breadcrumbs>
          <Typography variant="h5" component="h1" sx={{ color: "text.primary" }}>
            Offers
          </Typography>
          <Typography variant="body2" sx={{ color: "text.primary", p: 0.5 }}>
            You have {newOfferCount} offers to review
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <FavoriteOutlined sx={{ fontSize: 16, color: "primary.main" }} />
              <Typography variant="caption" sx={{ color: "text.primary" }}>
                Strong Offer
              </Typography>
            </Box>
            <FormControlLabel
              control={<Switch checked={openOnly} onChange={(e) => setOpenOnly(e.target.checked)} />}
              label="Open Offers"
              sx={{ m: 0, "& .MuiFormControlLabel-label": { typography: "body1", color: "text.primary" } }}
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {properties.map(({ property, offers }) => (
              <PropertyAccordion key={property.slug} property={property} offers={offers} defaultOpen={property.slug === "330-meadowbrook-lane"} />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
