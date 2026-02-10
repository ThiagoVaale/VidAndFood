import { Container, Row, Col } from "react-bootstrap";
import CardHome from "../ui/home/cardHome/CardHome";
import { useCallback, useMemo } from "react";
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

  const activeWines = useMemo(() => {
    if(!Array.isArray(wines)){
      return [];
    }

    return wines.filter((w) => w?.isActive !== false);
  }, [wines]);

  if (!wines || wines.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <h4>No se encontraron vinos</h4>
        <p>Intenta ajustar tus filtros.</p>
      </div>
    );
  }

  return (
    <section>
      <Row className="g-3"> 
        {activeWines.map((wine) => {
          const activeReviews = Array.isArray(wine.reviews) ? wine.reviews.filter((r) => r?.isActive !== false) : [];
          const bestReview =
            activeReviews.length > 0
              ? activeReviews.reduce((best, current) => {
                  if (!best) return current;

                  const bestScore = Number(best.score);
                  const currentScore = Number(current.score);

                  if (currentScore > bestScore) return current;

                  if (currentScore === bestScore) {
                    const bestDate = new Date(best.createdAt ?? 0).getTime();
                    const currentDate = new Date(
                      current.createdAt ?? 0,
                    ).getTime();
                    return currentDate > bestDate ? current : best;
                  }

                  return best;
                }, null)
              : null;

          return (
            <Col
              key={wine.id}
              xs={12}
              md={isHorizontal ? 12 : 6}
              lg={isHorizontal ? 12 : 4}
            >
              <CardHome
                id={wine.id}
                img={wine.imageUrl}
                nombre={wine.name} 
                region={wine.regionName}
                anio_cosecha={wine.vintageYear}
                bodega={wine.wineryName}
                rating={wine.averageScore}
                precio={wine.price}
                variedad_uva={wine.grapes?.name || wine.grapeNames} 
                valoraciones={wine.reviews?.length ?? 0}
                bestReview={bestReview}
                isHorizontal={isHorizontal}
                onClick={() => handleClickWine(wine)}
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