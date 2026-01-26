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

export async function upgradeToSommelier(userId, newRole) {
  const token = localStorage.getItem(TOKEN_KEY);

  console.log("USERID Y NEWROLE DESDE SERVICE: ", userId, newRole)

  if (!token) {
    throw new Error("Usuario no autenticado");
  }

  const res = await fetch(`${API_BASE_URL}/User/change-role`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ "userUuid": userId, "newRole": newRole }),
  });

  return handleResponse(res);
}

export async function downgradeToUser(userId, newRole) {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    throw new Error("Usuario no autenticado");
  }

  const res = await fetch(`${API_BASE_URL}/User/change-role`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ "userUuid": userId, "newRole": newRole })
  });

  return handleResponse(res);
}
