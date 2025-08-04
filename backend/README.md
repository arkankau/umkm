# UMKM Go Digital - EdgeOne Functions Backend

Backend service for automated UMKM website generation using EdgeOne Functions and Pages.

## 🚀 Features

- **Business Data Collection**: Comprehensive form validation and storage
- **Automated Site Generation**: Template-based website creation with color customization
- **EdgeOne Pages Deployment**: Instant live website deployment
- **Status Tracking**: Real-time generation progress monitoring
- **KV Storage**: Fast data retrieval and updates
- **Color Themes**: Multiple customizable color schemes for different business types

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
    ├── template.js        # HTML template processing (legacy)
    ├── template-system.js # Integrated template system with color customization
    └── deployment.js      # EdgeOne Pages deployment
```

## 🎨 Template System

### Integrated Template System

The backend now includes an advanced template system that combines:
- **Eleventy-style templates** with dynamic content processing
- **Color customization** with multiple theme options
- **Responsive design** with modern CSS
- **Business-specific sections** (menu, products, services, testimonials)

### Available Color Themes

#### Category-Based Themes (Default)
- **Restaurant**: Warm red/orange gradient with food-friendly colors
- **Retail**: Professional blue gradient with modern styling
- **Service**: Elegant purple gradient with professional appearance
- **Other**: Neutral gray gradient for general use

#### Custom Themes
- **Modern**: Purple gradient with modern aesthetics
- **Elegant**: Black/gray with orange accents
- **Vibrant**: Colorful gradient with energetic feel
- **Minimal**: Clean black/white with red accents

### Template Features

#### Restaurant Templates
- Menu display with categories and pricing
- Gallery for food and ambiance photos
- Delivery app integration
- Opening hours and location information

#### Retail Templates
- Product showcase with images and pricing
- E-commerce platform links
- Services section
- Gallery for product photos

#### Service Templates
- Services listing with pricing and features
- Testimonials from clients
- "Why Choose Us" section
- Gallery for work samples

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
   # Zone ID is not needed for EdgeOne Pages deployment
   ```

### Development

```bash
# Start local development server
npm run dev

# Test template system
node test-template-system.js

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

### POST /api/generate-site

Generate and deploy a website for a business.

**Request Body:**
```json
{
  "businessId": "business-123",
  "customTheme": "modern"
}
```

**Response:**
```json
{
  "success": true,
  "url": "https://warungpakbudi.umkm.id",
  "subdomain": "warungpakbudi",
  "processingTime": 25000,
  "theme": "modern",
  "message": "Website generated and deployed successfully"
}
```

### GET /api/get-themes

Get available color themes.

**Response:**
```json
{
  "success": true,
  "themes": {
    "default": "Default (Category-based)",
    "modern": "Modern",
    "elegant": "Elegant",
    "vibrant": "Vibrant",
    "minimal": "Minimal"
  }
}
```

### GET /api/get-status?businessId={id}

Get the current status of website generation.

### GET /api/get-business?businessId={id}

Get business information and website details.

## 🧪 Testing

### Template System Testing

Test the new integrated template system:

```bash
# Run comprehensive template tests
node test-template-system.js
```

This will generate sample HTML files for different themes:
- `test-restaurant-default.html`
- `test-restaurant-modern.html`
- `test-retail-elegant.html`
- `test-service-vibrant.html`
- `test-restaurant-minimal.html`

### API Testing

Test the backend APIs:

```bash
# Test simple API calls
node test-simple.js

# Test local development
node test-local.js
```

## 🎨 Customizing Templates

### Adding New Themes

To add a new color theme, edit `src/utils/template-system.js`:

```javascript
const CUSTOM_COLORS = {
  // ... existing themes
  your_theme: {
    primary: '#your-primary-color',
    secondary: '#your-secondary-color',
    accent: '#your-accent-color',
    background: '#your-background-color',
    text: '#your-text-color',
    success: '#your-success-color'
  }
};
```

### Modifying Templates

Templates are defined in `src/utils/template-system.js`:
- `getRestaurantTemplate()` - Restaurant-specific layout
- `getRetailTemplate()` - Retail-specific layout
- `getServiceTemplate()` - Service-specific layout

### Adding New Sections

To add new sections to templates:

1. Add the section HTML to the appropriate template function
2. Add data processing logic in `processTemplate()`
3. Update the business data structure if needed

## 📊 Performance

- **Template Processing**: < 100ms
- **HTML Generation**: < 50ms
- **Theme Application**: < 10ms
- **Total Generation Time**: < 30 seconds (including deployment)

## 🔒 Security

- **Input Validation**: All business data is validated
- **XSS Protection**: HTML content is properly escaped
- **CORS Headers**: Proper cross-origin resource sharing
- **Error Handling**: Secure error messages

## 🚀 Deployment

### EdgeOne Functions

```bash
# Deploy to EdgeOne Functions
npx wrangler deploy
```

### Environment Variables

Required environment variables in `wrangler.toml`:

```toml
[vars]
EDGEONE_API_TOKEN = "your-api-token"
EDGEONE_ACCOUNT_ID = "your-account-id"
EDGEONE_ZONE_ID = "your-zone-id"

[[kv_namespaces]]
binding = "UMKM_KV"
id = "your-kv-namespace-id"
```

## 📈 Monitoring

### Status Tracking

The system tracks website generation status:
- `pending` - Business submitted, waiting for generation
- `processing` - Website is being generated
- `live` - Website is live and accessible
- `error` - Generation failed

### Error Handling

Comprehensive error handling includes:
- Validation errors
- Template processing errors
- Deployment failures
- Network timeouts

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Test with different business data
4. Update documentation
5. Ensure backward compatibility

## 📄 License

MIT License - see LICENSE file for details 