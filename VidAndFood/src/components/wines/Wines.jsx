import { Container, Row } from "react-bootstrap";
import CardHome from "../ui/home/cardHome/CardHome";
import { useNavigate } from "react-router-dom";

const Wines = ({ wines, isHorizontal, isFavorite, onToggleFavorite }) => {
  const navigate = useNavigate();

  const handleClickWine = (wine) => {
    navigate(`/wines/${wine.id}`);
  };

  return (
    <Container>
      <Row className="g-5">
        {wines.map((wine) => {
          const bestReview =
            Array.isArray(wine.reviews) && wine.reviews.length > 0
              ? wine.reviews.reduce((best, current) => {
                  if (!best) {
                    return current;
                  }

                  const bestScore = Number(best.score);
                  const currentScore = Number(current.score);

                  if (currentScore > bestScore){
                    return current;
                  } 

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
            <CardHome
              key={wine.id}
              id={wine.id}
              img={wine.imageUrl}
              nombre={wine.wineryName}
              region={wine.regionName}
              anio_cosecha={wine.vintageYear}
              bodega={wine.wineryName}
              rating={wine.averageScore}
              precio={wine.price}
              variedad_uva={wine.grapeNames}
              valoraciones={wine.reviews?.length ?? 0}
              bestReview={bestReview}
              isHorizontal={isHorizontal}
              onClick={() => handleClickWine(wine)}
              isFavorite={isFavorite ? isFavorite(wine.id) : false}
              onToggleFavorite={
                onToggleFavorite
                  ? (e) => {
                      e?.stopPropagation?.();
                      onToggleFavorite(wine.id);
                    }
                  : undefined
              }
            />
          );
        })}
      </Row>
    </Container>
  );
};

export default Wines;
