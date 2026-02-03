import { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../../../services/context/authContext/AuthContext";
import { useNavigate } from "react-router-dom";
import "./wineReview.css";
import { Star } from "react-bootstrap-icons";
import ResponseContext from "../../../services/context/responseContext/ResponseContext";
import {
  deleteReview,
  rateChange,
  rateWine,
} from "../../../services/wineService";

const WineReview = ({
  nombre,
  anio_cosecha,
  bodega,
  region,
  wineReview,
  wineId,
  onReviewCreated,
}) => {
  const navigate = useNavigate();

  const reviews = (wineReview ?? []).map((r) => ({
    id: r.id,
    username: r.userName,
    rating: r.score,
    comment: r.review,
    isSommelier: r.isSommelierReview,
    createdAt: r.createdAt,
  }));
  
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  });
  const [isPublishing, setIsPublishing] = useState(false);
  const [openMenuForId, setOpenMenuForId] = useState(null);

  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: "" });
  const [isEditingSaving, setIsEditingSaving] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const menuRef = useRef(null);

  const { user, isAuthenticated, openAuthModal } = useContext(AuthContext);
  const { showResponse } = useContext(ResponseContext);

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

  const handleSubmitReview = async () => {
    console.log("HOLA HOLA");
    try {
      if (!newReview.comment.trim()) {
        showResponse({
          variant: "error",
          title: "Empty comment",
          message: "The comment cannot be empty.",
        });
        return;
      }
      setIsPublishing(true);

      await Promise.all([
        rateWine(wineId, newReview.rating, newReview.comment),
        sleep(1200),
      ]);
      await onReviewCreated?.();
      setNewReview({ rating: 5, comment: "" });

      showResponse({
        variant: "success",
        title: "Review published",
        message: "Your review has been successfully published.",
      });
    } catch (error) {
      showResponse({
        variant: "error",
        title: "Error posting review",
        message: error.message || "There was a problem posting your review.",
      });
      return;
    } finally {
      setIsPublishing(false);
    }
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpenMenuForId(null);
    };

    const onMouseDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuForId(null);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onMouseDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, []);

  const handleClickMenuReview = (e, review) => {
    e.stopPropagation();
    setOpenMenuForId((prev) => (prev === review.id ? null : review.id));
  };

  const handleEditMenuReview = (review) => {
    setOpenMenuForId(null);
    setEditingReviewId(review.id);
    setEditForm({ rating: review.rating, comment: review.comment });
  };

  const handleDeleteMenuReview = (review) => {
    setOpenMenuForId(null);
    setReviewToDelete(review);
    setDeleteModalOpen(true);
  };

  const handleEditRatingChange = (rating) => {
    setEditForm((prev) => ({ ...prev, rating }));
  };

  const handleEditCommentChange = (e) => {
    setEditForm((prev) => ({ ...prev, comment: e.target.value }));
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditForm({ rating: 5, comment: "" });
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setReviewToDelete(null);
  };

  const handleSaveEdit = async () => {
    if (!editForm.comment.trim()) {
      showResponse({
        variant: "error",
        title: "Empty comment",
        message: "The comment cannot be empty.",
      });
      return;
    }

    try {
      setIsEditingSaving(true);

      await Promise.all([
        rateChange(wineId, editForm.rating, editForm.comment),
        sleep(900),
      ]);

      await onReviewCreated?.();

      showResponse({
        variant: "success",
        title: "Updated review",
        message: "Your review has been successfully updated.",
      });

      handleCancelEdit();
    } catch (err) {
      showResponse({
        variant: "error",
        title: "Error updating review",
        message: err.message || "There was a problem updating your review.",
      });
    } finally {
      setIsEditingSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);

      await Promise.all([deleteReview(wineId), sleep(900)]);

      await onReviewCreated?.();

      showResponse({
        variant: "success",
        title: "Review deleted",
        message: "Your review was removed",
      });

      if (reviewToDelete?.id === editingReviewId) {
        handleCancelEdit();
      }

      handleCloseDeleteModal();
    } catch (err) {
      showResponse({
        variant: "error",
        title: "Error deleting review",
        message: err.messag || "The review could not be deleted",
      });
    } finally {
      setIsDeleting(false);
    }
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
          <h2 className="form-title">Write your review</h2>
          <div className="review-form">
            <div className="form-group">
              <label className="form-label">Rating:</label>
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
                Comment:
              </label>
              <textarea
                id="comment"
                className="form-textarea"
                rows="4"
                placeholder="Share your experience with this wine..."
                value={newReview.comment}
                onChange={handleCommentChange}
              />
            </div>

            <button onClick={handleSubmitReview} className="submit-button">
              {isPublishing ? "Posting review..." : "Post review"}
            </button>
          </div>
        </div>
      )}

      {!isAuthenticated && (
        <div className="auth-cta">
          <p className="auth-cta-text">
            <b>¿Do you want to share your experience with this wine?</b>
          </p>
          <button onClick={handleIsAuthenticated} className="auth-button">
            Log in to review
          </button>
        </div>
      )}

      <div className="reviews-list">
        <h2 className="reviews-title">Reviews ({reviews.length})</h2>
        {reviews.map((review) => {

          console.log("REVIEWS: ", reviews);
          console.log("REVIEW: ", review);
          
          const isMine =
            isAuthenticated &&
            user.fullName &&
            review.username === user.fullName;

          return (
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

                <div className="review-header-right">
                  <span className="username">
                    @{review.username}
                    {review.isSommelier && <span className="sommelier-badge"> · Sommelier</span>}
                  </span>

                  {isMine && (
                    <div
                      className="review-actions-wrap"
                      ref={openMenuForId === review.id ? menuRef : null}
                    >
                      <button
                        type="button"
                        className="review-actions-btn"
                        onClick={(e) => handleClickMenuReview(e, review)}
                        aria-label="Acciones de reseña"
                      >
                        ⋮
                      </button>

                      {openMenuForId === review.id && (
                        <div className="review-actions-menu" role="menu">
                          <button
                            type="button"
                            className="review-actions-item"
                            onClick={() => handleEditMenuReview(review)}
                            role="menuitem"
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            className="review-actions-item danger"
                            onClick={() => handleDeleteMenuReview(review)}
                            role="menuitem"
                          >
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </header>

              {editingReviewId === review.id ? (
                <div className="review-edit-box">
                  <div className="edit-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star-button ${editForm.rating >= star ? "active" : ""}`}
                        onClick={() => handleEditRatingChange(star)}
                        disabled={isEditingSaving}
                      >
                        <Star
                          size={22}
                          fill={editForm.rating >= star ? "#F59E0B" : "none"}
                          stroke={
                            editForm.rating >= star ? "#F59E0B" : "#D1D5DB"
                          }
                        />
                      </button>
                    ))}
                    <span className="rating-value">
                      {editForm.rating.toFixed(1)}
                    </span>
                  </div>

                  <textarea
                    className="form-textarea"
                    rows="3"
                    value={editForm.comment}
                    onChange={handleEditCommentChange}
                    disabled={isEditingSaving}
                  />

                  <div className="edit-actions">
                    <button
                      type="button"
                      className="edit-cancel-btn"
                      onClick={handleCancelEdit}
                      disabled={isEditingSaving}
                    >
                      Cancelar
                    </button>

                    <button
                      type="button"
                      className="edit-save-btn"
                      onClick={handleSaveEdit}
                      disabled={isEditingSaving}
                    >
                      {isEditingSaving ? "Guardando..." : "Guardar"}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="review-text">{review.comment}</p>
              )}

              <footer className="review-footer">
                <time className="review-date" dateTime={review.createdAt}>
                  {formatDate(review.createdAt)}
                </time>
              </footer>
            </article>
          );
        })}
      </div>

      {deleteModalOpen && (
        <div className="modal-backdrop" onClick={handleCloseDeleteModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">¿Eliminar reseña?</h3>
            <p className="modal-text">
              Esta acción no se puede deshacer. ¿Estás seguro?
            </p>

            <div className="modal-actions">
              <button
                type="button"
                className="modal-cancel-btn"
                onClick={handleCloseDeleteModal}
                disabled={isDeleting}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="modal-danger-btn"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WineReview;
