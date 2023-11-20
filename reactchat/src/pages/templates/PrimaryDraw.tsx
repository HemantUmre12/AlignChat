import { Box, Typography, useMediaQuery, styled } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import DrawerToggle from "../../components/PrimaryDraw/DrawToggle";
import MuiDrawer from "@mui/material/Drawer";

const PrimaryDraw = () => {
  // State
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
          {[...Array(100)].map((_, i) => {
            return (
              <Typography key={i + 1} paragraph>
                {i}
              </Typography>
            );
          })}
        </Box>
      </Box>
    </Drawer>
  );
};

export default PrimaryDraw;
