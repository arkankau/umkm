export interface BusinessData {
  businessName: string;
  ownerName: string;
  description: string;
  category: string;
  products: string;
  phone: string;
  address: string;
  email?: string;
  whatsapp?: string;
  instagram?: string;
}

export interface GeneratedWebsite {
  html: string;
  css: string;
  js: string;
  assets: {
    images: string[];
  };
  metadata: {
    generatedAt: string;
    version: number;
    businessData: BusinessData;
    lastPrompt?: string;
  };
}

export interface AIWebsiteResponse {
  html: string;
  css: string;
  js: string;
  success: boolean;
  error?: string;
  explanation?: string;
} 