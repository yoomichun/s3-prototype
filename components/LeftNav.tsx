"use client";

import { useState } from "react";
import { useDashboardReset } from "./DashboardReset";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import type { SvgIconComponent } from "@mui/icons-material";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import NoteAltOutlined from "@mui/icons-material/NoteAltOutlined";
import CampaignOutlined from "@mui/icons-material/CampaignOutlined";
import ChecklistOutlined from "@mui/icons-material/ChecklistOutlined";
import FactCheckOutlined from "@mui/icons-material/FactCheckOutlined";
import RequestQuoteOutlined from "@mui/icons-material/RequestQuoteOutlined";
import AreaChartOutlined from "@mui/icons-material/AreaChartOutlined";
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
import DrawOutlined from "@mui/icons-material/DrawOutlined";
import HowToRegOutlined from "@mui/icons-material/HowToRegOutlined";
import KeyboardArrowDownOutlined from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlined from "@mui/icons-material/KeyboardArrowUpOutlined";
import FirstPageOutlined from "@mui/icons-material/FirstPageOutlined";

type SubItem = { label: string; href?: string };
type NavItem = { label: string; icon: SvgIconComponent; href?: string; children?: SubItem[] };

const mainItems: NavItem[] = [
  { label: "Dashboard", icon: HomeOutlined, href: "/" },
  {
    label: "Pre-Listing",
    icon: NoteAltOutlined,
    children: [
      { label: "Assign Agents" },
      { label: "List Price" },
      { label: "Make Ready Work" },
      { label: "Order Make Ready Work" },
      { label: "Review BPO" },
      { label: "Review Listing Agreement" },
      { label: "Target Disposition Value" },
      { label: "Upload Fully Executed LA" },
      { label: "Verify Make Ready Work" },
      { label: "Verify MLS Listing" },
    ],
  },
  {
    label: "On Market",
    icon: CampaignOutlined,
    children: [
      { label: "Offers" },
      { label: "Overdue Weekly Reports" },
      { label: "Price Reduction", href: "/price-reductions" },
      { label: "Review PSA" },
    ],
  },
  {
    label: "Other Tasks",
    icon: ChecklistOutlined,
    children: [{ label: "Other Tasks List" }, { label: "Create a Task" }],
  },
  { label: "BPO as a Service", icon: FactCheckOutlined },
];

const secondaryItems: NavItem[] = [
  { label: "Offers", icon: RequestQuoteOutlined },
  { label: "Market Activity", icon: AreaChartOutlined },
  { label: "Under Contract", icon: DescriptionOutlined },
  {
    label: "e-Signature",
    icon: DrawOutlined,
    children: [
      { label: "e-Signature Ad Hoc Tasks" },
      { label: "e-Signature Documents" },
      { label: "e-Signature Settings" },
    ],
  },
  { label: "Manage Agents", icon: HowToRegOutlined },
];

const itemSx = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  width: "100%",
  p: 1.5,
  borderRadius: 0.5,
  color: "common.white",
  textAlign: "left",
  justifyContent: "flex-start",
} as const;

function NavRow({ item, open, onToggle }: { item: NavItem; open?: boolean; onToggle?: () => void }) {
  const { resetDashboard } = useDashboardReset();
  const Icon = item.icon;
  const hasChildren = Boolean(item.children);
  const content = (
    <>
      <Icon />
      <Typography variant="body2" sx={{ flex: 1, fontWeight: "fontWeightMedium" }}>
        {item.label}
      </Typography>
      {hasChildren && (open ? <KeyboardArrowUpOutlined /> : <KeyboardArrowDownOutlined />)}
    </>
  );
  const openSx = open
    ? { bgcolor: "nav.groupOpen", borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
    : {};
  if (item.href && !hasChildren) {
    return (
      <ButtonBase component={NextLink} href={item.href} onClick={item.href === "/" ? resetDashboard : undefined} sx={itemSx}>
        {content}
      </ButtonBase>
    );
  }
  return (
    <ButtonBase onClick={onToggle} sx={{ ...itemSx, ...openSx }} aria-expanded={hasChildren ? !!open : undefined}>
      {content}
    </ButtonBase>
  );
}

function NavGroup({ item, open, onToggle }: { item: NavItem; open: boolean; onToggle: () => void }) {
  return (
    <Box>
      <NavRow item={item} open={open} onToggle={item.children ? onToggle : undefined} />
      {open &&
        item.children?.map((child, i) => {
          const last = i === item.children!.length - 1;
          const sx = {
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "flex-start",
            px: 1.5,
            py: 1,
            pl: 5.5, // 12px padding + 32px label indent
            bgcolor: "nav.subItem",
            color: "common.white",
            textAlign: "left",
            ...(last && { borderBottomLeftRadius: 4, borderBottomRightRadius: 4 }),
          } as const;
          const label = <Typography variant="body2">{child.label}</Typography>;
          return child.href ? (
            <ButtonBase key={child.label} component={NextLink} href={child.href} sx={sx}>
              {label}
            </ButtonBase>
          ) : (
            <ButtonBase key={child.label} sx={sx}>
              {label}
            </ButtonBase>
          );
        })}
    </Box>
  );
}

export default function LeftNav() {
  const pathname = usePathname();
  const onPriceReduction = pathname.startsWith("/price-reductions");
  // Only one group is open at a time: opening another group closes the previous one.
  const [openGroup, setOpenGroup] = useState<string | null>(onPriceReduction ? "On Market" : null);
  const toggleGroup = (label: string) => setOpenGroup((current) => (current === label ? null : label));
  return (
    <Box
      component="nav"
      sx={(t) => ({
        width: t.custom.layout.navWidth,
        flexShrink: 0,
        position: "sticky",
        top: 0,
        alignSelf: "flex-start",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "nav.bg",
        overflowY: "auto",
      })}
    >
      <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 1 }}>
        <Box component="img" src="/assets/logo.svg" alt="" sx={{ width: 24, height: 24 }} />
        <Typography variant="h4" sx={{ color: "common.white" }}>
          DM Portal
        </Typography>
      </Box>

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", px: 1 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Box>
            {mainItems.map((item) => (
              <NavGroup key={item.label} item={item} open={openGroup === item.label} onToggle={() => toggleGroup(item.label)} />
            ))}
          </Box>
          <Box>
            <Box sx={{ height: 16, display: "flex", alignItems: "center" }}>
              <Box sx={{ width: "100%", borderTop: 1, borderColor: "divider", opacity: 0.3 }} />
            </Box>
            {secondaryItems.map((item) => (
              <NavGroup key={item.label} item={item} open={openGroup === item.label} onToggle={() => toggleGroup(item.label)} />
            ))}
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mx: -1 }}>
          <Box sx={{ px: 1 }}>
            {["Privacy Policy", "Terms & Conditions"].map((label) => (
              <ButtonBase key={label} sx={itemSx}>
                <Typography variant="body2" sx={{ fontWeight: "fontWeightMedium" }}>
                  {label}
                </Typography>
              </ButtonBase>
            ))}
          </Box>
          <Box sx={{ borderTop: 1, borderColor: "divider", px: 1.5, py: 1, display: "flex", justifyContent: "flex-end" }}>
            <IconButton size="small" aria-label="Collapse navigation" sx={{ color: "common.white" }}>
              <FirstPageOutlined />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
