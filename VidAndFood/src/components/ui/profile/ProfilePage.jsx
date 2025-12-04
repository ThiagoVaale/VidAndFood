import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../services/context/authContext/AuthContext";
import WishListContext from "../../../services/context/wishListContext/WishListContext";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";
import CustomNavbar from "../nav-bar/CustomNavbar";
import { getUserById } from "../../../services/userService";
import HistoryContext from "../../../services/context/historyContext/HistoryContext";


const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { favoriteIds } = useContext(WishListContext);
  const { historyIds } = useContext(HistoryContext)

  const [userInfo, setUserInfo] = useState(null);

  console.log('USER DESDE CONEXT: ', user)
  useEffect(() => {
    if (!user?.id) return;

    const loadUser = async () => {
      try {
        const data = await getUserById(user.id);
        console.log("DATA DESDE BACK: ", data)
        setUserInfo(data);
      } catch (err) {
        console.error("Error al cargar usuario:", err);
      }
    };

    loadUser();
  }, [user?.id]);

   const src = userInfo || user || {};

  const profile = {
    name: src.fullName,
    email: src.email || "",
    memberSince: src.createdAt || "—",
    membership: src.role || "Free",
    favouriteWinesCount: favoriteIds.length,
    historyWinesCount: historyIds.length
  };

  return (
    <>
      <CustomNavbar />

      <div
        className="profile-page"
        style={{
          backgroundColor: "#fdf9f2ff",
          minHeight: "100vh",
          paddingTop: "5rem",
        }}
      >
        <div className="container py-4">
          <header className="profile-header mb-4 d-flex justify-content-between align-items-center">
            <div>
              <h1 className="profile-title">Perfil</h1>
              <p className="profile-subtitle">
                Información de tu cuenta en Vid & Food.
              </p>
            </div>
          </header>

          <div className="row g-4">
            <div className="col-12 col-md-4">
              <div className="card profile-summary-card p-3">
                <div className="d-flex align-items-center mb-3">
                  <div className="profile-avatar me-3">
                    {profile.name?.[0] || "U"}
                  </div>
                  <div>
                    <h2 className="profile-name mb-1">{profile.name}</h2>
                    <p className="profile-email mb-1">{profile.email}</p>
                  </div>
                </div>

                <hr />

                <ul className="list-unstyled mb-3 profile-stats">
                  <li>
                    <strong>Miembro desde:</strong> {profile.memberSince}
                  </li>
                  <li>
                    <strong>Vinos en favoritos:</strong>{" "}
                    {profile.favouriteWinesCount}
                  </li>
                  <li>
                    <strong>Vinos en historial:</strong> {profile.historyWinesCount}
                  </li>
                </ul>

                <div className="d-flex flex-column gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-dark btn-sm"
                    onClick={() => navigate("/my-wines")}
                  >
                    Ver mis vinos favoritos
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-dark btn-sm"
                    onClick={() => navigate("/history")}
                  >
                    Ver mis vinos en historial
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => navigate("/setting")}
                  >
                    Ir a Settings
                  </button>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-8">
              <div className="card mb-3 p-3">
                <h3 className="section-title mb-3">Datos personales</h3>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Nombre y Apellido</label>
                    <div className="profile-field">{profile.name}</div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Correo electrónico</label>
                    <div className="profile-field">{profile.email}</div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Subscripción</label>
                    <div className="profile-field">{profile.membership}</div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Usuario desde</label>
                    <div className="profile-field">{profile.memberSince}</div>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-dark btn-sm"
                  onClick={() => navigate("/setting")}
                >
                  Editar en Settings
                </button>
              </div>

              {/* resto igual */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
