import { useContext, useEffect, useMemo, useState } from "react";
import { Modal, Button, Form, Alert, Badge } from "react-bootstrap";

import { registerRequestAdmin } from "../../services/authServices";
import {
  downgradeAdminToUser,
  upgradeAdminToSommelier,
} from "../../services/roleServices";
import ResponseContext from "../../services/context/responseContext/ResponseContext";

const UserAdminModal = ({ show, mode, user, onClose, onSuccess }) => {
  const isCreate = mode === "create";
  const isRole = mode === "role";

  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    rol: "string"
  })

  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState(null);

  const { showResponse } = useContext(ResponseContext);

  useEffect(() => {
    if (!show) return;
    setLocalError(null);
    setSaving(false);

    if (isCreate) {
      setForm({
        email: "",
        password: "",
        fullName: "",
        rol: "User"
      });
    }
  }, [show, isCreate]);

  const currentRole = user?.role ?? "User";
  const isSommelier = String(currentRole).toLowerCase().includes("sommelier");
  const isAdmin = String(currentRole).toLowerCase().includes("admin");

  const roleActionLabel = useMemo(() => {
    if (!user) return "";
    return isSommelier ? "Degradar a Usuario" : "Promover a Sommelier";
  }, [user, isSommelier]);

  const displayRole = useMemo(() => {
    const r = String(currentRole).toLowerCase();
    if (r.includes("sommelier")) return "Sommelier";
    if (r.includes("admin")) return "Admin";
    return "Usuario";
  }, [currentRole]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value
    }));
  }

  const handleCreate = async () => {
    const { email, password, fullName, rol } = form;

    if (!form.email.trim()) {
      return setLocalError("El correo es obligatorio.");
    }

    if (!form.password || form.password.length < 6) {
      return setLocalError("La contraseña debe tener al menos 6 caracteres.");
    }

    if (!form.fullName.trim()) {
      return setLocalError("El nombre completo es obligatorio.");
    }

    try {
      setSaving(true);
      setLocalError(null);

      await registerRequestAdmin({
        email: email.trim(),
        password,
        fullName: fullName.trim(),
        rol
      });
      showResponse({
        title: "Usuario creado",
        variant: "success",
        message: form.email.trim(),
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
          message: "No puedes cambiar el rol de un usuario Admin.",
        });
        return;
      }

      if (isSommelier) {
        await downgradeAdminToUser(user.id, 1);
        showResponse({
          title: "Rol actualizado",
          variant: "success",
          message: "Ahora es Usuario",
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

  return (
    <Modal show={show} onHide={saving ? undefined : onClose} centered>
      <Modal.Header closeButton={!saving}>
        <Modal.Title>
          {isCreate ? "Registro de usuario" : "Cambiar rol de usuario"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {localError ? <Alert variant="danger">{localError}</Alert> : null}

        {isCreate && (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                disabled={saving}
                placeholder="ej: user@mail.com"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={form.password}
                onChange={handleChange("password")}
                disabled={saving}
                placeholder="mínimo 6 caracteres"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nombre completo</Form.Label>
              <Form.Control
                value={form.fullName}
                onChange={handleChange("fullName")}
                disabled={saving}
                placeholder="Ej: Thiago Vale"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <div className="d-flex justify-content-center gap-4 mt-1">
                <Form.Check
                  type="radio"
                  label="Usuario"
                  name="rol"
                  value="User"
                  checked={form.rol === "User"}
                  onChange={handleChange("rol")}
                  disabled={saving}
                />
                <Form.Check
                  type="radio"
                  label="Sommelier"
                  name="rol"
                  value="Sommelier"
                  checked={form.rol === "Sommelier"}
                  onChange={handleChange("rol")}
                  disabled={saving}
                />
              </div>
            </Form.Group>
          </Form>
        )}

        {isRole && user && (
          <div>
            <div className="mb-2">
              <strong>{user.fullName}</strong> — {user.email}
            </div>
            <div className="mb-3">
              Rol actual: {" "}
              <Badge bg={isSommelier ? "warning" : "secondary"}>
                {displayRole}
              </Badge>
            </div>

            {isAdmin ? (
              <Alert variant="warning" className="mb-0">
                Este usuario es <strong>Admin</strong>. No está permitido cambiar su rol.
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
                ? "No modificable (Admin)"
                : roleActionLabel}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default UserAdminModal;
