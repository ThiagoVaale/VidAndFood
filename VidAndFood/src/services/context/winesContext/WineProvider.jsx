import { useCallback, useContext, useEffect, useState } from "react";
import { fetchAllWines } from "../../wineService"; 
import ResponseContext from "../responseContext/ResponseContext";
import WineContext from "./WinesContext";

const WineProvider = ({ children }) => {
  const [wines, setWines] = useState([]);
  const [isLoadingWines, setIsLoadingWines] = useState(false);
  const [error, setError] = useState("")
  const { showResponse } = useContext(ResponseContext);

  const loadWines = useCallback(async () => {
    try {
      setIsLoadingWines(true);
      setError("")

      const data = await fetchAllWines(); 
      setWines(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar vinos:", err);
      setError("Error al cargar los vinos")
      showResponse({
        title: "Error",
        message: error,
        variant: "error",
      });
    } finally {
      setIsLoadingWines(false);
    }
  }, [showResponse, error]);

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
        isLoadingWines,
        reloadWines: loadWines,
        getWineById,
      }}
    >
      {children}
    </WineContext.Provider>
  );
};

export default WineProvider;
