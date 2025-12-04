import Wines from "../wines/Wines";
import "./principalPage.css";
import NewsletterBanner from "../banners/NewsletterBanner";
import MatchBanner from "../banners/MatchBanner";
import Footer from "../ui/footer/Footer";
import { useContext } from "react";
import WineContext from "../../services/context/winesContext/WinesContext";

const PrincipalPage = () => {
  const { wines } = useContext(WineContext);
  console.log(wines)
  return (
    <div className="root-style">
      <main
        style={{
          flexGrow: 1,
          minHeight: "90vh",
        }}
      >
        <div className="p-4 pt-5 home-content">
          
          <section className="home-wines-section mt-5">
            <h2 className="home-section-title">Explora vinos destacados</h2>
            <div className="home-wines-grid">
              <Wines wines={wines} isHorizontal={false}/>
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
