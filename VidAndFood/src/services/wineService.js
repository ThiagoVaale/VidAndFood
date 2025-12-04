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

export async function fetchAllWines() {
  const res = await fetch(`${API_BASE_URL}/Wine/all-wines`, {
    method: "GET",
  });
  return handleResponse(res);
}

export async function toggleFavoriteWine(wineId) {
  if (!wineId) {
    throw new Error("wineId es requerido para marcar favorito");
  }

  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    throw new Error("Usuario no autenticado");
  }

  const response = await fetch(`${API_BASE_URL}/WineUser/${wineId}/favorite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}

export async function fetchFavoriteWines() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    throw new Error("Usuario no autenticado");
  }

  const response = await fetch(`${API_BASE_URL}/WineUser/favorites`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
}

export async function deleteFavoriteWine(wineId) {
  if (!wineId) {
    throw new Error("wineId es requerido para eliminar favorito");
  }

  const token = localStorage.getItem(TOKEN_KEY);
  
  if (!token) {
    throw new Error("Usuario no autenticado");
  }

  const response = await fetch(`${API_BASE_URL}/WineUser/${wineId}/favorite`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}
