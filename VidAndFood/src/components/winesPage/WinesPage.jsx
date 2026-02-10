import { useContext, useEffect, useMemo, useState } from "react";
import WineContext from "../../services/context/winesContext/WinesContext";
import WishListContext from "../../services/context/wishListContext/WishListContext";
import applyFilters from "../../utils/ApplyFilters";
import CustomNavbar from "../ui/nav-bar/CustomNavbar";
import GenericSidebarFilter from "../../components/common/generic-sideBar-filter";
import Wines from "../wines/Wines";
import WineSearch from "../ui/wineSearch/WineSearch";
import "./winesPage.css";
import useNavigateToWineDetail from "../../hooks/useNavigateToWineDetail";
import { wineTypeToLabel } from "../../utils/wineType";

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

const labelToFilterValue = (label) => {
  const v = slugify(label);
  if (v === "espumoso") return "espumante";
  return v;
};

const wineTypeToFilterValue = (wineTypeRaw) => {
  const label = wineTypeToLabel(wineTypeRaw);
  return labelToFilterValue(label);
};

const BASE_WINE_FILTERS = [
  {
    id: "price",
    type: "range",
    title: "Precio",
    isCollapsed: false,
    options: { min: 0, max: 200000, step: 1000, unit: "ARS" },
  },
  {
    id: "brand",
    type: "checkbox",
    title: "Bodega",
    isCollapsed: false,
    options: [],
  },
  {
    id: "type",
    type: "checkbox",
    title: "Tipo de vino",
    isCollapsed: true,
    options: [
      { id: "tinto", value: "tinto", label: "Tinto", count: 0 },
      { id: "blanco", value: "blanco", label: "Blanco", count: 0 },
      { id: "rosado", value: "rosado", label: "Rosado", count: 0 },
      { id: "espumante", value: "espumante", label: "Espumoso", count: 0 },
    ],
  },
  {
    id: "rating",
    type: "rating",
    title: "Calificación",
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
    title: "Región",
    isCollapsed: true,
    options: [],
  },
  {
    id: "grape",
    type: "checkbox",
    title: "Uvas",
    isCollapsed: true,
    options: [],
  },
];

const WinesPage = () => {
  const { wines, loadWines, winesLoaded, isLoadingWines } =
    useContext(WineContext);
  const { isFavorite, toggleFavorite } = useContext(WishListContext);

  const [filters, setFilters] = useState({});
  const [filtersConfig, setFiltersConfig] = useState(BASE_WINE_FILTERS);

  const navigateToWineDetail = useNavigateToWineDetail();

  useEffect(() => {
    if (!winesLoaded && !isLoadingWines) {
      loadWines();
    }

    if (!Array.isArray(wines) || wines.length === 0) return;

    const winerySet = new Map();
    const regionSet = new Map();
    const grapeSet = new Map();
    const typeSet = new Map();

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

      if (wine.wineType !== null && wine.wineType !== undefined) {
        const typeValue = wineTypeToFilterValue(wine.wineType);
        const prev = typeSet.get(typeValue) || { count: 0 };
        typeSet.set(typeValue, { count: prev.count + 1 });
      }

      if (Array.isArray(wine.grapes) && wine.grapes.length > 0) {
        wine.grapes.forEach((g) => {
          const nameGrape = g.name.trim();
          if (!nameGrape) {
            return;
          }

          const slug = slugify(nameGrape);
          const prev = grapeSet.get(slug) || { label: nameGrape, count: 0 };
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

    const typeOptions = Array.from(typeSet.entries()).map(([value, data]) => ({
      id: value,
      value,
      label:
        value === "tinto"
          ? "Tinto"
          : value === "blanco"
            ? "Blanco"
            : value === "rosado"
              ? "Rosado"
              : "Espumoso",
      count: data.count,
    }));

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
        if (f.id === "type") {
          const fallback = [
            { id: "tinto", value: "tinto", label: "Tinto", count: 0 },
            { id: "blanco", value: "blanco", label: "Blanco", count: 0 },
            { id: "rosado", value: "rosado", label: "Rosado", count: 0 },
            {
              id: "espumante",
              value: "espumante",
              label: "Espumoso",
              count: 0,
            },
          ];

          const merged = fallback.map((opt) => {
            const found = typeOptions.find((t) => t.value === opt.value);
            return found ? { ...opt, count: found.count } : opt;
          });

          return { ...f, options: merged };
        }
        return f;
      }),
    );
  }, [winesLoaded, isLoadingWines, loadWines, wines]);

  const filteredWines = useMemo(() => {
    const { rating, type, ...otherFilters } = filters;

    let result = applyFilters(wines, otherFilters);

    if (Array.isArray(type) && type.length > 0) {
      result = result.filter((wine) => {
        const wineTypeValue = wineTypeToFilterValue(wine.wineType);
        return type.includes(wineTypeValue);
      });
    }

    if (typeof rating === "number" && rating > 0) {
      result = result.filter((wine) => {
        const score = wine.averageScore || 0;
        return Math.floor(score) === rating;
      });
    } else {
      result = [...result].sort(
        (a, b) => (b.averageScore || 0) - (a.averageScore || 0),
      );
    }

    return result;
  }, [wines, filters]);

  const handleSelectWine = (wine) => {
    navigateToWineDetail(wine.id);
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
