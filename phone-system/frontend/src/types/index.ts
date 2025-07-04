export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'support' | 'client';
  clientId?: string;
}

export interface Client {
  id: string;
  clientCode: string;
  name: string;
  businessName: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  status: 'active' | 'suspended' | 'inactive';
  billingCycle: 'monthly' | 'quarterly' | 'annual';
  creditLimit: number;
  currentBalance: number;
  metadata?: Record<string, any>;
  settings?: {
    autoRecharge?: boolean;
    autoRechargeAmount?: number;
    autoRechargeThreshold?: number;
    notifications?: {
      email?: boolean;
      sms?: boolean;
      lowBalance?: boolean;
      highUsage?: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface PhoneNumber {
  id: string;
  phoneNumber: string;
  type: 'local' | 'toll_free' | 'mobile';
  status: 'active' | 'suspended' | 'released';
  displayName?: string;
  description?: string;
  monthlyFee: number;
  capabilities: {
    voice?: boolean;
    sms?: boolean;
    mms?: boolean;
    fax?: boolean;
  };
  configuration?: {
    voiceUrl?: string;
    smsUrl?: string;
    voiceFallbackUrl?: string;
    smsFallbackUrl?: string;
    statusCallbackUrl?: string;
  };
  provisionedAt: string;
  clientId: string;
  client?: Client;
}

export interface UsageRecord {
  id: string;
  type: 'inbound_call' | 'outbound_call' | 'inbound_sms' | 'outbound_sms' | 'inbound_mms' | 'outbound_mms';
  from?: string;
  to?: string;
  duration: number;
  quantity: number;
  cost: number;
  createdAt: string;
  phoneNumberId: string;
  clientId: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  status: 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled';
  billingPeriodStart: string;
  billingPeriodEnd: string;
  dueDate: string;
  subtotal: number;
  taxAmount: number;
  taxRate: number;
  totalAmount: number;
  paidAmount: number;
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
    category: string;
  }>;
  usageSummary?: {
    totalCalls?: number;
    totalCallMinutes?: number;
    totalSms?: number;
    totalMms?: number;
    byPhoneNumber?: Array<{
      phoneNumber: string;
      calls: number;
      minutes: number;
      sms: number;
      mms: number;
      cost: number;
    }>;
  };
  createdAt: string;
  clientId: string;
  client?: Client;
}

export interface Payment {
  id: string;
  paymentNumber: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  method: 'credit_card' | 'bank_transfer' | 'check' | 'cash' | 'other';
  amount: number;
  referenceNumber?: string;
  notes?: string;
  createdAt: string;
  processedAt?: string;
  clientId: string;
  invoiceId?: string;
}

export interface UsageStats {
  totalCalls: number;
  totalMinutes: number;
  totalSms: number;
  totalMms: number;
  totalCost: number;
  byType: Record<string, {
    count: number;
    duration?: number;
    cost: number;
  }>;
  byPhoneNumber: Array<{
    phoneNumber: string;
    displayName?: string;
    calls: number;
    minutes: number;
    sms: number;
    mms: number;
    cost: number;
  }>;
}