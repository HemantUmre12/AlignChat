import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const SecondaryDraw: React.FC<Props> = (props) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        mt: `${theme.primaryAppBar.height}px`,
        height: `calc(100vh - ${theme.primaryAppBar.height}px)`,
        width: `${theme.secondaryDraw.width}px`,
        borderRight: `1px solid ${theme.palette.divider}`,
        display: { xs: "none", sm: "block" },
        overflow: "auto",
      }}
    >
      {/* <ExploreCategories /> */}
      {props.children}
    </Box>
  );
};

export default SecondaryDraw;
