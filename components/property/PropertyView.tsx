"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import NoteHotspot from "@/components/notes/NoteHotspot";
import { comps, defaultCompId } from "@/data/property";
import CompsMap from "./CompsMapLoader";
import CompsTable from "./CompsTable";
import { Card } from "./parts";
import { ListingHistoryPanel, ListingHistoryTable } from "./ListingHistory";
import PriceHistory from "./PriceHistory";
import PropertyHeader from "./PropertyHeader";
import SuggestedPriceCard from "./SuggestedPriceCard";

export default function PropertyView() {
  const [selectedId, setSelectedId] = useState(defaultCompId);
  const selected = comps.find((c) => c.id === selectedId) ?? comps[0];

  return (
    <Box sx={{ gridColumn: 1, gridRow: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 5 }}>
      <PropertyHeader />
      <SuggestedPriceCard />
      <PriceHistory />

      <Box sx={{ position: "relative", display: "flex", flexDirection: "column", gap: 3 }}>
        <NoteHotspot id="comps" />
        <Typography variant="h5" sx={{ color: "text.primary" }}>
          Listed and sold comparables
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <CompsMap selectedId={selectedId} onSelect={setSelectedId} />
          <Box sx={{ display: "grid", gridTemplateColumns: "minmax(0, 600fr) minmax(0, 398fr)", gap: 3, alignItems: "stretch" }}>
            <Card>
              <CompsTable selectedId={selectedId} onSelect={setSelectedId} />
            </Card>
            <ListingHistoryPanel key={selected.id} comp={selected} />
          </Box>
          <ListingHistoryTable comp={selected} />
        </Box>
      </Box>
    </Box>
  );
}
