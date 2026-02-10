import { useState, useEffect, useContext } from "react";
import HistoryContext from "./HistoryContext";
import AuthContext from "../authContext/AuthContext";

const HistoryProvider = ({ children }) => {
  const { user, token } = useContext(AuthContext);

  const [historyIds, setHistoryIds] = useState([]);

  useEffect(() => {
    setHistoryIds([]);
  }, [user?.id, token])

  const isInHistory = (wineId) => {
    const id = String(wineId);
    return historyIds.includes(id);
  };

   const toggleHistoryLocal = (wineId) => {
    const id = String(wineId);
    setHistoryIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  return (
    <HistoryContext.Provider
      value={{ historyIds, isInHistory, toggleHistoryLocal }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export default HistoryProvider;
