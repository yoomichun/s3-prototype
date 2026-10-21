"use client";

import { useState } from "react";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import Collapse from "@mui/material/Collapse";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import BarChartOutlined from "@mui/icons-material/BarChartOutlined";
import KeyboardArrowDownOutlined from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlined from "@mui/icons-material/KeyboardArrowUpOutlined";
import PlaceOutlined from "@mui/icons-material/PlaceOutlined";
import WarningAmberOutlined from "@mui/icons-material/WarningAmberOutlined";
import { Card } from "@/components/property/parts";
import { money, termsFor, type Offer, type OfferProperty, type OfferTerms } from "@/data/offers";
import { OfferStatusChip } from "./chips";

const labelSx = { color: "text.secondary", typography: "body1" } as const;
const valueSx = { color: "text.primary", typography: "body1" } as const;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const id = `section-${title.toLowerCase().replace(/\W+/g, "-")}`;
  return (
    <Card sx={{ gap: 3 }}>
      <ButtonBase
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={id}
        sx={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", textAlign: "left" }}
      >
        <Typography variant="h5" component="h2" sx={{ color: "text.primary" }}>
          {title}
        </Typography>
        {open ? <KeyboardArrowUpOutlined /> : <KeyboardArrowDownOutlined />}
      </ButtonBase>
      <Collapse in={open}>
        <Box id={id}>{children}</Box>
      </Collapse>
    </Card>
  );
}

function TermRow({ label, labelWidth = 266, children }: { label: string; labelWidth?: number; children: React.ReactNode }) {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: `${labelWidth}px minmax(0, 1fr)`, columnGap: 4, alignItems: "start", minHeight: 24 }}>
      <Typography sx={{ ...labelSx, lineHeight: "24px" }}>{label}</Typography>
      <Box sx={{ ...valueSx, overflowWrap: "anywhere" }}>{children}</Box>
    </Box>
  );
}

/** A value the seller changed in a counter: an orange dot, and the buyer's original value on hover */
function Changed({ was, children }: { was?: string; children: React.ReactNode }) {
  if (!was) return <>{children}</>;
  return (
    <Tooltip title={`Buyer offered ${was}`} placement="right" arrow>
      <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
        <Box component="span" aria-label="Changed by the seller" sx={(t) => ({ width: 10, height: 10, borderRadius: "50%", bgcolor: t.palette.warning.main })} />
        {children}
      </Box>
    </Tooltip>
  );
}

