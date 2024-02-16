import LoginIcon from "@mui/icons-material/Login";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuthServiceContext from "../../context/useAuthServiceContext";
import { useState } from "react";

const LoginButton = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const { logout } = useAuthServiceContext();
  const handleLogOut = () => {
    logout();
    setIsLoggedIn(false);
  };

  const navigate = useNavigate();
  const handleLogIn = () => {
    navigate("/login");
  };

  return (
    <Box
      onClick={isLoggedIn ? handleLogOut : handleLogIn}
      sx={{ display: "flex" }}
    >
      <LoginIcon sx={{ marginRight: "6px", fontSize: "20px" }} />

      <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
        {isLoggedIn ? "Log out" : "Log in"}
      </Typography>
    </Box>
  );
};

export default LoginButton;
