import { Modal, Button } from "react-bootstrap";

const ConfirmModal = ({
  show,
  title = "Confirmar",
  body = "¿Estás seguro?",
  confirmText = "Confirmar",
  confirmVariant = "danger",
  loading = false,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal show={show} onHide={loading ? undefined : onClose} centered>
      <Modal.Header closeButton={!loading}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>{body}</Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant={confirmVariant} onClick={onConfirm} disabled={loading}>
          {loading ? "Processing..." : confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