function OfferTermsCard({ terms }: { terms: OfferTerms }) {
  const c = terms.changed;
  const row = (label: string, value: React.ReactNode) => (
    <TermRow key={label} label={label} labelWidth={160}>
      {value}
    </TermRow>
  );
  const left = [
    row("Buyer Signing Entity", terms.buyerSigningEntity),
    row("Buyer Name", terms.buyerName),
    row("Buyer Type", terms.buyerType),
    row("Buyer Agent Commission (%)", `${terms.buyerAgentCommissionPct}% (${money(terms.buyerAgentCommission)})`),
    row("Offer Price", <Changed was={c.offerPrice?.was}>{money(terms.offerPrice)}</Changed>),
    row("Offer Date", terms.offerDate),
    row("Seller Paid Closing Costs", money(terms.sellerPaidClosingCosts)),
    row("Offer Expiration Date", terms.offerExpirationDate),
    row("Dual Agency", terms.dualAgency),
    row("Home Warranty", <Changed was={c.homeWarranty?.was}>{money(terms.homeWarranty)}</Changed>),
    row("Other Costs", terms.otherCostsLabel),
    row("Cost", money(terms.otherCost)),
    row("Downpayment", `${terms.downPaymentPct}% (${money(terms.downPayment)})`),
    row("Pay Title Policy", terms.payTitlePolicy),
    row("Pay Survey", terms.paySurvey),
  ];
  const right = [
    row("Offer Price to List Price", <Changed was={c.offerToList?.was}>{terms.offerToListLabel}</Changed>),
    row("Net Offer Amount to List Price", `${terms.netOfferToListLabel} (${money(terms.netOfferAmount)})`),
    row("Buyer Pre-approved Up To", money(terms.buyerPreApprovedUpTo)),
    row("EMD Amount", money(terms.emdAmount)),
    row("Days to EMD (Calendar Days)", terms.daysToEmd),
    row("Additional EMD Amount (Optional)", <Changed was={c.additionalEmd?.was}>{money(terms.additionalEmdAmount)}</Changed>),
    row("Days to Additional EMD (Calendar Days - Optional)", terms.daysToAdditionalEmd),
    row("Title Company", terms.titleCompany),
    row(
      "Title Company Email",
      <Box component="a" href={`mailto:${terms.titleCompanyEmail}`} sx={{ color: "primary.main", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
        {terms.titleCompanyEmail}
      </Box>,
    ),
    row("Estimated Close of Escrow", terms.estimatedCloseOfEscrow),
    row("Option Fee", terms.optionFee),
  ];
  return (
    <Section title="Offer Terms">
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", columnGap: 5, alignItems: "start" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>{left}</Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>{right}</Box>
      </Box>
    </Section>
  );
}

function ContingenciesCard({ terms }: { terms: OfferTerms }) {
  const k = terms.contingencies;
  const row = (label: string, value: React.ReactNode) => (
    <TermRow key={label} label={label} labelWidth={160}>
      {value}
    </TermRow>
  );
  const left = [
    row("Financing", k.financing.applies),
    row("Inspection", k.inspection.applies),
    row("Appraisal", k.appraisal.applies),
    row("Financing Type", k.financingType),
    row(
      "Other Terms",
      <Box component="span" sx={{ color: "primary.main" }}>
        View Other Terms
      </Box>,
    ),
  ];
  const right = [
    row("Financing Expiration Date", k.financing.expires),
    row("Days of Inspection", k.inspection.days),
    row("Appraisal Expiration Date", k.appraisal.expires),
  ];
  return (
    <Section title="Contingencies">
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", columnGap: 5, alignItems: "start" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>{left}</Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>{right}</Box>
      </Box>
    </Section>
  );
}

function AgentFeedbackCard({ qualified, qualifiedWhy, recommendation, recommendationWhy }: { qualified: string; qualifiedWhy: string; recommendation: string; recommendationWhy: string }) {
  const q = (text: string) => <Typography sx={labelSx}>{text}</Typography>;
  return (
    <Section title="Agent Feedback">
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {q("Is this a qualified buyer that we want to go under contract with?")}
          <Typography sx={valueSx}>{qualified}</Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {q("Why?")}
          <Typography sx={valueSx}>{qualifiedWhy}</Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {q("Should the seller accept, decline or negotiate this offer?")}
          <Typography sx={valueSx}>{recommendation}</Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {q("Why?")}
          <Typography sx={valueSx}>{recommendationWhy}</Typography>
        </Box>
      </Box>
    </Section>
  );
}

function DocumentsCard({ documents }: { documents: OfferTerms["documents"] }) {
  const head = { height: 56, p: 2, typography: "body2", fontWeight: "fontWeightMedium", color: "text.primary", borderColor: "divider", borderTop: 1, borderTopColor: "divider" } as const;
  const cell = { height: 56, p: 2, typography: "body2", color: "text.primary", borderColor: "divider" } as const;
  return (
    <Section title="Offer Documents">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={head}>File Name</TableCell>
            <TableCell sx={head}>Document Type</TableCell>
            <TableCell sx={{ ...head, textAlign: "right" }}>Upload Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {documents.map((d) => (
            <TableRow key={d.name}>
              <TableCell sx={{ ...cell, color: "primary.main" }}>{d.name}</TableCell>
              <TableCell sx={cell}>{d.type}</TableCell>
              <TableCell sx={{ ...cell, textAlign: "right" }}>{d.uploaded}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Section>
  );
}

export default function OfferDetailView({ property, offer }: { property: OfferProperty; offer: Offer }) {
  const terms = termsFor(property, offer);
  const negotiated = offer.status === "Seller Negotiated";
  const address = `${property.street}, ${property.cityStateZip}`;
  const reduction = property.originalListPrice ? property.listPrice - property.originalListPrice : 0;

  const feedback = negotiated
    ? {
        qualified: "Yes",
        qualifiedWhy: `${terms.buyerName} is a retail buyer with a pre-approval letter and proof of funds on file. The pre-approval of ${money(terms.buyerPreApprovedUpTo)} covers the ${money(terms.loanAmount)} loan, and the buyer put ${money(terms.emdAmount)} down as earnest money.`,
        recommendation: "Accept Counter",
        recommendationWhy: `The seller's counter of ${money(terms.offerPrice)} is ${terms.offerToListLabel.replace("-", "")} under list and the buyer has already agreed to every other term. Splitting the home warranty keeps the deal moving, so I would accept the counter and move to contract.`,
      }
    : {
        qualified: "Yes",
        qualifiedWhy: `${terms.buyerName} is an institutional buyer with proof of funds and a pre-approval letter on file. The pre-approval of ${money(terms.buyerPreApprovedUpTo)} covers the ${money(terms.loanAmount)} loan, and the ${money(terms.emdAmount)} earnest money is due within 3 days of acceptance.`,
        recommendation: "Negotiate Terms",
        recommendationWhy: `The price is only ${money(property.listPrice - offer.price)} under list, so I would not push on price. I would ask the buyer to pay the ${money(terms.homeWarranty)} home warranty and shorten the inspection period from 10 days to 7. Both are small asks a motivated buyer is likely to accept.`,
      };

  const stats = [
    { label: "DOM", value: `${property.daysOnMarket} Days` },
    { label: "Offer Price", value: money(terms.offerPrice) },
  ];

  return (
    <Box sx={{ gridColumn: 1, gridRow: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
      <Breadcrumbs aria-label="Breadcrumb" sx={{ typography: "body2", color: "text.secondary", "& .MuiBreadcrumbs-separator": { mx: 1 } }}>
        <Typography component={NextLink} href="/" variant="body2" sx={{ color: "text.secondary", textDecoration: "none" }}>
          Home
        </Typography>
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          Review Offers
        </Typography>
      </Breadcrumbs>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="h5" component="h1" sx={{ color: "text.primary" }}>
          Review Offers
        </Typography>
        <Box sx={{ display: "flex", gap: 3 }}>
          <Button>BPO</Button>
          <Button>Property Details</Button>
        </Box>
      </Box>

      <Card sx={{ gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 2, borderBottom: 1, borderColor: "divider" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h5" sx={{ color: "text.primary" }}>
              {address}
            </Typography>
            <Button startIcon={<PlaceOutlined sx={{ fontSize: 16 }} />} sx={{ px: 1, py: 0.25 }}>
              Google Street View
            </Button>
          </Box>
          <Button size="large" startIcon={<BarChartOutlined />} sx={{ typography: "body1", fontWeight: "fontWeightMedium" }}>
            Market Insight
          </Button>
        </Box>

        {negotiated && (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box
              role="status"
              sx={(t) => ({ display: "inline-flex", alignItems: "center", gap: 1, px: 1.5, py: 1, borderRadius: "4px", bgcolor: t.palette.warning.light, ...t.typography.body2, color: "text.primary" })}
            >
              <WarningAmberOutlined sx={(t) => ({ fontSize: 16, color: t.palette.warning.main })} />
              The Seller has Negotiated these Terms.
            </Box>
          </Box>
        )}

        <Box sx={(t) => ({ bgcolor: t.palette.slate[50], borderRadius: `${t.custom.radius.md}px`, p: 3, display: "flex", flexDirection: "column", gap: 2 })}>
          <Typography variant="h5" sx={{ color: "text.primary" }}>
            Open Offer
          </Typography>
          <Box sx={{ display: "flex", alignItems: "stretch" }}>
            {stats.map((s) => (
              <Box key={s.label} sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 1, borderRight: 1, borderColor: "divider", px: 2 }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {s.label}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "fontWeightMedium", color: "text.primary" }}>
                  {s.value}
                </Typography>
              </Box>
            ))}
            <Box sx={{ flex: 1.3, display: "flex", flexDirection: "column", alignItems: "center", gap: 1, borderRight: 1, borderColor: "divider", px: 2 }}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Current List Price
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "fontWeightMedium", color: "text.primary" }}>
                {money(property.listPrice)}
                {reduction !== 0 && (
                  <Box component="span" sx={{ ml: 1, typography: "body2", color: "error.main" }}>
                    {money(reduction)}
                  </Box>
                )}
              </Typography>
            </Box>
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 1, px: 2 }}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Status
              </Typography>
              <OfferStatusChip status={offer.status} />
            </Box>
          </Box>
        </Box>
      </Card>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 3 }}>
        <Button component={NextLink} href="/offers" sx={{ px: 1, py: 0.25 }}>
          All Property Offers
        </Button>
        <Button disabled={!negotiated} sx={{ px: 1, py: 0.25 }}>
          Negotiation History
        </Button>
        <Button sx={{ px: 1, py: 0.25 }}>On-Market Activity</Button>
      </Box>

      <OfferTermsCard terms={terms} />
      <ContingenciesCard terms={terms} />
      <AgentFeedbackCard {...feedback} />
      <DocumentsCard documents={terms.documents} />
    </Box>
  );
}
