import { useCallback, useContext, useState } from "react";
import { fetchAllWines } from "../../wineService";
import ResponseContext from "../responseContext/ResponseContext";
import WineContext from "./WinesContext";

const WineProvider = ({ children }) => {
  const [wines, setWines] = useState([]);
  const [isLoadingWines, setIsLoadingWines] = useState(false);
  const [winesError, setWinesError] = useState(null);
  const [winesLoaded, setWinesLoaded] = useState(false);

  const { showResponse } = useContext(ResponseContext);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const loadWines = useCallback(async () => {
    if (winesLoaded) return;

    try {
      setIsLoadingWines(true);
      setWinesError(null);

      const [data] = await Promise.all([fetchAllWines(), delay(500)]);

      console.log("WINES: ", data);

      setWines(Array.isArray(data) ? data : []);
      setWinesLoaded(true);
    } catch (err) {
      console.error("Error al cargar vinos:", err);
      const msg = err.message || "No se pudieron cargar los vinos.";
      showResponse({
        title: "Error",
        message: msg,
        variant: "error",
      });
    } finally {
      setIsLoadingWines(false);
    }
  }, [showResponse, winesLoaded]);

  const reloadWines = useCallback(async () => {
    try {
      setIsLoadingWines(true);
      setWinesError(null);

      const [data] = await Promise.all([fetchAllWines(), delay(500)]);
      setWines(Array.isArray(data) ? data : []);
      setWinesLoaded(true);
    } catch (err) {
      console.error("Error al recargar vinos:", err);
      const msg = err.message || "No se pudieron cargar los vinos.";
      setWinesError(msg);

      showResponse({
        title: "Error",
        message: msg,
        variant: "error",
      });
    } finally {
      setIsLoadingWines(false);
    }
  }, [showResponse]);

  const getWineById = useCallback(
    (id) => wines.find((w) => String(w.id) === String(id)) || null,
    [wines],
  );

  return (
    <WineContext.Provider
      value={{
        wines,
        isLoadingWines,
        winesError,
        winesLoaded,
        loadWines,
        reloadWines,
        getWineById,
      }}
    >
      {children}
    </WineContext.Provider>
  );
};

export default WineProvider;
