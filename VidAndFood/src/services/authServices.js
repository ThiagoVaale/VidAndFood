const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

async function handleResponse(response){
    const data = await response.json().catch(() => ({}));

    if(!response.ok){
        const message = data.message || 'Error al comunicarse con el servidor';
        throw new Error(message);
    }

    return data;
}

export async function loginRequest({ email, password }) {
    const res = await fetch(`${API_BASE_URL}/User/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    });

    return handleResponse(res);
}

export async function registerRequest({ email, password, fullName }) {
    const res = await fetch(`${API_BASE_URL}/User/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, fullName })
    })

    return handleResponse(res);
}
