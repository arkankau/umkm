# UMKM Go Digital - Template System

This directory contains the template system for the UMKM Go Digital platform. Each template is designed to be flexible and customizable for different types of Indonesian SMEs.

## Directory Structure

```
templates/
├── base/                    # Base template components
│   ├── layout.njk          # Main layout template
│   ├── styles.css          # Base CSS styles
│   └── scripts.js          # Base JavaScript functionality
├── restaurant/             # Restaurant template
│   ├── template.njk        # Restaurant-specific template
│   ├── config.json         # Template configuration
│   └── assets/            # Restaurant-specific assets
├── retail/                # Retail template
│   ├── template.njk        # Retail-specific template
│   ├── config.json         # Template configuration
│   └── assets/            # Retail-specific assets
└── service/               # Service template
    ├── template.njk        # Service-specific template
    ├── config.json         # Template configuration
    └── assets/            # Service-specific assets
```

## Template Categories

### 1. Restaurant Template
**Best for:** Restaurants, cafes, food stalls, catering services

**Features:**
- Menu display with categories and pricing
- Gallery for food and ambiance photos
- Delivery app integration (GoFood, GrabFood, etc.)
- Opening hours and location information
- Contact form for reservations

**Required fields:**
- Business name
- Description
- Phone number
- Address

**Optional fields:**
- Tagline
- Logo
- Featured image
- WhatsApp number
- Email
- Opening hours
- Menu items
- Gallery images
- Delivery app links
- Social media links

### 2. Retail Template
**Best for:** Shops, boutiques, online stores, product sellers

**Features:**
- Product showcase with images and pricing
- E-commerce platform links (Shopee, Tokopedia, etc.)
- Services section
- Gallery for product photos
- Contact form for inquiries

**Required fields:**
- Business name
- Description
- Phone number
- Address

**Optional fields:**
- Tagline
- Logo
- Featured image
- WhatsApp number
- Email
- Opening hours
- Products list
- Services offered
- Gallery images
- E-commerce links
- Social media links

### 3. Service Template
**Best for:** Consultants, service providers, professionals

**Features:**
- Services listing with pricing
- Testimonials from clients
- "Why Choose Us" section
- Gallery for work samples
- Contact form with service selection

**Required fields:**
- Business name
- Description
- Phone number
- Address

**Optional fields:**
- Tagline
- Logo
- Featured image
- WhatsApp number
- Email
- Opening hours
- Services offered
- Testimonials
- Gallery images
- Why choose us points
- Social media links

## Template Configuration

Each template has a `config.json` file that defines:

- **Template metadata:** ID, name, description, version
- **Features:** List of available features
- **Required fields:** Fields that must be provided
- **Optional fields:** Additional fields that can be included
- **Form fields:** Contact form configuration
- **Analytics events:** Events to track
- **SEO settings:** Title and description templates
- **Mobile optimization:** Responsive design settings
- **Integrations:** Supported third-party services

## Customization

### Adding New Templates

1. Create a new directory in `templates/`
2. Create `template.njk` extending the base layout
3. Create `config.json` with template configuration
4. Create `assets/` directory for template-specific assets
5. Add template to the platform's template registry

### Modifying Existing Templates

1. **Layout changes:** Edit the `.njk` template file
2. **Styling changes:** Modify CSS in `base/styles.css` or add template-specific styles
3. **Functionality changes:** Update JavaScript in `base/scripts.js`
4. **Configuration changes:** Edit the `config.json` file

### Template Variables

All templates use the following data structure:

```javascript
{
  "business": {
    "id": "unique-business-id",
    "name": "Business Name",
    "tagline": "Business tagline",
    "description": "Business description",
    "logo": "logo-url",
    "featured_image": "featured-image-url",
    "phone": "phone-number",
    "whatsapp": "whatsapp-number",
    "email": "email-address",
    "address": "business-address",
    "opening_hours": "opening-hours",
    "menu": [...], // Restaurant template
    "products": [...], // Retail template
    "services": [...], // Service template
    "gallery": [...],
    "social_links": {...},
    "delivery_apps": [...], // Restaurant template
    "ecommerce_links": [...], // Retail template
    "testimonials": [...], // Service template
    "why_choose_us": [...] // Service template
  }
}
```

## Development Guidelines

### Template Development

1. **Extend base layout:** All templates should extend `base/layout.njk`
2. **Use semantic HTML:** Proper heading hierarchy and semantic elements
3. **Responsive design:** Mobile-first approach with responsive breakpoints
4. **Accessibility:** Include proper alt text, ARIA labels, and keyboard navigation
5. **Performance:** Optimize images and minimize JavaScript

### CSS Guidelines

1. **Use utility classes:** Leverage the utility-first CSS approach
2. **Consistent spacing:** Use the defined spacing scale
3. **Color scheme:** Use the template's color scheme variables
4. **Typography:** Use the Inter font family consistently
5. **Animations:** Use the provided animation classes

### JavaScript Guidelines

1. **Event handling:** Use event delegation where appropriate
2. **Form validation:** Client-side validation with proper error handling
3. **Analytics:** Track user interactions and form submissions
4. **Performance:** Lazy load images and optimize for mobile
5. **Error handling:** Graceful error handling for all async operations

## Deployment

Templates are processed by Eleventy (11ty) and deployed to EdgeOne Pages:

1. **Build process:** Templates are compiled to static HTML
2. **Asset optimization:** Images and CSS are optimized
3. **Deployment:** Files are uploaded to EdgeOne Pages
4. **Domain configuration:** Custom domains are configured
5. **CDN distribution:** Content is distributed via EdgeOne CDN

## Analytics and Tracking

Each template includes:

- **Page view tracking:** Automatic page view events
- **Form submission tracking:** Contact form submissions
- **Click tracking:** Phone, WhatsApp, and link clicks
- **Section tracking:** Menu, gallery, and product views
- **Conversion tracking:** Lead generation and contact events

## SEO Optimization

Templates are optimized for search engines with:

- **Meta tags:** Title, description, and Open Graph tags
- **Structured data:** JSON-LD markup for business information
- **Semantic HTML:** Proper heading hierarchy and semantic elements
- **Mobile optimization:** Responsive design and fast loading
- **Local SEO:** Address and contact information markup

## Support and Maintenance

- **Documentation:** Keep this README updated
- **Testing:** Test templates across different devices and browsers
- **Performance monitoring:** Monitor loading times and user interactions
- **Security updates:** Keep dependencies updated
- **User feedback:** Collect and implement user feedback

## Contributing

When contributing to the template system:

1. Follow the existing code structure and conventions
2. Test templates across different screen sizes
3. Ensure accessibility compliance
4. Update documentation for any changes
5. Follow the established naming conventions
6. Include proper error handling
7. Optimize for performance

## License

This template system is part of the UMKM Go Digital platform and follows the project's licensing terms. 