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
          <h2>Regístrate para recibir las ofertas exclusivas</h2>
          <p>
            Hoy están disponibles. Quizás mañana no. Los favoritos se agotan
            pronto.
          </p>
        </div>
      </div>

      <div className="newsletter-right">
        <form className="newsletter-form">
          <input
            type="email"
            className="newsletter-input"
            placeholder="Escribe tu dirección de correo electrónico*"
          />
          <button type="button" className="newsletter-button">
            Inscribirme
          </button>
        </form>

        <label className="newsletter-consent">
          <input type="checkbox" />
          <span>
            Sí, me gustaría recibir noticias y ofertas de Vid &amp; Food por
            correo electrónico. Puedo cancelar mi suscripción en cualquier
            momento.
          </span>
        </label>
      </div>
    </section>
  );
};

export default NewsletterBanner;

