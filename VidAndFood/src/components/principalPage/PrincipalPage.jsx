import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useNavigate } from "react-router-dom";
import "./principalPage.css";
import NewsletterBanner from "../banners/NewsletterBanner";
import MatchBanner from "../banners/MatchBanner";
import Footer from "../ui/footer/Footer";
import { fetchWinesFeatured } from "../../services/wineService";
import ResponseContext from "../../services/context/responseContext/ResponseContext";
import CardHome from "../ui/home/cardHome/CardHome";
import useNavigateToWineDetail from "../../hooks/useNavigateToWineDetail";

const MAX_SLIDERS = import.meta.env.VITE_MAX_SLIDES_PER_VIEW;

const PrincipalPage = () => {
  const { showResponse } = useContext(ResponseContext);
  const [winesFeatured, setWinesFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const navigateToWineDetail = useNavigateToWineDetail();

  useEffect(() => {
    const loadWinesFeatured = async () => {
      try {
        const wines = await fetchWinesFeatured();
        setWinesFeatured(wines || []);
      } catch (err) {
        showResponse({
          variant: "error",
          title: "Error",
          message: err.message,
        });
      } finally {
        setLoading(false);
      }
    };
    loadWinesFeatured();
  }, []);

  const canLoop = winesFeatured.length >= MAX_SLIDERS * 2;

  const handleClickWineSwiper = (wine) => {
    navigateToWineDetail(wine.id);
  }

  return (
    <div className="root-style">
      <main>
        <section className="hero-intro py-5">
          <Container>
            <Row className="align-items-center gx-5">
              <Col lg={6} className="mb-5 mb-lg-0 order-lg-1">
                <div className="hero-image-wrapper">
                  <img
                    src="https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?q=80&w=1000&auto=format&fit=crop"
                    alt="Vid & Food Experience"
                    className="hero-img"
                  />
                  <div className="hero-badge-floating">
                    <span>Since 2026</span>
                  </div>
                </div>
              </Col>

              <Col lg={6} className="order-lg-0">
                <div className="hero-content ps-lg-4">
                  <span className="hero-eyebrow">WELCOME TO</span>
                  <h1
                    className="display-4 fw-bold mb-4"
                    style={{ color: "#424242" }}
                  >
                    Vid & <span style={{ color: "#1a3305" }}>Food</span>
                  </h1>
                  <p
                    className="lead text-muted mb-4"
                    style={{ fontSize: "1.1rem", lineHeight: "1.8" }}
                  >
                    We redefine the experience of enjoying wine. We are your
                    digital bridge between the finest wineries and your table.
                    Combine tradition and technology with our{" "}
                    <strong>Sommelier AI</strong> to find the perfect pairing in
                    seconds.
                  </p>
                  <div className="d-flex gap-3">
                    <Button
                      variant="dark"
                      className="rounded-pill px-4 py-2"
                      onClick={() => navigate("/sommelier-ai")}
                    >
                      Try AI
                    </Button>
                    <Button
                      variant="outline-dark"
                      className="rounded-pill px-4 py-2"
                      onClick={() => navigate("/wines")}
                    >
                      View Wines
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        <section id="featured-section" className="featured-section-header mt-5">
          <div className="header-content text-center">
            <span className="header-eyebrow">SELECTION OF THE MONTH</span>
            <h2 className="header-title">Explore Featured Wines</h2>
            <div className="header-separator"></div>
            <p className="header-subtitle">
              Curated by our expert sommeliers for your delight.
            </p>
          </div>
        </section>

        <div className="home-content pb-5">
          <section className="home-wines-section">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-danger" role="status"></div>
              </div>
            ) : (
              <Container className="mb-5 pb-4">
                <Swiper
                  modules={[Autoplay, Pagination, Navigation]}
                  spaceBetween={50}
                  autoplay={{ delay: 4000, disableOnInteraction: false }}
                  pagination={{ clickable: true }}
                  navigation
                  watchOverflow={true}
                  breakpoints={{
                    0: {
                      slidesPerView: 1,
                      slidesPerGroup: 1,
                      centeredSlides: true,
                      loop: winesFeatured.length >= 2,
                    },
                    720: {
                      slidesPerView: 2,
                      slidesPerGroup: 2,
                      centeredSlides: true,
                      loop: winesFeatured.length >= 4,
                    },
                    1024: {
                      slidesPerView: 3,
                      slidesPerGroup: 3,
                      centeredSlides: false, 
                      loop: canLoop, 
                    },
                  }}
                  className="pb-5 vf-swiper"
                >
                  {winesFeatured.map((wine) => (
                    <SwiperSlide key={wine.id}>
                      <CardHome
                        {...wine}
                        nombre={wine.name}
                        img={wine.imageUrl}
                        bodega={wine.wineryName}
                        precio={wine.price}
                        rating={wine.averageScore}
                        isHorizontal={false}
                        onClick={() => handleClickWineSwiper(wine)}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Container>
            )}
          </section>

          <div className="section-divider"></div>
          <NewsletterBanner />
          <div className="section-divider"></div>
          <MatchBanner />
          <div className="section-divider"></div>

          <Footer />
        </div>
      </main>
    </div>
  );
};

export default PrincipalPage;
