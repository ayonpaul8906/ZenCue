import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;