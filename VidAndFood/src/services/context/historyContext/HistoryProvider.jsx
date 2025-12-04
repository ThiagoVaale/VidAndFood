import { useState, useCallback } from "react";
import HistoryContext from "./HistoryContext";

const HistoryProvider = ({ children }) => {
  const [historyIds, setHistoryIds] = useState([]);

  const isInHistory = useCallback(
    (wineId) => historyIds.includes(String(wineId)),
    [historyIds]
  );

  const toggleHistoryLocal = useCallback((wineId) => {
    setHistoryIds((prev) => {
      const id = String(wineId);
      return prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
    });
  }, []);

  return (
    <HistoryContext.Provider
      value={{ historyIds, isInHistory, toggleHistoryLocal }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export default HistoryProvider;
