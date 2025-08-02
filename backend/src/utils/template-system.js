// Integrated Template System for UMKM Go Digital
// Combines Eleventy-style templates with color customization
import { renderTemplate } from './template-renderer.js';

// Color schemes for different business types
const COLOR_SCHEMES = {
  restaurant: {
    primary: '#ff6b6b',
    secondary: '#ee5a24',
    accent: '#f39c12',
    background: '#f8f9fa',
    text: '#2c3e50',
    success: '#27ae60'
  },
  retail: {
    primary: '#3498db',
    secondary: '#2980b9',
    accent: '#e74c3c',
    background: '#ecf0f1',
    text: '#2c3e50',
    success: '#27ae60'
  },
  service: {
    primary: '#9b59b6',
    secondary: '#8e44ad',
    accent: '#f39c12',
    background: '#f8f9fa',
    text: '#2c3e50',
    success: '#27ae60'
  },
  other: {
    primary: '#34495e',
    secondary: '#2c3e50',
    accent: '#e74c3c',
    background: '#ecf0f1',
    text: '#2c3e50',
    success: '#27ae60'
  }
};

// Custom color schemes
const CUSTOM_COLORS = {
  modern: {
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#f093fb',
    background: '#f8f9fa',
    text: '#2d3748',
    success: '#48bb78'
  },
  elegant: {
    primary: '#2d3748',
    secondary: '#4a5568',
    accent: '#ed8936',
    background: '#ffffff',
    text: '#1a202c',
    success: '#38a169'
  },
  vibrant: {
    primary: '#ff6b6b',
    secondary: '#4ecdc4',
    accent: '#45b7d1',
    background: '#f7f1e3',
    text: '#2c3e50',
    success: '#26de81'
  },
  minimal: {
    primary: '#000000',
    secondary: '#666666',
    accent: '#ff6b6b',
    background: '#ffffff',
    text: '#333333',
    success: '#00d4aa'
  }
};

export function getColorScheme(category, customTheme = null) {
  if (customTheme && CUSTOM_COLORS[customTheme]) {
    return CUSTOM_COLORS[customTheme];
  }
  return COLOR_SCHEMES[category] || COLOR_SCHEMES.other;
}

