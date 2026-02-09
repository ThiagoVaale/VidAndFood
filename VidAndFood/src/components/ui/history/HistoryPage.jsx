import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomNavbar from "../nav-bar/CustomNavbar";
import Wines from "../../wines/Wines";
import "../my-wines/MyWinesPage"; 
import HistoryContext from "../../../services/context/historyContext/HistoryContext";
import { fetchHistoryWines } from "../../../services/historyUserService";

const HistoryPage = () => {
  const navigate = useNavigate();

  const { isInHistory, toggleHistoryLocal } = useContext(HistoryContext);

  const [historyWines, setHistoryWines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchHistoryWines();
        setHistoryWines(data);
      } catch (err) {
        console.error("Error al cargar historial:", err);
        setHistoryWines([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, []);

  const hasHistory = !isLoading && historyWines.length > 0;

  return (
    <>
      <CustomNavbar />

      <div
        className="mywines-page"
        style={{
          backgroundColor: "#fdf9f2ff",
          minHeight: "100vh",
          paddingTop: "2rem",
          
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
                History
              </h1>
              <p style={{ margin: 0, color: "#666" }}>
                Wines you recently added to your history.
              </p>
            </div>

            {hasHistory && (
              <div className="mywines-summary">
                <span>{historyWines.length} wines</span>
              </div>
            )}
          </header>

          {isLoading ? (
            <section
              className="mywines-empty d-flex flex-column align-items-center justify-content-center"
              style={{ padding: "4rem 0" }}
            >
              <p style={{ color: "#666" }}>Cargando tu historial...</p>
            </section>
          ) : hasHistory ? (
            <section className="mywines-list">
              <Wines
                wines={historyWines}
                isHorizontal={true}
                isFavorite={isInHistory}
                onToggleFavorite={toggleHistoryLocal}
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
                🕰️
              </div>
              <h2
                style={{
                  fontSize: "1.6rem",
                  marginBottom: "0.5rem",
                }}
              >
                You don't have any wines in your history yet
              </h2>
              <p style={{ color: "#666", maxWidth: 420, textAlign: "center" }}>
                Go to a wine's detail page and it will automatically be added to your history.
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

export default HistoryPage;
