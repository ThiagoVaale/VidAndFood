import { useContext } from "react";
import "./MatchBanner.css";
import AuthContext from "../../services/context/authContext/AuthContext";
import ResponseContext from "../../services/context/responseContext/ResponseContext";

const MatchBanner = () => {
  const { openAuthModal, isAuthenticated, onLogout } = useContext(AuthContext);
  const { showResponse } = useContext(ResponseContext);

  const handleLogOutAccount = () => {
    onLogout();
    showResponse({
      variant: "success",
      title: "Cerrar sesión",
      message: "Tu cuenta se ha cerrado con éxito. Hasta la próxima."
    });
  }

  return (
    <section className="match-banner">
      <div className="match-illustration">
        <img
          src="../../../public/assets/images/banner_match.png"
          alt="Pareja perfecta de vinos"
          className="match-img"
        />
      </div>

      <div className="match-content">
        <h2>Encuentra tu pareja perfecta</h2>
        <p>
          Obtén recomendaciones de vinos personalizadas. Inicia sesión para encontrar vinos que se ajusten a tu gusto.
        </p>

        {!isAuthenticated ? (
          <button
          type="button"
          className="match-button"
          onClick={() => openAuthModal("login")}
        >
          Inicia sesión en tu cuenta
        </button>
        ) : (
          <button
          type="button"
          className="match-button"
          onClick={handleLogOutAccount}
        >
          Cerrar sesión
        </button>
        )}
      </div>
    </section>
  );
};

export default MatchBanner;
