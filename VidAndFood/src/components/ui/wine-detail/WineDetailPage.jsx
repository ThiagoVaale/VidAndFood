import { useNavigate, useParams } from "react-router-dom";
import CustomNavBar from "../../ui/nav-bar/CustomNavbar";
import StarRating from "../../common/StarsRating";
import "./WineDetailPage.css";
import { Bookmark } from "react-bootstrap-icons";
import Footer from "../footer/Footer";
import { useContext, useEffect, useRef, useState } from "react";
import WishListContext from "../../../services/context/wishListContext/WishListContext";
import WineReview from "../wineReview/WineReview";
import {
  deleteFavoriteWine,
  fetchWineById,
  toggleFavoriteWine,
} from "../../../services/wineService";
import ResponseContext from "../../../services/context/responseContext/ResponseContext";
import HistoryContext from "../../../services/context/historyContext/HistoryContext";
import { addWineToHistory } from "../../../services/historyUserService";
import AuthContext from "../../../services/context/authContext/AuthContext";
import WineContext from "../../../services/context/winesContext/WinesContext";

const WineDetailPage = () => {
  const { wineId } = useParams();
  const navigate = useNavigate();

  const { isFavorite, toggleFavorite } = useContext(WishListContext);
  const { showResponse } = useContext(ResponseContext);
  const { isInHistory, toggleHistoryLocal } = useContext(HistoryContext);
  const { user, isAuthenticated, openAuthModal } = useContext(AuthContext);
  const { wines } = useContext(WineContext);

  const [wine, setWine] = useState(null);

  const historyTimeoutRef = useRef(null);
  const historyFiredForWineRef = useRef(null);
  const isInHistoryRef = useRef(isInHistory);
  const toggleHistoryLocalRef = useRef(toggleHistoryLocal);
  const showResponseRef = useRef(showResponse);

  const role = user?.role || null;

  const historyKey = (id) => `vf_history_fired_${String(id)}`;

  const canUseHistory =
    !!isAuthenticated &&
    (role === "User" || role === "Sommelier" || role === "Admin");

  const canUseFavorites =
    !!isAuthenticated && (role === "Sommelier" || role === "Admin");

  useEffect(() => {
    const loadWineWithReview = async () => {
      try {
        const wineReview = await fetchWineById(wineId);
        console.log("VINO POR ID DESDE BACK: ", wineReview);
        setWine(wineReview || null);
      } catch (err) {
        console.error("Error al cargar el vino:", err);
      }
    };
    loadWineWithReview();
  }, [wineId, wines]);

  const reloadWine = async () => {
    const wineReview = await fetchWineById(wineId);
    setWine(wineReview || null);
  };

  useEffect(() => {
    if (!canUseHistory) {
      return;
    }

    const key = historyKey(wineId);

    if (localStorage.getItem(key) === "1") return;

    if (isInHistoryRef.current(wineId)) {
      localStorage.setItem(key, "1");
      return;
    }

    if (historyTimeoutRef.current) {
      clearTimeout(historyTimeoutRef.current);
      historyTimeoutRef.current = null;
    }

    historyTimeoutRef.current = setTimeout(async () => {
      historyFiredForWineRef.current = String(wineId);

      try {
        await addWineToHistory(wineId);

        historyFiredForWineRef.current = String(wineId);
        localStorage.setItem(key, "1");

        const alredyInHistory = isInHistoryRef.current(wineId);
        if (!alredyInHistory) {
          toggleHistoryLocalRef.current(wineId);
        }

        showResponseRef.current({
          variant: "success",
          title: "Agregado en tu historial.",
          message: "Guardamos este vino en tu historial automaticamente.",
        });
      } catch (err) {
        showResponseRef.current({
          variant: "error",
          title: "No se pudo agregar al historial",
          message: err.message || "Intente nuevamente más tarde.",
        });
      }
    }, 5000);

    return () => {
      if (historyTimeoutRef.current) {
        clearTimeout(historyTimeoutRef.current);
        historyTimeoutRef.current = null;
      }
    };
  }, [wineId, canUseHistory]);

  if (!wine) {
    return (
      <>
        <CustomNavBar />
        <div className="wine-detail-wrapper">
          <div className="wine-detail-main-container">
            <p>No se encontró el vino seleccionado.</p>
            <button onClick={() => navigate("/wines")}>Volver a Wines</button>
          </div>
        </div>
      </>
    );
  }

  const grapeNames = wine?.wine?.grapes?.length
    ? wine.wine.grapes.map((g) => g.name).join(", ")
    : "Sin especificar";

  const favorite = isFavorite(wine.id);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      openAuthModal("login");
      return;
    }

    if (!canUseFavorites) {
      showResponse({
        variant: "error",
        title: "Acción no permitida",
        message: "Solo Sommeliers pueden gestionar la lista de deseos.",
      });
      return;
    }

    const wasFavorite = favorite;

    try {
      if (wasFavorite) {
        await deleteFavoriteWine(wine.id);
      } else {
        await toggleFavoriteWine(wine.id);
      }

      toggleFavorite(wine.id);

      showResponse({
        variant: "success",
        message: wasFavorite
          ? "Vino eliminado de favoritos"
          : "Vino agregado a favoritos",
        title: wasFavorite
          ? "Actualizamos tu lista"
          : "Con Vid&Food todo es posible",
      });
    } catch (err) {
      console.error("Error al actualizar favorito:", err.message);
      showResponse({
        variant: "error",
        message: err.message || "No se pudo actualizar el estado de favoritos",
        title: "Intente de nuevo",
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
                      ? "En tu lista de deseos"
                      : "Añadir a la lista de deseos"}
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
