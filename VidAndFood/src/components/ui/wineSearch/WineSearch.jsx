import { useEffect, useMemo, useRef, useState } from "react";
import "./wineSearch.css";

const WineSearch = ({ wines = [], onSelectWine }) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const wrapRef = useRef(null);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) {
      return [];
    }

    return wines.filter((w) => w.name.toLowerCase().includes(s));
  }, [search, wines]);

  useEffect(() => {
    const onMouseDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown" , onKeyDown);

    return () => {
        document.removeEventListener("mousedown", onMouseDown);
        document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const handleChange = (e) => {
    const v = e.target.value;
    setSearch(v);
    setOpen(!!v.trim());
  };

  const handleSelect = (wine) => {
    setSearch("");
    setOpen(false);
    onSelectWine?.(wine);
  };

  return (
    <div className="wine-search" ref={wrapRef}>
      <input
        className="wine-search-input"
        placeholder="Search for any wine"
        value={search}
        onChange={handleChange}
        onFocus={() => setOpen(!!search.trim())}
      />

      {open && (
        <div className="wine-search-dropdown">
          {filtered.length === 0 ? (
            <div className="wine-search-empty">No se encontraron vinos</div>
          ) : (
            filtered.map((w) => (
              <button
                key={w.id}
                type="button"
                className="wine-search-item"
                onClick={() => handleSelect(w)}
              >
                <img
                  className="wine-search-thumb"
                  src={w.imageUrl}
                  alt={w.name}
                />
                <span className="wine-search-name">{w.name}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default WineSearch;
