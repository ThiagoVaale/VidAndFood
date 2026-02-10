import "./NewsletterBanner.css";

const NewsletterBanner = () => {
  return (
    <section className="newsletter-banner">
      <div className="newsletter-left">
        <div className="newsletter-icon">
          <img
            src="/assets/images/banner_mail.png" 
            alt="Ofertas de vino por mail"
            className="newsletter-icon-img"
          />
        </div>

        <div className="newsletter-text">
          <h2>Sign up to receive exclusive offers</h2>
          <p>
            They are available today. Maybe not tomorrow. Favorites run out quickly.
          </p>
        </div>
      </div>

      <div className="newsletter-right">
        <form className="newsletter-form">
          <input
            type="email"
            className="newsletter-input"
            placeholder="Enter your email address*"
          />
          <button type="button" className="newsletter-button">
            Sign up
          </button>
        </form>

        <label className="newsletter-consent">
          <input type="checkbox" />
          <span>
            Yes, I would like to receive news and offers from Vid &amp; Food by email. I can unsubscribe at any time.
          </span>
        </label>
      </div>
    </section>
  );
};

export default NewsletterBanner;

