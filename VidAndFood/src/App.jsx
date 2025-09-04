import Wines from "./components/wines/Wines";
import { wines } from "./data/wines";
import "bootstrap/dist/css/bootstrap.min.css";
import GenericSidebarFilter from "./components/common/generic-sideBar-filter";
import { useMemo, useState } from "react";
import applyFilters from "./utils/ApplyFilters";
import CustomNavbar from "./components/nav-bar/CustomNavbar";

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
];

function App() {
  const [filters, setFilters] = useState({});

  const filteredWines = useMemo(() => applyFilters(wines, filters), [filters]);

  return (
    <>
      <CustomNavbar />
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          backgroundColor: "#fdf9f2ff",
          paddingTop: "6rem",
        }}
      >
        
        <div
          className="sidebar-container"
          style={{
            width: "400px",
            minWidth: "400px",
            flex: "0 0 400px",
            height: "100vh",
            position: "sticky",
            top: 0,
            background: "transparent",
          }}
        >
          <div
            className="sidebar-content"
            style={{
              background: "transparent",
              backgroundColor: "transparent",
            }}
          >
            <GenericSidebarFilter
              filters={wineFilters}
              value={filters}
              onChange={setFilters}
              rangeDebounceMs={120}
            />
          </div>
        </div>

        <main
          style={{
            flexGrow: 1,
            backgroundColor: "#fdf9f2ff",
            minHeight: "100vh",
          }}
        >
          <div className="p-4 pt-5">
            <Wines wines={filteredWines} />
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
