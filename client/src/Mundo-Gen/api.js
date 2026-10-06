const API_URL = 'https://talkie-town-api.onrender.com';

// Lanza un Error que conserva el código HTTP (error.status) para que las
// pantallas puedan mostrar un mensaje distinto según lo que pasó.
const request = async (path, body, fallbackMessage) => {
    const response = await fetch(`${API_URL}${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    // Si el backend está caído, Render responde HTML en lugar de JSON
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const error = new Error(data.message || fallbackMessage);
        error.status = response.status;
        throw error;
    }

    return data;
};

export const registerUser = async (userData) => {
    try {
        return await request('/api/auth/register', userData, 'Error en el registro');
    } catch (error) {
        console.error('Error en registerUser:', error);
        throw error;
    }
};

export const loginUser = async (credentials) => {
    try {
        return await request('/api/auth/login', credentials, 'Login error');
    } catch (error) {
        console.error('Error en loginUser:', error);
        throw error;
    }
};

export default {
    registerUser,
    loginUser,
};
