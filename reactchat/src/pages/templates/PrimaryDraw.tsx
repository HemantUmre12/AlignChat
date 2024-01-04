import { Box, useMediaQuery, styled } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { ReactNode, useEffect, useState } from "react";
import DrawerToggle from "../../components/PrimaryDraw/DrawToggle";
import MuiDrawer from "@mui/material/Drawer";

type Props = {
  children: (open: boolean) => ReactNode;
};

const PrimaryDraw: React.FC<Props> = (props) => {
  // The state `open` is used for both toggling the size of the drawer
  // on click of a bottom and removing the drawer for smaller screens
  // in conjuction with `below600` state.
  const [open, setOpen] = useState(false);
  const handleDrawOpen = () => {
    setOpen(true);
  };
  const handleDrawClose = () => {
    setOpen(false);
  };

  const below600 = useMediaQuery("(max-width: 599px)");
  useEffect(() => {
    setOpen(!below600);
  }, [below600]);

  // Custom Drawer
  const theme = useTheme();
  const transition = {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    // overflowX: "hidden",
  };
  const openedMixIn = () => ({
    ...transition,
    width: theme.primaryDraw.width,
  });
  const closedMixIn = () => ({
    ...transition,
    width: theme.primaryDraw.closed,
  });

  const Drawer = styled(
    MuiDrawer,
    {}
  )(({ open }) => ({
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
      ...openedMixIn(),
      "& .MuiDrawer-paper": openedMixIn(),
    }),
    ...(!open && {
      ...closedMixIn(),
      "& .MuiDrawer-paper": closedMixIn(),
    }),
  }));

  return (
    <Drawer
      open={open}
      variant={below600 ? "temporary" : "permanent"}
      PaperProps={{
        sx: {
          mt: `${theme.primaryAppBar.height}px`,
          height: `calc(100vh - ${theme.primaryAppBar.height}px)`,
        },
      }}
    >
      <Box>
        <Box
          sx={{
            position: "absolute",
            top: "0",
            right: "0",
            p: "0", // ! Refactor
            width: open ? "auto" : "100%", // ! Refactor
          }}
        >
          <DrawerToggle
            open={open}
            handleDrawOpen={handleDrawOpen}
            handleDrawClose={handleDrawClose}
          />
        </Box>

        {props.children(open)}
      </Box>
    </Drawer>
  );
};

export default PrimaryDraw;
