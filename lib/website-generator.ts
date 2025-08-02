import { BusinessData } from './api';

export interface GeneratedWebsite {
  html: string;
  css: string;
  js: string;
  assets: {
    logo?: string;
    images: string[];
  };
}

export class WebsiteGenerator {
  private businessData: BusinessData;

  constructor(businessData: BusinessData) {
    this.businessData = businessData;
  }

  generate(): GeneratedWebsite {
    return {
      html: this.generateHTML(),
      css: this.generateCSS(),
      js: this.generateJS(),
      assets: {
        images: this.generateImages()
      }
    };
  }

  private generateHTML(): string {
    const { businessName, ownerName, description, category, products, phone, email, address, whatsapp, instagram } = this.businessData;
    
    const whatsappUrl = whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, '')}` : '';
    const instagramUrl = instagram ? `https://instagram.com/${instagram.replace('@', '')}` : '';
    const googleMapsUrl = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
    
    return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${businessName} - UMKM Go Digital</title>
    <meta name="description" content="${description}">
    <meta name="keywords" content="${businessName}, ${category}, UMKM, Indonesia">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="${businessName}">
    <meta property="og:description" content="${description}">
    <meta property="og:type" content="website">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏪</text></svg>">
    
    <style id="generated-css">
        /* CSS will be injected here */
    </style>
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="container">
            <div class="header-content">
                <div class="logo">
                    <h1>${businessName}</h1>
                    <p class="tagline">UMKM Go Digital</p>
                </div>
                <nav class="nav">
                    <a href="#beranda" class="nav-link">Beranda</a>
                    <a href="#tentang" class="nav-link">Tentang</a>
                    <a href="#produk" class="nav-link">Produk</a>
                    <a href="#kontak" class="nav-link">Kontak</a>
                </nav>
            </div>
        </div>
    </header>

    <!-- Hero Section -->
    <section id="beranda" class="hero">
        <div class="container">
            <div class="hero-content">
                <h2 class="hero-title">Selamat Datang di ${businessName}</h2>
                <p class="hero-description">${description}</p>
                <div class="hero-buttons">
                    <a href="#produk" class="btn btn-primary">Lihat Produk</a>
                    <a href="#kontak" class="btn btn-secondary">Hubungi Kami</a>
                </div>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="tentang" class="about">
        <div class="container">
            <h2 class="section-title">Tentang Kami</h2>
            <div class="about-content">
                <div class="about-text">
                    <p>${description}</p>
                    <div class="business-info">
                        <div class="info-item">
                            <strong>Pemilik:</strong> ${ownerName}
                        </div>
                        <div class="info-item">
                            <strong>Kategori:</strong> ${this.getCategoryDisplayName(category)}
                        </div>
                        <div class="info-item">
                            <strong>Alamat:</strong> ${address}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Products Section -->
    <section id="produk" class="products">
        <div class="container">
            <h2 class="section-title">Produk & Layanan</h2>
            <div class="products-content">
                <div class="products-text">
                    <p>${products}</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="kontak" class="contact">
        <div class="container">
            <h2 class="section-title">Hubungi Kami</h2>
            <div class="contact-content">
                <div class="contact-info">
                    <div class="contact-item">
                        <div class="contact-icon">📞</div>
                        <div class="contact-details">
                            <h3>Telepon</h3>
                            <p><a href="tel:${phone}">${phone}</a></p>
                        </div>
                    </div>
                    
                    ${email ? `
                    <div class="contact-item">
                        <div class="contact-icon">📧</div>
                        <div class="contact-details">
                            <h3>Email</h3>
                            <p><a href="mailto:${email}">${email}</a></p>
                        </div>
                    </div>
                    ` : ''}
                    
                    <div class="contact-item">
                        <div class="contact-icon">📍</div>
                        <div class="contact-details">
                            <h3>Alamat</h3>
                            <p><a href="${googleMapsUrl}" target="_blank">${address}</a></p>
                        </div>
                    </div>
                </div>
                
                <div class="social-links">
                    ${whatsapp ? `
                    <a href="${whatsappUrl}" class="social-link whatsapp" target="_blank">
                        <span class="social-icon">💬</span>
                        <span>WhatsApp</span>
                    </a>
                    ` : ''}
                    
                    ${instagram ? `
                    <a href="${instagramUrl}" class="social-link instagram" target="_blank">
                        <span class="social-icon">📷</span>
                        <span>Instagram</span>
                    </a>
                    ` : ''}
                    
                    <a href="${googleMapsUrl}" class="social-link maps" target="_blank">
                        <span class="social-icon">🗺️</span>
                        <span>Google Maps</span>
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <p>&copy; 2024 ${businessName}. Dibuat dengan ❤️ oleh UMKM Go Digital</p>
            </div>
        </div>
    </footer>

    <script id="generated-js">
        // JavaScript will be injected here
    </script>
</body>
</html>`;
  }

  private generateCSS(): string {
    return `
/* Reset and Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f8f9fa;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Header Styles */
.header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1rem 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo h1 {
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 0.2rem;
}

.tagline {
    font-size: 0.9rem;
    opacity: 0.9;
}

.nav {
    display: flex;
    gap: 2rem;
}

.nav-link {
    color: white;
    text-decoration: none;
    font-weight: 500;
    transition: opacity 0.3s ease;
}

.nav-link:hover {
    opacity: 0.8;
}

/* Hero Section */
.hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 120px 0 80px;
    text-align: center;
}

.hero-title {
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: 1rem;
    animation: fadeInUp 1s ease;
}

.hero-description {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    opacity: 0.9;
}

