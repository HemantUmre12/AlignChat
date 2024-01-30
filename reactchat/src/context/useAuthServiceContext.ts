import { useContext } from "react";
import { AuthServiceProps } from "../@type/authService";
import { AuthServiceContext } from "./AuthContext";

const useAuthServiceContext = (): AuthServiceProps => {
  const context = useContext(AuthServiceContext);

  if (context === null) {
    throw new Error("Error - You have to use the AuthServiceProvider");
  }
  return context;
};

export default useAuthServiceContext;
