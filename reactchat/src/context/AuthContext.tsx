import React, { createContext } from "react";
import { AuthServiceProps } from "../@type/authService";
import useAuthService from "../services/AuthService";

export const AuthServiceContext = createContext<AuthServiceProps | null>(null);

interface Props {
  children: React.ReactNode;
}

const AuthServiceProvider: React.FC<Props> = (props) => {
  const authServices = useAuthService();
  return (
    <AuthServiceContext.Provider value={authServices}>
      {props.children}
    </AuthServiceContext.Provider>
  );
};

export default AuthServiceProvider;
