import { useContext, useEffect } from "react";
import { parseJwt } from "../../utils/jwt.js";
import ResponseContext from "../../services/context/responseContext/ResponseContext.jsx";
import AuthContext from "../../services/context/authContext/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const SessionWatcher = () => {
  const { token, onLogout } = useContext(AuthContext);
  const { showResponse } = useContext(ResponseContext); 
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    let interval;

    try {
      const decoded = parseJwt(token);
      if (!decoded?.exp) return;

      const expMillis = decoded.exp * 1000;

      interval = setInterval(() => {
        const now = Date.now();

        if (now >= expMillis) {
          clearInterval(interval);

          onLogout();

          showResponse({
            variant: "error",
            title: "Sesión expirada",
            message: "Tu sesión expiró. Por favor iniciá sesión nuevamente.",
          });

          navigate("/home", { replace: true });

          const event = new CustomEvent("open-auth-modal");
          window.dispatchEvent(event);
        }
      }, 1000);
    } catch (error) {
      console.error("Error al verificar expiración de token:", error);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [token, onLogout, showResponse, navigate]);


  return null;
};

export default SessionWatcher;
