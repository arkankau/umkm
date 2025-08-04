import { BusinessData, GeneratedWebsite } from './types';
import { AIWebsiteService } from './ai-website-service';
import { IntelligentTemplateGenerator } from './intelligent-template-generator';

export class WebsiteGenerator {
  private businessData: BusinessData;
  private aiService: AIWebsiteService;

  constructor(businessData: BusinessData) {
    this.businessData = businessData;
    this.aiService = new AIWebsiteService();
  }

  async generate(): Promise<GeneratedWebsite> {
    try {
      // Use AI to generate website content
      console.log('Generating website with AI...');
      const aiWebsite = await this.aiService.generateWebsite(this.businessData);
      
      if (aiWebsite.success) {
        return {
          html: aiWebsite.html,
          css: aiWebsite.css,
          js: aiWebsite.js,
          assets: {
            images: await this.generateImages()
          },
          metadata: {
            generatedAt: new Date().toISOString(),
            version: 1,
            businessData: this.businessData,
            lastPrompt: undefined
          }
        };
      } else {
        throw new Error(aiWebsite.error || 'AI generation failed');
      }
    } catch (error) {
      console.error('AI generation failed, falling back to template:', error);
      // Fallback to template-based generation
      const template = new IntelligentTemplateGenerator(this.businessData);
      const result = template.generate();
      
      return {
        html: result.html,
        css: result.css,
        js: result.js,
        assets: {
          images: await this.generateImages()
        },
        metadata: {
          generatedAt: new Date().toISOString(),
          version: 1,
          businessData: this.businessData,
          lastPrompt: undefined
        }
      };
    }
  }

  private async generateImages(): Promise<string[]> {
    try {
      // Try to use Gemini for image generation
      const { geminiImageService } = await import('./gemini-image-service');
      
      if (geminiImageService.isAvailable()) {
        console.log('Using Gemini for business image generation');
        const images = await geminiImageService.generateBusinessImages({
          businessName: this.businessData.businessName,
          businessType: this.businessData.category,
          description: this.businessData.description,
          products: this.businessData.products
        });
        
        if (images.length > 0) {
          return images;
        }
      }
    } catch (error) {
      console.error('Gemini image generation failed, using fallback:', error);
    }
    
    // Fallback to placeholder images
    const { category } = this.businessData;
    const imageCount = Math.floor(Math.random() * 3) + 2; // 2-4 images
    const images = [];
    
    for (let i = 0; i < imageCount; i++) {
      images.push(`https://picsum.photos/400/300?random=${Date.now() + i}`);
    }
    
    return images;
  }

