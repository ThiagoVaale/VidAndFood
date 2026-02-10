const WINE_TYPE_LABELS_ES = {
  sparkling: "Espumoso",
  red: "Tinto",
  white: "Blanco",
  rosé: "Rosado",
  rose: "Rosado", 
};

const WINE_TYPE_BY_INDEX_ES = [
  "Espumoso", 
  "Tinto",    
  "Blanco",   
  "Rosado",   
];

export function wineTypeToLabel(value) {
  if (value === null || value === undefined) return "Sin especificar";

  if (typeof value === "number") {
    return WINE_TYPE_BY_INDEX_ES[value] ?? "Sin especificar";
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    const asNumber = Number(trimmed);
    if (Number.isFinite(asNumber) && trimmed !== "") {
      return WINE_TYPE_BY_INDEX_ES[asNumber] ?? "Sin especificar";
    }

    const key = trimmed.toLowerCase();
    return WINE_TYPE_LABELS_ES[key] ?? trimmed;
  }

  return "Sin especificar";
}
