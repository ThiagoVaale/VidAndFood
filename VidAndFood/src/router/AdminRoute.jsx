import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../services/context/authContext/AuthContext.jsx";

const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/home" replace />;
  }

  if (user.role !== "Admin") {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default AdminRoute;
