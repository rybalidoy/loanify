
import api from "../config/api";

const apiPrefix = 'api';

// Auth
export const csrfCookies = (payload) => api.get('sanctum/csrf-cookie', payload);
export const login = async (payload) => await api.post(`${apiPrefix}/login`, payload);
export const register = async (payload) => await api.post(`${apiPrefix}/register`, payload);
export const logout = async (payload) => await api.post(`${apiPrefix}/logout`, payload);
export const fetchAuthenticatedUser = async() => await api.get(`${apiPrefix}/auth-user`);