# UMKM Go Digital - Services

This directory contains the core services for the UMKM Go Digital platform, including the Eleventy service for generating microsites.

## Eleventy Service

The `EleventyService` is responsible for generating static websites from business data and templates.

### Features

- **Template-based generation**: Uses Nunjucks templates to generate static HTML
- **Business data validation**: Validates business data against template requirements
- **Asset management**: Copies and optimizes assets (CSS, JS, images)
- **Multiple template support**: Supports restaurant, retail, and service templates
- **TypeScript support**: Fully typed for better development experience

### Usage

```typescript
import EleventyService from './services/eleventy-service';
import { BusinessData } from './types/business';

// Initialize the service
const eleventyService = new EleventyService('templates', '_site');

// Business data
const businessData: BusinessData = {
  id: 'restaurant-001',
  name: 'Warung Makan Sederhana',
  description: 'Warung makan tradisional dengan cita rasa autentik',
  phone: '08123456789',
  address: 'Jl. Sudirman No. 123, Jakarta Pusat',
  // ... other business data
};

// Generate the site
const result = await eleventyService.generateSite(businessData, 'restaurant');

if (result.success) {
  console.log(`Site generated: ${result.siteUrl}`);
} else {
  console.error(`Generation failed: ${result.error}`);
}
```

### API Reference

#### Constructor

```typescript
new EleventyService(templatesDir?: string, outputDir?: string)
```

- `templatesDir`: Directory containing templates (default: 'templates')
- `outputDir`: Directory for generated sites (default: '_site')

#### Methods

##### `generateSite(businessData: BusinessData, templateId: string): Promise<GeneratedSite>`

Generates a complete website for a business.

**Parameters:**
- `businessData`: Business information and content
- `templateId`: Template to use (e.g., 'restaurant', 'retail', 'service')

**Returns:**
```typescript
{
  success: boolean;
  siteUrl?: string;
  files?: string[];
  businessId: string;
  templateId: string;
  error?: string;
}
```

##### `getAvailableTemplates(): Promise<string[]>`

Returns a list of available templates.

##### `getTemplateConfig(templateId: string): Promise<TemplateConfig>`

Returns the configuration for a specific template.

##### `validateTemplate(templateId: string): Promise<boolean>`

Checks if a template exists and is valid.

### Template System

The service supports three main template types:

#### 1. Restaurant Template (`restaurant`)
- Menu display with categories and pricing
- Gallery for food and ambiance photos
- Delivery app integration
- Opening hours and location information

#### 2. Retail Template (`retail`)
- Product showcase with images and pricing
- E-commerce platform links
- Services section
- Gallery for product photos

#### 3. Service Template (`service`)
- Services listing with pricing
- Testimonials from clients
- "Why Choose Us" section
- Gallery for work samples

### Business Data Structure

```typescript
interface BusinessData {
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
```

### Template Configuration

Each template has a `config.json` file that defines:

- **Template metadata**: ID, name, description, version
- **Features**: List of available features
- **Required fields**: Fields that must be provided
- **Optional fields**: Additional fields that can be included
- **Form fields**: Contact form configuration
- **Analytics events**: Events to track
- **SEO settings**: Title and description templates
- **Mobile optimization**: Responsive design settings
- **Integrations**: Supported third-party services

### Development

#### Adding New Templates

1. Create a new directory in `templates/`
2. Create `template.njk` extending the base layout
3. Create `config.json` with template configuration
4. Create `assets/` directory for template-specific assets
5. Add template to the service's template registry

#### Customizing Templates

1. **Layout changes**: Edit the `.njk` template file
2. **Styling changes**: Modify CSS in `base/styles.css` or add template-specific styles
3. **Functionality changes**: Update JavaScript in `base/scripts.js`
4. **Configuration changes**: Edit the `config.json` file

### Deployment

The generated sites are designed to be deployed to EdgeOne Pages:

1. **Build process**: Templates are compiled to static HTML
2. **Asset optimization**: Images and CSS are optimized
3. **Deployment**: Files are uploaded to EdgeOne Pages
4. **Domain configuration**: Custom domains are configured
5. **CDN distribution**: Content is distributed via EdgeOne CDN

### Examples

See `examples/generate-site.ts` for complete examples of how to use the service with different business types.

### Error Handling

The service includes comprehensive error handling:

- **Validation errors**: Missing required fields
- **Template errors**: Invalid template configuration
- **File system errors**: Missing files or directories
- **Build errors**: Template processing failures

### Performance

- **Parallel processing**: Multiple sites can be generated simultaneously
- **Caching**: Template configurations are cached for better performance
- **Asset optimization**: Images and CSS are optimized during build
- **Lazy loading**: Assets are loaded only when needed

### Testing

```bash
# Run the example generator
npm run dev

# Run tests
npm test

# Build the project
npm run build
```

### Dependencies

- `@11ty/eleventy`: Static site generator
- `nunjucks`: Template engine
- `@types/node`: Node.js type definitions
- `typescript`: TypeScript compiler

### Contributing

When contributing to the service:

1. Follow the existing code structure and conventions
2. Add proper TypeScript types for all new features
3. Include error handling for all async operations
4. Test with different business data scenarios
5. Update documentation for any changes
6. Ensure backward compatibility
7. Optimize for performance

### License

This service is part of the UMKM Go Digital platform and follows the project's licensing terms. 