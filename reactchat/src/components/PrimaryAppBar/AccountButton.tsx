import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DarkModeSwitch from "./DarkMode/DarkModeSwitch";
import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import React, { useState } from "react";
import {Link} from "react-router-dom";

const AccountButton = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderMenu = (
    <Menu
      open={isMenuOpen}
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      keepMounted
      onClose={handleMenuClose}
    >
      <MenuItem>
        <DarkModeSwitch />
      </MenuItem>
      {/* Testing */}
      <Link to="/login">
      <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
        LogIn
      </Typography>
      </Link>
      <Link to="/register">
      <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
        Register
      </Typography>
      </Link>
    </Menu>
  );

  return (
    <Box sx={{ display: { xs: "flex" } }}>
      <IconButton edge="end" color="inherit" onClick={handleMenuOpen}>
        <AccountCircleIcon />
      </IconButton>
      {renderMenu}
    </Box>
  );
};

export default AccountButton;
