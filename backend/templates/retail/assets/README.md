# Retail Template Assets

This directory contains assets specific to the retail template.

## Structure
```
assets/
├── images/          # Retail-specific images
│   ├── hero-bg.jpg  # Hero section background
│   ├── products/    # Product images
│   └── gallery/     # Gallery images
├── icons/           # Custom icons
└── fonts/           # Custom fonts (if any)
```

## Image Guidelines
- Hero images: 1920x1080px (16:9 ratio)
- Product images: 400x400px (1:1 ratio)
- Gallery images: 800x600px (4:3 ratio)
- File formats: JPG, PNG, WebP
- File size: Optimize for web (< 500KB per image)

## Usage
Images in this directory can be referenced in the template using:
```njk
<img src="/assets/images/hero-bg.jpg" alt="Retail Hero">
```

## Optimization
- Use WebP format when possible
- Implement lazy loading for product images
- Provide alt text for accessibility
- Consider responsive images with srcset
- Product images should have consistent aspect ratios 