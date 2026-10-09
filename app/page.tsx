import Box from "@mui/material/Box";
import Tasks from "@/components/dashboard/Tasks";
import RecommendedActions from "@/components/dashboard/RecommendedActions";
import EfficiencyMetrics from "@/components/dashboard/EfficiencyMetrics";
import PropertiesTable from "@/components/dashboard/PropertiesTable";

export default function DashboardPage() {
  return (
    <>
      <Box sx={{ gridColumn: 1, gridRow: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 5 }}>
        <Tasks />
        <RecommendedActions />
        <EfficiencyMetrics />
      </Box>
      <Box sx={{ gridColumn: "1 / -1", gridRow: 2, mt: 5 }}>
        <PropertiesTable />
      </Box>
    </>
  );
}
