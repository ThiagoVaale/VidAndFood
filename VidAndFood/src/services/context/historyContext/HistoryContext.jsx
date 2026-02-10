import { createContext } from "react";

const HistoryContext = createContext({
  historyIds: [],
  isInHistory: () => false,
  toggleHistoryLocal: () => {},
});

export default HistoryContext;
