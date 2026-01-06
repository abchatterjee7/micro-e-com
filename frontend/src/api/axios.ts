import axios from 'axios';
import keycloak from '../keycloak';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:8095',
});

api.interceptors.request.use(async (config) => {
    if (keycloak.token) {
        // Refresh token if it's expired or about to expire (within 30 seconds)
        try {
            await keycloak.updateToken(30);
            config.headers.Authorization = `Bearer ${keycloak.token}`;
        } catch (error) {
            console.error('Failed to update token', error);
            keycloak.login();
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn('Unauthorized request, redirecting to login');
            keycloak.login();
        }
        return Promise.reject(error);
    }
);

export default api;
