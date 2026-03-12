// this is used to authenticate end points like @ login required in django as a decorator.

import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const authenticateedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/login" />;

  return children;
};

export default authenticateedRoute;
