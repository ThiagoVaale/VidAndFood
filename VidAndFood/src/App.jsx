import Wines from "./components/wines/Wines";
import "bootstrap/dist/css/bootstrap.min.css";
import GenericSidebarFilter from "./components/common/generic-sideBar-filter";
import { useContext, useMemo, useState } from "react";
import applyFilters from "./utils/ApplyFilters";
import CustomNavBar from "./components/ui/nav-bar/CustomNavbar";
import "./index.css";
import { Navigate, Route, Routes } from "react-router-dom";
import "./components/principalPage/principalPage.css";
import WineDetailPage from "./components/ui/wine-detail/WineDetailPage";
import AuthModal from "./components/ui/auth-modal/AuthModal";
import GlobalLoadingContext from "./services/context/globalLoadingContext/GlobalLoadingContext";
import MyWinesPage from "./components/ui/my-wines/MyWinesPage";
import WishListContext from "./services/context/wishListContext/WishListContext";
import ProfilePage from "./components/ui/profile/ProfilePage";
import SettingPage from "./components/ui/setting/SettingPage";
import PrincipalPage from "./components/principalPage/PrincipalPage";
import WineContext from "./services/context/winesContext/WinesContext";
import HistoryPage from "./components/ui/history/HistoryPage";
import AdminRoute from "./router/AdminRoute";
import SysAdminPage from "./components/ui/sys-admin/SysAdminPage";
import SessionWatcher from "./components/auth/SessionWatcher";

const wineFilters = [
  {
    id: "price",
    type: "range",
    title: "Price",
    isCollapsed: false,
    options: { min: 0, max: 20000, step: 100, unit: "ARS" },
  },
  {
    id: "brand",
    type: "checkbox",
    title: "Winery",
    isCollapsed: false,
    options: [
      { id: "catena", value: "catena", label: "Catena Zapata", count: 15 },
      { id: "trapiche", value: "trapiche", label: "Trapiche", count: 23 },
      { id: "norton", value: "norton", label: "Norton", count: 18 },
      { id: "alamos", value: "alamos", label: "Alamos", count: 12 },
      { id: "rutini", value: "rutini", label: "Rutini", count: 9 },
    ],
  },
  {
    id: "type",
    type: "checkbox",
    title: "Wine Types",
    isCollapsed: true,
    options: [
      { id: "tinto", value: "tinto", label: "Tinto", count: 45 },
      { id: "blanco", value: "blanco", label: "Blanco", count: 28 },
      { id: "rosado", value: "rosado", label: "Rosado", count: 15 },
      { id: "espumante", value: "espumante", label: "Espumante", count: 8 },
    ],
  },
  {
    id: "rating",
    type: "rating",
    title: "Calification",
    isCollapsed: false,
    options: [
      { value: 5, label: "5 estrellas" },
      { value: 4, label: "4 estrellas" },
      { value: 3, label: "3 estrellas" },
      { value: 2, label: "2 estrellas" },
      { value: 1, label: "1 estrella" },
    ],
  },
  {
    id: "region",
    type: "checkbox",
    title: "Region",
    isCollapsed: true,
    options: [
      { id: "mendoza", value: "mendoza", label: "Mendoza", count: 42 },
      { id: "sanjuan", value: "sanjuan", label: "San Juan", count: 18 },
      { id: "salta", value: "salta", label: "Salta", count: 15 },
      { id: "rionegro", value: "rionegro", label: "Río Negro", count: 8 },
      { id: "neuquen", value: "neuquen", label: "Neuquén", count: 5 },
    ],
  },

  {
    id: "grape",
    type: "checkbox",
    title: "Grapes",
    isCollapsed: true,
    options: [
      { id: "malbec", value: "malbec", label: "Malbec", count: 12 },
      { id: "chardonnay", value: "chardonnay", label: "Chardonnay", count: 20 },
      {
        id: "cabernet_sauvignon",
        value: "cabernet_sauvignon",
        label: "Cabernet Sauvignon",
        count: 10,
      },
      { id: "bonarda", value: "bonarda", label: "Bonarda", count: 8 },
      { id: "torrontés", value: "torrontés", label: "Torrontés", count: 6 },
    ],
  },
];

function HomePage() {
  return (
    <>
      <CustomNavBar />
      <PrincipalPage />
    </>
  );
}

function WinesPage() {
  const { wines } = useContext(WineContext);
  const { isFavorite, toggleFavorite } = useContext(WishListContext);

  const [filters, setFilters] = useState({});

   const filteredWines = useMemo(
    () => applyFilters(wines, filters), [wines, filters]
  );

  return (
    <>
      <CustomNavBar />
      <div className="main-style">
        <GenericSidebarFilter
          filters={wineFilters}
          value={filters}
          onChange={setFilters}
          rangeDebounceMs={120}
        />

        <main
          style={{
            flexGrow: 1,
            backgroundColor: "#fdf9f2ff",
            minHeight: "100vh",
          }}
        >
          <div className="p-4 pt-5">
            <Wines
              wines={filteredWines}
              isHorizontal={true}
              isFavorite={isFavorite}
              toggleFavorite={toggleFavorite}
              showWishListAction={true}
            />
          </div>
        </main>
      </div>
    </>
  );
}

function App() {
  return (
    <>
      <AuthModal />
      <SessionWatcher/>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/wines" element={<WinesPage />} />
        <Route path="/wines/:wineId" element={<WineDetailPage />} />
        <Route path="/my-wines" element={<MyWinesPage />} />
        <Route path="/history" element={<HistoryPage/>}/>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/setting" element={<SettingPage />} />
        <Route
          path="/sys-admin"
          element={
            <AdminRoute>
              <SysAdminPage/>
            </AdminRoute>
          }
        /> 
      </Routes>
    </>
  );
}

export default App;
