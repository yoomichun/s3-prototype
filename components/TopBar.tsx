"use client";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import NotificationsOutlined from "@mui/icons-material/NotificationsOutlined";
import AppsOutlined from "@mui/icons-material/AppsOutlined";

export default function TopBar() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3, height: 32 }}>
      <IconButton aria-label="Notifications" sx={{ p: 0.5, color: "primary.dark" }}>
        <NotificationsOutlined />
      </IconButton>
      <IconButton aria-label="Apps" sx={{ p: 0.5, color: "primary.dark" }}>
        <AppsOutlined />
      </IconButton>
      <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main", color: "common.white", typography: "body2", fontWeight: "fontWeightMedium" }}>
        AH
      </Avatar>
    </Box>
  );
}
