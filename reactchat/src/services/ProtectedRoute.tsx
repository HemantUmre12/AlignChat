import { Navigate } from "react-router-dom";
import useAuthServiceContext from "../context/useAuthServiceContext";
import React from "react";

const ProtectedRoute = (props: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuthServiceContext();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace={true}></Navigate>;
  }

  return <>{props.children}</>;
};

export default ProtectedRoute;
