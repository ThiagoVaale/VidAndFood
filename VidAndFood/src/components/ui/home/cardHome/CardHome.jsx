import React, { useState, useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { ChatDots } from "react-bootstrap-icons";
import StarRating from "../../../common/StarsRating";
import "./cardHome.css";
import COLORS from "../../../../utils/colors";

const optimizeCloudinaryUrl = (url) => {
  if (!url) return "https://via.placeholder.com/600x450?text=Sin+Imagen";

  if (
    typeof url === "string" &&
    url.includes("cloudinary.com") &&
    url.includes("/upload/")
  ) {
    return url.replace(
      "/upload/",
      "/upload/c_fill,w_800,h_600,q_auto:best,f_auto/",
    );
  }

  return url;
};

const CardHome = ({
  img,
  nombre,
  region,
  anio_cosecha,
  bodega,
  rating,
  valoraciones,
  bestReview,
  precio,
  variedad_uva,
  isHorizontal,
  onClick,
}) => {
  const safeRating = typeof rating === "number" ? rating : Number(rating) || 0;

  const [imgSrc, setImgSrc] = useState(img);

  useEffect(() => {
    setImgSrc(optimizeCloudinaryUrl(img));
  }, [img]);

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
                  src={imgSrc || "https://via.placeholder.com/150"}
                  alt={nombre || "Vino"}
                  onError={(e) => {
                    e.target.onerror = null;
                    if (imgSrc !== img) setImgSrc(img);
                  }}
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
                      <span className="me-2"></span>
                      <span style={{ fontSize: "0.85rem", color: "#6c757d" }}>
                        {region}
                      </span>
                    </div>

                    <div
                      className="d-flex flex-column mt-3"
                      style={{
                        maxWidth: "520px",
                        gap: "4px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "0.9rem",
                          fontWeight: 700,
                          color: "#F59E0B",
                          lineHeight: 1,
                        }}
                        title={
                          bestReview
                            ? `Score ${Number(bestReview.score).toFixed(1)}`
                            : ""
                        }
                      >
                        <span style={{ fontSize: "0.95rem" }}>★</span>
                        <span>{bestReview ? Number(bestReview.score).toFixed(1) : "-"}</span>
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: "0.92rem",
                            lineHeight: 1.25,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          title={
                            bestReview
                              ? `@${bestReview.userName}: ${bestReview.review}`
                              : "No reviews yet"
                          }
                        >
                          {bestReview ? (
                            <>
                              <span
                                style={{ fontWeight: 600, color: COLORS.board }}
                              >
                                @{bestReview.userName}:
                              </span>{" "}
                              <span style={{ color: "#2b2b2b" }}>
                                {bestReview.review}
                              </span>
                            </>
                          ) : (
                            <span style={{ color: "#6c757d" }}>
                              No reviews yet
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rating-price-section text-center">
                    <div className="rating-display mb-1">
                      <StarRating
                        rating={safeRating}
                        size="1rem"
                        color="#a52a2a"
                        showValue={true}
                        layout="vertical"
                        maxStars={5}
                      />
                      <div style={{ fontSize: "0.75rem", color: "#6c757d" }}>
                        {" "}
                        {`${valoraciones} ${valoraciones > 1 ? "assessments" : "assessment"}`}{" "}
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
                        Average price
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      ) : (
        <Col xs={12} sm={6} md={4} lg={3} className="mb-5 d-flex">
          <Card
            className="flex-fill border-0"
            onClick={onClick}
            style={{
              cursor: onClick ? "pointer" : "default",
              backgroundColor: "transparent",
            }}
          >
            <div className="ratio ratio-4x3 overflow-hidden position-relative mb-3 shadow-sm rounded-4">
              <Card.Img
                src={imgSrc || "https://via.placeholder.com/400x300"}
                alt={nombre || "Vino"}
                className="w-100 h-100 object-fit-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  if (imgSrc !== img) setImgSrc(img);
                }}
                style={{ transition: "transform 0.5s ease" }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              />
            </div>

            <Card.Body className="p-0 d-flex flex-column">
              <div className="mb-2">
                <h6
                  className="mb-1 text-truncate"
                  title={nombre}
                  style={{
                    fontWeight: "700",
                    color: "#1a1a1a",
                    fontSize: "1.05rem",
                    fontFamily:
                      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  }}
                >
                  {nombre}
                </h6>

                <div
                  className="text-truncate mb-1"
                  style={{
                    color: "#9e4758",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                  }}
                >
                  {bodega}, {anio_cosecha}
                </div>

                <div
                  className="text-truncate text-muted"
                  style={{ fontSize: "0.85rem" }}
                >
                  {variedad_uva}
                </div>
              </div>

              <div className="d-flex align-items-center justify-content-between mt-auto pt-2">
                <div className="d-flex align-items-center">
                  <span
                    className="me-1"
                    style={{
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                      color: "#333",
                    }}
                  >
                    {safeRating.toFixed(1)}
                  </span>
                  <StarRating
                    rating={safeRating}
                    size="14px"
                    color="#a52a2a"
                    maxStars={1}
                  />
                </div>

                {precio && (
                  <span
                    style={{
                      fontSize: "1rem",
                      fontWeight: "700",
                      color: "#2c3e50",
                    }}
                  >
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
