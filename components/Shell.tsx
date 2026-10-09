"use client";

import Box from "@mui/material/Box";
import LeftNav from "./LeftNav";
import TopBar from "./TopBar";
import RightPanel from "./RightPanel";

// Pages render their main column as the first child (auto-placed in column 1, row 1).
// A page can add a full-width section under the panel row with `gridColumn: "1 / -1"`.
export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <LeftNav />
      <Box
        component="main"
        sx={(t) => ({ flex: 1, minWidth: 0, px: `${t.custom.layout.contentGutter}px`, pt: 2, pb: 3 })}
      >
        <TopBar />
        <Box
          sx={(t) => ({
            display: "grid",
            gridTemplateColumns: `minmax(0, 1fr) ${t.custom.layout.rightPanelWidth}px`,
            columnGap: `${t.custom.layout.contentGutter}px`,
            alignItems: "start",
            mt: 5,
          })}
        >
          {children}
          <RightPanel />
        </Box>
      </Box>
    </Box>
  );
}
