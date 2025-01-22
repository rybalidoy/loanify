import api from "../config/api";

const apiPrefix = 'api/companies';

export const fetchCompany = async (id) => await api.get(`${apiPrefix}/${id}`);
export const fetchCompanies = async (payload) => await api.get(apiPrefix, { payload });
export const getMaxCompanyId = async () => await api.get(`${apiPrefix}/max-id`);
export const create = async (payload) => await api.post(apiPrefix, payload);
export const update = async (id, payload) => await api.post(`${apiPrefix}/${id}`, payload);
export const deleteCompany = async (id) => await api.delete(`${apiPrefix}/${id}`);
export const updateCompanyStatus = async (id, payload) => await api.post(`${apiPrefix}/${id}/status`, payload);