export function generateCSS(colorScheme) {
  return `
    * { 
      margin: 0; 
      padding: 0; 
      box-sizing: border-box; 
    }
    
    :root {
      --primary: ${colorScheme.primary};
      --secondary: ${colorScheme.secondary};
      --accent: ${colorScheme.accent};
      --background: ${colorScheme.background};
      --text: ${colorScheme.text};
      --success: ${colorScheme.success};
    }
    
    body { 
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      line-height: 1.6; 
      color: var(--text); 
      background-color: var(--background);
    }

    .hidden {
      display: none;
    }

    .antialiased {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .font-sans {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .max-w-7xl {
      max-width: 80rem;
    }

    .mx-auto {
      margin-left: auto;
      margin-right: auto;
    }

    .px-4 {
      padding-left: 1rem;
      padding-right: 1rem;
    }

    .py-12 {
      padding-top: 3rem;
      padding-bottom: 3rem;
    }

    .space-x-4 > * + * {
      margin-left: 1rem;
    }
    
    .header { 
      background: linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.secondary}); 
      color: white; 
      padding: 2rem 0; 
      text-align: center; 
    }
    
    .logo { 
      width: 80px; 
      height: 80px; 
      border-radius: 50%; 
      margin: 0 auto 1rem; 
      display: block; 
      object-fit: cover;
    }
    
    .container { 
      max-width: 1200px; 
      margin: 0 auto; 
      padding: 0 1rem; 
    }
    
    .hero { 
      background: ${colorScheme.background}; 
      padding: 3rem 0; 
      text-align: center; 
    }
    
    .section { 
      padding: 3rem 0; 
    }
    
    .section-title {
      font-size: 2.25rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 2rem;
      color: ${colorScheme.text};
    }
    
    .section-subtitle {
      font-size: 1.125rem;
      color: #6b7280;
      text-align: center;
      margin-bottom: 3rem;
    }
    
    .menu-grid, .product-grid, .service-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
      gap: 2rem; 
      margin: 2rem 0; 
    }
    
    .menu-item, .product-item, .service-item { 
      background: white; 
      border-radius: 10px; 
      padding: 1.5rem; 
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      transition: transform 0.2s ease-in-out;
    }
    
    .menu-item:hover, .product-item:hover, .service-item:hover {
      transform: translateY(-5px);
    }
    
    .contact-info { 
      background: ${colorScheme.secondary}; 
      color: white; 
      padding: 2rem; 
      border-radius: 10px; 
      margin: 2rem 0; 
    }
    
    .contact-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
      gap: 1rem; 
    }
    
    .btn { 
      display: inline-block; 
      padding: 0.75rem 1.5rem; 
      background: var(--primary); 
      color: white; 
      text-decoration: none; 
      border-radius: 0.375rem; 
      font-weight: 500;
      font-size: 0.875rem;
      line-height: 1.25rem;
      transition: all 0.15s ease-in-out;
      border: 2px solid transparent;
    }
    
    .btn:hover { 
      background: var(--secondary);
      transform: translateY(-1px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    
    .btn:active {
      transform: translateY(0);
      box-shadow: none;
    }
    
    .btn-success {
      background: var(--success);
      border-color: var(--success);
    }
    
    .btn-success:hover {
      background: transparent;
      color: var(--success);
    }

    .btn-outline {
      background: transparent;
      border: 2px solid var(--primary);
      color: var(--primary);
    }

    .btn-outline:hover {
      background: var(--primary);
      color: white;
    }
    
    .footer { 
      background: ${colorScheme.text}; 
      color: white; 
      text-align: center; 
      padding: 2rem 0; 
      margin-top: 3rem; 
    }
    
    .price {
      font-size: 1.25rem;
      font-weight: bold;
      color: ${colorScheme.success};
    }
    
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    
    .gallery-item {
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .gallery-item img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
    
    .testimonial {
      background: white;
      padding: 1.5rem;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin: 1rem 0;
    }
    
    .testimonial-author {
      font-weight: bold;
      color: ${colorScheme.primary};
    }
    
    .rating {
      color: #f39c12;
      margin: 0.5rem 0;
    }
    
    @media (max-width: 768px) { 
      .container { 
        padding: 0 0.5rem; 
      }
      .section-title {
        font-size: 1.875rem;
      }
      .menu-grid, .product-grid, .service-grid {
        grid-template-columns: 1fr;
      }
    }
  `;
}

// Base template structure
function getBaseTemplate(colorScheme, businessData) {
  return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{BUSINESS_NAME}} - {{CATEGORY_DISPLAY}}</title>
    <meta name="description" content="{{DESCRIPTION}}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        ${generateCSS(colorScheme)}
    </style>
    <script>
      // Mobile menu toggle
      document.addEventListener('DOMContentLoaded', function() {
        const menuButton = document.querySelector('.mobile-menu-button');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (menuButton && mobileMenu) {
          menuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
          });
        }
        
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
              target.scrollIntoView({
                behavior: 'smooth'
              });
              // Close mobile menu if open
              mobileMenu.classList.add('hidden');
            }
          });
        });
      });
    </script>
