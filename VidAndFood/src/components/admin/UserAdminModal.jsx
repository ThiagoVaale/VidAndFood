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
    return isSommelier ? "Downgrade a User" : "Upgrade a Sommelier";
  }, [user, isSommelier]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value
    }));
  }

  const handleCreate = async () => {
    const { email, password, fullName, rol } = form;

    if (!form.email.trim()){
      return setLocalError("Email is required.");
    } 

    if (!form.password || form.password.length < 6){
      return setLocalError("Password must be at least 6 characters.");
    }

    if (!form.fullName.trim()){
      return setLocalError("Full name is required.");
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
        title: "User created",
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
          title: "Action not allowed",
          variant: "error",
          message: "You cannot change the role of an Admin user.",
        });
        return;
      }

      if (isSommelier) {
        await downgradeAdminToUser(user.id, 1);
        showResponse({
          title: "Role updated",
          variant: "success",
          message: "Now it's User",
        });
      } else {
        await upgradeAdminToSommelier(user.id, 2);
        showResponse({
          title: "Role updated",
          variant: "success",
          message: "Now he/she is a Sommelier",
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
          {isCreate ? "User registration" : "Change user role"}
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
                value={form.email}
                onChange={handleChange("email")}
                disabled={saving}
                placeholder="ej: user@mail.com"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={form.password}
                onChange={handleChange("password")}
                disabled={saving}
                placeholder="minimum 6 characters"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                value={form.fullName}
                onChange={handleChange("fullName")}
                disabled={saving}
                placeholder="Ej: Thiago Vale"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <div className="d-flex justify-content-center gap-4 mt-1">
                <Form.Check
                  type="radio"
                  label="User"
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
              Current rol:{" "}
              <Badge bg={isSommelier ? "warning" : "secondary"}>
                {currentRole}
              </Badge>
            </div>

            {isAdmin ? (
              <Alert variant="warning" className="mb-0">
                This user is <strong>Admin</strong>. Changing your role is not allowed.
              </Alert>
            ) : (
              <Alert variant="info" className="mb-0">
                This action will change the role of the selected user.
              </Alert>
            )}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={saving}>
          Cancel
        </Button>

        {isCreate ? (
          <Button variant="success" onClick={handleCreate} disabled={saving}>
            {saving ? "Creating..." : "Create"}
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleRoleChange}
            disabled={saving || !user || isAdmin}
          >
            {saving
              ? "Updating..."
              : isAdmin
                ? "Not modifiable(Admin)"
                : roleActionLabel}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default UserAdminModal;
