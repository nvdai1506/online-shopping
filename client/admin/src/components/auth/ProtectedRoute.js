import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({isAuthentication, redirect, children}) {
  
  if (!isAuthentication) {
    return <Navigate to={redirect} replace/>;
  }
  return children ? children : <Outlet />;
}

export default ProtectedRoute;
