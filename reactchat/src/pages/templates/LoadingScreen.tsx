import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

// TODO: Refactor
export default function LoadingScreen() {
  return (
    <Box sx={{ display: "flex" }}>
      <CircularProgress />
    </Box>
  );
}
