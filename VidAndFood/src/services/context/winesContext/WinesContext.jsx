import { createContext } from "react";

const WineContext = createContext({
  wines: [],
  isLoadingWines: false,
  winesError: null,
  reloadWines: () => {},
  getWineById: () => null,
});

export default WineContext;
