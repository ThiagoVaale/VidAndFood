const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TOKEN_KEY = "vf-token";

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.message || "Error al comunicarse con el servidor";
    throw new Error(message);
  }

  return data;
}

export async function fetchHistoryWines() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    throw new Error("Usuario no autenticado");
  }

  const response = await fetch(`${API_BASE_URL}/WineUser/history`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}

export async function addWineToHistory(wineId) {
  if (!wineId) {
    throw new Error("wineId es requerido para agregar al historial");
  }

  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    throw new Error("Usuario no autenticado");
  }

  const response = await fetch(
    `${API_BASE_URL}/WineUser/${wineId}/history`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return handleResponse(response);
}

export async function deleteWineFromHistory(wineId) {
  if (!wineId) {
    throw new Error("wineId es requerido para eliminar del historial");
  }

  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    throw new Error("Usuario no autenticado");
  }

  const response = await fetch(
    `${API_BASE_URL}/WineUser/${wineId}/history`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return handleResponse(response);
}
