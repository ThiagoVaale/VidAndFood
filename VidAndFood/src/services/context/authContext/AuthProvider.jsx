import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import * as authService from "../../authServices";
import { mapClaimsToUser, parseJwt } from "../../../utils/jwt";

const TOKEN_KEY = "vf-token";
const USER_KEY = "vf-user";

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }

    const savedToken = localStorage.getItem(TOKEN_KEY);
    if (savedToken) {
      const claims = parseJwt(savedToken);
      return mapClaimsToUser(claims);
    }

    return null;
  });
  const [token, setToken] = useState(
    () => localStorage.getItem(TOKEN_KEY) || null
  );

  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login");

  const isAuthenticated = !!token;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

 const onLogin = (tokenOrUser, existingToken) => {
  if (typeof tokenOrUser === "string") {
    const tokenValue = tokenOrUser;

    setToken(tokenValue);

    const claims = parseJwt(tokenValue);
    const userData = mapClaimsToUser(claims);

    setUser(userData);
    setIsAuthModalOpen(false);
    return;
  }

  if (tokenOrUser && typeof tokenOrUser === "object") {
    const updatedUser = tokenOrUser;

    if (existingToken) {
      setToken(existingToken);
    }

    setUser(updatedUser);
    setIsAuthModalOpen(false);
    return;
  }

  console.error("onLogin recibió un valor inválido:", tokenOrUser);
};

  const onLogout = () => {
    setUser(null);
    setToken(null);
    setIsAuthModalOpen(false);
    setAuthModalMode("login");
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }

    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user, token]);

  const loginRequest = async ({ email, password }) => {
    const loginUser = await authService.loginRequest({ email, password });
    const tokenValue = loginUser.token

    if (!tokenValue) {
      throw new Error("No se recibió token desde el backend");
    }

    onLogin(tokenValue);

    return { token: tokenValue };
  };

  const registerRequest = async ({ email, password, fullName }) => {
    await authService.registerRequest({ email, password, fullName })
    
    const loginData = await authService.loginRequest({ email, password });
    const tokenValue = loginData.token;

    if (!tokenValue) {
      throw new Error("No se recibió token desde el backend");
    }
  
    onLogin(tokenValue);

    return { token: tokenValue };
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
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
