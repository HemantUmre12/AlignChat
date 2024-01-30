export interface AuthServiceProps {
    login: (username: string, password: string) => void;
    isLoggedIn: boolean;
    logout: () => void
}