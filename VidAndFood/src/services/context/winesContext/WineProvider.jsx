import { useCallback, useContext, useEffect, useState } from "react";
import { fetchAllWines } from "../../wineService"; 
import ResponseContext from "../responseContext/ResponseContext";
import WineContext from "./WinesContext";
import GlobalLoadingContext from "../globalLoadingContext/GlobalLoadingContext";

const WineProvider = ({ children }) => {
  const [wines, setWines] = useState([]);
  const { showResponse } = useContext(ResponseContext);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  
  const loadWines = useCallback(async () => {
    try {
      const [data] = await Promise.all([
        fetchAllWines(),
        delay(500),
      ]); 

      setWines(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar vinos:", err);
      showResponse({
        title: "Error",
        message: "Error al cargar vinos:",
        variant: "error",
      });
    }
  }, [showResponse]);

  useEffect(() => {
    loadWines();
  }, [loadWines]);

  const getWineById = useCallback(
    (id) => wines.find((w) => String(w.id) === String(id)) || null,
    [wines]
  );

  return (
    <WineContext.Provider
      value={{
        wines,
        reloadWines: loadWines,
        getWineById,
      }}
    >
      {children}
    </WineContext.Provider>
  );
};

export default WineProvider;
