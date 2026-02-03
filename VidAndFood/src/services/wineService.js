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

export async function fetchWinesFeatured() {
  const res = await fetch(`${API_BASE_URL}/Wine/wine-of-month`, {
    method: "GET"
  });
  return handleResponse(res);
}

export async function fetchWineById(wineId) {
  const res = await fetch(`${API_BASE_URL}/Wine/${wineId}`, {
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

export async function rateWine(wineId, rating, comment) {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) throw new Error("Usuario no autenticado");

  const response = await fetch(`${API_BASE_URL}/Wine/${wineId}/rate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ 
      "score": rating,
      "review": comment
     }),
  });

  return handleResponse(response);
}

export async function rateChange(wineId, rating, comment) {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) throw new Error("Usuario no autenticado");

  const response = await fetch(`${API_BASE_URL}/Wine/${wineId}/rate-change`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ 
      "score": rating,
      "review": comment
     }),
  });

  return handleResponse(response);
}

export async function deleteReview(wineId) {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) throw new Error("Usuario no autenticado");

  const response = await fetch(`${API_BASE_URL}/Wine/${wineId}/rate-delete` , {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    },
  });

  return handleResponse(response);
}

export async function fetchAddWineAdmin(wine){
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) throw new Error("Usuario no autenticado");

  const response = await fetch(`${API_BASE_URL}/Wine/admin-create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ 
      "name": wine.name,
      "wineryName": wine.wineryName,
      "regionName": wine.regionName,
      "vintageYear": wine.vintageYear,
      "price": wine.price,
      "description": wine.description,
      "imageUrl": wine.imageUrl,
      "grapes": wine.grapes
     }),
  });

  return handleResponse(response);
}

export async function fetchUpdateWineAdmin(wine, wineId){
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) throw new Error("Usuario no autenticado");

  const response = await fetch(`${API_BASE_URL}/Wine/admin-update/${wineId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ 
      "name": wine.name,
      "wineryName": wine.wineryName,
      "regionName": wine.regionName,
      "vintageYear": wine.vintageYear,
      "price": wine.price,
      "description": wine.description,
      "imageUrl": wine.imageUrl,
      "grapes": wine.grapes
     }),
  });

  return handleResponse(response);
}

export async function fetchDeleteWineAdmin(wineId) {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) throw new Error("Usuario no autenticado");

  const response = await fetch(`${API_BASE_URL}/Wine/admin-delete/${wineId}` , {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    },
  });

  return handleResponse(response);
}