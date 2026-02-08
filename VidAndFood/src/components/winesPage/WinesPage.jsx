import { useContext, useEffect, useMemo, useState } from "react";
import WineContext from "../../services/context/winesContext/WinesContext";
import WishListContext from "../../services/context/wishListContext/WishListContext";
import applyFilters from "../../utils/ApplyFilters";
import CustomNavbar from "../ui/nav-bar/CustomNavbar";
import GenericSidebarFilter from "../../components/common/generic-sideBar-filter";
import Wines from "../wines/Wines";
import WineSearch from "../ui/wineSearch/WineSearch";
import { useNavigate } from "react-router-dom";
import "./winesPage.css";

const slugify = (str) => {
  if (!str) return "";
  return str
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_");
};

const BASE_WINE_FILTERS = [
  {
    id: "price",
    type: "range",
    title: "Price",
    isCollapsed: false,
    options: { min: 0, max: 200000, step: 1000, unit: "ARS" },
  },
  {
    id: "brand",
    type: "checkbox",
    title: "Winery",
    isCollapsed: false,
    options: [],
  },
  {
    id: "type",
    type: "checkbox",
    title: "Wine Types",
    isCollapsed: true,
    options: [
      { id: "tinto", value: "tinto", label: "Red", count: 0 },
      { id: "blanco", value: "blanco", label: "White", count: 0 },
      { id: "rosado", value: "rosado", label: "Rose", count: 0 },
      { id: "espumante", value: "espumante", label: "Sparkling", count: 0 },
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
    options: [],
  },
  {
    id: "grape",
    type: "checkbox",
    title: "Grapes",
    isCollapsed: true,
    options: [],
  },
];

const WinesPage = () => {
  const { wines, loadWines, winesLoaded, isLoadingWines } = useContext(WineContext);
  const { isFavorite, toggleFavorite } = useContext(WishListContext);

  const [filters, setFilters] = useState({});
  const [filtersConfig, setFiltersConfig] = useState(BASE_WINE_FILTERS);

  const navigate = useNavigate();

  useEffect(() => {
    if (!winesLoaded && !isLoadingWines) {
      loadWines();
    }

    if (!Array.isArray(wines) || wines.length === 0) return;

    const winerySet = new Map();
    const regionSet = new Map();
    const grapeSet = new Map();

    wines.forEach((wine) => {
      if (wine.wineryName) {
        const slug = slugify(wine.wineryName);
        const prev = winerySet.get(slug) || {
          label: wine.wineryName,
          count: 0,
        };
        winerySet.set(slug, { label: prev.label, count: prev.count + 1 });
      }

      if (wine.regionName) {
        const slug = slugify(wine.regionName);
        const prev = regionSet.get(slug) || {
          label: wine.regionName,
          count: 0,
        };
        regionSet.set(slug, { label: prev.label, count: prev.count + 1 });
      }

      if (wine.grapeNames) {
        const grapesArray = Array.isArray(wine.grapeNames)
          ? wine.grapeNames
          : wine.grapeNames.split(",");
        grapesArray.forEach((g) => {
          const trimmed = g.trim();
          if (!trimmed) return;
          const slug = slugify(trimmed);
          const prev = grapeSet.get(slug) || { label: trimmed, count: 0 };
          grapeSet.set(slug, { label: prev.label, count: prev.count + 1 });
        });
      }
    });

    const wineryOptions = Array.from(winerySet.entries()).map(
      ([value, data]) => ({
        id: value,
        value,
        label: data.label,
        count: data.count,
      }),
    );

    const regionOptions = Array.from(regionSet.entries()).map(
      ([value, data]) => ({
        id: value,
        value,
        label: data.label,
        count: data.count,
      }),
    );

    const grapeOptions = Array.from(grapeSet.entries()).map(
      ([value, data]) => ({
        id: value,
        value,
        label: data.label,
        count: data.count,
      }),
    );

    setFiltersConfig((prev) =>
      prev.map((f) => {
        if (f.id === "brand") {
          return { ...f, options: wineryOptions };
        }
        if (f.id === "region") {
          return { ...f, options: regionOptions };
        }
        if (f.id === "grape") {
          return { ...f, options: grapeOptions };
        }
        return f;
      }),
    );
  }, [winesLoaded, isLoadingWines, loadWines, wines]);

  // --- LÓGICA DE FILTRADO Y ORDENAMIENTO ---
  const filteredWines = useMemo(() => {
    const { rating, ...otherFilters } = filters;

    // 1. Aplicar filtros generales
    let result = applyFilters(wines, otherFilters);

    // 2. Lógica de Rating
    if (typeof rating === "number" && rating > 0) {
      // Si hay filtro, mostrar solo ese rango específico (4.0 a 4.9)
      result = result.filter((wine) => {
        const score = wine.averageScore || 0;
        return Math.floor(score) === rating;
      });
    } else {
      // Si NO hay filtro de rating, ordenar por puntaje descendente (Mejor a Peor)
      result = [...result].sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0));
    }

    return result;
  }, [wines, filters]);

  const handleSelectWine = (wine) => {
    navigate(`/wines/${wine.id}`);
  };

  return (
    <>
      <CustomNavbar />

      <div className="main-style">
        <GenericSidebarFilter
          filters={filtersConfig}
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
          <div className="wine-search-bar">
            <WineSearch wines={wines} onSelectWine={handleSelectWine} />
          </div>

          <div className="wine-search-bar">
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
};

export default WinesPage;