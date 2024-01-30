import axios, { AxiosInstance } from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";

const API_BASE_URL = BASE_URL;

const useAxiosWithInterceptor = (): AxiosInstance => {
  const jwtAxios = axios.create({ baseURL: API_BASE_URL });
  const navigate = useNavigate();

  jwtAxios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        const refreshToken = localStorage.getItem("refreshToken");
        // If access token is expired and we have refresh token we
        // will request for a new access token from `/token/refresh`
        // else redirect to login page for a new access token
        if (refreshToken) {
          try {
            const response = await axios.post(`${BASE_URL}/token/refresh/`, {
              refresh: refreshToken,
            });

            const newAccessToken = response.data.access;
            localStorage.setItem("accessToken", newAccessToken);

            // Rerequest the resource after getting a new access token
            const originalRequest = error.config;
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;

            return jwtAxios(originalRequest);
          } catch (refreshError) {
            navigate("/login");
            throw refreshError;
          }
        } else {
          navigate("/login");
        }
      }

      throw error;
    }
  );

  return jwtAxios;
};

export default useAxiosWithInterceptor;