  // Fallback methods for template-based generation
  private generateHTML(): string {
    const { businessName, ownerName, description, category, products, phone, address, whatsapp, instagram } = this.businessData;
    const categoryDisplay = this.getCategoryDisplayName(category);
    
    return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${businessName} - ${categoryDisplay}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        /* CSS will be injected here */
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <i class="fas fa-store"></i>
                <span>${businessName}</span>
            </div>
            <ul class="nav-menu">
                <li><a href="#home">Beranda</a></li>
                <li><a href="#about">Tentang</a></li>
                <li><a href="#products">Produk</a></li>
                <li><a href="#contact">Kontak</a></li>
            </ul>
        </div>
    </nav>

    <section id="home" class="hero">
        <div class="hero-content">
            <h1>Selamat Datang di ${businessName}</h1>
            <p>${description}</p>
            <div class="hero-buttons">
                <a href="#products" class="btn btn-primary">Lihat Produk</a>
                <a href="#contact" class="btn btn-secondary">Hubungi Kami</a>
            </div>
        </div>
    </section>

    <section id="about" class="about">
        <div class="container">
            <h2>Tentang Kami</h2>
            <p>${description}</p>
            <p>Dikelola oleh <strong>${ownerName}</strong></p>
        </div>
    </section>

    <section id="products" class="products">
        <div class="container">
            <h2>Produk & Layanan</h2>
            <div class="products-grid">
                ${products.split(',').map((product: string) => `
                    <div class="product-card">
                        <i class="fas fa-${this.getCategoryIcon(category)}"></i>
                        <h3>${product.trim()}</h3>
                        <p>Layanan profesional dengan kualitas terbaik.</p>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>

    <section id="contact" class="contact">
        <div class="container">
            <h2>Hubungi Kami</h2>
            <div class="contact-info">
                <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    <div>
                        <h3>Telepon</h3>
                        <p><a href="tel:${phone}">${phone}</a></p>
                    </div>
                </div>
                ${whatsapp ? `
                <div class="contact-item">
                    <i class="fab fa-whatsapp"></i>
                    <div>
                        <h3>WhatsApp</h3>
                        <p><a href="https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}" target="_blank">${whatsapp}</a></p>
                    </div>
                </div>
                ` : ''}
                <div class="contact-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <div>
                        <h3>Alamat</h3>
                        <p>${address}</p>
                    </div>
                </div>
                ${instagram ? `
                <div class="contact-item">
                    <i class="fab fa-instagram"></i>
                    <div>
                        <h3>Instagram</h3>
                        <p><a href="https://instagram.com/${instagram.replace('@', '')}" target="_blank">${instagram}</a></p>
                    </div>
                </div>
                ` : ''}
            </div>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 ${businessName}. Semua hak dilindungi.</p>
        </div>
    </footer>

    <script>
        // JavaScript will be injected here
    </script>
</body>
</html>`;
  }

  private generateCSS(): string {
    const { category } = this.businessData;
    const colors = this.getCategoryColors(category);
    
    return `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', sans-serif;
    line-height: 1.6;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.navbar {
    position: fixed;
    top: 0;
    width: 100%;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    z-index: 1000;
    padding: 1rem 0;
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.5rem;
    font-weight: 700;
    color: ${colors.primary};
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-menu a {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    transition: color 0.3s ease;
}

.nav-menu a:hover {
    color: ${colors.primary};
}

.hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
    color: white;
    padding: 100px 0;
    text-align: center;
}

.hero h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.hero p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.9;
}

.btn {
    display: inline-block;
    padding: 12px 25px;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    margin: 0 10px;
}

.btn-primary {
    background: white;
    color: ${colors.primary};
}

.btn-secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
}

.about, .products, .contact {
    padding: 100px 0;
}

.about {
    background: #f8f9fa;
}

.section h2 {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 3rem;
    color: ${colors.primary};
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.product-card {
    background: white;
    border-radius: 15px;
    padding: 2rem;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    text-align: center;
    transition: transform 0.3s ease;
}

.product-card:hover {
    transform: translateY(-5px);
}

.product-card i {
    font-size: 3rem;
    color: ${colors.primary};
    margin-bottom: 1rem;
}

.contact-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.contact-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: white;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.contact-item i {
    font-size: 2rem;
    color: ${colors.primary};
}

.contact-item a {
    color: ${colors.primary};
    text-decoration: none;
}

.contact-item a:hover {
    text-decoration: underline;
}

.footer {
    background: #333;
    color: white;
    padding: 50px 0;
    text-align: center;
}

@media (max-width: 768px) {
    .nav-menu {
        display: none;
    }
    
    .hero h1 {
        font-size: 2rem;
    }
    
    .products-grid {
        grid-template-columns: 1fr;
    }
    
    .contact-info {
        grid-template-columns: 1fr;
    }
}`;
  }

  private generateJS(): string {
    return `// Smooth scrolling for navigation links
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

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});`;
  }

  private getCategoryDisplayName(category: string): string {
    const displayNames: { [key: string]: string } = {
      restaurant: 'Restoran',
      retail: 'Toko Retail',
      service: 'Jasa',
      other: 'Bisnis Lainnya'
    };
    return displayNames[category] || 'Bisnis';
  }

  private getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      restaurant: 'utensils',
      retail: 'shopping-bag',
      service: 'tools',
      other: 'store'
    };
    return icons[category] || 'store';
  }

  private getCategoryColors(category: string): { primary: string; secondary: string } {
    const colors: { [key: string]: { primary: string; secondary: string } } = {
      restaurant: { primary: '#e74c3c', secondary: '#c0392b' },
      retail: { primary: '#3498db', secondary: '#2980b9' },
      service: { primary: '#f39c12', secondary: '#e67e22' },
      other: { primary: '#9b59b6', secondary: '#8e44ad' }
    };
    return colors[category] || { primary: '#3498db', secondary: '#2980b9' };
  }

  // Generate complete HTML file with embedded CSS and JS
  generateCompleteHTML(): string {
    const template = new IntelligentTemplateGenerator(this.businessData);
    const result = template.generate();
    
    // Replace the placeholder comments with actual CSS and JS
    const completeHTML = result.html
      .replace('/* CSS will be injected here */', result.css)
      .replace('// JavaScript will be injected here', result.js);
    
    return completeHTML;
  }
}

export async function generateWebsite(businessData: BusinessData): Promise<GeneratedWebsite> {
  return await new WebsiteGenerator(businessData).generate();
}

// Utility function to generate complete HTML file for deployment
export function generateCompleteHTML(businessData: BusinessData): string {
  const generator = new WebsiteGenerator(businessData);
  return generator.generateCompleteHTML();
} 