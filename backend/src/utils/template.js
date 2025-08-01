// Template loading and processing utilities
const templates = {
  restaurant: getRestaurantTemplate(),
  retail: getRetailTemplate(),
  service: getServiceTemplate(),
  other: getDefaultTemplate()
};

export async function loadTemplate(category) {
  return templates[category] || templates.other;
}

export function processTemplate(template, businessData) {
  let html = template;
  
  // Replace all placeholders with business data
  const replacements = {
    '{{BUSINESS_NAME}}': businessData.businessName || '',
    '{{OWNER_NAME}}': businessData.ownerName || '',
    '{{DESCRIPTION}}': businessData.description || '',
    '{{CATEGORY}}': businessData.category || '',
    '{{PRODUCTS}}': businessData.products || '',
    '{{PHONE}}': businessData.phone || '',
    '{{EMAIL}}': businessData.email || '',
    '{{ADDRESS}}': businessData.address || '',
    '{{WHATSAPP}}': businessData.whatsapp || '',
    '{{INSTAGRAM}}': businessData.instagram || '',
    '{{LOGO_URL}}': businessData.logoUrl || '/default-logo.png',
    '{{WEBSITE_URL}}': businessData.websiteUrl || '',
    '{{GOOGLE_MAPS_URL}}': generateGoogleMapsUrl(businessData.address),
    '{{WHATSAPP_URL}}': generateWhatsAppUrl(businessData.whatsapp || businessData.phone),
    '{{INSTAGRAM_URL}}': generateInstagramUrl(businessData.instagram),
    '{{CURRENT_YEAR}}': new Date().getFullYear().toString()
  };
  
  Object.entries(replacements).forEach(([placeholder, value]) => {
    html = html.replace(new RegExp(placeholder, 'g'), value);
  });
  
  return html;
}

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
        </div>
    </section>

    <section class="section" id="menu">
        <div class="container">
            <h2>Menu & Layanan</h2>
            <div class="menu-grid">
                <div class="menu-item">
                    <h3>Produk & Layanan</h3>
                    <p>{{PRODUCTS}}</p>
                </div>
                <div class="menu-item">
                    <h3>Jam Operasional</h3>
                    <p>Senin - Minggu: 08:00 - 22:00</p>
                </div>
            </div>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <div class="contact-info">
                <h2>Hubungi Kami</h2>
                <div class="contact-grid">
                    <div>
                        <h3>Telepon</h3>
                        <p><a href="tel:{{PHONE}}" style="color: white;">{{PHONE}}</a></p>
                    </div>
                    <div>
                        <h3>WhatsApp</h3>
                        <p><a href="{{WHATSAPP_URL}}" style="color: white;">{{WHATSAPP}}</a></p>
                    </div>
                    <div>
                        <h3>Alamat</h3>
                        <p><a href="{{GOOGLE_MAPS_URL}}" style="color: white;">{{ADDRESS}}</a></p>
                    </div>
                    <div>
                        <h3>Instagram</h3>
                        <p><a href="{{INSTAGRAM_URL}}" style="color: white;">@{{INSTAGRAM}}</a></p>
                    </div>
                </div>
                <div style="text-align: center; margin-top: 2rem;">
                    <a href="{{WHATSAPP_URL}}" class="btn">Pesan Sekarang</a>
                    <a href="{{GOOGLE_MAPS_URL}}" class="btn">Lihat Lokasi</a>
                </div>
            </div>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <p>&copy; {{CURRENT_YEAR}} {{BUSINESS_NAME}}. Dibuat dengan ❤️ untuk UMKM Indonesia.</p>
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
        .hero { background: #f8f9fa; padding: 3rem 0; text-align: center; }
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
        </div>
    </section>

    <section class="section" id="products">
        <div class="container">
            <h2>Produk & Layanan</h2>
            <div class="product-grid">
                <div class="product-item">
                    <h3>Produk Unggulan</h3>
                    <p>{{PRODUCTS}}</p>
                </div>
                <div class="product-item">
                    <h3>Jam Operasional</h3>
                    <p>Senin - Minggu: 09:00 - 21:00</p>
                </div>
            </div>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <div class="contact-info">
                <h2>Hubungi Kami</h2>
                <div class="contact-grid">
                    <div>
                        <h3>Telepon</h3>
                        <p><a href="tel:{{PHONE}}" style="color: white;">{{PHONE}}</a></p>
                    </div>
                    <div>
                        <h3>WhatsApp</h3>
                        <p><a href="{{WHATSAPP_URL}}" style="color: white;">{{WHATSAPP}}</a></p>
                    </div>
                    <div>
                        <h3>Alamat</h3>
                        <p><a href="{{GOOGLE_MAPS_URL}}" style="color: white;">{{ADDRESS}}</a></p>
                    </div>
                    <div>
                        <h3>Instagram</h3>
                        <p><a href="{{INSTAGRAM_URL}}" style="color: white;">@{{INSTAGRAM}}</a></p>
                    </div>
                </div>
                <div style="text-align: center; margin-top: 2rem;">
                    <a href="{{WHATSAPP_URL}}" class="btn">Pesan Sekarang</a>
                    <a href="{{GOOGLE_MAPS_URL}}" class="btn">Lihat Lokasi</a>
                </div>
            </div>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <p>&copy; {{CURRENT_YEAR}} {{BUSINESS_NAME}}. Dibuat dengan ❤️ untuk UMKM Indonesia.</p>
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
    <title>{{BUSINESS_NAME}} - Jasa & Layanan</title>
    <meta name="description" content="{{DESCRIPTION}}">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #27ae60, #2ecc71); color: white; padding: 2rem 0; text-align: center; }
        .logo { width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 1rem; display: block; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
        .hero { background: #f8f9fa; padding: 3rem 0; text-align: center; }
        .section { padding: 3rem 0; }
        .service-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin: 2rem 0; }
        .service-item { background: white; border-radius: 10px; padding: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .contact-info { background: #2c3e50; color: white; padding: 2rem; border-radius: 10px; margin: 2rem 0; }
        .contact-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; }
        .btn { display: inline-block; padding: 12px 24px; background: #27ae60; color: white; text-decoration: none; border-radius: 5px; margin: 0.5rem; }
        .btn:hover { background: #229954; }
        .footer { background: #34495e; color: white; text-align: center; padding: 2rem 0; margin-top: 3rem; }
        @media (max-width: 768px) { .container { padding: 0 0.5rem; } }
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <img src="{{LOGO_URL}}" alt="{{BUSINESS_NAME}}" class="logo">
            <h1>{{BUSINESS_NAME}}</h1>
            <p>Jasa & Layanan Profesional</p>
        </div>
    </header>

    <section class="hero">
        <div class="container">
            <h2>Selamat Datang di {{BUSINESS_NAME}}</h2>
            <p>{{DESCRIPTION}}</p>
            <a href="#services" class="btn">Lihat Layanan</a>
        </div>
    </section>

    <section class="section" id="services">
        <div class="container">
            <h2>Layanan Kami</h2>
            <div class="service-grid">
                <div class="service-item">
                    <h3>Layanan Utama</h3>
                    <p>{{PRODUCTS}}</p>
                </div>
                <div class="service-item">
                    <h3>Jam Operasional</h3>
                    <p>Senin - Jumat: 08:00 - 17:00</p>
                </div>
            </div>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <div class="contact-info">
                <h2>Hubungi Kami</h2>
                <div class="contact-grid">
                    <div>
                        <h3>Telepon</h3>
                        <p><a href="tel:{{PHONE}}" style="color: white;">{{PHONE}}</a></p>
                    </div>
                    <div>
                        <h3>WhatsApp</h3>
                        <p><a href="{{WHATSAPP_URL}}" style="color: white;">{{WHATSAPP}}</a></p>
                    </div>
                    <div>
                        <h3>Alamat</h3>
                        <p><a href="{{GOOGLE_MAPS_URL}}" style="color: white;">{{ADDRESS}}</a></p>
                    </div>
                    <div>
                        <h3>Instagram</h3>
                        <p><a href="{{INSTAGRAM_URL}}" style="color: white;">@{{INSTAGRAM}}</a></p>
                    </div>
                </div>
                <div style="text-align: center; margin-top: 2rem;">
                    <a href="{{WHATSAPP_URL}}" class="btn">Konsultasi Sekarang</a>
                    <a href="{{GOOGLE_MAPS_URL}}" class="btn">Lihat Lokasi</a>
                </div>
            </div>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <p>&copy; {{CURRENT_YEAR}} {{BUSINESS_NAME}}. Dibuat dengan ❤️ untuk UMKM Indonesia.</p>
        </div>
    </footer>
</body>
</html>`;
}

function getDefaultTemplate() {
  return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{BUSINESS_NAME}} - UMKM Digital</title>
    <meta name="description" content="{{DESCRIPTION}}">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #9b59b6, #8e44ad); color: white; padding: 2rem 0; text-align: center; }
        .logo { width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 1rem; display: block; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
        .hero { background: #f8f9fa; padding: 3rem 0; text-align: center; }
        .section { padding: 3rem 0; }
        .content-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin: 2rem 0; }
        .content-item { background: white; border-radius: 10px; padding: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
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
            <p>UMKM Digital Indonesia</p>
        </div>
    </header>

    <section class="hero">
        <div class="container">
            <h2>Selamat Datang di {{BUSINESS_NAME}}</h2>
            <p>{{DESCRIPTION}}</p>
            <a href="#about" class="btn">Tentang Kami</a>
        </div>
    </section>

    <section class="section" id="about">
        <div class="container">
            <h2>Tentang Kami</h2>
            <div class="content-grid">
                <div class="content-item">
                    <h3>Produk & Layanan</h3>
                    <p>{{PRODUCTS}}</p>
                </div>
                <div class="content-item">
                    <h3>Jam Operasional</h3>
                    <p>Senin - Minggu: 08:00 - 20:00</p>
                </div>
            </div>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <div class="contact-info">
                <h2>Hubungi Kami</h2>
                <div class="contact-grid">
                    <div>
                        <h3>Telepon</h3>
                        <p><a href="tel:{{PHONE}}" style="color: white;">{{PHONE}}</a></p>
                    </div>
                    <div>
                        <h3>WhatsApp</h3>
                        <p><a href="{{WHATSAPP_URL}}" style="color: white;">{{WHATSAPP}}</a></p>
                    </div>
                    <div>
                        <h3>Alamat</h3>
                        <p><a href="{{GOOGLE_MAPS_URL}}" style="color: white;">{{ADDRESS}}</a></p>
                    </div>
                    <div>
                        <h3>Instagram</h3>
                        <p><a href="{{INSTAGRAM_URL}}" style="color: white;">@{{INSTAGRAM}}</a></p>
                    </div>
                </div>
                <div style="text-align: center; margin-top: 2rem;">
                    <a href="{{WHATSAPP_URL}}" class="btn">Hubungi Sekarang</a>
                    <a href="{{GOOGLE_MAPS_URL}}" class="btn">Lihat Lokasi</a>
                </div>
            </div>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <p>&copy; {{CURRENT_YEAR}} {{BUSINESS_NAME}}. Dibuat dengan ❤️ untuk UMKM Indonesia.</p>
        </div>
    </footer>
</body>
</html>`;
} 