.hero-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

.btn {
    display: inline-block;
    padding: 12px 30px;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
}

.btn-primary {
    background: #ff6b6b;
    color: white;
}

.btn-primary:hover {
    background: #ff5252;
    transform: translateY(-2px);
}

.btn-secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
}

.btn-secondary:hover {
    background: white;
    color: #667eea;
}

/* Section Styles */
section {
    padding: 80px 0;
}

.section-title {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: #333;
    position: relative;
}

.section-title::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
}

/* About Section */
.about {
    background: white;
}

.about-content {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
}

.about-text p {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    line-height: 1.8;
}

.business-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
}

.info-item {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 10px;
    border-left: 4px solid #667eea;
}

/* Products Section */
.products {
    background: #f8f9fa;
}

.products-content {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
}

.products-text p {
    font-size: 1.1rem;
    line-height: 1.8;
    background: white;
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

/* Contact Section */
.contact {
    background: white;
}

.contact-content {
    max-width: 1000px;
    margin: 0 auto;
}

.contact-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
}

.contact-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 10px;
    transition: transform 0.3s ease;
}

.contact-item:hover {
    transform: translateY(-5px);
}

.contact-icon {
    font-size: 2rem;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    color: white;
}

.contact-details h3 {
    margin-bottom: 0.5rem;
    color: #333;
}

.contact-details a {
    color: #667eea;
    text-decoration: none;
}

.contact-details a:hover {
    text-decoration: underline;
}

/* Social Links */
.social-links {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
}

.social-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 12px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-decoration: none;
    border-radius: 50px;
    transition: all 0.3s ease;
    font-weight: 600;
}

.social-link:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.social-link.whatsapp {
    background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
}

.social-link.instagram {
    background: linear-gradient(135deg, #e4405f 0%, #833ab4 100%);
}

.social-link.maps {
    background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
}

/* Footer */
.footer {
    background: #333;
    color: white;
    text-align: center;
    padding: 2rem 0;
}

/* Animations */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Responsive Design */
@media (max-width: 768px) {
    .header-content {
        flex-direction: column;
        gap: 1rem;
    }
    
    .nav {
        gap: 1rem;
    }
    
    .hero-title {
        font-size: 2rem;
    }
    
    .hero-description {
        font-size: 1rem;
    }
    
    .hero-buttons {
        flex-direction: column;
        align-items: center;
    }
    
    .section-title {
        font-size: 2rem;
    }
    
    .contact-info {
        grid-template-columns: 1fr;
    }
    
    .social-links {
        flex-direction: column;
        align-items: center;
    }
    
    .business-info {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 480px) {
    .container {
        padding: 0 15px;
    }
    
    .hero {
        padding: 100px 0 60px;
    }
    
    .hero-title {
        font-size: 1.8rem;
    }
    
    section {
        padding: 60px 0;
    }
}`;
  }

  private generateJS(): string {
    return `
// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(102, 126, 234, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            header.style.backdropFilter = 'none';
        }
        
        lastScrollTop = scrollTop;
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections for animation
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Contact form validation (if needed in future)
    const contactLinks = document.querySelectorAll('.contact-details a');
    contactLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add click tracking if needed
            console.log('Contact link clicked:', this.href);
        });
    });

    // Social media link tracking
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add analytics tracking if needed
            console.log('Social link clicked:', this.href);
        });
    });

    // Add loading animation
    window.addEventListener('load', function() {
        document.body.style.opacity = '1';
    });
});

// Add some interactive features
function addInteractiveFeatures() {
    // Add hover effects for contact items
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add click-to-copy for phone numbers
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const phoneNumber = this.href.replace('tel:', '');
            if (navigator.clipboard) {
                navigator.clipboard.writeText(phoneNumber).then(() => {
                    // Show a small notification
                    showNotification('Nomor telepon disalin!');
                });
            }
        });
    });
}

// Simple notification function
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = \`
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 12px 24px;
        border-radius: 5px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    \`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = \`
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
\`;
document.head.appendChild(notificationStyles);

// Initialize interactive features
addInteractiveFeatures();

// Add WhatsApp floating button
function addWhatsAppButton() {
    const whatsappLink = document.querySelector('.social-link.whatsapp');
    if (whatsappLink) {
        const floatingButton = document.createElement('div');
        floatingButton.innerHTML = '💬';
        floatingButton.style.cssText = \`
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: #25d366;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
            z-index: 1000;
            transition: all 0.3s ease;
        \`;
        
        floatingButton.addEventListener('click', function() {
            window.open(whatsappLink.href, '_blank');
        });
        
        floatingButton.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        floatingButton.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        document.body.appendChild(floatingButton);
    }
}

// Initialize WhatsApp button
addWhatsAppButton();`;
  }

  private generateImages(): string[] {
    // Return placeholder image URLs or generated images
    return [
      'https://via.placeholder.com/800x400/667eea/ffffff?text=Welcome+to+' + encodeURIComponent(this.businessData.businessName),
      'https://via.placeholder.com/400x300/764ba2/ffffff?text=About+Us',
      'https://via.placeholder.com/400x300/ff6b6b/ffffff?text=Products'
    ];
  }

  private getCategoryDisplayName(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'restaurant': 'Restoran & Kuliner',
      'retail': 'Retail & Toko',
      'service': 'Jasa & Layanan',
      'other': 'Lainnya'
    };
    return categoryMap[category] || category;
  }
}

// Utility function to generate website
export function generateWebsite(businessData: BusinessData): GeneratedWebsite {
  const generator = new WebsiteGenerator(businessData);
  return generator.generate();
} 