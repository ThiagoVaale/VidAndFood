import { useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../services/context/authContext/AuthContext";
import HistoryContext from "../services/context/historyContext/HistoryContext";
import { addWineToHistory } from "../services/historyUserService";

export default function useNavigateToWineDetail() {
  const navigate = useNavigate();

  const { user, isAuthenticated } = useContext(AuthContext);
  const { isInHistory, toggleHistoryLocal } = useContext(HistoryContext);

  const role = user?.role;

  const canUseHistory =
    isAuthenticated &&
    (role === "User" || role === "Sommelier" || role === "Admin");

  const navigateToWineDetail = useCallback(
    async (wineId) => {
      console.log("[NAV] click wineId:", wineId);
      console.log("[NAV] canUseHistory:", canUseHistory);
      console.log("[NAV] isInHistory:", isInHistory(wineId));

      navigate(`/wines/${wineId}`);

      if (!canUseHistory) {
        return;
      }
      if (isInHistory(wineId)) {
        return;
      }

      try {
        await addWineToHistory(wineId);
        toggleHistoryLocal(wineId);
      } catch (err) {
        console.error("El vino no se pudo agregar al historial: ", err.message);
      }
    },
    [navigate, canUseHistory, isInHistory, toggleHistoryLocal],
  );

  return navigateToWineDetail;
}
