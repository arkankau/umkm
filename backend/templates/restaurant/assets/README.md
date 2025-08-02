# Restaurant Template Assets

This directory contains assets specific to the restaurant template.

## Structure
```
assets/
├── images/          # Restaurant-specific images
│   ├── hero-bg.jpg  # Hero section background
│   ├── menu/        # Menu item images
│   └── gallery/     # Gallery images
├── icons/           # Custom icons
└── fonts/           # Custom fonts (if any)
```

## Image Guidelines
- Hero images: 1920x1080px (16:9 ratio)
- Menu images: 400x300px (4:3 ratio)
- Gallery images: 800x600px (4:3 ratio)
- File formats: JPG, PNG, WebP
- File size: Optimize for web (< 500KB per image)

## Usage
Images in this directory can be referenced in the template using:
```njk
<img src="/assets/images/hero-bg.jpg" alt="Restaurant Hero">
```

## Optimization
- Use WebP format when possible
- Implement lazy loading for gallery images
- Provide alt text for accessibility
- Consider responsive images with srcset 