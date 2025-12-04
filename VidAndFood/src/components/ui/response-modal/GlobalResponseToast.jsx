import { useContext } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import ResponseContext from "../../../services/context/responseContext/ResponseContext";

const variantColors = {
  success: "#198754",
  error: "#dc3545"
};

const GlobalToast = () => {
  const { isOpen, title, message, variant, closeResponse } =
    useContext(ResponseContext);

  return (
    <ToastContainer position="top-center" className="p-3" style={{ zIndex: 9999 }}>
      <Toast
        show={isOpen}
        onClose={closeResponse}
        bg={variant === "error" ? "danger" : variant === "success" ? "success" : null}
        autohide={false} 
      >
        <Toast.Header
          closeButton={false}
          style={{ backgroundColor: variantColors[variant], color: "white" }}
        >
          <strong className="me-auto">{title}</strong>
        </Toast.Header>
        <Toast.Body style={{ fontSize: "0.9rem" }}>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default GlobalToast;
