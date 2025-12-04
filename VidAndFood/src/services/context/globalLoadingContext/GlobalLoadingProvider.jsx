import { useState } from "react";
import GlobalLoaderOverlay from "../../../components/ui/spinner/GlobalLoaderOverlay";
import GlobalLoadingContext from "./GlobalLoadingContext";

const GlobalLoadingProvider = ({ children }) => {
  const [globalLoading, setGlobalLoading] = useState(false);

  return (
    <GlobalLoadingContext.Provider value={{ globalLoading, setGlobalLoading }}>
      {globalLoading && (
        <GlobalLoaderOverlay loading={true} message={"Cargando..."} />
      )}
      {children}
    </GlobalLoadingContext.Provider>
  );
};

export default GlobalLoadingProvider;
