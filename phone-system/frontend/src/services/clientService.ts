import api from './api';
import { Client } from '../types';

export const clientService = {
  async getClients(params?: {
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const response = await api.get('/clients', { params });
    return response.data;
  },

  async getClient(id: string) {
    const response = await api.get(`/clients/${id}`);
    return response.data.client;
  },

  async getClientByCode(code: string) {
    const response = await api.get(`/clients/code/${code}`);
    return response.data.client;
  },

  async createClient(data: Partial<Client>) {
    const response = await api.post('/clients', data);
    return response.data.client;
  },

  async updateClient(id: string, data: Partial<Client>) {
    const response = await api.put(`/clients/${id}`, data);
    return response.data.client;
  },
};