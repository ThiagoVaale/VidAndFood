import { useContext, useState } from "react";
import AuthContext from "../../../services/context/authContext/AuthContext";
import { useNavigate } from "react-router-dom";
import "./wineReview.css";
import { Star } from "react-bootstrap-icons";

const WineReview = ({ nombre, anio_cosecha, bodega, region }) => {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([
    {
      id: 1,
      username: "vinocatador",
      rating: 5.0,
      comment:
        "Excelente año, 2007 fue muy reconocido para esta bodega. Un vino difícil de conseguir, pues ya solo debe haber entre los coleccionistas.",
      createdAt: "2024-01-15T10:30:00",
    },
    {
      id: 2,
      username: "sommelier_pro",
      rating: 4.5,
      comment:
        "Muy buen vino, con notas frutales y un final prolongado. Perfecto para acompañar carnes rojas.",
      createdAt: "2024-02-20T15:45:00",
    },
    {
      id: 3,
      username: "wine_lover",
      rating: 4.0,
      comment:
        "Buena relación calidad-precio. Recomendado para dejar reposar antes de servir.",
      createdAt: "2024-03-10T18:20:00",
    },
  ]);

  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  });

  const { user, isAuthenticated, openAuthModal } = useContext(AuthContext);
  const currentUser = isAuthenticated ? user.name : null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("es-ES", options);
  };

  const handleIsAuthenticated = () => {
    if (!isAuthenticated) {
      navigate("/home");
      setTimeout(() => {
        openAuthModal("login");
      }, 100);
    }
  };

  const handleRatingChange = (rating) => {
    setNewReview({ ...newReview, rating });
  };

  const handleCommentChange = (e) => {
    setNewReview({ ...newReview, comment: e.target.value });
  };

  const handleSubmitReview = () => {
    if (!newReview.comment.trim()) {
      alert("Por favor escribe un comentario");
      return;
    }

    const reviewToAdd = {
      id: reviews.length + 1,
      username: currentUser.fullName,
      rating: newReview.rating,
      comment: newReview.comment,
      createdAt: new Date().toISOString(),
    };

    setReviews([reviewToAdd, ...reviews]);
    setNewReview({ rating: 5, comment: "" });
  };

  return (
    <div className="wine-reviews-container">
      <div className="wine-header">
        <h1 className="wine-title">
          {nombre} {anio_cosecha}
        </h1>
        <p className="wine-subtitle">
          {bodega} {region}
        </p>
      </div>

      {isAuthenticated && (
        <div className="review-form-container">
          <h2 className="form-title">Escribe tu reseña</h2>
          <div className="review-form">
            <div className="form-group">
              <label className="form-label">Calificación:</label>
              <div className="rating-selector">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star-button ${
                      newReview.rating >= star ? "active" : ""
                    }`}
                    onClick={() => handleRatingChange(star)}
                  >
                    <Star
                      size={28}
                      fill={newReview.rating >= star ? "#F59E0B" : "none"}
                      stroke={newReview.rating >= star ? "#F59E0B" : "#D1D5DB"}
                    />
                  </button>
                ))}
                <span className="rating-value">
                  {newReview.rating.toFixed(1)}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="comment">
                Comentario:
              </label>
              <textarea
                id="comment"
                className="form-textarea"
                rows="4"
                placeholder="Comparte tu experiencia con este vino..."
                value={newReview.comment}
                onChange={handleCommentChange}
              />
            </div>

            <button onClick={handleSubmitReview} className="submit-button">
              Publicar Reseña
            </button>
          </div>
        </div>
      )}

      {!isAuthenticated && (
        <div className="auth-cta">
          <p className="auth-cta-text">
            <b>¿Querés compartir tu experiencia con este vino?</b>
          </p>
          <button onClick={handleIsAuthenticated} className="auth-button">
            Iniciar sesión para reseñar
          </button>
        </div>
      )}

      <div className="reviews-list">
        <h2 className="reviews-title">Reseñas ({reviews.length})</h2>
        {reviews.map((review) => (
          <article key={review.id} className="review-card">
            <header className="review-header">
              <div className="review-rating">
                <Star
                  size={20}
                  fill="#F59E0B"
                  stroke="#F59E0B"
                  className="star-icon"
                />
                <span className="score">{review.rating.toFixed(1)}</span>
              </div>
              <span className="username">@{review.username}</span>
            </header>

            <p className="review-text">{review.comment}</p>

            <footer className="review-footer">
              <time className="review-date" dateTime={review.createdAt}>
                {formatDate(review.createdAt)}
              </time>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
};

export default WineReview;
