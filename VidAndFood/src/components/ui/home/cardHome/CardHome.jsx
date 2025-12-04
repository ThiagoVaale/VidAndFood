import { Card, Col, Row } from "react-bootstrap";
import { ChatDots } from "react-bootstrap-icons";
import "./cardHome.css";
import StarRating from "../../../common/StarsRating";

const CardHome = ({
  img,
  nombre,
  region,
  anio_cosecha,
  bodega,
  rating,
  valoraciones,
  precio,
  variedad_uva,
  isHorizontal,
  onClick,
  
}) => {
  console.log("RATING", rating)
  return (
    <>
      {isHorizontal ? (
        <Col lg={12} md={12} sm={12} xs={12} className="mb-4">
          <Card
            className="wine-card shadow-sm border-0 p-3"
            onClick={onClick}
            style={{ cursor: onClick ? "pointer" : "default" }}
          >
            <div className="d-flex align-items-start">
              <div className="me-4">
                <Card.Img
                  src={img}
                  alt={nombre}
                  style={{
                    width: "100%",
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
                      {bodega} {anio_cosecha} {variedad_uva}
                    </p>
                    <div className="d-flex align-items-center mb-2">
                      {/* { podria agregar algo referencial } */}
                      <span className="me-2"></span>
                      <span style={{ fontSize: "0.85rem", color: "#6c757d" }}>
                        {region}
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
                      <ChatDots
                        className="me-2"
                        style={{ fontSize: "0.9rem" }}
                      />
                      <span>
                        Esta cosecha tiene mejor valoración que cualquier otro
                        año de este vino
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
      ) : (
        // --- CARTA VERTICAL CORREGIDA PARA TUS FOTOS ---
        <Col xs={12} sm={6} md={4} lg={3} className="mb-5 d-flex">
          <Card
            className="flex-fill border-0"
            onClick={onClick}
            style={{ 
                cursor: onClick ? "pointer" : "default",
                backgroundColor: "transparent"
            }}
          >
            {/* CAMBIO CLAVE:
               1. Quitamos el bg-light (gris).
               2. Usamos 'rounded-4' para bordes más modernos.
               3. shadow-sm muy suave para que la foto destaque.
            */}
            <div 
                className="ratio ratio-4x3 overflow-hidden position-relative mb-3 shadow-sm rounded-4"
            >
              <Card.Img
                src={img}
                alt={nombre}
                // CAMBIO CLAVE: object-fit-cover llena la caja sin deformar
                // w-100 h-100 asegura que ocupe todo el espacio
                className="w-100 h-100 object-fit-cover"
                style={{ 
                    transition: "transform 0.5s ease", // Efecto zoom suave al pasar el mouse (opcional)
                }} 
                // Pequeño truco: Si quieres un efecto zoom al hover, agrega una clase CSS para hover
              />
            </div>

            {/* INFO - ESTILO MINIMALISTA IDENTICO A LA REFERENCIA */}
            <Card.Body className="p-0 d-flex flex-column">
              <div>
                <h6 
                    className="mb-1 text-truncate" 
                    title={nombre}
                    style={{ 
                        fontWeight: "700", 
                        color: "#1a1a1a", // Negro casi puro
                        fontSize: "1.05rem",
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                    }}
                >
                    {nombre}{bodega}, {anio_cosecha}

                <p 
                    className="mb-2 text-truncate"
                    style={{ 
                        color: "#9e4758", // El color rojizo de tu referencia
                        fontSize: "0.9rem",
                        fontWeight: "500"
                    }}
                >
                  {variedad_uva}
                  
                </p>
                </h6>

                
              </div>

              {/* RATING Y PRECIO */}
              <div className="d-flex align-items-center justify-content-between mt-1">
                <div className="d-flex align-items-center">
                    <span 
                        className="me-1" 
                        style={{ fontWeight: "bold", fontSize: "0.9rem", color: "#333" }}
                    >
                        {rating.toFixed(1)}
                    </span>
                    {/* Solo 1 estrella para mantenerlo limpio como la referencia */}
                    <StarRating
                        rating={rating}
                        size="14px"
                        color="#a52a2a"
                        maxStars={1} 
                    />
                </div>
                
                {precio && (
                    <span style={{ fontSize: "0.95rem", fontWeight: "600", color: "#333" }}>
                        ${precio.toLocaleString()}
                    </span>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      )}
    </>
  );
};

export default CardHome;