// Devuelve localStorage si es seguro usarlo; si no, null
export const getSafeStorage = () => {
  if (typeof window === "undefined") return null;

  try {
    const storage = window.localStorage;

    // Test mínimo para disparar SecurityError si está bloqueado
    const testKey = "__vidandfood_test__";
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);

    return storage;
  } catch {
    return null;
  }
};

export const safeGetItem = (key) => {
  const storage = getSafeStorage();
  if (!storage) return null;

  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
};

export const safeSetItem = (key, value) => {
  const storage = getSafeStorage();
  if (!storage) return;

  try {
    storage.setItem(key, value);
  } catch {
    // opcional: console.warn("No se pudo guardar en storage", err);
  }
};

export const safeRemoveItem = (key) => {
  const storage = getSafeStorage();
  if (!storage) return;

  try {
    storage.removeItem(key);
  } catch {
    // opcional: log
  }
};
