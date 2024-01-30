import axios from "axios";
import { BASE_URL } from "../config";

const useAuthService = () => {
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

      // Save the tokens in local storage
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("userId", getUserIdFromToken(access));

      getUserDetails();
    } catch (error) {
      return error;
    }
  };

  return { login };
};

export default useAuthService;
