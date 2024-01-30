export interface AuthServiceProps {
  login: (username: string, password: string) => Promise<number>;
  register: (username: string, password: string) => Promise<number>;
  isLoggedIn: boolean;
  refreshAccessToken: () => Promise<void>;
  logout: () => void;
}
