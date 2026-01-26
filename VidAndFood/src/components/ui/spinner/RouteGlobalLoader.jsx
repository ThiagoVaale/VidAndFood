import { useContext, useLayoutEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import GlobalLoadingContext from "../../../services/context/globalLoadingContext/GlobalLoadingContext";
import AuthContext from "../../../services/context/authContext/AuthContext";

const RouteGlobalLoader = ({ delayMs = 700 }) => {
  const location = useLocation();
  const { setGlobalLoading, setGlobalMessage } =
    useContext(GlobalLoadingContext);
  const { user } = useContext(AuthContext);

  const timerRef = useRef(null);
  const prevNavKeyRef = useRef(null);

  const role = user?.role || null;

  const computedMessage = useMemo(() => {
    const pathname = location.pathname;

    if (pathname.startsWith("/wines/")) return "Cargando detalle del vino...";
    if (pathname.startsWith("/sys-admin"))
      return "Cargando panel de administración...";

    if (pathname === "/home") return "Cargando inicio...";
    if (pathname === "/wines") return "Cargando vinos...";
    if (pathname === "/my-wines") return "Cargando tus vinos...";
    if (pathname === "/history") return "Cargando tu historial...";
    if (pathname === "/setting") return "Cargando configuración...";

    if (pathname === "/sommelier-ai") {
      const allowed = role === "Sommelier" || role === "Admin";
      return allowed ? "Cargando Sommelier AI..." : "Cargando inicio...";
    }

    return "Cargando página...";
  }, [location.pathname, role]);

  useLayoutEffect(() => {
    const isFirstMount = prevNavKeyRef.current === null;

    if (isFirstMount) {
      prevNavKeyRef.current = location.key;
    } else {
      if (prevNavKeyRef.current === location.key) return;
      prevNavKeyRef.current = location.key;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setGlobalMessage(computedMessage);
    setGlobalLoading(true);

    timerRef.current = setTimeout(() => {
      setGlobalLoading(false);
      timerRef.current = null;
    }, delayMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [
    location.key,
    computedMessage,
    delayMs,
    setGlobalLoading,
    setGlobalMessage,
  ]);

  return null;
};

export default RouteGlobalLoader;
