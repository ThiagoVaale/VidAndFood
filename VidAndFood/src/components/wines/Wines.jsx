import { Container, Row } from "react-bootstrap";
import CardHome from "../ui/cardHome/CardHome";

const Wines = ({ wines }) => {
  return (
    <Container>
      <Row className="g-5">
        {wines.map((wine) => (
          <CardHome
            key={wine.id}
            id={wine.id}
            img={wine.img}
            nombre={wine.nombre}
            anio_cosecha={wine.anio_cosecha}
            bodega={wine.bodega}
            rating={wine.rating}
            precio={wine.precio_promedio}
            valoraciones={10}
          />
        ))}
      </Row>
    </Container>
  );
};

export default Wines;
