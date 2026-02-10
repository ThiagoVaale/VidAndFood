import { createContext } from "react";

const ResponseContext = createContext({
  isOpen: false,
  title: "",
  message: "",
  variant: "", 
  showResponse: () => {},
  closeResponse: () => {},
});

export default ResponseContext;
