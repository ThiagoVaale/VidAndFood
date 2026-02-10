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
        <h2>Find your perfect match</h2>
        <p>
          Get personalized wine recommendations. Log in to find wines that suit your taste.
        </p>

        {!isAuthenticated ? (
          <button
          type="button"
          className="match-button"
          onClick={() => openAuthModal("login")}
        >
          Log in to your account
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
