/**
 * API client for the backend.
 * Wraps the fetch calls for authentication, analysis and model info,
 * and stores the JWT token in localStorage.
 */

const API_URL = 'http://localhost:5000';

const getToken = () => localStorage.getItem('token');

const getUser = () => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
};

const headers = (auth = true) => {
    const h = { 'Content-Type': 'application/json' };

    if (auth && getToken()) {
        h['Authorization'] = `Bearer ${getToken()}`;
    }

    return h;
};

// Parse the JSON response and throw on a non-2xx status
const handle = async (res) => {
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data.error || 'Request failed');
    }

    return data;
};

export const api = {
    register: (name, email, password) =>
        fetch(`${API_URL}/API/REGISTER`, {
            method: 'POST',
            headers: headers(false),
            body: JSON.stringify({ name, email, password })
        }).then(handle),

    login: (email, password) =>
        fetch(`${API_URL}/API/LOGIN`, {
            method: 'POST',
            headers: headers(false),
            body: JSON.stringify({ email, password })
        }).then(handle),

    analyze: (text) =>
        fetch(`${API_URL}/API/ANALYZE`, {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify({ text })
        }).then(handle),

    history: (userId) =>
        fetch(`${API_URL}/API/HISTORY/${userId}`, {
            headers: headers()
        }).then(handle),

    clearHistory: () =>
        fetch(`${API_URL}/API/CLEAR_HISTORY`, {
            method: 'POST',
            headers: headers()
        }).then(handle),

    modelInfo: () =>
        fetch(`${API_URL}/API/MODEL-INFO`)
            .then(handle),
};

export const auth = {
    getToken,
    getUser,
    isLoggedIn: () => !!getToken(),

    save: (token, user) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};
