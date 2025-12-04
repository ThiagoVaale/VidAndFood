import { useContext, useState } from "react";
import AuthContext from "../../../services/context/authContext/AuthContext";
import { useNavigate } from "react-router-dom";
import CustomNavbar from "../nav-bar/CustomNavbar";
import "./SettingPage.css";

const SettingPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [accountForm, setAccountForm] = useState({
    username: user?.name || "Guest User",
    fullname: user?.fullname,
    email: user?.email,
    role: user?.role,
    city: "Rosario",
    country: "Argentina",
  });

  const [saving, setSaving] = useState(false);

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveAll = async (e) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((res) => setTimeout(res, 800));
    setSaving(false);
  };

  return (
    <>
      <CustomNavbar />

      <div className="settings-page-wrapper">
        <div className="container py-4">

          <header className="header-setting mb-4">
            <h1 className="settings-title">Settings</h1>
            <p className="settings-subtitle">
              Gestiona la información de tu cuenta y tus preferencias.
            </p>
          </header>

          <div className="settings-card shadow-sm p-4 mx-auto">
            <form onSubmit={handleSaveAll}>
              <h5 className="section-title">Cuenta</h5>

              <label className="form-label mt-3">Usuario</label>
              <input
                type="text"
                className="form-control"
                value={accountForm.username}
                onChange={handleAccountChange}
              />

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

              <label className="form-label mt-3">Subcripción</label>
              <input
                type="email"
                className="form-control"
                value={accountForm.role}
                disabled
              />

              <div className="row mt-3">
                <div className="col-md-6">
                  <label className="form-label">Ciudad</label>
                  <input
                    type="text"
                    className="form-control"
                    value={accountForm.city}
                    onChange={handleAccountChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">País</label>
                  <input
                    type="text"
                    className="form-control"
                    value={accountForm.country}
                    onChange={handleAccountChange}
                  />
                </div>
              </div>

              <hr className="mt-4" />

              <div className="d-flex justify-content-between mt-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => navigate("/profile")}
                >
                  Ver perfil
                </button>

                <button
                  type="submit"
                  className="btn btn-dark"
                  disabled={saving}
                >
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </>
  );
};

export default SettingPage;
