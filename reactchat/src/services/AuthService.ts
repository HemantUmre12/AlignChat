import axios from "axios";
import { BASE_URL } from "../config";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const useAuthService = () => {
  const navigate = useNavigate();
  const getInitialLoggedInValue = () => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (loggedIn !== null) {
      return Boolean(loggedIn === "true");
    }

    return false;
  };

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    getInitialLoggedInValue
  );

  const getUserDetails = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await axios.get(
        `${BASE_URL}/account/?user_id=${userId}`,
        {
          withCredentials: true,
        }
      );

      const userDetails = response.data;
      localStorage.setItem("username", userDetails.username);
    } catch (error) {
      return error;
    }
  };

  // const getUsernameFromToken = (token: string) => {
  //   const tokenParts = token.split(".");
  //   const encodedPayload = tokenParts[1];
  //   const decodedPayload = atob(encodedPayload);
  //   const payloadData = JSON.parse(decodedPayload);
  //   const username = payloadData.user;

  //   return username;
  // };

  const login = async (username: string, password: string) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/token/`,
        {
          username,
          password,
        },
        { withCredentials: true }
      );

      const userId = res.data.user_id;

      localStorage.setItem("userId", userId);
      localStorage.setItem("isLoggedIn", "true");
      getUserDetails();

      setIsLoggedIn(true);
    } catch (error) {
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      localStorage.setItem("isLoggedIn", "false");

      setIsLoggedIn(false);

      return error;
    }
  };

  const refreshAccessToken = async () => {
    try {
      await axios.post(
        `${BASE_URL}/token/refresh/`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  };

  const logout = async () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.setItem("isLoggedIn", "false");

    setIsLoggedIn(false);

    navigate("/login");

    try {
      await axios.post(
        `${BASE_URL}/logout/`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (logoutError) {
      return Promise.reject(logoutError);
    }
  };

  return { login, logout, isLoggedIn, refreshAccessToken };
};

export default useAuthService;
