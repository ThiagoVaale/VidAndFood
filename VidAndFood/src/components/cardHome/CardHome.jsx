import { Card, Col, Row } from "react-bootstrap";
import { Star, StarFill, ChatDots } from "react-bootstrap-icons";

import "./cardHome.css";
import StarRating from "../common/StarsRating";

const CardHome = ({
  img,
  nombre,
  anio_cosecha,
  bodega,
  rating,
  valoraciones,
  precio,
}) => {
  return (
    <Col lg={12} md={12} sm={12} xs={12} className="mb-4">
      <Card className="wine-card shadow-sm border-0 p-3">
        <div className="d-flex align-items-start">
          <div className="me-4">
            <Card.Img
              src={img}
              alt={nombre}
              style={{
                width: "120px",
                height: "160px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </div>

          <div className="flex-grow-1 d-flex justify-content-between align-items-center">
            <div className="d-flex justify-content-between align-items-start w-100">
              <div className="wine-info flex-grow-1 me-4">
                <h5
                  className="wine-title mb-2"
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    lineHeight: "1.3",
                  }}
                >
                  {nombre}
                </h5>
                <p
                  className="wine-subtitle mb-2 text-muted"
                  style={{ fontSize: "0.9rem", marginBottom: "8px" }}
                >
                  {bodega}, {anio_cosecha}
                </p>
                <div className="d-flex align-items-center mb-2">
                  <span className="me-2">🇮🇹</span>
                  <span style={{ fontSize: "0.85rem", color: "#6c757d" }}>
                    Campania, Italia
                  </span>
                </div>

                <div
                  className="special-message d-flex align-items-center p-2 rounded-3 mt-2"
                  style={{
                    backgroundColor: "#fff8e1",
                    border: "1px solid #f9e79f",
                    fontSize: "0.8rem",
                    color: "#8b6914",
                  }}
                >
                  <ChatDots className="me-2" style={{ fontSize: "0.9rem" }} />
                  <span>
                    Esta cosecha tiene mejor valoración que cualquier otro año
                    de este vino
                  </span>
                </div>
              </div>

              <div className="rating-price-section text-end">
                <div className="rating-display mb-1">

                  <StarRating
                    rating={rating}
                    size="1rem"
                    color="#a52a2a"
                    showValue={true}
                    layout="vertical"
                    maxStars={5}
                  />  

                  <div style={{ fontSize: "0.75rem", color: "#6c757d" }}>
                    {valoraciones} valoraciones
                  </div>
                </div>

                <div className="price-section mt-4">
                  <div
                    className="precio-amount"
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: "700",
                      color: "#2c3e50",
                    }}
                  >
                    ${precio?.toLocaleString()}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#6c757d" }}>
                    Precio promedio
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Col>
  );
};

export default CardHome;
