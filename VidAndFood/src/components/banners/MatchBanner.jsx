import { useContext } from "react";
import "./MatchBanner.css";
import AuthContext from "../../services/context/authContext/AuthContext";

const MatchBanner = () => {
  const { openAuthModal } = useContext(AuthContext);

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
          Obtén recomendaciones personalizadas de vinos. Inicia sesión para
          encontrar vinos que se adapten a tu gusto.
        </p>

        <button
          type="button"
          className="match-button"
          onClick={() => openAuthModal("login")}
        >
          Inicia sesión en tu cuenta
        </button>
      </div>
    </section>
  );
};

export default MatchBanner;
