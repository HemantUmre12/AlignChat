export interface AuthServiceProps {
  login: (username: string, password: string) => void;
  isLoggedIn: boolean;
  refreshAccessToken: () => Promise<void>;
  logout: () => void;
}
