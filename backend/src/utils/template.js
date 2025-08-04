// Template loading and processing utilities
// Updated to use the new integrated template system with color customization

import { loadTemplate as loadNewTemplate, getAvailableThemes } from './template-system.js';

// Legacy template loading for backward compatibility
const templates = {
  restaurant: getRestaurantTemplate(),
  retail: getRetailTemplate(),
  service: getServiceTemplate(),
  other: getDefaultTemplate()
};

export async function loadTemplate(category, businessData = {}, theme = null) {
  // Normalize the business data structure
  const normalizedData = normalizeBusinessData(businessData);
  
  // Use the new integrated template system with theme support
  return await loadNewTemplate(category, normalizedData, theme);
}

function normalizeBusinessData(data) {
  const normalized = { ...data };

  // Convert products to standardized menu format
  if (typeof data.products === 'string') {
    normalized.menu = [{
      name: 'Menu',
      items: data.products.split(',').map(item => ({
        name: item.trim(),
        price: 0,
        description: ''
      }))
    }];
  } else if (Array.isArray(data.products)) {
    normalized.menu = data.products;
  }

  // Ensure both products and menu are available
  normalized.products = normalized.menu || [];

  return normalized;
}

export function processTemplate(template, businessData) {
  // Convert products array to menu format if needed
  let normalizedData = { ...businessData };
  
  if (Array.isArray(businessData.products)) {
    normalizedData.menu = businessData.products;
  } else if (typeof businessData.products === 'string') {
    // Convert string format to menu structure
    normalizedData.menu = [{
      name: 'Menu',
      items: businessData.products.split(',').map(item => ({
        name: item.trim(),
        price: 0,
        description: ''
      }))
    }];
  }
  
  // Handle both menu and products in templates
  normalizedData.products = normalizedData.menu;
  
  return loadTemplate(businessData.category || 'other', normalizedData);
}

// Legacy template functions (kept for backward compatibility)
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

