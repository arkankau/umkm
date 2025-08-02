# Service Template Assets

This directory contains assets specific to the service template.

## Structure
```
assets/
├── images/          # Service-specific images
│   ├── hero-bg.jpg  # Hero section background
│   ├── services/    # Service-related images
│   ├── testimonials/ # Testimonial avatars
│   └── gallery/     # Gallery images
├── icons/           # Custom icons
└── fonts/           # Custom fonts (if any)
```

## Image Guidelines
- Hero images: 1920x1080px (16:9 ratio)
- Service images: 400x300px (4:3 ratio)
- Testimonial avatars: 150x150px (1:1 ratio)
- Gallery images: 800x600px (4:3 ratio)
- File formats: JPG, PNG, WebP
- File size: Optimize for web (< 500KB per image)

## Usage
Images in this directory can be referenced in the template using:
```njk
<img src="/assets/images/hero-bg.jpg" alt="Service Hero">
```

## Optimization
- Use WebP format when possible
- Implement lazy loading for gallery images
- Provide alt text for accessibility
- Consider responsive images with srcset
- Professional headshots for testimonials
- High-quality images for service showcases 