import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import AuthContext from "../../context/auth-context";

function ProtectedRoute({redirect='/login', children}) {
  const authCtx = useContext(AuthContext);
  
  if (!authCtx.isLoggedIn) {
    return <Navigate to={redirect} replace/>;
  }
  return children ? children : <Outlet />;
}

export default ProtectedRoute;
