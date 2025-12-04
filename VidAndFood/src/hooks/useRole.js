import { useContext, useMemo } from "react";
import AuthContext from "../services/context/authContext/AuthContext";

const ROLE_USER = "User";
const ROLE_SOMMELIER = "Sommelier";
const ROLE_ADMIN = "Admin";

const useRole = () => {
  const { user, isAuthenticated } = useContext(AuthContext);

  const role = user?.role || null;

  const canUseUserFeatures = useMemo(
    () => isAuthenticated && (role === ROLE_USER || role === ROLE_SOMMELIER || role === ROLE_ADMIN),
    [isAuthenticated, role]
  );

  const canUseSommelierFeatures = useMemo(
    () => isAuthenticated && (role === ROLE_SOMMELIER || role === ROLE_ADMIN),
    [isAuthenticated, role]
  );

  const isAdmin = useMemo(
    () => isAuthenticated && role === ROLE_ADMIN,
    [isAuthenticated, role]
  );

  return {
    isAuthenticated,
    role,
    canUseUserFeatures,
    canUseSommelierFeatures,
    isAdmin,
  };
};

export default useRole;
