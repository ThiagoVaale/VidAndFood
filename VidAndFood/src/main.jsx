import { StrictMode } from "react";
import App from "./App.jsx";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AuthContextProvider from "./services/context/authContext/AuthProvider.jsx";
import GlobalLoadingProvider from "./services/context/globalLoadingContext/GlobalLoadingProvider.jsx";
import WishlistProvider from "./services/context/wishListContext/WishListProvider.jsx";
import ResponseContextProvider from "./services/context/responseContext/ResponseProvider.jsx";
import WineProvider from "./services/context/winesContext/WineProvider.jsx";
import HistoryProvider from "./services/context/historyContext/HistoryProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ResponseContextProvider>
        <GlobalLoadingProvider>
          <AuthContextProvider>
            <WineProvider>
              <WishlistProvider>
                <HistoryProvider>
                  <App />
                </HistoryProvider>
              </WishlistProvider>
            </WineProvider>
          </AuthContextProvider>
        </GlobalLoadingProvider>
      </ResponseContextProvider>
    </BrowserRouter>
  </StrictMode>
);
