import axios from "axios";
import { BASE_URL } from "../config";
import { useState } from "react";

const useAuthService = () => {
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

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.setItem("isLoggedIn", "false");

    setIsLoggedIn(false);
  };

  return { login, logout, isLoggedIn };
};

export default useAuthService;
