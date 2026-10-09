import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function CardHeader({ title, subtitle }: { title: string; subtitle: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      <Typography variant="h3" sx={{ color: "text.primary" }}>
        {title}
      </Typography>
      <Typography variant="body1" sx={{ color: "text.secondary" }}>
        {subtitle}
      </Typography>
    </Box>
  );
}
