import { BusinessData } from './types';

export class IntelligentTemplateGenerator {
  private businessData: BusinessData;
  private customPrompt: string;

  constructor(businessData: BusinessData, customPrompt?: string) {
    this.businessData = businessData;
    this.customPrompt = customPrompt || '';
  }

  generate(): { html: string; css: string; js: string } {
    const colors = this.getCategoryColors(this.businessData.category);
    
    return {
      html: this.generateHTML(),
      css: this.generateCSS(colors),
      js: this.generateJS()
    };
  }

  private generateHTML(): string {
    const { businessName, ownerName, description, category, products, phone, address, email, whatsapp, instagram } = this.businessData;
    const icon = this.getCategoryIcon(category);
    
    return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${businessName} - ${description}</title>
    <meta name="description" content="${description}">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        /* CSS will be injected here */
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar" id="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <i class="fas fa-${icon}"></i>
                <span>${businessName}</span>
            </div>
            <ul class="nav-menu" id="nav-menu">
                <li><a href="#home" class="nav-link">Beranda</a></li>
                <li><a href="#about" class="nav-link">Tentang</a></li>
                <li><a href="#services" class="nav-link">Layanan</a></li>
                <li><a href="#contact" class="nav-link">Kontak</a></li>
            </ul>
            <div class="nav-toggle" id="nav-toggle">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="hero">
        <div class="hero-content">
            <div class="hero-text">
                <h1 class="hero-title">
                    Selamat Datang di<br>
                    <span class="highlight">${businessName}</span>
                </h1>
                <p class="hero-subtitle">${description}</p>
                <div class="hero-buttons">
                    <a href="#services" class="btn btn-primary">Lihat Layanan</a>
                    <a href="#contact" class="btn btn-outline">Hubungi Kami</a>
                </div>
            </div>
            <div class="hero-visual">
                <div class="hero-card">
                    <i class="fas fa-${icon}"></i>
                </div>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="about">
        <div class="container">
            <div class="section-header">
                <h2>Tentang ${businessName}</h2>
                <p>Mengenal lebih dekat dengan bisnis kami</p>
            </div>
            <div class="about-content">
                <div class="about-text">
                    <h3>Mengapa Memilih Kami?</h3>
                    <p>${description}</p>
                    <p>Dengan pengalaman dan dedikasi dari <strong>${ownerName}</strong>, kami berkomitmen memberikan layanan terbaik untuk kebutuhan Anda.</p>
                </div>
                <div class="about-image">
                    <div class="image-placeholder">
                        <i class="fas fa-${icon}"></i>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="services">
        <div class="container">
            <div class="section-header">
                <h2>Layanan Kami</h2>
                <p>Solusi terbaik untuk kebutuhan Anda</p>
            </div>
            <div class="services-grid">
                ${products.split(',').map((product, index) => `
                    <div class="service-card">
                        <div class="service-icon">
                            <i class="fas fa-${icon}"></i>
                        </div>
                        <h3>${product.trim()}</h3>
                        <p>Layanan profesional dengan kualitas terbaik dan harga yang kompetitif.</p>
                        <a href="#contact" class="btn btn-outline">Konsultasi</a>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact">
        <div class="container">
            <div class="section-header">
                <h2>Hubungi Kami</h2>
                <p>Kami siap melayani kebutuhan Anda</p>
            </div>
            <div class="contact-content">
                <div class="contact-info">
                    <div class="contact-card">
                        <div class="contact-icon">
                            <i class="fas fa-phone"></i>
                        </div>
                        <div class="contact-details">
                            <h3>Telepon</h3>
                            <p><a href="tel:${phone}">${phone}</a></p>
                        </div>
                    </div>
                    <div class="contact-card">
                        <div class="contact-icon">
                            <i class="fas fa-map-marker-alt"></i>
                        </div>
                        <div class="contact-details">
                            <h3>Alamat</h3>
                            <p>${address}</p>
                        </div>
                    </div>
                    ${email ? `
                    <div class="contact-card">
                        <div class="contact-icon">
                            <i class="fas fa-envelope"></i>
                        </div>
                        <div class="contact-details">
                            <h3>Email</h3>
                            <p><a href="mailto:${email}">${email}</a></p>
                        </div>
                    </div>
                    ` : ''}
                    ${whatsapp ? `
                    <div class="contact-card">
                        <div class="contact-icon">
                            <i class="fab fa-whatsapp"></i>
                        </div>
                        <div class="contact-details">
                            <h3>WhatsApp</h3>
                            <p><a href="https://wa.me/${whatsapp.replace(/\D/g, '')}" target="_blank">${whatsapp}</a></p>
                        </div>
                    </div>
                    ` : ''}
                    ${instagram ? `
                    <div class="contact-card">
                        <div class="contact-icon">
                            <i class="fab fa-instagram"></i>
                        </div>
                        <div class="contact-details">
                            <h3>Instagram</h3>
                            <p><a href="https://instagram.com/${instagram.replace('@', '')}" target="_blank">${instagram}</a></p>
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <div class="footer-logo">
                        <i class="fas fa-${icon}"></i>
                        <span>${businessName}</span>
                    </div>
                    <p>${description}</p>
                </div>
                <div class="footer-section">
                    <h3>Kontak</h3>
                    <div class="footer-contact">
                        <p><i class="fas fa-phone"></i> ${phone}</p>
                        <p><i class="fas fa-map-marker-alt"></i> ${address}</p>
                        ${email ? `<p><i class="fas fa-envelope"></i> ${email}</p>` : ''}
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 ${businessName}. Semua hak dilindungi.</p>
            </div>
        </div>
    </footer>

    <script>
        // JavaScript will be injected here
    </script>
</body>
</html>`;
  }

  private generateCSS(colors: any): string {
    return `/* Reset and Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary-color: ${colors.primary};
    --secondary-color: ${colors.secondary};
    --accent-color: ${colors.accent};
    --text-color: #2c3e50;
    --text-light: #7f8c8d;
    --background: #ffffff;
    --light-bg: #f8f9fa;
    --border-color: #e9ecef;
    --shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    --shadow-hover: 0 15px 35px rgba(0, 0, 0, 0.1);
    --border-radius: 12px;
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.7;
    color: var(--text-color);
    overflow-x: hidden;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Navigation */
.navbar {
    position: fixed;
    top: 0;
    width: 100%;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border-color);
    z-index: 1000;
    transition: var(--transition);
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;
}

.nav-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-color);
}

.nav-logo i {
    font-size: 2rem;
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-link {
    text-decoration: none;
    color: var(--text-color);
    font-weight: 500;
    transition: var(--transition);
}

.nav-link:hover {
    color: var(--primary-color);
}

.nav-toggle {
    display: none;
    flex-direction: column;
    cursor: pointer;
}

.nav-toggle span {
    width: 25px;
    height: 3px;
    background: var(--text-color);
    margin: 3px 0;
    transition: var(--transition);
}

/* Hero Section */
.hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
    color: white;
    padding: 100px 0 50px;
}

.hero-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
}

