import Box from "@mui/material/Box";

export default function CountBadge({ count }: { count: number }) {
  return (
    <Box
      component="span"
      sx={(t) => ({
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        px: "5.5px",
        borderRadius: `${t.custom.radius.pill}px`,
        bgcolor: t.palette.slate[200],
        color: t.palette.slate[600],
        ...t.typography.caption,
        fontWeight: t.typography.fontWeightMedium,
      })}
    >
      {count}
    </Box>
  );
}
