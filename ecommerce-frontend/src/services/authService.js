import api from './api';

const authService = {
    async login(username, password) {
        const response = await api.post('/auth/login', { username, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    async register(userData) {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated() {
        return !!localStorage.getItem('token');
    },

    hasRole(role) {
        const user = this.getCurrentUser();
        return user?.roles?.includes(role) || false;
    },

    isAdmin() {
        return this.hasRole('ROLE_ADMIN');
    }
};

export default authService;
