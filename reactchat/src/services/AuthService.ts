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
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");
    try {
      const response = await axios.get(
        `${BASE_URL}/account/?user_id=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const userDetails = response.data;
      localStorage.setItem("username", userDetails.username);
    } catch (error) {
      return error;
    }
  };

  const getUserIdFromToken = (token: string) => {
    const tokenParts = token.split(".");
    const encodedPayload = tokenParts[1];
    const decodedPayload = atob(encodedPayload);
    const payloadData = JSON.parse(decodedPayload);
    const userId = payloadData.user_id;

    return userId;
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/token/`, {
        username,
        password,
      });

      const { access, refresh } = response.data;

      // Save the tokens and user details in local storage
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("userId", getUserIdFromToken(access));
      localStorage.setItem("isLoggedIn", "true");

      getUserDetails();

      // Set the isLoggedIn state to true after successful login
      setIsLoggedIn(true);
    } catch (error) {
      // Set isLoggedIn to false in case of an error
      localStorage.setItem("isLoggedIn", "false");
      setIsLoggedIn(false);

      return error;
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.setItem("isLoggedIn", "false");

    setIsLoggedIn(false);
    console.log("User is LoggedOut");
  };

  return { login, logout, isLoggedIn };
};

export default useAuthService;
