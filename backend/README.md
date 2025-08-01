# UMKM Go Digital - EdgeOne Functions Backend

Backend service for automated UMKM website generation using EdgeOne Functions and Pages.

## 🚀 Features

- **Business Data Collection**: Comprehensive form validation and storage
- **Automated Site Generation**: Template-based website creation
- **EdgeOne Pages Deployment**: Instant live website deployment
- **Status Tracking**: Real-time generation progress monitoring
- **KV Storage**: Fast data retrieval and updates

## 📁 Project Structure

```
src/
├── index.js              # Main router and CORS handler
├── api/
│   ├── submit-business.js # Form submission handler
│   ├── generate-site.js   # Site generation pipeline
│   ├── get-status.js      # Status monitoring
│   └── get-business.js    # Business data retrieval
└── utils/
    ├── validation.js      # Data validation utilities
    ├── template.js        # HTML template processing
    └── deployment.js      # EdgeOne Pages deployment
```

## 🛠️ Setup

### Prerequisites

- Node.js 18+ 
- Wrangler CLI
- EdgeOne account with API access

### Installation

1. **Clone and install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   ```bash
   # Copy wrangler.toml and update with your values
   cp wrangler.toml.example wrangler.toml
   ```

3. **Set up KV namespaces**
   ```bash
   wrangler kv:namespace create "umkm-business-data"
   wrangler kv:namespace create "umkm-business-data" --preview
   ```

4. **Configure EdgeOne credentials**
   ```bash
   # Add to wrangler.toml
   [env]
   EDGEONE_API_TOKEN = "your-api-token"
   EDGEONE_ACCOUNT_ID = "your-account-id"
   EDGEONE_ZONE_ID = "your-zone-id"
   ```

### Development

```bash
# Start local development server
npm run dev

# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production
```

## 📡 API Endpoints

### POST /api/submit-business

Submit business information for website generation.

**Request Body:**
```json
{
  "businessName": "Warung Pak Budi",
  "ownerName": "Budi Santoso",
  "description": "Warung makan tradisional dengan cita rasa autentik",
  "category": "restaurant",
  "products": "Nasi goreng, Mie goreng, Soto ayam",
  "phone": "081234567890",
  "email": "budi@warung.com",
  "address": "Jl. Sudirman No. 123, Jakarta",
  "whatsapp": "081234567890",
  "instagram": "warungpakbudi",
  "logoUrl": "https://example.com/logo.png"
}
```

**Response:**
```json
{
  "success": true,
  "businessId": "uuid",
  "subdomain": "warungpakbudixyz",
  "status": "processing",
  "message": "Business data submitted successfully. Site generation in progress."
}
```

### POST /api/generate-site

Trigger website generation for a business.

**Request Body:**
```json
{
  "businessId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "url": "https://warungpakbudixyz.umkm.id",
  "subdomain": "warungpakbudixyz",
  "processingTime": 2500,
  "message": "Website generated and deployed successfully"
}
```

### GET /api/get-status?businessId=uuid

Get generation status for a business.

**Response:**
```json
{
  "businessId": "uuid",
  "subdomain": "warungpakbudixyz",
  "status": "live",
  "businessName": "Warung Pak Budi",
  "websiteUrl": "https://warungpakbudixyz.umkm.id",
  "processingTime": 2500,
  "message": "Website berhasil dibuat!",
  "progress": "100%"
}
```

### GET /api/get-business?businessId=uuid

Retrieve business data.

**Response:**
```json
{
  "id": "uuid",
  "businessName": "Warung Pak Budi",
  "ownerName": "Budi Santoso",
  "description": "Warung makan tradisional dengan cita rasa autentik",
  "category": "restaurant",
  "products": "Nasi goreng, Mie goreng, Soto ayam",
  "phone": "081234567890",
  "email": "budi@warung.com",
  "address": "Jl. Sudirman No. 123, Jakarta",
  "whatsapp": "081234567890",
  "instagram": "warungpakbudi",
  "logoUrl": "https://example.com/logo.png",
  "websiteUrl": "https://warungpakbudixyz.umkm.id",
  "subdomain": "warungpakbudixyz",
  "status": "live",
  "googleMapsUrl": "https://maps.google.com/?q=Jl.%20Sudirman%20No.%20123%2C%20Jakarta",
  "whatsappUrl": "https://wa.me/6281234567890",
  "instagramUrl": "https://instagram.com/warungpakbudi"
}
```

## 🎨 Templates

The system includes 4 responsive templates:

- **Restaurant**: Food & beverage businesses
- **Retail**: Product-based businesses  
- **Service**: Service-based businesses
- **Default**: General business template

Each template includes:
- Mobile-responsive design
- Contact information integration
- Social media links
- Google Maps integration
- WhatsApp direct messaging

## 🔧 Data Models

### Business Data Structure

```javascript
{
  id: "uuid",
  businessName: "string",
  ownerName: "string", 
  description: "string",
  category: "restaurant|retail|service|other",
  products: "string",
  phone: "string",
  email: "string",
  address: "string",
  whatsapp: "string",
  instagram: "string",
  logoUrl: "string",
  websiteUrl: "string",
  subdomain: "string",
  status: "processing|live|error",
  createdAt: "timestamp",
  deployedAt: "timestamp"
}
```

## 🚀 Deployment

### EdgeOne Pages Integration

The system automatically deploys generated websites to EdgeOne Pages with:

- Custom subdomains (businessname.umkm.id)
- SSL certificates
- Global CDN distribution
- Automatic caching optimization

### KV Storage Schema

```
business:{businessId} -> JSON business data
subdomain:{subdomain} -> businessId for quick lookup
```

## 📊 Performance Targets

- **Form submission**: < 2 seconds
- **Site generation**: < 30 seconds  
- **Uptime**: 99.9%
- **Page load time**: < 3 seconds

## 🔒 Security

- Input validation and sanitization
- CORS protection
- Rate limiting (to be implemented)
- Secure API token handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in this repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for UMKM Indonesia** 