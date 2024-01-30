import axios, { AxiosInstance } from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";
import useAuthService from "../services/AuthService";

const API_BASE_URL = BASE_URL;

const useAxiosWithInterceptor = (): AxiosInstance => {
  const jwtAxios = axios.create({ baseURL: API_BASE_URL });
  const navigate = useNavigate();
  const { logout } = useAuthService();

  jwtAxios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        // If access token is expired and we have refresh token we
        // will request for a new access token from `/token/refresh`
        // else redirect to login page for a new access token
        axios.defaults.withCredentials = true;
        try {
          await axios.post(`${BASE_URL}/token/refresh/`);

          // Rerequest the resource after getting a new access token
          const originalRequest = error.config;
          return jwtAxios(originalRequest);
        } catch (refreshError) {
          // Incase refresh token is invalid(expired) logout the user
          logout();
          navigate("/login");

          return Promise.reject(refreshError);
        }
      }

      throw error;
    }
  );

  return jwtAxios;
};

export default useAxiosWithInterceptor;
