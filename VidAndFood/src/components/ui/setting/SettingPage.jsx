import { useContext, useState } from "react";
import AuthContext from "../../../services/context/authContext/AuthContext";
import CustomNavbar from "../nav-bar/CustomNavbar";
import "./SettingPage.css";
import ResponseContext from "../../../services/context/responseContext/ResponseContext";
import { upgradeToSommelier } from "../../../services/roleServices";

const SettingPage = () => {
  const { user, token, onLogin } = useContext(AuthContext);
  const { showResponse } = useContext(ResponseContext);

  const [accountForm, setAccountForm] = useState({
    fullname: user?.fullName,
    email: user?.email,
    membership: user?.role,
  });

  const [saving, setSaving] = useState(false);

  const handleSelectMembership = (membership) => {
    setAccountForm((prev) => ({ ...prev, membership }));
  };

  const handleSaveAll = async (e) => {
    e.preventDefault();

    const currentRole = user.role;
    const newRole = accountForm.membership;

    if( currentRole === newRole ){
      showResponse({
        variant: "error",
        title: "Error al actualizar subscripción",
        message: "No realizaste nigun cambio en tu tipo de subcripción."
      });
      return;
    }

    const isUserToSommelier = currentRole === "User" && newRole === "Sommelier";
    if (!isUserToSommelier) {
      showResponse({
        variant: "error",
        title: "Cambio de rol no disponible",
        message:
          "Desde esta pantalla solo podés actualizar tu suscripción de Usuario a Sommelier.",
      });

      setAccountForm((prev) => ({ ...prev, membership: currentRole }));
      return;
    }

    setSaving(true);

    try {
      await upgradeToSommelier();

      const updatedUser = { ...user, role: "Sommelier" };
      onLogin(updatedUser, token);

      showResponse({
        variant: "success",
        title: "Suscripción actualizada",
        message:
          "Ahora sos Sommelier en Vid&Food. Disfrutá de los beneficios de tu nueva suscripción.",
      });
    } catch (err) {
      showResponse({
        variant: "error",
        title: "No se pudo actualizar tu suscripción",
        message:
          err.message ||
          "Ocurrió un error al actualizar tu tipo de membresía.",
      });

      setAccountForm((prev) => ({ ...prev, membership: currentRole }));
    } finally {
      setSaving(false);
    }
  };

  const membershipPlans =
    user?.role === "Admin"
      ? ["User", "Sommelier", "Admin"]
      : ["User", "Sommelier"];

  const currentRole = user?.role;

  return (
    <>
      <CustomNavbar />

      <div className="settings-page-wrapper">
        <div className="container py-4">
          <header className="header-setting mb-4">
            <h1 className="settings-title">Settings</h1>
            <p className="settings-subtitle">
              Visualiza tu informacion de usuario y actualiza ru Subcripción.
            </p>
          </header>

          <div className="settings-card shadow-sm p-4 mx-auto">
            <form>
              <label className="form-label mt-3">Correo electrónico</label>
              <input
                type="email"
                className="form-control"
                value={accountForm.email}
                disabled
              />
              <div className="text-muted small mt-1">
                El email se utiliza para iniciar sesión y comunicaciones.
              </div>

              <label className="form-label mt-3">Nombre y apellido</label>
              <input
                type="email"
                className="form-control"
                value={accountForm.fullname}
                disabled
              />

              <label className="form-label mt-4">Subcripción</label>
              <div className="membership-group mx-2">
                {membershipPlans.map((plan) => {
                  const isSelected = accountForm.membership === plan; 
                  const isCurrent = currentRole === plan; 

                  let tagText = "";
                  if (isCurrent) {
                    tagText = "(actual)";
                  } else if (
                    currentRole === "User" &&
                    plan === "Sommelier"
                  ) {
                    tagText = "(actualizar)";
                  }

                  return (
                    <button
                      key={plan}
                      type="button"
                      className={
                        "btn btn-sm membership-pill" +
                        (isSelected ? " active" : "")
                      }
                      onClick={() => handleSelectMembership(plan)}
                    >
                      <span>{plan}</span>
                      {tagText && (
                        <span className="membership-tag"> {tagText}</span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="text-muted small mb-3">
                El tipo de membresía define beneficios como historial ampliado,
                bodega y recomendaciones avanzadas.
              </div>

              <button type="submit" className="btn btn-dark button-save" disabled={saving} onClick={handleSaveAll}>
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingPage;
