import { useContext, useEffect } from "react";
import ResponseContext from "./ResponseContext";
import { useToast } from "@chakra-ui/react";
import AppToast from "../../../components/app-toast/AppToast";

const mapVariantToStatus = (variant) => {
  switch (variant) {
    case "success":
      return "success";
    case "error":
      return "error";
    case "warning":
      return "warning";
    case "info":
    default:
      return "info";
  }
};

const ResponseToastBridge = () => {
  const toast = useToast();
  const { isOpen, title, message, variant, closeResponse } =
    useContext(ResponseContext);

  useEffect(() => {
    if (!isOpen) return;

    const status = mapVariantToStatus(variant);

    toast({
      position: "top",
      duration: 4000,
      isClosable: true,
      render: ({ onClose }) => (
        <AppToast
          status={status}
          title={title}
          description={message}
          onClose={() => {
            onClose();
            closeResponse();
          }}
        />
      ),
    });

    closeResponse();
  }, [isOpen, title, message, variant, toast, closeResponse]);

  return null;
};

export default ResponseToastBridge;
