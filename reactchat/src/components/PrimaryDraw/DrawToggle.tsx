import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import React from "react";

type Props = {
  open: boolean;
  handleDrawOpen: () => void;
  handleDrawClose: () => void;
};

const DrawerToggle: React.FC<Props> = ({
  open,
  handleDrawOpen,
  handleDrawClose,
}) => {
  return (
    <Box
      sx={{
        height: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <IconButton onClick={open ? handleDrawClose : handleDrawOpen}>
        {open ? <ChevronRight /> : <ChevronLeft />}
      </IconButton>
    </Box>
  );
};

export default DrawerToggle;
