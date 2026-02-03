import "./Footer.css";
import { ChatDots, Truck, Stars, Heart } from "react-bootstrap-icons";

const Footer = () => {
  return (
    <section className="footer-banner">
      <div className="footer-container">
        <h2 className="footer-title">
          Thousands of people trust Vid&Food to find<br />
          the perfect pairing over and over again.
        </h2>

        <div className="footer-features">
          <div className="feature-item">
            <Heart className="feature-icon" />
            <p>
              Find your perfect pairing with smart recommendations based on your tastes.
            </p>
          </div>

          <div className="feature-item">
            <ChatDots className="feature-icon" />
            <p>
              We have an AI chatbot ready to give you advice on wines, food, and ideal pairings.
            </p>
          </div>

          <div className="feature-item">
            <Stars className="feature-icon" />
            <p>
              Check honest reviews about any wine before buying it.
            </p>
          </div>
        </div>

        <div className="footer-legal">
          © Vid&Food 2026  —  All rights reserved.
        </div>
      </div>
    </section>
  );
};

export default Footer;
