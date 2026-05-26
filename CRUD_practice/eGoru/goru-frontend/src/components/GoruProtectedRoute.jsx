// GoruProtectedRoute.jsx
// Wraps any route that requires login
// If not logged in → redirect to /login
// If logged in → show the page

import { Navigate } from "react-router-dom";
import userGoruAuth from "../hooks/userGoruAuth";

const GoruProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, goruUser, goruLoading } = userGoruAuth();

  // Still checking localStorage — show nothing yet
  if (goruLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-green-700 text-lg">Loading...</div>
      </div>
    );
  }

  // Not logged in at all
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role (e.g. buyer trying to access seller dashboard)
  if (allowedRoles && !allowedRoles.includes(goruUser.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default GoruProtectedRoute;
