# Website Template Engine

## Overview

The website template engine generates complete, responsive websites for UMKM businesses based on the information provided in the business form. Each generated website includes:

- **HTML**: Complete HTML structure with semantic markup
- **CSS**: Responsive design with modern styling
- **JavaScript**: Interactive features and animations
- **Assets**: Placeholder images and icons

## Features

### 🎨 **Modern Design**
- Responsive layout that works on desktop, tablet, and mobile
- Gradient backgrounds and modern color schemes
- Smooth animations and hover effects
- Professional typography

### 📱 **Mobile-First**
- Optimized for mobile devices
- Touch-friendly navigation
- Responsive images and layouts
- Fast loading times

### 🔗 **Social Media Integration**
- WhatsApp integration with click-to-chat
- Instagram profile links
- Google Maps integration
- Email and phone links

### ⚡ **Interactive Features**
- Smooth scrolling navigation
- Animated sections on scroll
- Hover effects on contact items
- Floating WhatsApp button
- Copy-to-clipboard functionality

## Generated Website Structure

### 1. **Header Section**
- Business name and tagline
- Navigation menu
- Fixed position with scroll effects

### 2. **Hero Section**
- Welcome message with business name
- Business description
- Call-to-action buttons

### 3. **About Section**
- Detailed business description
- Owner information
- Business category
- Address information

### 4. **Products Section**
- Products and services listing
- Clean, card-based layout

### 5. **Contact Section**
- Phone number with click-to-call
- Email with mailto link
- Address with Google Maps link
- Social media buttons (WhatsApp, Instagram)

### 6. **Footer**
- Copyright information
- UMKM Go Digital branding

## Technical Implementation

### File Structure
```
lib/
├── website-generator.ts    # Main generator class
├── api.ts                 # API interfaces
└── ...

pages/api/
├── submit-business.js     # Business submission endpoint
├── preview-website.js     # Website preview endpoint
├── get-status.js         # Status checking endpoint
└── get-business.js       # Business info endpoint

components/
├── BusinessForm.tsx      # Main form component
├── WebsitePreview.tsx    # Preview modal component
└── ...
```

### Usage

#### 1. **Generate Website**
```typescript
import { generateWebsite } from '../lib/website-generator';

const businessData = {
  businessName: "Warung Makan Sederhana",
  ownerName: "Pak Budi",
  description: "Warung makan tradisional...",
  category: "restaurant",
  products: "Nasi goreng, Mie goreng...",
  phone: "081234567890",
  email: "budi@warungsederhana.com",
  address: "Jl. Sudirman No. 123, Jakarta",
  whatsapp: "081234567890",
  instagram: "warungsederhana"
};

const website = generateWebsite(businessData);
console.log(website.html); // Complete HTML
console.log(website.css);  // Complete CSS
console.log(website.js);   // Complete JavaScript
```

#### 2. **Preview Website**
```typescript
// In your component
const [showPreview, setShowPreview] = useState(false);

// Show preview modal
<WebsitePreview
  businessData={formData}
  onClose={() => setShowPreview(false)}
/>
```

#### 3. **API Endpoints**

**Submit Business:**
```bash
POST /api/submit-business
Content-Type: application/json

{
  "businessName": "Business Name",
  "ownerName": "Owner Name",
  "description": "Business description",
  "category": "restaurant|retail|service|other",
  "products": "Products/services",
  "phone": "Phone number",
  "email": "Email (optional)",
  "address": "Address",
  "whatsapp": "WhatsApp (optional)",
  "instagram": "Instagram (optional)"
}
```

**Preview Website:**
```bash
POST /api/preview-website
Content-Type: application/json

# Same data structure as submit-business
# Returns complete HTML with embedded CSS and JS
```

## Customization

### Adding New Categories
```typescript
private getCategoryDisplayName(category: string): string {
  const categoryMap: { [key: string]: string } = {
    'restaurant': 'Restoran & Kuliner',
    'retail': 'Retail & Toko',
    'service': 'Jasa & Layanan',
    'other': 'Lainnya',
    'new-category': 'New Category Display Name' // Add here
  };
  return categoryMap[category] || category;
}
```

### Modifying Templates
The templates are generated in the `WebsiteGenerator` class:

- `generateHTML()`: Creates the HTML structure
- `generateCSS()`: Creates the CSS styles
- `generateJS()`: Creates the JavaScript functionality

### Adding New Features
1. Update the `BusinessData` interface in `lib/api.ts`
2. Modify the HTML template in `generateHTML()`
3. Add corresponding CSS styles in `generateCSS()`
4. Add JavaScript functionality in `generateJS()`

## Deployment Ready

The generated websites are ready for deployment to any hosting platform:

- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **CDN**: Cloudflare, AWS CloudFront
- **Traditional Hosting**: Any web server

Each website is self-contained with all CSS and JavaScript embedded, making it easy to deploy as a single HTML file.

## Next Steps for EdgeOne Integration

To deploy to EdgeOne, you would need to:

1. **Add EdgeOne API Integration**
   - Domain/subdomain creation
   - File upload endpoints
   - Deployment triggers

2. **File Storage**
   - Store generated websites in a database or file system
   - Manage multiple business websites

3. **Real-time Deployment**
   - Replace mock status updates with real deployment status
   - Add deployment progress tracking

4. **Custom Domains**
   - Support for custom domain configuration
   - SSL certificate management

The website template engine is now complete and ready for integration with EdgeOne or any other hosting platform! 