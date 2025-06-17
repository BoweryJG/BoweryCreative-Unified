// Payment-related TypeScript types for Mission Control

export interface PaymentOption {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  type: 'subscription' | 'credits' | 'service' | 'custom';
  interval?: 'monthly' | 'annual';
  features?: string[];
}

export interface SubscriptionPlan extends PaymentOption {
  type: 'subscription';
  interval: 'monthly' | 'annual';
  features: string[];
  popular?: boolean;
}

export interface CreditPackage extends PaymentOption {
  type: 'credits';
  creditAmount: number;
  pricePerCredit: number;
}

export interface ServicePackage extends PaymentOption {
  type: 'service';
  estimatedDuration?: string;
  deliverables?: string[];
}

export interface PaymentHistory {
  id: string;
  date: Date;
  amount: number;
  currency: string;
  description: string;
  status: 'succeeded' | 'pending' | 'failed' | 'refunded';
  type: 'subscription' | 'credits' | 'service';
  invoiceUrl?: string;
  receiptUrl?: string;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  clientId: string;
  clientEmail: string;
  onSuccess?: (sessionId: string) => void;
  preselectedOption?: PaymentOption;
}

export interface PaymentHistoryProps {
  clientId: string;
  limit?: number;
  showLoadMore?: boolean;
}

export interface StripeConfig {
  publishableKey: string;
  apiEndpoint: string;
}

export interface CustomPaymentForm {
  projectName: string;
  projectDescription: string;
  amount: number;
}