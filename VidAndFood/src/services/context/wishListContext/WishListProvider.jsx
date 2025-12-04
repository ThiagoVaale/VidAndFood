import { useEffect, useState } from "react";
import WishListContext from "./WishListContext";

const STORAGE_KEY = "vf-favorites";

const WishlistProvider = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      setFavoriteIds(raw ? JSON.parse(raw) : []);
    } catch {
      setFavoriteIds([]);
    }
  }, []);

  const persist = (ids) => {
    setFavoriteIds(ids);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch (error) {
      console.error("Error saving favorites to localStorage", error);
    }
  };

  const isFavorite = (id) => favoriteIds.includes(id);

  const addFavorite = (id) => {
    if (!isFavorite(id)) {
      persist([...favoriteIds, id]);
    }
  };

  const removeFavorite = (id) => {
    if (isFavorite(id)) {
      persist(favoriteIds.filter((x) => x !== id));
    }
  };

  const toggleFavorite = (id) => {
    if (isFavorite(id)) {
      removeFavorite(id);
      return false;
    } else {
      addFavorite(id);
      return true;
    }
  };

  return (
    <WishListContext.Provider
      value={{ favoriteIds, isFavorite, addFavorite, removeFavorite, toggleFavorite }}
    >
      {children}
    </WishListContext.Provider>
  );
};

export default WishlistProvider;
