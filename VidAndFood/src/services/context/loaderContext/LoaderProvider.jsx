import { useCallback, useMemo, useState } from "react";
import LoaderContext from "./LoaderContext";

const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const showLoader = useCallback((msg = "") => {
    setMessage(msg);
    setLoading(true);
  }, []);

  const hideLoader = useCallback(() => {
    setLoading(false);
    setMessage("");
  }, []);

  const value = useMemo(
    () => ({ loading, message, showLoader, hideLoader, setLoading }),
    [loading, message, showLoader, hideLoader],
  );

  return (
    <LoaderContext.Provider value={value}>
        {children}
    </LoaderContext.Provider>
  );
};

export default LoaderProvider;
