import { createContext } from "react";

const GlobalLoadingContext = createContext({
    globalLoading: false,
    setGlobalLoading: () => {},
})

export default GlobalLoadingContext;