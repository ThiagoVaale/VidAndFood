import { Card, Col, Row } from "react-bootstrap";
import { Star, StarFill } from "react-bootstrap-icons";

import "./cardHome.css";

const CardHome = ({ id, img, nombre, anio_cosecha, bodega, rating, valoraciones, precio }) => {

  const filledStars = Array.from({ length: Math.min(rating, 5) }, (_, i) => (
    <StarFill key={`filled-${i}`} color="#a52a2a" />
  ));

  const emptyStars = Array.from({ length: 5 - Math.min(rating, 5) }, (_, i) => (
    <Star key={`empty-${i}`} color="#a52a2a" />
  ));

  return (
    <Col lg={6} md={6} sm={12} xs={12} className="mb-4">
      <Card className="wine-card shadow-sm border-0 p-3 position-relative">
        <Row className="align-items-center">
          <Col xs={4} className="position-relative">
            <Card.Img className="wine-img-floating" src={img} alt={nombre} />
          </Col>
          <Col xs={8}>
            <Card.Body>
              <Card.Title className="wine-title">{nombre}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {bodega}, {anio_cosecha}
              </Card.Subtitle>
              <div className="rating-stars">
                {filledStars}
                {emptyStars}
                <span className="valoraciones">({valoraciones})</span>
              </div>
              <div className="precio">${precio?.toLocaleString()}</div>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Col>
  );
};

export default CardHome;
