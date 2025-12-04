import { useCallback, useState } from "react";
import ResponseContext from "./ResponseContext";
import GlobalResponseModal from "../../../components/ui/response-modal/GlobalResponseToast";

const ResponseContextProvider = ({ children }) => {
  const [state, setState] = useState({
    isOpen: false,
    title: "",
    message: "",
    variant: "",
  });

  const showResponse = useCallback(({ title, message, variant = "info" }) => {
    setState({ isOpen: true, title, message, variant });

    setTimeout(() => {
      setState((prev) => ({ ...prev, isOpen: false }));
    }, 2000);
  }, []);

  const closeResponse = () => {
    setState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  return (
    <ResponseContext.Provider
      value={{
        ...state,
        showResponse,
        closeResponse,
      }}
    >
      <GlobalResponseModal />
      {children}
    </ResponseContext.Provider>
  );
};

export default ResponseContextProvider;
