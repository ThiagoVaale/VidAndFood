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
    <ToastContainer
      position="bottom-end"
      className="p-3"
      style={{ zIndex: 9999 }}
    >
      <Toast
        show={isOpen}
        onClose={closeResponse}
        autohide={false}
        style={{
          backgroundColor: "#f5f5f5",   // fondo sobrio
          border: "1px solid #ddd",
          minWidth: "320px",
        }}
      >
        <Toast.Header
          closeButton={true}
          style={{
            backgroundColor: "transparent",
            borderBottom: "1px solid #e2e2e2"
          }}
        >
          {/* Indicador de color */}
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: variantColors[variant],
              marginRight: "10px"
            }}
          />

          <strong className="me-auto" style={{ fontSize: "0.95rem" }}>
            {title}
          </strong>
        </Toast.Header>

        <Toast.Body style={{ fontSize: "0.9rem", color: "#333" }}>
          {message}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default GlobalToast;