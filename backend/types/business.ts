export interface BusinessData {
  id: string;
  name: string;
  tagline?: string;
  description: string;
  logo?: string;
  featured_image?: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  address: string;
  opening_hours?: string;
  subdomain?: string;
  custom_domain?: string;
  
  // Template-specific data
  menu?: MenuCategory[];
  products?: Product[];
  services?: Service[];
  gallery?: GalleryImage[];
  social_links?: SocialLinks;
  delivery_apps?: DeliveryApp[];
  ecommerce_links?: EcommerceLink[];
  testimonials?: Testimonial[];
  why_choose_us?: WhyChooseUs[];
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

export interface MenuItem {
  name: string;
  description?: string;
  price: number;
  available: boolean;
}

export interface Product {
  name: string;
  description?: string;
  price: number;
  image?: string;
  available: boolean;
  ecommerce_links?: EcommerceProductLink[];
}

export interface Service {
  name: string;
  description: string;
  icon?: string;
  price?: number | string;
  features?: string[];
  contact_info?: {
    phone: string;
  };
}

export interface GalleryImage {
  url: string;
  caption?: string;
}

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  linkedin?: string;
}

export interface DeliveryApp {
  name: string;
  link: string;
}

export interface EcommerceLink {
  name: string;
  url: string;
  icon?: string;
  description?: string;
}

export interface EcommerceProductLink {
  platform: string;
  url: string;
}

export interface Testimonial {
  name: string;
  position?: string;
  message: string;
  rating?: number;
  avatar?: string;
}

export interface WhyChooseUs {
  icon: string;
  title: string;
  description: string;
}

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  version: string;
  author: string;
  features: string[];
  required_fields: string[];
  optional_fields: string[];
  menu_structure?: {
    categories: MenuCategory[];
  };
  product_structure?: {
    products: Product[];
  };
  service_structure?: {
    services: Service[];
  };
  testimonial_structure?: {
    testimonials: Testimonial[];
  };
  why_choose_us?: WhyChooseUs[];
  delivery_apps?: DeliveryApp[];
  ecommerce_links?: EcommerceLink[];
  social_links?: SocialLinks;
  preview_image: string;
  color_scheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  sections: TemplateSection[];
  form_fields: FormField[];
  analytics_events: string[];
  seo: {
    title_template: string;
    description_template: string;
    keywords: string[];
  };
  mobile_optimization: {
    responsive: boolean;
    touch_friendly: boolean;
    fast_loading: boolean;
    pwa_ready: boolean;
  };
  integrations: {
    google_maps: boolean;
    whatsapp: boolean;
    delivery_apps?: boolean;
    ecommerce_platforms?: boolean;
    social_media: boolean;
    analytics: boolean;
    email_marketing?: boolean;
  };
}

export interface TemplateSection {
  id: string;
  name: string;
  description: string;
  optional?: boolean;
}

export interface FormField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export interface GeneratedSite {
  success: boolean;
  siteUrl?: string;
  files?: string[];
  businessId: string;
  templateId: string;
  error?: string;
}

export interface BuildResult {
  siteUrl: string;
  files: string[];
}

export interface EleventyBuildConfig {
  input: string;
  output: string;
  data: string;
  config: any;
} 