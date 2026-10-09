"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AutoAwesomeOutlined from "@mui/icons-material/AutoAwesomeOutlined";
import CheckCircleOutlineOutlined from "@mui/icons-material/CheckCircleOutlineOutlined";
import { useCalculator } from "@/components/calculator/CalculatorProvider";
import { calculate, currentPrice, suggestedPrice } from "@/data/priceCalculator";
import { suggestion } from "@/data/property";
import { Card, DataRow, formatMoney } from "./parts";

export default function SuggestedPriceCard() {
  const { openCalculator, approvedPrice, approvePrice } = useCalculator();
  const approved = approvedPrice !== null;
  const price = approvedPrice ?? suggestedPrice;
  const amount = currentPrice - price;
  const percent = Math.round((amount / currentPrice) * 1000) / 10;
  const days = approved ? calculate(price, 0).daysToContract : suggestion.projectedDays;

  return (
    <Card>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <AutoAwesomeOutlined sx={{ color: "warning.main" }} />
        <Typography variant="h5" sx={{ color: "text.primary" }}>
          Suggested price reduction
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <DataRow label={approved ? "Approved price" : "New price"}>{formatMoney(price)}</DataRow>
        <DataRow label="Reduction amount">{`${formatMoney(amount)} / ${percent}%`}</DataRow>
        <DataRow label="Why">
          <Box component="ul" sx={{ m: 0, pl: 3 }}>
            {suggestion.why.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </Box>
        </DataRow>
        <DataRow label="Projected impact">{`Under contract in about ${days} days at the new price`}</DataRow>
      </Box>

      {approved ? (
        <Box
          sx={(t) => ({
            alignSelf: "flex-start",
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            px: 1,
            py: 0.5,
            borderRadius: `${t.custom.radius.pill}px`,
            bgcolor: "success.light",
            ...t.typography.caption,
            color: "text.primary",
          })}
        >
          <CheckCircleOutlineOutlined sx={{ fontSize: 12, color: "success.main" }} />
          Approved
        </Box>
      ) : (
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button variant="contained" onClick={() => approvePrice(suggestedPrice)}>
            Approve
          </Button>
          <Button variant="outlined" onClick={openCalculator}>
            Adjust price
          </Button>
          <Button>Dismiss</Button>
        </Box>
      )}
    </Card>
  );
}
