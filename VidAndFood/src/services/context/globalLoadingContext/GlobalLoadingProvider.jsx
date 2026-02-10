import { useState } from "react";
import GlobalLoaderOverlay from "../../../components/ui/spinner/GlobalLoaderOverlay";
import GlobalLoadingContext from "./GlobalLoadingContext";

const GlobalLoadingProvider = ({ children }) => {
  const [globalLoading, setGlobalLoading] = useState(false);
  const [globalMessage, setGlobalMessage] = useState("Cargando...");

  return (
    <GlobalLoadingContext.Provider
      value={{ globalLoading, setGlobalLoading, globalMessage, setGlobalMessage }}
    >
      <GlobalLoaderOverlay loading={globalLoading} message={globalMessage} />
      {children}
    </GlobalLoadingContext.Provider>
  );
};

export default GlobalLoadingProvider;
