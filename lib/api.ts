// API client for UMKM Go Digital backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export interface BusinessData {
  businessName: string;
  ownerName: string;
  description: string;
  category: 'restaurant' | 'retail' | 'service' | 'other';
  products: string;
  phone: string;
  email?: string;
  address: string;
  whatsapp?: string;
  instagram?: string;
  logoUrl?: string;
}

export interface SubmitBusinessResponse {
  success: boolean;
  businessId: string;
  subdomain: string;
  status: string;
  message: string;
  url?: string;
  deployedAt?: number;
}

export interface BusinessStatus {
  businessId: string;
  subdomain: string;
  domain?: string;
  status: 'processing' | 'live' | 'error';
  businessName: string;
  websiteUrl?: string;
  processingTime?: number;
  createdAt: number;
  deployedAt?: number;
  error?: string;
  message: string;
  progress: string;
  deploymentMethod?: string;
}

export interface BusinessInfo {
  id: string;
  businessName: string;
  ownerName: string;
  description: string;
  category: string;
  products: string;
  phone: string;
  email?: string;
  address: string;
  whatsapp?: string;
  instagram?: string;
  logoUrl?: string;
  websiteUrl?: string;
  subdomain: string;
  status: string;
  createdAt: number;
  deployedAt?: number;
  googleMapsUrl: string;
  whatsappUrl: string;
  instagramUrl: string;
}

// Submit business data
export async function submitBusiness(data: BusinessData): Promise<SubmitBusinessResponse> {
  const response = await fetch(`${API_BASE_URL}/submit-business`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to submit business');
  }

  return response.json();
}

// Get business status
export async function getBusinessStatus(businessId: string): Promise<BusinessStatus> {
  const response = await fetch(`${API_BASE_URL}/get-status?businessId=${businessId}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get status');
  }

  return response.json();
}

// Get business information
export async function getBusinessInfo(businessId: string): Promise<BusinessInfo> {
  const response = await fetch(`${API_BASE_URL}/get-business?businessId=${businessId}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get business info');
  }

  return response.json();
}

// Get business information from businesses
export async function getBusinessInfoNeo(businessId: string): Promise<BusinessInfo> {
  const response = await fetch(`${API_BASE_URL}/get-business-neo?businessId=${businessId}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get business info');
  }

  return response.json();
}

// Get business by subdomain
export async function getBusinessBySubdomain(subdomain: string): Promise<BusinessInfo> {
  const response = await fetch(`${API_BASE_URL}/get-business?subdomain=${subdomain}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get business info');
  }

  return response.json();
} 

export async function generateImage(prompt: string, businessData?: any): Promise<string | string[]> {
  const response = await fetch(`${API_BASE_URL}/generate-image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, businessData }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to generate image');
  }

  const data = await response.json();
  
  // Return images array if business images were generated, otherwise single image URL
  if (data.images && Array.isArray(data.images)) {
    return data.images;
  }
  
  return data.imageUrl || data.url || '';
}