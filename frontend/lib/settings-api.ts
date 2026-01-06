import api from './axios';

export interface Settings {
  id: string;
  language: 'ENGLISH' | 'SPANISH' | 'PORTUGUESE';
  siteName: string;
  siteDescription?: string;
  contactEmail?: string;
  contactPhone?: string;
  supportEmail?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  whatsappNumber?: string;
  taxRate: number;
  currency: string;
  currencySymbol: string;
  exchangeRate: number;
  freeShippingThreshold: number;
  defaultShippingCost: number;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPassword?: string;
  emailFromName?: string;
  emailFromAddress?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  enableCart: boolean;
  enableWishlist: boolean;
  enableReviews: boolean;
  enableCoupons: boolean;
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export const settingsApi = {
  // Get current settings
  async getSettings(): Promise<Settings> {
    const response = await api.get('/settings');
    return response.data;
  },
};
