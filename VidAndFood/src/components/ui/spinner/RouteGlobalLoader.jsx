import { useContext, useLayoutEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GlobalLoadingContext from "../../../services/context/globalLoadingContext/GlobalLoadingContext";
import AuthContext from "../../../services/context/authContext/AuthContext";
import ResponseContext from "../../../services/context/responseContext/ResponseContext";
import WineContext from "../../../services/context/winesContext/WinesContext";

const RouteGlobalLoader = ({ delayMs = 700 }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { setGlobalLoading, setGlobalMessage } =
    useContext(GlobalLoadingContext);
  const { user } = useContext(AuthContext);
  const { showResponse } = useContext(ResponseContext);

  const timerRef = useRef(null);
  const redirectRef = useRef(null);
  const prevPathRef = useRef(null);
  const prevNavKeyRef = useRef(null);

  const role = user?.role || null;

  const computedMessage = useMemo(() => {
    const pathname = location.pathname;

    if (pathname.startsWith("/wines/")) return "Loading wine details...";
    if (pathname.startsWith("/sys-admin")) return "Loading admin panel...";

    if (pathname === "/home") return "Loading home...";
    if (pathname === "/wines") return "Loading wines...";
    if (pathname === "/my-wines") return "Loading your wines...";
    if (pathname === "/history") return "Loading your history...";
    if (pathname === "/setting") return "Loading configuration...";

    if (pathname === "/sommelier-ai") return "Loading Sommelier AI...";

    return "Loading page...";
  }, [location.pathname]);

   useLayoutEffect(() => {
    const isFirstMount = prevNavKeyRef.current === null;
    const prevPath = prevPathRef.current; 

    if (isFirstMount) {
      prevNavKeyRef.current = location.key;
      prevPathRef.current = location.pathname;
      return;
    }

    if (prevNavKeyRef.current === location.key) return;
    prevNavKeyRef.current = location.key;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (redirectRef.current) {
      clearTimeout(redirectRef.current);
      redirectRef.current = null;
    }

    const pathname = location.pathname;

    if (pathname === "/sommelier-ai") {
      const allowed = role === "Sommelier" || role === "Admin";

      if (!allowed) {
        showResponse({
          variant: "error",
          title: "Error trying to enter the chatbot",
          message: "You have to be a sommelier to get in here",
        });

        if (prevPath === "/home") {
          setGlobalLoading(false);
          navigate("/home", { replace: true });
          prevPathRef.current = "/home";
          return;
        }

        setGlobalMessage("Loading home...");
        setGlobalLoading(true);

        redirectRef.current = setTimeout(() => {
          setGlobalLoading(false);
          navigate("/home", { replace: true });
          redirectRef.current = null;
        }, delayMs);

        prevPathRef.current = pathname;
        return;
      }
    }

    setGlobalMessage(computedMessage);
    setGlobalLoading(true);

    timerRef.current = setTimeout(() => {
      setGlobalLoading(false);
      timerRef.current = null;
    }, delayMs);

    prevPathRef.current = pathname;

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (redirectRef.current) {
        clearTimeout(redirectRef.current);
        redirectRef.current = null;
      }
    };
  }, [
    location.key,
    location.pathname,
    role,
    computedMessage,
    delayMs,
    navigate,
    showResponse,
    setGlobalLoading,
    setGlobalMessage,
  ]);

  return null;
};

export default RouteGlobalLoader;
