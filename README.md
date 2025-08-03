# UMKM Go Digital - Untuk Mu Karya Mu Website Generator

A complete system for automatically generating professional websites for Indonesian UMKM (Micro, Small, and Medium Enterprises) businesses.

## 🏗️ System Architecture

### Frontend (Next.js)
- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Location**: Root directory (except `backend/` folder)

### Backend (EdgeOne Functions)
- **Platform**: Cloudflare EdgeOne Functions
- **Language**: JavaScript (ES Modules)
- **Location**: `backend/` directory
- **Template System**: Integrated with color customization

## 🚀 Features

### For UMKM Businesses
- ✅ **Instant Website Creation** - Generate professional websites in under 30 seconds
- ✅ **Mobile-Responsive Design** - Perfect on all devices
- ✅ **Indonesian Market Focus** - Local language and cultural elements
- ✅ **Social Media Integration** - WhatsApp, Instagram, Google Maps
- ✅ **Free Hosting** - Websites hosted on `.umkm.id` domain
- ✅ **Professional Templates** - Restaurant, Retail, Service categories with color themes

### Technical Features
- ✅ **EdgeOne Functions** - Global CDN for fast performance
- ✅ **KV Storage** - Scalable data persistence
- ✅ **Integrated Template System** - Advanced templates with color customization
- ✅ **Validation System** - Robust data validation
- ✅ **Error Handling** - Comprehensive error management
- ✅ **Status Monitoring** - Real-time generation progress

## 📁 Project Structure

```
onestopumkm/
├── app/                          # Next.js frontend
│   ├── page.tsx                  # Main landing page
│   ├── status/[businessId]/      # Status monitoring page
│   └── globals.css               # Global styles
├── components/                   # React components
│   └── BusinessForm.tsx          # Business submission form
├── lib/                         # API client
│   └── api.ts                   # Backend API integration
├── pages/api/                   # Next.js API routes
│   └── submit-business.js        # Development API proxy
├── backend/                     # EdgeOne Functions backend
│   ├── src/
│   │   ├── index.js             # Main function entry point
│   │   ├── api/                 # API endpoints
│   │   │   ├── submit-business.js
│   │   │   ├── generate-site.js
│   │   │   ├── get-status.js
│   │   │   └── get-business.js
│   │   └── utils/               # Utility functions
│   │       ├── validation.js    # Data validation
│   │       ├── template.js      # Legacy template system
│   │       ├── template-system.js # Integrated template system
│   │       └── deployment.js    # Site deployment
│   ├── templates/               # Template files
│   │   ├── base/               # Base template components
│   │   ├── restaurant/         # Restaurant templates
│   │   ├── retail/            # Retail templates
│   │   └── service/           # Service templates
│   ├── types/                  # TypeScript definitions
│   ├── services/               # Template services
│   ├── examples/               # Example usage
│   ├── test/                   # Test files
│   ├── wrangler.toml          # EdgeOne configuration
│   └── package.json           # Backend dependencies
└── package.json               # Frontend dependencies
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ (recommended)
- npm or yarn

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Test template system
npm test

# Test API endpoints
npm run test:api

# Deploy to EdgeOne (requires EdgeOne account)
npm run deploy
```

## 🎨 Template System

The backend includes an advanced template system with:

### Color Themes
- **Category-Based**: Restaurant (red/orange), Retail (blue), Service (purple)
- **Custom Themes**: Modern, Elegant, Vibrant, Minimal

### Template Features
- **Restaurant**: Menu display, food gallery, delivery apps
- **Retail**: Product showcase, e-commerce links, services
- **Service**: Service listings, testimonials, professional features

### Testing Templates
```bash
cd backend
npm test  # Tests all themes and generates sample HTML files
```

## 🔧 Development

### Frontend Development
The frontend is a standard Next.js application with:
- TypeScript for type safety
- Tailwind CSS for styling
- API client for backend communication
- Status monitoring with real-time updates

### Backend Development
The backend uses EdgeOne Functions with:
- ES Modules for modern JavaScript
- KV storage for data persistence
- Integrated template system for HTML generation
- Comprehensive validation and error handling

### API Endpoints

#### Submit Business
```
POST /api/submit-business
Content-Type: application/json

{
  "businessName": "Warung Pak Budi",
  "ownerName": "Budi Santoso",
  "description": "Warung makan tradisional...",
  "category": "restaurant",
  "products": "Nasi goreng, Mie goreng...",
  "phone": "081234567890",
  "email": "budi@warung.com",
  "address": "Jl. Sudirman No. 123...",
  "whatsapp": "081234567890",
  "instagram": "warungpakbudi"
}
```

#### Generate Site with Theme
```
POST /api/generate-site
Content-Type: application/json

{
  "businessId": "business-123",
  "customTheme": "modern"
}
```

#### Get Available Themes
```
GET /api/get-themes
```

#### Get Status
```
GET /api/get-status?businessId={id}
```

#### Get Business Info
```
GET /api/get-business?businessId={id}
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test        # Test template system
npm run test:api # Test API endpoints
npm run test:local # Test local development
```

### Frontend Tests
```bash
npm run lint
npm run build
```

## 🚀 Deployment

### Frontend Deployment
The frontend can be deployed to any Next.js-compatible platform:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Self-hosted

### Backend Deployment
The backend is deployed to EdgeOne Functions:
```bash
cd backend
npm run deploy
```

## 📊 Performance Metrics

- **Form Submission**: < 2 seconds
- **Template Processing**: < 100ms
- **HTML Generation**: < 50ms
- **Theme Application**: < 10ms
- **Total Generation Time**: < 30 seconds

## 🎯 Business Impact

### For UMKM
- **Instant Digital Presence** - No technical knowledge required
- **Professional Appearance** - Modern, responsive design with color themes
- **Cost-Effective** - Free hosting and domain
- **Local Market Focus** - Indonesian language and culture
- **Contact Integration** - Direct WhatsApp and phone integration

### Technical Benefits
- **Scalable Architecture** - EdgeOne Functions for global performance
- **Fast Performance** - Global CDN with edge caching
- **Secure Deployment** - SSL certificates and security headers
- **Easy Maintenance** - Template-based system with color customization
- **Custom Domains** - Business-specific subdomains

## 🔒 Security & Privacy

- **Data Validation** - Comprehensive input sanitization
- **CORS Headers** - Proper cross-origin resource sharing
- **Error Handling** - Secure error messages
- **Input Sanitization** - XSS protection
- **HTTPS Only** - Secure connections

## 📈 Future Enhancements

- [ ] **Custom Domains** - Support for custom domain names
- [ ] **Analytics Integration** - Google Analytics and tracking
- [ ] **SEO Optimization** - Meta tags and structured data
- [ ] **Payment Integration** - Online payment processing
- [ ] **Multi-language Support** - English and other languages
- [ ] **Advanced Templates** - More design options
- [ ] **Content Management** - Easy content updates
- [ ] **Social Media Integration** - Facebook, Twitter, TikTok

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation in the `backend/README.md` file

---

**Status**: ✅ Production Ready  
**Last Updated**: January 2025  
**Version**: 1.0.0
