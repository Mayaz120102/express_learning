import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    alert("please login");
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
