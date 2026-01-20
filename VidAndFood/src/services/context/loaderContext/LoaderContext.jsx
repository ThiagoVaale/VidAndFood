import { createContext } from "react";

const LoaderContext = createContext({
  loading: false,
  message: "",
  showLoader: () => {},
  hideLoader: () => {},
  setLoading: () => {},
});

export default LoaderContext;