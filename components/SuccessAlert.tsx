"use client";

import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
import CloseOutlined from "@mui/icons-material/CloseOutlined";

// Success alert from the Figma Alert component (node 89:18859), desktop, no title, no action.
// Snackbar animates its child and needs a ref to the DOM node, so the ref is passed through.
export default function SuccessAlert({ children, onClose, ref }: { children: React.ReactNode; onClose: () => void; ref?: React.Ref<HTMLDivElement> }) {
  return (
    <Alert
      ref={ref}
      severity="success"
      variant="standard"
      icon={<CheckCircleOutlined sx={{ fontSize: 16 }} />}
      action={
        <IconButton aria-label="Dismiss" size="small" onClick={onClose} sx={{ p: 0.5, color: "text.primary" }}>
          <CloseOutlined sx={{ fontSize: 16 }} />
        </IconButton>
      }
      sx={(t) => ({
        width: 600,
        maxWidth: "100%",
        boxSizing: "border-box",
        alignItems: "center",
        gap: 2,
        px: 1.5,
        py: 1,
        borderRadius: "4px",
        boxShadow: "none",
        bgcolor: "success.light",
        color: "text.primary",
        ...t.typography.body2,
        "& .MuiAlert-icon": { p: 0, mr: 0, color: "success.main", alignItems: "center" },
        "& .MuiAlert-message": { p: 0, py: 0.75, flex: 1 },
        "& .MuiAlert-action": { p: 0, m: 0 },
      })}
    >
      {children}
    </Alert>
  );
}
