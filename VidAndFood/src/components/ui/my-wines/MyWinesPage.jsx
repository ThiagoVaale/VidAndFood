import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomNavbar from "../nav-bar/CustomNavbar";
import Wines from "../../wines/Wines";
import "./myWinesPage.css";
import WishListContext from "../../../services/context/wishListContext/WishListContext";
import WineContext from "../../../services/context/winesContext/WinesContext";
import { fetchFavoriteWines } from "../../../services/wineService";
import GlobalLoadingContext from "../../../services/context/globalLoadingContext/GlobalLoadingContext";

const MyWinesPage = () => {
  const navigate = useNavigate();

  const { isFavorite, handleToggleFavorite } = useContext(WishListContext);
  const { setGlobalLoading, setGlobalMessage } = useContext(GlobalLoadingContext);

  const [favoriteWines, setFavoriteWines] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setGlobalMessage("Cargando tus vinos favoritos...");
        setGlobalLoading(true);

        const data = await fetchFavoriteWines();
        setFavoriteWines(data);
      } catch (err) {
        console.error("Error al cargar vinos favoritos:", err);
        setFavoriteWines([]);
      } finally {
        setGlobalLoading(false);
      }
    };
    loadFavorites();
  }, [setGlobalLoading, setGlobalMessage]);

  const hasFavorites = favoriteWines.length > 0;

  return (
    <>
      <CustomNavbar />

      <div
        className="mywines-page"
        style={{
          backgroundColor: "#fdf9f2ff",
          minHeight: "100vh",
          paddingTop: "5rem",
        }}
      >
        <div className="container py-4">
          <header className="mywines-header mb-4">
            <div>
              <h1
                style={{
                  fontSize: "2rem",
                  marginBottom: "0.5rem",
                }}
              >
                My Wines
              </h1>
              <p style={{ margin: 0, color: "#666" }}>
                Your wines saved in the wishlist.
              </p>
            </div>

            {hasFavorites && (
              <div className="mywines-summary">
                <span>{favoriteWines.length} vinos</span>
              </div>
            )}
          </header>

          {hasFavorites ? (
            <section className="mywines-list">
              <Wines
                wines={favoriteWines}
                isHorizontal={true}
                isFavorite={isFavorite}
                onToggleFavorite={handleToggleFavorite}
              />
            </section>
          ) : (
            <section
              className="mywines-empty d-flex flex-column align-items-center justify-content-center"
              style={{ padding: "4rem 0" }}
            >
              <div
                style={{
                  fontSize: "3rem",
                  marginBottom: "1rem",
                }}
              >
                🍷
              </div>
              <h2
                style={{
                  fontSize: "1.6rem",
                  marginBottom: "0.5rem",
                }}
              >
                You don't have any wines on your wishlist yet
              </h2>
              <p style={{ color: "#666", maxWidth: 420, textAlign: "center" }}>
                Explore our selection of wines and add your favorites from the detail page.
              </p>
              <button
                type="button"
                className="btn btn-dark mt-3"
                onClick={() => navigate("/wines")}
              >
                Explore wines
              </button>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default MyWinesPage;