</head>
<body class="font-sans antialiased">
    <header class="header">
        <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center">
                    <img src="{{LOGO_URL}}" alt="{{BUSINESS_NAME}}" class="logo">
                    <h1 class="text-xl font-bold text-white ml-2">{{BUSINESS_NAME}}</h1>
                </div>
                
                <div class="hidden md:block">
                    <div class="ml-10 flex items-baseline space-x-4">
                        <a href="#beranda" class="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">Beranda</a>
                        <a href="#produk" class="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">Produk</a>
                        <a href="#kontak" class="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium">Kontak</a>
                    </div>
                </div>
                
                <div class="md:hidden">
                    <button type="button" class="mobile-menu-button bg-transparent p-2 rounded-md text-white hover:text-gray-200 focus:outline-none">
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
            
            <div class="mobile-menu hidden md:hidden">
                <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <a href="#beranda" class="text-white hover:text-gray-200 block px-3 py-2 rounded-md text-base font-medium">Beranda</a>
                    <a href="#produk" class="text-white hover:text-gray-200 block px-3 py-2 rounded-md text-base font-medium">Produk</a>
                    <a href="#kontak" class="text-white hover:text-gray-200 block px-3 py-2 rounded-md text-base font-medium">Kontak</a>
                </div>
            </div>
        </nav>
        
        <div class="container text-center py-12">
            <h1 class="text-4xl font-bold text-white mb-4">{{BUSINESS_NAME}}</h1>
            <p class="text-xl text-white mb-8">{{TAGLINE}}</p>
            <div class="flex justify-center space-x-4">
                {{HERO_BUTTONS}}
            </div>
        </div>
    </header>

    <section class="hero">
        <div class="container">
            <h2 class="section-title">Selamat Datang di {{BUSINESS_NAME}}</h2>
            <p class="section-subtitle">{{DESCRIPTION}}</p>
            {{HERO_BUTTONS}}
        </div>
    </section>

    {{CONTENT_SECTIONS}}

    <section class="section">
        <div class="container">
            <div class="contact-info">
                <h3>Hubungi Kami</h3>
                <div class="contact-grid">
                    {{CONTACT_INFO}}
                </div>
            </div>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <p>&copy; {{CURRENT_YEAR}} {{BUSINESS_NAME}}. Dibuat dengan ❤️ oleh UMKM Go Digital</p>
        </div>
    </footer>
