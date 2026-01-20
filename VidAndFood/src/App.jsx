import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { Navigate, Route, Routes } from "react-router-dom";
import "./components/principalPage/principalPage.css";
import WineDetailPage from "./components/ui/wine-detail/WineDetailPage";
import AuthModal from "./components/ui/auth-modal/AuthModal";
import MyWinesPage from "./components/ui/my-wines/MyWinesPage";
import SettingPage from "./components/ui/setting/SettingPage";
import HistoryPage from "./components/ui/history/HistoryPage";
import AdminRoute from "./router/AdminRoute";
import SysAdminPage from "./components/ui/sys-admin/SysAdminPage";
import SessionWatcher from "./components/auth/SessionWatcher";
import RoleRoute from "./routes/roleRoute/RoleRoute";
import HomePage from "./components/ui/home/homePage/HomePage";
import WinesPage from "./components/winesPage/WinesPage";
import SommelierAI from "./components/ui/somellierAi/somellier-ai";
import { useContext } from "react";
import GlobalLoadingContext from "./services/context/globalLoadingContext/GlobalLoadingContext";
import GlobalLoaderOverlay from "./components/ui/spinner/GlobalLoaderOverlay";

function App() {
  const { loading, message } = useContext(GlobalLoadingContext);

  return (
    <>
      <GlobalLoaderOverlay loading={loading} message={message} />

      <AuthModal />
      <SessionWatcher />

      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/wines" element={<WinesPage />} />
        <Route path="/wines/:wineId" element={<WineDetailPage />} />

        <Route
          path="/my-wines"
          element={
            <RoleRoute allowedRoles={["Sommelier", "Admin"]}>
              <MyWinesPage />
            </RoleRoute>
          }
        />

        <Route
          path="/sommelier-ai"
          element={
            <RoleRoute allowedRoles={["Sommelier", "Admin"]}>
              <SommelierAI />
            </RoleRoute>
          }
        />

        <Route
          path="/history"
          element={
            <RoleRoute allowedRoles={["User", "Admin"]}>
              <HistoryPage />
            </RoleRoute>
          }
        />
        <Route path="/setting" element={<SettingPage />} />
        <Route
          path="/sys-admin"
          element={
            <AdminRoute>
              <SysAdminPage />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
