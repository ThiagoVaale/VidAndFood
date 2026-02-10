import { useNavigate, useParams } from "react-router-dom";
import CustomNavBar from "../../ui/nav-bar/CustomNavbar";
import StarRating from "../../common/StarsRating";
import "./WineDetailPage.css";
import { Bookmark } from "react-bootstrap-icons";
import Footer from "../footer/Footer";
import { useContext, useEffect, useState } from "react";
import WishListContext from "../../../services/context/wishListContext/WishListContext";
import WineReview from "../wineReview/WineReview";
import {
  deleteFavoriteWine,
  fetchWineById,
  toggleFavoriteWine,
} from "../../../services/wineService";
import ResponseContext from "../../../services/context/responseContext/ResponseContext";
import AuthContext from "../../../services/context/authContext/AuthContext";
import WineContext from "../../../services/context/winesContext/WinesContext";
import { wineTypeToLabel } from "../../../utils/wineType";

const WineDetailPage = () => {
  const { wineId } = useParams();
  const navigate = useNavigate();

  const { isFavorite, toggleFavorite } = useContext(WishListContext);
  const { showResponse } = useContext(ResponseContext);
  const { user, isAuthenticated, openAuthModal } = useContext(AuthContext);
  const { wines } = useContext(WineContext);

  const [wine, setWine] = useState(null);

  const role = user?.role;

  const canUseFavorites =
    !!isAuthenticated && (role === "Sommelier" || role === "Admin");

  useEffect(() => {
    const loadWineWithReview = async () => {
      try {
        const wineReview = await fetchWineById(wineId);
        setWine(wineReview || null);
      } catch (err) {
        console.error("Error al cargar el vino:", err);
      }
    };

    loadWineWithReview();
  }, [wineId, wines]);

  const reloadWine = async () => {
    try{
    const wineReview = await fetchWineById(wineId);
    setWine(wineReview || null);
    } catch (err) {
      console.error("Error reloading the wine: ", err.message)
    }
  };

  if (!wine) {
    return (
      <>
        <CustomNavBar />
        <div className="wine-detail-wrapper">
          <div className="wine-detail-main-container">
            <p>No history available</p>
            <button onClick={() => navigate("/wines")}>Back to Wines</button>
          </div>
        </div>
      </>
    );
  }

  const grapeNames = wine?.wine?.grapes?.length
    ? wine.wine.grapes.map((g) => g.name).join(", ")
    : "Sin especificar";

  const favorite = isFavorite(wine.wine.id);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      openAuthModal("login");
      return;
    }

    if (!canUseFavorites) {
      showResponse({
        variant: "error",
        title: "Action not allowed",
        message: "Only Sommeliers can manage the wish list.",
      });
      return;
    }

    const wasFavorite = favorite;

    try {
      if (wasFavorite) {
        await deleteFavoriteWine(wine.wine.id);
      } else {
        await toggleFavoriteWine(wine.wine.id);
      }

      toggleFavorite(wine.wine.id);

      showResponse({
        variant: "success",
        message: wasFavorite
          ? "Removed from favorites"
          : "Wine added to favorites",
        title: wasFavorite
          ? "We updated your list"
          : "With Vid&Food, everything is possible",
      });
    } catch (err) {
      console.error("Error al actualizar favorito:", err.message);
      showResponse({
        variant: "error",
        message: err.message || "Could not update the favorites status",
        title: "Try again",
      });
    }
  };

  return (
    <>
      <CustomNavBar />

      <div className="wine-detail-wrapper">
        <div className="wine-detail-main-container">
          <section className="wine-detail-header">
            <div className="wine-detail-image-col">
              <img
                src={wine.wine.imageUrl}
                alt={"Foto del vino"}
                className="wine-detail-image"
              />
            </div>

            <div className="wine-detail-info-col">
              <h1 className="wine-detail-title">{wine.wine.wineryName}</h1>
              <h2 className="wine-detail-subtitle">{wine.wine.name}</h2>

              {wine.vintageYear && (
                <p className="wine-detail-year">{wine.wine.vintageYear}</p>
              )}

              <div className="wine-detail-meta-links">
                {wine.wine.regionName && <span>{wine.wine.regionName}</span>}
                {grapeNames !== "Sin especificar" && (
                  <span>• {grapeNames}</span>
                )}
              </div>

              <div className="wine-detail-rating">
                <div className="wine-detail-rating-left">
                  <div className="wine-detail-rating-score">
                    {wine.wine.averageScore?.toFixed(1) ?? "–"}
                  </div>
                  <StarRating
                    rating={wine.wine.averageScore}
                    size="1.1rem"
                    color="#a52a2a"
                    maxStars={5}
                  />
                </div>
               
              </div>
               <div className="wine-detail-price-card">
                  <div className="wine-detail-price-amount">
                    {wine.wine.price
                      ? `$ ${wine.wine.price.toLocaleString()}`
                      : "No disponible"}
                  </div>
                  <p className="wine-detail-price-note">
                    Estimated price according to affiliated stores.
                  </p>
                </div>

              <div className="wine-detail-actions">
                {canUseFavorites && (
                  <button
                    type="button"
                    className="wine-detail-action-link"
                    onClick={handleToggleFavorite}
                  >
                    <Bookmark
                      className="wine-detail-action-icon"
                      style={{ color: favorite ? "#a52a2a" : undefined }}
                    />
                    {favorite
                      ? "In your wish list"
                      : "Add to wishlist"}
                  </button>
                )}
              </div>
            </div>

          </section>

          <section className="wine-detail-section">
            <h3 className="wine-detail-section-title">Facts about wine</h3>

            <div className="wine-detail-data-table">
              <div className="wine-detail-row">
                <div className="wine-detail-row-label">Winery</div>
                <div className="wine-detail-row-value">
                  {wine.wine.wineryName}
                </div>
              </div>

              <div className="wine-detail-row">
                <div className="wine-detail-row-label">Grapes</div>
                <div className="wine-detail-row-value wine-detail-grapes">
                  {wine.wine.grapes.map((g, index) => (
                    <span key={g.id} className="wine-grape-tag">
                      {g.name}
                      {index < wine.wine.grapes.length - 1 && " · "}
                    </span>
                  ))}
                </div>
              </div>

              <div className="wine-detail-row">
                <div className="wine-detail-row-label">Region</div>
                <div className="wine-detail-row-value">
                  {wine.wine.regionName || "Sin especificar"}
                </div>
              </div>

              <div className="wine-detail-row">
                <div className="wine-detail-row-label">Flavor notes</div>
                <div className="wine-detail-row-value">
                  {wine.wine.notesTaste || "Sin especificar"}
                </div>
              </div>

              <div className="wine-detail-row">
                <div className="wine-detail-row-label">Scent</div>
                <div className="wine-detail-row-value">
                  {wine.wine.aroma || "Sin especificar"}
                </div>
              </div>

              <div className="wine-detail-row">
                <div className="wine-detail-row-label">Tipo de vino</div>
                <div className="wine-detail-row-value">
                  {wineTypeToLabel(wine.wine.wineType)}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <WineReview
        nombre={wine.wine.name}
        bodega={wine.wine.wineryName}
        anio_cosecha={wine.wine.vintageYear}
        region={wine.wine.regionName}
        wineReview={wine.reviews}
        wineId={wineId}
        onReviewCreated={reloadWine}
      />

      <Footer />
    </>
  );
};

export default WineDetailPage;
