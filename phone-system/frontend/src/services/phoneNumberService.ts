import api from './api';
import { PhoneNumber } from '../types';

export const phoneNumberService = {
  async searchAvailableNumbers(params: {
    areaCode?: string;
    contains?: string;
    country?: string;
    type?: string;
    limit?: number;
  }) {
    const response = await api.get('/phone-numbers/available', { params });
    return response.data.numbers;
  },

  async provisionNumber(data: {
    clientId: string;
    phoneNumber: string;
    displayName?: string;
    description?: string;
    configuration?: any;
  }) {
    const response = await api.post('/phone-numbers/provision', data);
    return response.data.phoneNumber;
  },

  async getClientNumbers(clientId: string) {
    const response = await api.get(`/phone-numbers/client/${clientId}`);
    return response.data.phoneNumbers;
  },

  async getPhoneNumber(id: string) {
    const response = await api.get(`/phone-numbers/${id}`);
    return response.data.phoneNumber;
  },

  async updateConfiguration(id: string, configuration: any) {
    const response = await api.put(`/phone-numbers/${id}/configuration`, configuration);
    return response.data.phoneNumber;
  },

  async releaseNumber(id: string) {
    await api.delete(`/phone-numbers/${id}`);
  },
};