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
        <h2>Find your perfect match</h2>
        <p>
          Get personalized wine recommendations. Log in to find wines that suit your taste.
        </p>

        <button
          type="button"
          className="match-button"
          onClick={() => openAuthModal("login")}
        >
          Log in to your account
        </button>
      </div>
    </section>
  );
};

export default MatchBanner;
