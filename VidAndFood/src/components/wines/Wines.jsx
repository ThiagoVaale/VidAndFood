import { Container, Row, Col } from "react-bootstrap";
import CardHome from "../ui/home/cardHome/CardHome";
import { useCallback } from "react";
import useNavigateToWineDetail from "../../hooks/useNavigateToWineDetail";

const Wines = ({ wines, isHorizontal, isFavorite, onToggleFavorite }) => {
  const navigateToWineDetail = useNavigateToWineDetail();
  
   const handleClickWine = useCallback(
    (wine) => {
      if (!wine?.id) return;
      navigateToWineDetail(wine.id);
    },
    [navigateToWineDetail]
  );

  // Si no hay vinos, mostramos un mensaje amigable
  if (!wines || wines.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <h4>No wines found</h4>
        <p>Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <section>
      <Row className="g-3"> {/* g-3 da un poco más de espacio entre tarjetas */}
        {wines.map((wine) => {
          // Lógica para encontrar la mejor review
          const bestReview =
            Array.isArray(wine.reviews) && wine.reviews.length > 0
              ? wine.reviews.reduce((best, current) => {
                  if (!best) return current;

                  const bestScore = Number(best.score);
                  const currentScore = Number(current.score);

                  if (currentScore > bestScore) {
                    return current;
                  }

                  if (currentScore === bestScore) {
                    const bestDate = new Date(best.createdAt ?? 0).getTime();
                    const currentDate = new Date(current.createdAt ?? 0).getTime();
                    return currentDate > bestDate ? current : best;
                  }

                  return best;
                }, null)
              : null;

          return (
            <Col
              key={wine.id}
              xs={12}
              // LÓGICA DE ANCHO DINÁMICO:
              // Si es horizontal (lista) -> ocupa 12 columnas (100%)
              // Si es vertical (grilla) -> ocupa 6 (tablet) o 4 (desktop) columnas
              md={isHorizontal ? 12 : 6}
              lg={isHorizontal ? 12 : 4}
            >
              <CardHome
                id={wine.id}
                img={wine.imageUrl}
                nombre={wine.name} // Corregido: suele ser wine.name, no wine.wineryName en el nombre
                region={wine.regionName}
                anio_cosecha={wine.vintageYear}
                bodega={wine.wineryName}
                rating={wine.averageScore}
                precio={wine.price}
                variedad_uva={wine.grapes?.name || wine.grapeNames} // Ajuste para evitar error si grapes es objeto o string
                valoraciones={wine.reviews?.length ?? 0}
                bestReview={bestReview}
                isHorizontal={isHorizontal}
                onClick={() => handleClickWine(wine)}
                // Manejo seguro de isFavorite y onToggleFavorite
                isFavorite={
                  typeof isFavorite === "function" ? isFavorite(wine.id) : false
                }
                onToggleFavorite={
                  typeof onToggleFavorite === "function"
                    ? (e) => {
                        e?.stopPropagation?.();
                        onToggleFavorite(wine.id);
                      }
                    : undefined
                }
              />
            </Col>
          );
        })}
      </Row>
    </section>
  );
};

export default Wines;