import api from './api';
import { UsageStats } from '../types';

export const usageService = {
  async getClientUsageStats(
    clientId: string,
    startDate: string,
    endDate: string
  ): Promise<UsageStats> {
    const response = await api.get(`/usage/stats/${clientId}`, {
      params: { startDate, endDate },
    });
    return response.data.stats;
  },

  async getPhoneNumberUsage(
    phoneNumberId: string,
    startDate: string,
    endDate: string,
    options?: {
      type?: string;
      limit?: number;
      offset?: number;
    }
  ) {
    const response = await api.get(`/usage/phone-number/${phoneNumberId}`, {
      params: { startDate, endDate, ...options },
    });
    return response.data;
  },
};