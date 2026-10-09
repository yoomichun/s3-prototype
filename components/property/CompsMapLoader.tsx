"use client";

import dynamic from "next/dynamic";
import Box from "@mui/material/Box";

// Leaflet touches `window`, so the map only renders in the browser
const CompsMap = dynamic(() => import("./CompsMap"), {
  ssr: false,
  loading: () => <Box sx={(t) => ({ height: 454, borderRadius: `${t.custom.radius.md}px`, bgcolor: "slate.100" })} />,
});

export default CompsMap;