.hero-title {
    font-size: 3.5rem;
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 1.5rem;
}

.highlight {
    background: linear-gradient(45deg, #fff, #f0f0f0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.hero-subtitle {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    opacity: 0.9;
}

.hero-buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.btn {
    padding: 12px 30px;
    border-radius: var(--border-radius);
    text-decoration: none;
    font-weight: 600;
    transition: var(--transition);
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: none;
    cursor: pointer;
    font-size: 1rem;
}

.btn-primary {
    background: white;
    color: var(--primary-color);
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-hover);
}

.btn-outline {
    background: transparent;
    color: white;
    border: 2px solid white;
}

.btn-outline:hover {
    background: white;
    color: var(--primary-color);
}

.hero-visual {
    display: flex;
    justify-content: center;
    align-items: center;
}

.hero-card {
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.hero-card i {
    font-size: 5rem;
    color: white;
}

/* Section Headers */
.section-header {
    text-align: center;
    margin-bottom: 4rem;
}

.section-header h2 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--text-color);
}

.section-header p {
    font-size: 1.1rem;
    color: var(--text-light);
    max-width: 600px;
    margin: 0 auto;
}

/* About Section */
.about {
    padding: 100px 0;
    background: var(--light-bg);
}

.about-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
}

.about-text h3 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    color: var(--text-color);
}

.about-text p {
    margin-bottom: 1.5rem;
    color: var(--text-light);
}

.about-image {
    display: flex;
    justify-content: center;
}

