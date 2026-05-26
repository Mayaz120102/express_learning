// GoruPublicRoute.jsx
// If user is already logged in and tries to visit /login or /register
// redirect them away — no point showing auth pages to logged-in users

import { Navigate } from "react-router-dom";
import userGoruAuth from "../hooks/userGoruAuth";

const GoruPublicRoute = ({ children }) => {
  const { isAuthenticated, goruUser, goruLoading } = userGoruAuth();

  if (goruLoading) return null; // wait for auth check to finish

  if (isAuthenticated) {
    // Send sellers to dashboard, buyers to home
    return (
      <Navigate to={goruUser?.role === "seller" ? "/dashboard" : "/"} replace />
    );
  }

  return children;
};

export default GoruPublicRoute;