</body>
</html>`;
}

// Restaurant template
export async function loadTemplate(category, businessData, colorScheme) {
  try {
    // Get the appropriate color scheme
    const baseScheme = COLOR_SCHEMES[category] || COLOR_SCHEMES.other;
    const finalScheme = colorScheme ? { ...baseScheme, ...CUSTOM_COLORS[colorScheme] } : baseScheme;
    
    // Use the template renderer with an output directory
    const outputDir = path.join(process.cwd(), 'generated', businessData.businessName.toLowerCase().replace(/\s+/g, '-'));
    await fs.mkdir(outputDir, { recursive: true });
    
    return await renderTemplate(category, businessData, finalScheme, outputDir);
  } catch (error) {
    console.error('Template loading failed:', error);
    // Fallback to old template system
    switch (category) {
      case 'restaurant':
        return getRestaurantTemplate(businessData, colorScheme);
      case 'retail':
        return getRetailTemplate(businessData, colorScheme);
      case 'service':
        return getServiceTemplate(businessData, colorScheme);
      default:
        return getDefaultTemplate(businessData, colorScheme);
    }
  }
}

export function getRestaurantTemplate(businessData, colorScheme) {
  // Normalize data structure
  const normalizedData = {
    name: businessData.businessName || '',
    description: businessData.description || '',
    category: businessData.category || 'restaurant',
    menu: Array.isArray(businessData.products) ? businessData.products : [],
    phone: businessData.phone || '',
    whatsapp: businessData.whatsapp || businessData.phone || '',
    instagram: businessData.instagram || '',
    email: businessData.email || '',
    address: businessData.address || ''
  };

  const template = getBaseTemplate(colorScheme, normalizedData);
  
  let contentSections = `
    <section id="menu" class="section">
        <div class="container">
            <h2 class="section-title">Menu Favorit</h2>
            <p class="section-subtitle">Nikmati hidangan terbaik kami dengan cita rasa yang memukau</p>
            <div class="menu-grid">
                ${normalizedData.menu.map(category => `
                  <div class="category-section">
                    <h3 class="category-title">${category.name}</h3>
                    <div class="menu-list">
                      ${category.items.map(item => `
                        <div class="menu-card">
                          <h4>${item.name}</h4>
                          ${item.description ? `<p>${item.description}</p>` : ''}
                          ${item.price ? `<p class="price">Rp ${item.price.toLocaleString('id-ID')}</p>` : ''}
                        </div>
                      `).join('')}
                    </div>
                  </div>
                `).join('')}
            </div>
        </div>
    </section>
  `;
  
  if (businessData.gallery && businessData.gallery.length > 0) {
    contentSections += `
      <section id="gallery" class="section">
          <div class="container">
              <h2 class="section-title">Galeri</h2>
              <p class="section-subtitle">Lihat suasana dan hidangan kami</p>
              <div class="gallery-grid">
                  {{GALLERY_ITEMS}}
              </div>
          </div>
      </section>
    `;
  }
  
  return template
    .replace('{{CATEGORY_DISPLAY}}', 'Restoran & Kuliner')
    .replace('{{TAGLINE}}', businessData.tagline || 'Nikmati hidangan lezat dengan cita rasa autentik')
    .replace('{{HERO_BUTTONS}}', `
      <a href="#menu" class="btn btn-outline">Lihat Menu</a>
      ${businessData.whatsapp ? `<a href="{{WHATSAPP_URL}}" class="btn btn-success" target="_blank">💬 WhatsApp</a>` : ''}
      ${businessData.instagram ? `<a href="{{INSTAGRAM_URL}}" class="btn" target="_blank">📸 Instagram</a>` : ''}
    `)
    .replace('{{CONTENT_SECTIONS}}', contentSections);
}

// Retail template
export function getRetailTemplate(businessData, colorScheme) {
  // Normalize data structure
  const normalizedData = {
    name: businessData.businessName || '',
    description: businessData.description || '',
    category: businessData.category || 'retail',
    products: Array.isArray(businessData.products) ? businessData.products : [],
    phone: businessData.phone || '',
    whatsapp: businessData.whatsapp || businessData.phone || '',
    instagram: businessData.instagram || '',
    email: businessData.email || '',
    address: businessData.address || ''
  };

  const template = getBaseTemplate(colorScheme, normalizedData);
  
  let contentSections = '';
  
  if (normalizedData.products && normalizedData.products.length > 0) {
    contentSections += `
      <section id="products" class="section">
          <div class="container">
              <h2 class="section-title">Produk Unggulan</h2>
              <p class="section-subtitle">Temukan produk berkualitas dengan harga terbaik</p>
              <div class="product-grid">
                  ${normalizedData.products.map(category => `
                    <div class="category-section">
                      <h3 class="category-title">${category.name}</h3>
                      <div class="product-list">
                        ${category.items.map(product => `
                          <div class="product-card">
                            <h4>${product.name}</h4>
                            ${product.description ? `<p>${product.description}</p>` : ''}
                            ${product.price ? `<p class="price">Rp ${product.price.toLocaleString('id-ID')}</p>` : ''}
                          </div>
                        `).join('')}
                      </div>
                    </div>
                  `).join('')}
              </div>
          </div>
      </section>
    `;
  }
  
  if (businessData.services && businessData.services.length > 0) {
    contentSections += `
      <section id="services" class="section">
          <div class="container">
              <h2 class="section-title">Layanan Kami</h2>
              <p class="section-subtitle">Berbagai layanan yang kami tawarkan</p>
              <div class="service-grid">
                  {{SERVICE_ITEMS}}
              </div>
          </div>
      </section>
    `;
  }
  
  if (businessData.gallery && businessData.gallery.length > 0) {
    contentSections += `
      <section id="gallery" class="section">
          <div class="container">
              <h2 class="section-title">Galeri</h2>
              <p class="section-subtitle">Lihat suasana toko dan produk kami</p>
              <div class="gallery-grid">
                  {{GALLERY_ITEMS}}
              </div>
          </div>
      </section>
    `;
  }
  
  return template
    .replace('{{CATEGORY_DISPLAY}}', 'Toko & Retail')
    .replace('{{TAGLINE}}', businessData.tagline || 'Temukan produk berkualitas dengan harga terbaik')
    .replace('{{HERO_BUTTONS}}', `
      <a href="#products" class="btn">Lihat Produk</a>
      ${businessData.whatsapp ? `<a href="{{WHATSAPP_URL}}" class="btn btn-success" target="_blank">💬 WhatsApp</a>` : ''}
    `)
    .replace('{{CONTENT_SECTIONS}}', contentSections);
}

// Service template
export function getServiceTemplate(businessData, colorScheme) {
  // Normalize data structure
  const normalizedData = {
    name: businessData.businessName || '',
    description: businessData.description || '',
    category: businessData.category || 'service',
    services: Array.isArray(businessData.products) ? businessData.products : [],
    phone: businessData.phone || '',
    whatsapp: businessData.whatsapp || businessData.phone || '',
    instagram: businessData.instagram || '',
    email: businessData.email || '',
    address: businessData.address || ''
  };

  const template = getBaseTemplate(colorScheme, normalizedData);
  
  let contentSections = '';
  
  if (normalizedData.services && normalizedData.services.length > 0) {
    contentSections += `
      <section id="services" class="section">
          <div class="container">
              <h2 class="section-title">Layanan Kami</h2>
              <p class="section-subtitle">Berbagai layanan profesional yang kami tawarkan</p>
              <div class="service-grid">
                ${normalizedData.services.map(category => `
                  <div class="category-section">
                    <h3 class="category-title">${category.name}</h3>
                    <div class="service-list">
                      ${category.items.map(service => `
                        <div class="service-card">
                          <h4>${service.name}</h4>
                          ${service.description ? `<p>${service.description}</p>` : ''}
                          ${service.price ? `<p class="price">Rp ${service.price.toLocaleString('id-ID')}</p>` : ''}
                        </div>
                      `).join('')}
                    </div>
                  </div>
                `).join('')}
              </div>
          </div>
      </section>
    `;
  }
  
  if (businessData.testimonials && businessData.testimonials.length > 0) {
    contentSections += `
      <section id="testimonials" class="section">
          <div class="container">
              <h2 class="section-title">Testimoni Klien</h2>
              <p class="section-subtitle">Apa kata klien kami tentang layanan kami</p>
              <div class="testimonial-grid">
                  {{TESTIMONIAL_ITEMS}}
              </div>
          </div>
      </section>
    `;
  }
  
  if (businessData.gallery && businessData.gallery.length > 0) {
    contentSections += `
      <section id="gallery" class="section">
          <div class="container">
              <h2 class="section-title">Galeri</h2>
              <p class="section-subtitle">Lihat hasil kerja dan suasana kantor kami</p>
              <div class="gallery-grid">
                  {{GALLERY_ITEMS}}
              </div>
          </div>
      </section>
    `;
  }
  
  return template
    .replace('{{CATEGORY_DISPLAY}}', 'Layanan Profesional')
    .replace('{{TAGLINE}}', businessData.tagline || 'Layanan profesional untuk memenuhi kebutuhan Anda')
    .replace('{{HERO_BUTTONS}}', `
      <a href="#services" class="btn">Lihat Layanan</a>
      ${businessData.whatsapp ? `<a href="{{WHATSAPP_URL}}" class="btn btn-success" target="_blank">💬 WhatsApp</a>` : ''}
    `)
    .replace('{{CONTENT_SECTIONS}}', contentSections);
}

// Process template with business data
export function processTemplate(template, businessData) {
  let html = template;
  
  // Normalize the business data
  const normalizedData = {
    businessName: businessData.businessName || businessData.name || '',
    ownerName: businessData.ownerName || '',
    description: businessData.description || '',
    category: businessData.category || '',
    products: Array.isArray(businessData.products) ? businessData.products : 
             typeof businessData.products === 'string' ? [{
               name: 'Menu',
               items: businessData.products.split(',').map(item => ({
                 name: item.trim(),
                 price: 0,
                 description: ''
               }))
             }] : [],
    phone: businessData.phone || '',
    email: businessData.email || '',
    address: businessData.address || '',
    whatsapp: businessData.whatsapp || businessData.phone || '',
    instagram: businessData.instagram || '',
    logoUrl: businessData.logoUrl || '/default-logo.png',
    websiteUrl: businessData.websiteUrl || ''
  };
  
  // Basic replacements
  const replacements = {
    '{{BUSINESS_NAME}}': normalizedData.businessName,
    '{{OWNER_NAME}}': normalizedData.ownerName,
    '{{DESCRIPTION}}': normalizedData.description,
    '{{CATEGORY}}': normalizedData.category,
    '{{PHONE}}': normalizedData.phone,
    '{{EMAIL}}': normalizedData.email,
    '{{ADDRESS}}': normalizedData.address,
    '{{WHATSAPP}}': normalizedData.whatsapp,
    '{{INSTAGRAM}}': normalizedData.instagram,
    '{{LOGO_URL}}': normalizedData.logoUrl,
    '{{WEBSITE_URL}}': normalizedData.websiteUrl,
    '{{GOOGLE_MAPS_URL}}': generateGoogleMapsUrl(normalizedData.address),
    '{{WHATSAPP_URL}}': generateWhatsAppUrl(normalizedData.whatsapp),
    '{{INSTAGRAM_URL}}': generateInstagramUrl(normalizedData.instagram),
    '{{CURRENT_YEAR}}': new Date().getFullYear().toString()
  };
  
  Object.entries(replacements).forEach(([placeholder, value]) => {
    html = html.replace(new RegExp(placeholder, 'g'), value);
  });
  
  // Process menu items
  if (businessData.menu && businessData.menu.length > 0) {
    const menuItems = businessData.menu.map(category => `
      <div class="menu-item">
        <h3>${category.name}</h3>
        ${category.items.map(item => `
          <div style="margin: 1rem 0; padding: 1rem; border-bottom: 1px solid #eee;">
            <h4>${item.name}</h4>
            ${item.description ? `<p style="color: #666; margin: 0.5rem 0;">${item.description}</p>` : ''}
            <p class="price">Rp ${item.price.toLocaleString('id-ID')}</p>
            ${!item.available ? '<span style="color: #e74c3c; font-size: 0.875rem;">Habis</span>' : ''}
          </div>
        `).join('')}
      </div>
    `).join('');
    html = html.replace('{{MENU_ITEMS}}', menuItems);
  }
  
  // Process product items
  if (businessData.products && businessData.products.length > 0) {
    const productItems = businessData.products.map(product => `
      <div class="product-item">
        ${product.image ? `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;">` : ''}
        <h3>${product.name}</h3>
        ${product.description ? `<p style="color: #666; margin: 0.5rem 0;">${product.description}</p>` : ''}
        ${product.price ? `<p class="price">Rp ${(product.price || 0).toLocaleString('id-ID')}</p>` : ''}
        ${!product.available ? '<span style="color: #e74c3c; font-size: 0.875rem;">Stok Habis</span>' : ''}
      </div>
    `).join('');
    html = html.replace('{{PRODUCT_ITEMS}}', productItems);
  }
  
  // Process service items
  if (businessData.services && businessData.services.length > 0) {
    const serviceItems = businessData.services.map(service => `
      <div class="service-item">
        ${service.icon ? `<div style="font-size: 3rem; margin-bottom: 1rem;">${service.icon}</div>` : ''}
        <h3>${service.name}</h3>
        <p style="color: #666; margin: 0.5rem 0;">${service.description}</p>
        ${service.price ? `<p class="price">${typeof service.price === 'number' ? `Rp ${service.price.toLocaleString('id-ID')}` : service.price}</p>` : ''}
        ${service.features ? `
          <ul style="margin: 1rem 0; padding-left: 1.5rem;">
            ${service.features.map(feature => `<li>${feature}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
    `).join('');
    html = html.replace('{{SERVICE_ITEMS}}', serviceItems);
  }
  
  // Process gallery items
  if (businessData.gallery && businessData.gallery.length > 0) {
    const galleryItems = businessData.gallery.map(image => `
      <div class="gallery-item">
        <img src="${image.url}" alt="${image.caption || 'Gallery image'}" />
        ${image.caption ? `<p style="padding: 1rem; margin: 0; background: white;">${image.caption}</p>` : ''}
      </div>
    `).join('');
    html = html.replace('{{GALLERY_ITEMS}}', galleryItems);
  }
  
  // Process testimonial items
  if (businessData.testimonials && businessData.testimonials.length > 0) {
    const testimonialItems = businessData.testimonials.map(testimonial => `
      <div class="testimonial">
        <p>"${testimonial.message}"</p>
        <p class="testimonial-author">- ${testimonial.name}</p>
        ${testimonial.position ? `<p style="color: #666; font-size: 0.875rem;">${testimonial.position}</p>` : ''}
        ${testimonial.rating ? `
          <div class="rating">
            ${'⭐'.repeat(testimonial.rating)}
          </div>
        ` : ''}
      </div>
    `).join('');
    html = html.replace('{{TESTIMONIAL_ITEMS}}', testimonialItems);
  }
  
  // Process contact info
  const contactInfo = [];
  if (businessData.phone) {
    contactInfo.push(`<div><strong>📞 Telepon:</strong> <a href="tel:${businessData.phone}" style="color: white;">${businessData.phone}</a></div>`);
  }
  if (businessData.whatsapp) {
    contactInfo.push(`<div><strong>💬 WhatsApp:</strong> <a href="{{WHATSAPP_URL}}" style="color: white;" target="_blank">${businessData.whatsapp}</a></div>`);
  }
  if (businessData.email) {
    contactInfo.push(`<div><strong>✉️ Email:</strong> <a href="mailto:${businessData.email}" style="color: white;">${businessData.email}</a></div>`);
  }
  if (businessData.address) {
    contactInfo.push(`<div><strong>📍 Alamat:</strong> <a href="{{GOOGLE_MAPS_URL}}" style="color: white;" target="_blank">${businessData.address}</a></div>`);
  }
  if (businessData.instagram) {
    contactInfo.push(`<div><strong>📷 Instagram:</strong> <a href="{{INSTAGRAM_URL}}" style="color: white;" target="_blank">@${businessData.instagram}</a></div>`);
  }
  
  html = html.replace('{{CONTACT_INFO}}', contactInfo.join(''));
  
  return html;
}

// Generate URLs
function generateGoogleMapsUrl(address) {
  if (!address) return '#';
  const encodedAddress = encodeURIComponent(address);
  return `https://maps.google.com/?q=${encodedAddress}`;
}

function generateWhatsAppUrl(phone) {
  if (!phone) return '#';
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const whatsappPhone = cleanPhone.startsWith('62') ? cleanPhone : `62${cleanPhone}`;
  return `https://wa.me/${whatsappPhone}`;
}

function generateInstagramUrl(instagram) {
  if (!instagram) return '#';
  return `https://instagram.com/${instagram}`;
}

// Main template loading function
// export async function loadTemplate(category, businessData, customTheme = null) {
//   const colorScheme = getColorScheme(category, customTheme);
  
//   let template;
//   switch (category) {
//     case 'restaurant':
//       template = getRestaurantTemplate(businessData, colorScheme);
//       break;
//     case 'retail':
//       template = getRetailTemplate(businessData, colorScheme);
//       break;
//     case 'service':
//       template = getServiceTemplate(businessData, colorScheme);
//       break;
//     default:
//       template = getRetailTemplate(businessData, colorScheme); // Default to retail
//   }
  
//   return processTemplate(template, businessData);
// }

// Get available color themes
export function getAvailableThemes() {
  return {
    default: 'Default (Category-based)',
    modern: 'Modern',
    elegant: 'Elegant',
    vibrant: 'Vibrant',
    minimal: 'Minimal'
  };
} 