// Legacy template functions (simplified versions)
function getRestaurantTemplate() {
  return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{BUSINESS_NAME}} - Restoran & Kuliner</title>
    <meta name="description" content="{{DESCRIPTION}}">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #ff6b6b, #ee5a24); color: white; padding: 2rem 0; text-align: center; }
        .logo { width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 1rem; display: block; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
        .hero { background: #f8f9fa; padding: 3rem 0; text-align: center; }
        .section { padding: 3rem 0; }
        .menu-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin: 2rem 0; }
        .menu-item { background: white; border-radius: 10px; padding: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .contact-info { background: #2c3e50; color: white; padding: 2rem; border-radius: 10px; margin: 2rem 0; }
        .contact-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; }
        .btn { display: inline-block; padding: 12px 24px; background: #e74c3c; color: white; text-decoration: none; border-radius: 5px; margin: 0.5rem; }
        .btn:hover { background: #c0392b; }
        .footer { background: #34495e; color: white; text-align: center; padding: 2rem 0; margin-top: 3rem; }
        @media (max-width: 768px) { .container { padding: 0 0.5rem; } }
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <img src="{{LOGO_URL}}" alt="{{BUSINESS_NAME}}" class="logo">
            <h1>{{BUSINESS_NAME}}</h1>
            <p>Restoran & Kuliner Terbaik</p>
        </div>
    </header>

    <section class="hero">
        <div class="container">
            <h2>Selamat Datang di {{BUSINESS_NAME}}</h2>
            <p>{{DESCRIPTION}}</p>
            <a href="#menu" class="btn">Lihat Menu</a>
            <a href="{{WHATSAPP_URL}}" class="btn" target="_blank">💬 WhatsApp</a>
        </div>
    </section>

    <section id="menu" class="section">
        <div class="container">
            <h2>Menu Favorit</h2>
            <div class="menu-grid">
                <div class="menu-item">
                    <h3>Makanan Utama</h3>
                    <p>{{PRODUCTS}}</p>
                </div>
            </div>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <div class="contact-info">
                <h3>Hubungi Kami</h3>
                <div class="contact-grid">
                    <div><strong>📞 Telepon:</strong> <a href="tel:{{PHONE}}" style="color: white;">{{PHONE}}</a></div>
                    <div><strong>💬 WhatsApp:</strong> <a href="{{WHATSAPP_URL}}" style="color: white;" target="_blank">{{WHATSAPP}}</a></div>
                    <div><strong>📍 Alamat:</strong> <a href="{{GOOGLE_MAPS_URL}}" style="color: white;" target="_blank">{{ADDRESS}}</a></div>
                    <div><strong>📷 Instagram:</strong> <a href="{{INSTAGRAM_URL}}" style="color: white;" target="_blank">@{{INSTAGRAM}}</a></div>
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

function getRetailTemplate() {
  return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{BUSINESS_NAME}} - Toko & Retail</title>
    <meta name="description" content="{{DESCRIPTION}}">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #3498db, #2980b9); color: white; padding: 2rem 0; text-align: center; }
        .logo { width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 1rem; display: block; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
        .hero { background: #ecf0f1; padding: 3rem 0; text-align: center; }
        .section { padding: 3rem 0; }
        .product-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin: 2rem 0; }
        .product-item { background: white; border-radius: 10px; padding: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .contact-info { background: #2c3e50; color: white; padding: 2rem; border-radius: 10px; margin: 2rem 0; }
        .contact-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; }
        .btn { display: inline-block; padding: 12px 24px; background: #3498db; color: white; text-decoration: none; border-radius: 5px; margin: 0.5rem; }
        .btn:hover { background: #2980b9; }
        .footer { background: #34495e; color: white; text-align: center; padding: 2rem 0; margin-top: 3rem; }
        @media (max-width: 768px) { .container { padding: 0 0.5rem; } }
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <img src="{{LOGO_URL}}" alt="{{BUSINESS_NAME}}" class="logo">
            <h1>{{BUSINESS_NAME}}</h1>
            <p>Toko & Retail Terpercaya</p>
        </div>
    </header>

    <section class="hero">
        <div class="container">
            <h2>Selamat Datang di {{BUSINESS_NAME}}</h2>
            <p>{{DESCRIPTION}}</p>
            <a href="#products" class="btn">Lihat Produk</a>
            <a href="{{WHATSAPP_URL}}" class="btn" target="_blank">💬 WhatsApp</a>
        </div>
    </section>

    <section id="products" class="section">
        <div class="container">
            <h2>Produk Unggulan</h2>
            <div class="product-grid">
                <div class="product-item">
                    <h3>Produk Kami</h3>
                    <p>{{PRODUCTS}}</p>
                </div>
            </div>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <div class="contact-info">
                <h3>Hubungi Kami</h3>
                <div class="contact-grid">
                    <div><strong>📞 Telepon:</strong> <a href="tel:{{PHONE}}" style="color: white;">{{PHONE}}</a></div>
                    <div><strong>💬 WhatsApp:</strong> <a href="{{WHATSAPP_URL}}" style="color: white;" target="_blank">{{WHATSAPP}}</a></div>
                    <div><strong>📍 Alamat:</strong> <a href="{{GOOGLE_MAPS_URL}}" style="color: white;" target="_blank">{{ADDRESS}}</a></div>
                    <div><strong>📷 Instagram:</strong> <a href="{{INSTAGRAM_URL}}" style="color: white;" target="_blank">@{{INSTAGRAM}}</a></div>
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

function getServiceTemplate() {
  return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{BUSINESS_NAME}} - Layanan Profesional</title>
    <meta name="description" content="{{DESCRIPTION}}">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #9b59b6, #8e44ad); color: white; padding: 2rem 0; text-align: center; }
        .logo { width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 1rem; display: block; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
        .hero { background: #f8f9fa; padding: 3rem 0; text-align: center; }
        .section { padding: 3rem 0; }
        .service-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin: 2rem 0; }
        .service-item { background: white; border-radius: 10px; padding: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .contact-info { background: #2c3e50; color: white; padding: 2rem; border-radius: 10px; margin: 2rem 0; }
        .contact-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; }
        .btn { display: inline-block; padding: 12px 24px; background: #9b59b6; color: white; text-decoration: none; border-radius: 5px; margin: 0.5rem; }
        .btn:hover { background: #8e44ad; }
        .footer { background: #34495e; color: white; text-align: center; padding: 2rem 0; margin-top: 3rem; }
        @media (max-width: 768px) { .container { padding: 0 0.5rem; } }
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <img src="{{LOGO_URL}}" alt="{{BUSINESS_NAME}}" class="logo">
            <h1>{{BUSINESS_NAME}}</h1>
            <p>Layanan Profesional</p>
        </div>
    </header>

    <section class="hero">
        <div class="container">
            <h2>Selamat Datang di {{BUSINESS_NAME}}</h2>
            <p>{{DESCRIPTION}}</p>
            <a href="#services" class="btn">Lihat Layanan</a>
            <a href="{{WHATSAPP_URL}}" class="btn" target="_blank">💬 WhatsApp</a>
        </div>
    </section>

    <section id="services" class="section">
        <div class="container">
            <h2>Layanan Kami</h2>
            <div class="service-grid">
                <div class="service-item">
                    <h3>Layanan Profesional</h3>
                    <p>{{PRODUCTS}}</p>
                </div>
            </div>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <div class="contact-info">
                <h3>Hubungi Kami</h3>
                <div class="contact-grid">
                    <div><strong>📞 Telepon:</strong> <a href="tel:{{PHONE}}" style="color: white;">{{PHONE}}</a></div>
                    <div><strong>💬 WhatsApp:</strong> <a href="{{WHATSAPP_URL}}" style="color: white;" target="_blank">{{WHATSAPP}}</a></div>
                    <div><strong>📍 Alamat:</strong> <a href="{{GOOGLE_MAPS_URL}}" style="color: white;" target="_blank">{{ADDRESS}}</a></div>
                    <div><strong>📷 Instagram:</strong> <a href="{{INSTAGRAM_URL}}" style="color: white;" target="_blank">@{{INSTAGRAM}}</a></div>
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

function getDefaultTemplate() {
  return getRetailTemplate(); // Default to retail template
}

// Export the new theme functionality
export { getAvailableThemes }; 