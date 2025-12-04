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

export default function applyFilters(wines, filters = {}) {
  if (!Array.isArray(wines)) return [];

  return wines.filter((wine) => {
    const priceFilter = filters.price;
    if (priceFilter) {
      const price = Number(wine.price ?? 0);

      if (Number.isFinite(price)) {
        if (priceFilter.min != null && price < priceFilter.min) return false;
        if (priceFilter.max != null && price > priceFilter.max) return false;
      }
    }

    if (filters.rating) {
      const minRating = Number(filters.rating);
      const rating = Number(wine.averageScore ?? 0);

      if (!Number.isNaN(minRating) && rating < minRating) {
        return false;
      }
    }

    if (Array.isArray(filters.brand) && filters.brand.length > 0) {
      const selectedBrands = new Set(filters.brand); // valores slug
      const winerySlug = slugify(wine.wineryName);
      if (!selectedBrands.has(winerySlug)) {
        return false;
      }
    }

    if (Array.isArray(filters.region) && filters.region.length > 0) {
      const selectedRegions = new Set(filters.region);
      const regionSlug = slugify(wine.regionName);
      if (!selectedRegions.has(regionSlug)) {
        return false;
      }
    }

    if (Array.isArray(filters.grape) && filters.grape.length > 0) {
      const selectedGrapes = new Set(filters.grape);

      let wineGrapes = [];
      if (Array.isArray(wine.grapeNames)) {
        wineGrapes = wine.grapeNames;
      } else if (typeof wine.grapeNames === "string") {
        wineGrapes = wine.grapeNames.split(","); // ej: "Malbec, Cabernet Sauvignon"
      }

      const grapeSlugs = wineGrapes.map((g) => slugify(g));
      const hasAnySelected = grapeSlugs.some((g) => selectedGrapes.has(g));

      if (!hasAnySelected) {
        return false;
      }
    }

    return true;
  });
}

export { slugify };
