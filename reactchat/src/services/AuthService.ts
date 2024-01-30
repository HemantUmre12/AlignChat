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

  const login = async (username: string, password: string): Promise<number> => {
    // TODO: Check if user is already loggedin
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

      // Success
      return 200;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return error.response.status;
    }
  };

  const register = async (username: string, password: string): Promise<number> => {
    try {
      await axios.post(
        `${BASE_URL}/register/`,
        {
          username,
          password,
        },
        { withCredentials: true }
      );

      // Success
      return 200;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return error.response.status;
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

  return { login, register, logout, isLoggedIn, refreshAccessToken };
};

export default useAuthService;
