import { useContext, useState } from "react";
import AuthContext from "../../../services/context/authContext/AuthContext";
import CustomNavbar from "../nav-bar/CustomNavbar";
import "./settingPage.css";
import ResponseContext from "../../../services/context/responseContext/ResponseContext";
import {
  downgradeToUser,
  upgradeToSommelier,
} from "../../../services/roleServices";

const SettingPage = () => {
  const { user, onLogin } = useContext(AuthContext);
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

    if (!currentRole) {
      return;
    }

    if (currentRole === newRole) {
      showResponse({
        variant: "error",
        title: "Error al actualizar suscripción",
        message: "No realizaste cambios en tu tipo de suscripción.",
      });
      return;
    }

    setSaving(true);

    try {
      if (currentRole === "Sommelier" && newRole === "User") {
        const { token: newToken } = await downgradeToUser();

        if (!newToken) {
          throw new Error("No token was received from the backend");
        }

        onLogin(newToken);

        showResponse({
          variant: "info",
          title: "Subscription updated",
          message: "Your subscription was updated.",
        });

        setAccountForm((prev) => ({ ...prev, membership: "User" }));
        return;
      }

      if (currentRole === "User" && newRole === "Sommelier") {
        const { token: newToken, message } = await upgradeToSommelier();

        if (!newToken) {
          throw new Error("No token was received from the backend");
        }

        onLogin(newToken);
        showResponse({
          variant: "success",
          title: "Subscription updated",
          message:
            message ||
            "You are now a Sommelier at Vid&Food. Enjoy the benefits of your new subscription.",
        });

        setAccountForm((prev) => ({ ...prev, membership: "Sommelier" }));
        return;
      }

      showResponse({
        variant: "error",
        title: "Cambio de rol no disponible",
        message:
          "Desde esta pantalla solo puedes actualizar tu suscripción de Usuario a Sommelier.",
      });
      setAccountForm((prev) => ({ ...prev, membership: currentRole }));
      return;
    } catch (err) {
      showResponse({
        variant: "error",
        title: "No se pudo actualizar la suscripción",
        message:
          err?.message ||
          "Ocurrió un error al actualizar tu tipo de suscripción.",
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

  const displayPlanLabel = (plan) => {
    if (plan === "User") return "Usuario";
    if (plan === "Sommelier") return "Sommelier";
    if (plan === "Admin") return "Admin";
    return plan;
  };

  return (
    <>
      <CustomNavbar />

      <div className="settings-page-wrapper">
        <div className="container py-4">
          <header className="header-setting mb-4">
            <h1 className="settings-title">Configuración</h1>
            <p className="settings-subtitle">
              Ver tu información de usuario y actualizar tu suscripción.
            </p>
          </header>

          <div className="settings-card shadow-sm p-4 ">
            <form>
              <label className="form-label mt-3">Correo electrónico</label>
              <input
                type="email"
                className="form-control"
                value={accountForm.email}
                disabled
              />
              <div className="text-muted small mt-1">
                El correo se utiliza para iniciar sesión y comunicaciones.
              </div>

              <label className="form-label mt-3">Nombre y apellido</label>
              <input
                type="email"
                className="form-control"
                value={accountForm.fullname}
                disabled
              />

              <label className="form-label mt-4">Suscripción</label>
              <div className="membership-group mx-2" />
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

              <div className="text-muted small mb-3">
                El tipo de suscripción define beneficios como historial extendido, Favoritos, crear un vino si no está disponible y recomendaciones avanzadas con un chatbot.
              </div>

              <button
                type="submit"
                className="btn btn-dark button-save"
                disabled={saving}
                onClick={handleSaveAll}
              >
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
