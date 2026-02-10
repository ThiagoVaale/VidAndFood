import "./NewsletterBanner.css";

const NewsletterBanner = () => {
  return (
    <section className="newsletter-banner">
      <div className="newsletter-left">
        <div className="newsletter-icon">
          <img
            src="../../../public/assets/images/banner_mail.png"
            alt="Ofertas de vino por mail"
            className="newsletter-icon-img"
          />
        </div>

        <div className="newsletter-text">
          <h2>Suscríbete para recibir ofertas exclusivas</h2>
          <p>
            Están disponibles hoy. Quizás no mañana. Los favoritos se agotan rápidamente.
          </p>
        </div>
      </div>

      <div className="newsletter-right">
        <form className="newsletter-form">
          <input
            type="email"
            className="newsletter-input"
            placeholder="Ingresa tu dirección de correo electrónico*"
          />
          <button type="button" className="newsletter-button">
            Suscribirse
          </button>
        </form>

        <label className="newsletter-consent">
          <input type="checkbox" />
          <span>
            Sí, me gustaría recibir noticias y ofertas de Vid & Food por correo electrónico. Puedo desuscribirme en cualquier momento.
          </span>
        </label>
      </div>
    </section>
  );
};

export default NewsletterBanner;

