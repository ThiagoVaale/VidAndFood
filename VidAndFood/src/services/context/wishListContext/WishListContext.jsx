import { createContext } from "react";

const WishListContext = createContext({
    favoriteIds: [],
    isFavorite: () => false,
    toggleFavorite: () => {},
    addFavorite: () => {},
    removeFavorite: () => {}
})

export default WishListContext;