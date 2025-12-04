import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import GlobalLoaderOverlay from "../../../components/ui/spinner/GlobalLoaderOverlay";
import * as authService from "../../authServices";

const tokenValue = localStorage.getItem("vf-token");

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(tokenValue);
  const [loading, setLoading] = useState(true);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login");

  useEffect(() => {
    const savedUser = localStorage.getItem("vf-user");
    const savedToken = localStorage.getItem("vf-token");

    setTimeout(() => {
      if (savedUser && savedToken) {
        try{
          setUser(JSON.parse(savedUser));
          setToken(savedToken);
        } catch {
          localStorage.removeItem("vf-user")
          localStorage.removeItem("vf-token")
        }
      }
      setLoading(false);
    }, 1000);
  }, []);

  const isAuthenticated = !!token;

  const onLogin = (userData, tokenValue) => {
    setUser(userData);
    setToken(tokenValue);
  };

  const onLogout = () => {
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    if(user && token){
      localStorage.setItem("vf-user", JSON.stringify(user));
      localStorage.setItem("vf-token", token);
    } else {
      localStorage.removeItem("vf-user");
      localStorage.removeItem("vf-token");
    }
  }, [user, token]);

  const loginRequest = async ({ email, password }) => {
    const loginUser = await authService.loginRequest({ email, password });
    const tokenValue = loginUser.token

    if (!tokenValue) {
      throw new Error("No se recibió token desde el backend");
    }

    const userData = { email }

    onLogin(userData, tokenValue);

    return { user: userData, token: tokenValue };
  };

  const registerRequest = async ({ email, password, fullName }) => {
    const registerUser = await authService.registerRequest({ email, password, fullName })
    
    const loginData = await authService.loginRequest({ email, password });
    const tokenValue = loginData.token;

    if (!tokenValue) {
      throw new Error("No se recibió token desde el backend");
    }
    
    const userData = {
      id: registerUser.id,
      email: registerUser.email,
      name: registerUser.fullName,
      role: registerUser.role,
      isActive: registerUser.isActive,
    };

    onLogin(userData, tokenValue);

    return { user: userData , token: tokenValue };
  };

  const openAuthModal = (mode = "login") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const switchMode = () => {
    setAuthModalMode((prev) => (prev === "login" ? "register" : "login"));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        onLogin,
        onLogout,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        switchMode,

        loginRequest,
        registerRequest,
      }}
    >
      {loading ? (
        <GlobalLoaderOverlay loading={loading} message={"Aguarde un momento"} />
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
