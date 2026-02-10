import { useContext, useEffect, useMemo, useRef, useState } from "react";
import "./wineSearch.css";
import AuthContext from "../../../services/context/authContext/AuthContext";
import WineAdminModal from "../../admin/WineAdminModal";


const WineSearch = ({ wines = [], onSelectWine, onWineCreated }) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const [showWineModal, setShowWineModal] = useState(false);
  const [wineModalMode, setWineModalMode] = useState("create");
  const [wineTarget, setWineTarget] = useState(null);

  const { user } = useContext(AuthContext);

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

  const userIsSommelier = user?.role === "Sommelier";

   const handleOpenCreateWine = () => {
    setOpen(false);
    setWineModalMode("create");
    setWineTarget(null);
    setShowWineModal(true);
  };

  const handleCloseCreateWine = () => {
    setShowWineModal(false);
  };

  const handleSuccessCreateWine = async () => {
    await onWineCreated?.();
    setSearch("");
    setShowWineModal(false);
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
            <div className="wine-search-empty">
              <div>No wines were found</div>

              {userIsSommelier && (
                <button
                  type="button"
                  className="wine-search-create-btn"
                  onClick={handleOpenCreateWine}
                >
                  + Create wine
                </button>
              )}
            </div>
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

      <WineAdminModal
        show={showWineModal}
        mode={wineModalMode}
        wine={wineTarget}
        onClose={handleCloseCreateWine}
        onSuccess={handleSuccessCreateWine}
      />

    </div>
  );
};

export default WineSearch;
