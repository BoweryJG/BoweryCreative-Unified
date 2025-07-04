import api from './api';
import { Invoice, Payment } from '../types';

export const billingService = {
  async getInvoices(params?: {
    clientId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }) {
    const response = await api.get('/billing/invoices', { params });
    return response.data;
  },

  async getInvoice(id: string) {
    const response = await api.get(`/billing/invoices/${id}`);
    return response.data.invoice;
  },

  async generateInvoice(data: {
    clientId: string;
    billingPeriodStart: string;
    billingPeriodEnd: string;
  }) {
    const response = await api.post('/billing/invoices/generate', data);
    return response.data.invoice;
  },

  async recordPayment(data: {
    clientId: string;
    invoiceId?: string;
    amount: number;
    method: string;
    referenceNumber?: string;
    notes?: string;
  }) {
    const response = await api.post('/billing/payments', data);
    return response.data.payment;
  },
};