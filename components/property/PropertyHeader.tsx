import NextLink from "next/link";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import BarChartOutlined from "@mui/icons-material/BarChartOutlined";
import ExpandMoreOutlined from "@mui/icons-material/ExpandMoreOutlined";
import PlaceOutlined from "@mui/icons-material/PlaceOutlined";
import { address, subject } from "@/data/property";
import { Card } from "./parts";

const facts = [
  { value: String(subject.beds), label: "Beds" },
  { value: String(subject.baths), label: "Baths" },
  { value: String(subject.units), label: "No. units" },
  { value: String(subject.yearBuilt), label: "Year built" },
  { value: `${subject.lotSqft.toLocaleString("en-US")} sqft`, label: "Lot size" },
  { value: `${subject.sqft.toLocaleString("en-US")} sqft`, label: "Sqft" },
];

export default function PropertyHeader() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Breadcrumbs aria-label="Breadcrumb" sx={{ typography: "body2", color: "text.secondary", "& .MuiBreadcrumbs-separator": { mx: 1 } }}>
        <Typography component={NextLink} href="/" variant="body2" sx={{ color: "text.secondary", textDecoration: "none" }}>
          Home
        </Typography>
        <Typography component={NextLink} href="/price-reductions" variant="body2" sx={{ color: "text.secondary", textDecoration: "none" }}>
          Market activity
        </Typography>
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {address}
        </Typography>
      </Breadcrumbs>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="h5" component="h1" sx={{ color: "text.primary" }}>
          Price reduction
        </Typography>
        <Box sx={{ display: "flex", gap: 3 }}>
          <Button>BPO</Button>
          <Button>Property details</Button>
          <Button endIcon={<ExpandMoreOutlined sx={{ fontSize: 16 }} />}>BPO history</Button>
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
            Market insight
          </Button>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          {facts.map((f) => (
            <Box key={f.label} sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Typography variant="body1" sx={{ fontWeight: "fontWeightMedium", color: "text.primary" }}>
                {f.value}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {f.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Card>
    </Box>
  );
}