.image-placeholder {
    width: 300px;
    height: 300px;
    background: var(--primary-color);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 4rem;
}

/* Services Section */
.services {
    padding: 100px 0;
}

.services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.service-card {
    background: white;
    padding: 2rem;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    transition: var(--transition);
    text-align: center;
}

.service-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-hover);
}

.service-icon {
    width: 80px;
    height: 80px;
    background: var(--primary-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
    color: white;
    font-size: 2rem;
}

.service-card h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--text-color);
}

.service-card p {
    color: var(--text-light);
    margin-bottom: 1.5rem;
}

/* Contact Section */
.contact {
    padding: 100px 0;
    background: var(--light-bg);
}

.contact-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 4rem;
}

.contact-info {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.contact-card {
    background: white;
    padding: 1.5rem;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    display: flex;
    align-items: center;
    gap: 1rem;
}

.contact-icon {
    width: 60px;
    height: 60px;
    background: var(--primary-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5rem;
}

.contact-details h3 {
    margin-bottom: 0.5rem;
    color: var(--text-color);
}

.contact-details p {
    color: var(--text-light);
}

.contact-details a {
    color: var(--primary-color);
    text-decoration: none;
}

/* Footer */
.footer {
    background: var(--text-color);
    color: white;
    padding: 50px 0 20px;
}

.footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
}

.footer-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
}

.footer-logo i {
    font-size: 2rem;
    color: var(--primary-color);
}

.footer-section h3 {
    margin-bottom: 1rem;
    color: var(--primary-color);
}

.footer-contact p {
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.footer-bottom {
    text-align: center;
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Responsive Design */
@media (max-width: 768px) {
    .nav-menu {
        display: none;
    }
    
    .nav-toggle {
        display: flex;
    }
    
    .hero-content {
        grid-template-columns: 1fr;
        text-align: center;
    }
    
    .hero-title {
        font-size: 2.5rem;
    }
    
    .about-content {
        grid-template-columns: 1fr;
    }
    
    .services-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 480px) {
    .hero-title {
        font-size: 2rem;
    }
    
    .section-header h2 {
        font-size: 2rem;
    }
    
    .hero-buttons {
        flex-direction: column;
    }
    
    .btn {
        width: 100%;
        justify-content: center;
    }
}`;
  }

  private generateJS(): string {
    return `
// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile navigation toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
});

console.log('Website loaded successfully!');
`;
  }

  private getCategoryIcon(category: string): string {
    const iconMap: { [key: string]: string } = {
      restaurant: 'utensils',
      retail: 'shopping-bag',
      service: 'tools',
      technology: 'laptop-code',
      health: 'heartbeat',
      beauty: 'spa',
      education: 'graduation-cap',
      automotive: 'car',
      construction: 'hard-hat',
      other: 'store'
    };
    
    return iconMap[category] || 'store';
  }

  private getCategoryColors(category: string): { primary: string; secondary: string; accent: string } {
    const colorMap: { [key: string]: { primary: string; secondary: string; accent: string } } = {
      restaurant: {
        primary: '#e74c3c',
        secondary: '#c0392b',
        accent: '#f39c12'
      },
      retail: {
        primary: '#3498db',
        secondary: '#2980b9',
        accent: '#e74c3c'
      },
      service: {
        primary: '#2ecc71',
        secondary: '#27ae60',
        accent: '#f39c12'
      },
      technology: {
        primary: '#9b59b6',
        secondary: '#8e44ad',
        accent: '#3498db'
      },
      health: {
        primary: '#e74c3c',
        secondary: '#c0392b',
        accent: '#2ecc71'
      },
      beauty: {
        primary: '#e91e63',
        secondary: '#c2185b',
        accent: '#ff9800'
      },
      education: {
        primary: '#2196f3',
        secondary: '#1976d2',
        accent: '#ffc107'
      },
      automotive: {
        primary: '#607d8b',
        secondary: '#455a64',
        accent: '#ff5722'
      },
      construction: {
        primary: '#795548',
        secondary: '#5d4037',
        accent: '#ff9800'
      },
      other: {
        primary: '#34495e',
        secondary: '#2c3e50',
        accent: '#3498db'
      }
    };
    
    return colorMap[category] || colorMap.other;
  }
} 