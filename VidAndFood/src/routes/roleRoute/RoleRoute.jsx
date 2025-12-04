import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../../services/context/authContext/AuthContext";

const RoleRoute = ({ allowedRoles, children }) => {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated || !user) {
    return <Navigate to="/home" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default RoleRoute;
