import { useContext, useEffect, useMemo, useState } from "react";
import { Modal, Button, Form, Alert, Badge } from "react-bootstrap";

import { registerRequest } from "../../services/authServices";
import {
  downgradeAdminToUser,
  upgradeAdminToSommelier,
} from "../../services/roleServices";
import ResponseContext from "../../services/context/responseContext/ResponseContext";

const UserAdminModal = ({ show, mode, user, onClose, onSuccess }) => {
  const isCreate = mode === "create";
  const isRole = mode === "role";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState(null);

  const { showResponse } = useContext(ResponseContext);

  useEffect(() => {
    if (!show) return;
    setLocalError(null);
    setSaving(false);

    if (isCreate) {
      setEmail("");
      setPassword("");
      setFullName("");
    }
  }, [show, isCreate]);

  const currentRole = user?.role ?? "User";
  const isSommelier = String(currentRole).toLowerCase().includes("sommelier");
  const isAdmin = String(currentRole).toLowerCase().includes("admin");

  const roleActionLabel = useMemo(() => {
    if (!user) return "";
    return isSommelier ? "Downgrade a User" : "Upgrade a Sommelier";
  }, [user, isSommelier]);

  const handleCreate = async () => {
    if (!email.trim()) return setLocalError("Email es obligatorio.");
    if (!password || password.length < 6)
      return setLocalError("Password mínimo 6 caracteres.");
    if (!fullName.trim()) return setLocalError("Full name es obligatorio.");

    try {
      setSaving(true);
      setLocalError(null);

      await registerRequest({
        email: email.trim(),
        password,
        fullName: fullName.trim(),
      });
      showResponse({
        title: "Usuario creado",
        variant: "success",
        message: email.trim(),
      });
      onClose();
      await onSuccess?.();
    } catch (e) {
      showResponse({
        title: "Error",
        variant: "error",
        message: e.message,
      });
      setLocalError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRoleChange = async () => {
    if (!user?.id) return;

    try {
      setSaving(true);
      setLocalError(null);

      if (isAdmin) {
        showResponse({
          title: "Acción no permitida",
          variant: "error",
          message: "No se puede modificar el rol de un usuario Admin.",
        });
        return;
      }

      if (isSommelier) {
        await downgradeAdminToUser(user.id, 1);
        showResponse({
          title: "Rol actualizado",
          variant: "success",
          message: "Ahora es User",
        });
      } else {
        await upgradeAdminToSommelier(user.id, 2);
        showResponse({
          title: "Rol actualizado",
          variant: "success",
          message: "Ahora es Sommelier",
        });
      }
      onClose();
      await onSuccess?.();
    } catch (e) {
      showResponse({
        title: "Error",
        variant: "error",
        message: e.message,
      });
      setLocalError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleChangeFullName = (e) => {
    setFullName(e.target.value);
  };

  return (
    <Modal show={show} onHide={saving ? undefined : onClose} centered>
      <Modal.Header closeButton={!saving}>
        <Modal.Title>
          {isCreate ? "Alta de usuario" : "Cambiar rol de usuario"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {localError ? <Alert variant="danger">{localError}</Alert> : null}

        {isCreate && (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={handleChangeEmail}
                disabled={saving}
                placeholder="ej: user@mail.com"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={handleChangePassword}
                disabled={saving}
                placeholder="mínimo 6 caracteres"
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                value={fullName}
                onChange={handleChangeFullName}
                disabled={saving}
                placeholder="Ej: Thiago Vale"
              />
            </Form.Group>
          </Form>
        )}

        {isRole && user && (
          <div>
            <div className="mb-2">
              <strong>{user.fullName}</strong> — {user.email}
            </div>
            <div className="mb-3">
              Rol actual:{" "}
              <Badge bg={isSommelier ? "warning" : "secondary"}>
                {currentRole}
              </Badge>
            </div>

            {isAdmin ? (
              <Alert variant="warning" className="mb-0">
                Este usuario es <strong>Admin</strong>. No se permite cambiar su
                rol.
              </Alert>
            ) : (
              <Alert variant="info" className="mb-0">
                Esta acción cambiará el rol del usuario seleccionado.
              </Alert>
            )}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={saving}>
          Cancelar
        </Button>

        {isCreate ? (
          <Button variant="success" onClick={handleCreate} disabled={saving}>
            {saving ? "Creando..." : "Crear"}
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleRoleChange}
            disabled={saving || !user || isAdmin}
          >
            {saving
              ? "Actualizando..."
              : isAdmin
                ? "No modificable(Admin)"
                : roleActionLabel}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default UserAdminModal;
