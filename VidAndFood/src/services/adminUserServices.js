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

export async function fecthAllUsers() {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    throw new Error("Usuario no autenticado");
  }
  
  const response = await fetch(`${API_BASE_URL}/User/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}

export async function createGrape(grapeName) {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    throw new Error("Usuario no autenticado");
  }

  const response = await fetch(`${API_BASE_URL}/Grape/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ "name": grapeName })
  });

  return handleResponse(response); 
}

export async function updateGrape(grapeId, grapeName) {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    throw new Error("Usuario no autenticado");
  }

  const response = await fetch(`${API_BASE_URL}/Grape/update/${grapeId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ "name": grapeName })
  });

  return handleResponse(response); 
}

export async function deleteUserAdmin(selectedUserId) {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    throw new Error("Usuario no autenticado");
  }
  
  const response = await fetch(`${API_BASE_URL}/User/delete/${selectedUserId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}

export async function deleteGrapeAdmin(selectedGrapeId) {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    throw new Error("Usuario no autenticado");
  }
  
  const response = await fetch(`${API_BASE_URL}/Grape/delete/${selectedGrapeId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}