import { useCallback, useState } from "react";
import ResponseContext from "./ResponseContext";
import ResponseToastBridge from "./ResponseToastBridge";

const ResponseContextProvider = ({ children }) => {
  const [state, setState] = useState({
    isOpen: false,
    title: "",
    message: "",
    variant: "info",
  });

  const showResponse = useCallback(({ title, message, variant = "info" }) => {
    setState({ isOpen: true, title, message, variant });
  }, []);

  const closeResponse = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <ResponseContext.Provider value={{ ...state, showResponse, closeResponse }}>
      <ResponseToastBridge />
      {children}
    </ResponseContext.Provider>
  );
};

export default ResponseContextProvider;
