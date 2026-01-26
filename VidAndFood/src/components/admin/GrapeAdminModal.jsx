import { useContext, useEffect, useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import ResponseContext from "../../services/context/responseContext/ResponseContext";
import { createGrape, updateGrape } from "../../services/adminUserServices";

const GrapeAdminModal = ({ show, mode, grape, onClose, onSuccess }) => {
  const isEdit = mode === "edit";

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState(null);

  const { showResponse } = useContext(ResponseContext);

  useEffect(() => {
    if (!show) return;
    setLocalError(null);
    setSaving(false);
    setName(isEdit ? (grape?.name ?? "") : "");
  }, [show, isEdit, grape]);

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setLocalError("El nombre es obligatorio.");
      return;
    }

    try {
      setSaving(true);
      setLocalError(null);

      if (isEdit) {
        await updateGrape(grape.id, name);
        showResponse(
          { 
            title: "Uva actualizada", 
            variant: "success",
            message: trimmed 
          }
        );
      } else {
        await createGrape(name);
        showResponse(
          { 
            title: "Uva creada", 
            variant: "success",
            message: trimmed 
          }
        );
      }

      onClose();
      await onSuccess?.();
    } catch (e) {
      showResponse(
          { 
            title: "Uva actualizada", 
            variant: "error",
            message: e.message 
          }
        );
      setLocalError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSetNameGrape = (e) => {
    setName(e.target.value);
  }

  return (
    <Modal show={show} onHide={saving ? undefined : onClose} centered>
      <Modal.Header closeButton={!saving}>
        <Modal.Title>{isEdit ? "Editar uva" : "Alta de uva"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {localError ? <Alert variant="danger">{localError}</Alert> : null}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              value={name}
              onChange={handleSetNameGrape}
              placeholder="Ej: Malbec"
              disabled={saving}
              autoFocus
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? "Guardando..." : "Guardar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GrapeAdminModal;
