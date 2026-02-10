import "./Footer.css";
import { ChatDots, Truck, Stars, Heart } from "react-bootstrap-icons";

const Footer = () => {
  return (
    <section className="footer-banner">
      <div className="footer-container">
        <h2 className="footer-title">
          Miles de personas confían en Vid&Food para encontrar<br />
          el maridaje perfecto una y otra vez.
        </h2>

        <div className="footer-features">
          <div className="feature-item">
            <Heart className="feature-icon" />
            <p>
              Encuentra tu maridaje perfecto con recomendaciones inteligentes basadas en tus gustos.
            </p>
          </div>

          <div className="feature-item">
            <ChatDots className="feature-icon" />
            <p>
              Contamos con un chatbot de IA listo para darte consejos sobre vinos, comida y maridajes ideales.
            </p>
          </div>

          <div className="feature-item">
            <Stars className="feature-icon" />
            <p>
              Consulta reseñas honestas sobre cualquier vino antes de comprarlo.
            </p>
          </div>
        </div>

        <div className="footer-legal">
          © Vid&Food 2026  —  Todos los derechos reservados.
        </div>
      </div>
    </section>
  );
};

export default Footer;
