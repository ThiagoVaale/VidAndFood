import { createContext } from "react";

const GlobalLoadingContext = createContext({
    globalLoading: false,
    setGlobalLoading: () => {},
    globalMessage: "Cargando...",
    setGlobalMessage: () => {},
});

export default GlobalLoadingContext;