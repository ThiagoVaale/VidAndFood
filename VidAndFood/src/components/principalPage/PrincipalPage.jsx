import Wines from "../wines/Wines";
import "./principalPage.css";
import NewsletterBanner from "../banners/NewsletterBanner";
import MatchBanner from "../banners/MatchBanner";
import Footer from "../ui/footer/Footer";
import { useContext, useEffect, useState } from "react";
import { fetchWinesFeatured } from "../../services/wineService";
import ResponseContext from "../../services/context/responseContext/ResponseContext";
import { delay } from "framer-motion";

const PrincipalPage = () => {
  const { showResponse } = useContext(ResponseContext);

  const [winesFeatured, setWinesFeatured] = useState([])
  
  useEffect(() => {
    const loadWinesFeatured = async () => {
      try {
        const [wines] = await Promise.all([
          fetchWinesFeatured(),
          delay(900)
        ]);

        setWinesFeatured(wines);
        
      } catch(err){
        showResponse({
          variant: "error",
          title: "Error al cargar los vinos destacados",
          message: err.message
        });
      }
    }

    loadWinesFeatured();
  }, [])

  return (
    <div className="root-style">
      <main
        style={{
          flexGrow: 1,
          minHeight: "90vh",
        }}
      >
        <div className="p-4 pt-5 home-content">
          
          <section className="home-wines-section mt-4">
            <h2 className="home-section-title">Explore featured wines</h2>
            <div className="home-wines-grid">
              <Wines wines={winesFeatured} isHorizontal={false}/>
            </div>
          </section>

          <div className="section-divider"></div>
          
          <NewsletterBanner />
          <div className="section-divider"></div>
          <MatchBanner />

          <div className="section-divider"></div>
          <Footer/>
        </div>
      </main>
    </div>
  );
};

export default PrincipalPage;
