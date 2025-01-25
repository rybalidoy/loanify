import api from "../config/api";

const apiPrefix = 'api/users';

export const fetchUser = async (id) => await api.get(`${apiPrefix}/${id}`);
export const fetchUsers = async (payload) => await api.get(apiPrefix, { params: payload});
export const create = async (payload) => await api.post(apiPrefix, payload);
export const update = async (id, payload) => await api.post(`${apiPrefix}/${id}`, payload);
export const deleteUser = async (id) => await api.delete(`${apiPrefix}/${id}`);
export const updateUserStatus = async (id, payload) => await api.post(`${apiPrefix}/${id}/status`, payload);