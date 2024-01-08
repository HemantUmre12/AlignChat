import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode | null;
};

const Main: React.FC<Props> = (props) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        flexGrow: 1,
        mt: `${theme.primaryAppBar.height}px`,
        height: `calc(100vh - ${theme.primaryAppBar.height}px)`,
        overflow: "auto",
      }}
    >
      {/* Explore Servers */}
      {props.children}
    </Box>
  );
};

export default Main;
