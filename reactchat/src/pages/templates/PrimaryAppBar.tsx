import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { useEffect, useState } from "react";
import ExploreCategories from "../../components/SecondaryDraw/ExploreCategories";
import AccountButton from "../../components/PrimaryAppBar/AccountButton";

const PrimaryAppBar = () => {
  const theme = useTheme();

  const [sideMenu, setSideMenu] = useState(false);
  const toggleDrawer = (state: boolean) => {
    setSideMenu(state);
  };

  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));
  useEffect(() => {
    if (isSmallScreen && sideMenu) {
      toggleDrawer(false);
    }
  }, [isSmallScreen, sideMenu]);

  const list = () => (
    <Box
      sx={{ minWidth: 200, paddingTop: `${theme.primaryAppBar.height}px` }}
      role="presentation"
      onClick={() => toggleDrawer(false)}
      onKeyDown={() => toggleDrawer(false)}
    >
      <ExploreCategories />
    </Box>
  );

  return (
    <AppBar
      sx={{
        backgroundColor: theme.palette.background.default,
        borderBottom: `1px solid ${theme.palette.divider}`,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        variant="dense"
        sx={{
          height: theme.primaryAppBar.height,
          minHeight: theme.primaryAppBar.height,
        }}
      >
        <Box sx={{ display: { sx: "block", sm: "none" } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => toggleDrawer(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        <Drawer open={sideMenu} onClose={() => toggleDrawer(false)}>
          <Box>{list()}</Box>
        </Drawer>

        <Link to="/" color="inherit" style={{ textDecoration: "none" }}>
          <Typography
            variant="h6"
            component="div"
            noWrap
            sx={{ fontWeight: "700", letterSpacing: "-0.5px" }}
          >
            ALIGNCHAT
          </Typography>
        </Link>

        <Box sx={{ flexGrow: 1 }}></Box>

        <AccountButton />
      </Toolbar>
    </AppBar>
  );
};

export default PrimaryAppBar;
