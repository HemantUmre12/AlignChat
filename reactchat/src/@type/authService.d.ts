export interface AuthServiceProps {
    login: (username: string, password: string) => void;
    // logout: () => void
}