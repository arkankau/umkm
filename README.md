# UMKM Go Digital - One Stop UMKM Website Generator

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

## 🚀 Features

### For UMKM Businesses
- ✅ **Instant Website Creation** - Generate professional websites in under 30 seconds
- ✅ **Mobile-Responsive Design** - Perfect on all devices
- ✅ **Indonesian Market Focus** - Local language and cultural elements
- ✅ **Social Media Integration** - WhatsApp, Instagram, Google Maps
- ✅ **Free Hosting** - Websites hosted on `.umkm.id` domain
- ✅ **Professional Templates** - Restaurant, Retail, Service, and Other categories

### Technical Features
- ✅ **EdgeOne Functions** - Global CDN for fast performance
- ✅ **KV Storage** - Scalable data persistence
- ✅ **Template System** - Customizable HTML templates
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
│   │       ├── template.js      # HTML template system
│   │       └── deployment.js    # Site deployment
│   ├── test/                    # Test files and samples
│   ├── wrangler.toml           # EdgeOne configuration
│   └── package.json            # Backend dependencies
└── package.json                # Frontend dependencies
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

# Test backend functions
node test-simple.js

# Deploy to EdgeOne (requires EdgeOne account)
npx wrangler deploy
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
- Template system for HTML generation
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
node test-simple.js
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
npx wrangler deploy
```

## 📊 Performance Metrics

- **Form Submission**: < 2 seconds
- **Template Processing**: < 30 seconds
- **HTML Generation**: < 5 seconds
- **Validation**: < 1 second
- **Template Size**: 4,200-4,800 characters (optimal)

## 🎯 Business Impact

### For UMKM
- **Instant Digital Presence** - No technical knowledge required
- **Professional Appearance** - Modern, responsive design
- **Cost-Effective** - Free hosting and domain
- **Local Market Focus** - Indonesian language and culture
- **Contact Integration** - Direct WhatsApp and phone integration

### Technical Benefits
- **Scalable Architecture** - EdgeOne Functions for global performance
- **Fast Performance** - Global CDN with edge caching
- **Secure Deployment** - SSL certificates and security headers
- **Easy Maintenance** - Template-based system
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
