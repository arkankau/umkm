import { BusinessData } from './api';

export interface EdgeAIResponse {
  html: string;
  css: string;
  js: string;
  success: boolean;
  error?: string;
}

export class EdgeAIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.EDGEAI_API_KEY || '';
    this.baseUrl = process.env.EDGEAI_BASE_URL || 'https://api.cloudflare.com/client/v4/ai/run';
  }

  async generateWebsite(businessData: BusinessData): Promise<EdgeAIResponse> {
    try {
      if (!this.apiKey) {
        console.log('EdgeAI API key not found, using fallback generation');
        return this.generateFallbackWebsite(businessData);
      }

      const prompt = this.createWebsitePrompt(businessData);
      
      // Call EdgeAI API
      const response = await fetch(`${this.baseUrl}/@cf/meta/llama-3.1-8b-instruct`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are a professional web developer specializing in creating modern, responsive websites for small businesses. Generate complete HTML, CSS, and JavaScript code that is production-ready.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`EdgeAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.result || !data.result.response) {
        throw new Error('Invalid response from EdgeAI API');
      }

      // Parse the AI response to extract HTML, CSS, and JS
      const aiResponse = data.result.response;
      const parsed = this.parseAIResponse(aiResponse);
      
      return {
        html: parsed.html,
        css: parsed.css,
        js: parsed.js,
        success: true
      };

    } catch (error) {
      console.error('EdgeAI generation failed:', error);
      return this.generateFallbackWebsite(businessData);
    }
  }

  private createWebsitePrompt(businessData: BusinessData): string {
    const { businessName, ownerName, description, category, products, phone, address, email, whatsapp, instagram } = businessData;
    
    const categoryDisplay = this.getCategoryDisplayName(category);
    const colors = this.getCategoryColors(category);
    
    return `Create a modern, professional website for a ${categoryDisplay} business with the following details:

BUSINESS INFORMATION:
- Business Name: ${businessName}
- Owner: ${ownerName}
- Description: ${description}
- Category: ${categoryDisplay}
- Products/Services: ${products}
- Phone: ${phone}
- Address: ${address}
- Email: ${email || 'Not provided'}
- WhatsApp: ${whatsapp || 'Not provided'}
- Instagram: ${instagram || 'Not provided'}

DESIGN REQUIREMENTS:
- Use modern, responsive design principles
- Color scheme: Primary ${colors.primary}, Secondary ${colors.secondary}
- Include smooth animations and transitions
- Mobile-first approach
- Professional typography using Inter font
- Include Font Awesome icons

WEBSITE SECTIONS:
1. Navigation bar with logo and menu
2. Hero section with business name and description
3. About section with business details
4. Products/Services section
5. Contact section with all contact information
6. Footer with business info and social links

TECHNICAL REQUIREMENTS:
- Generate complete, valid HTML5 code
- Include embedded CSS with modern styling
- Include JavaScript for interactivity
- Make it SEO-friendly
- Ensure accessibility standards
- Include contact form functionality
- Add smooth scrolling navigation
- Include loading animations

Please generate the complete website code in this exact format:

===HTML===
[Complete HTML code here]
===CSS===
[Complete CSS code here]
===JS===
[Complete JavaScript code here]

Make sure the website looks professional and modern, suitable for a ${categoryDisplay} business.`;
  }

  private parseAIResponse(response: string): { html: string; css: string; js: string } {
    try {
      // Try to parse structured response
      const htmlMatch = response.match(/===HTML===\s*([\s\S]*?)(?===CSS===|===JS===|$)/i);
      const cssMatch = response.match(/===CSS===\s*([\s\S]*?)(?===HTML===|===JS===|$)/i);
      const jsMatch = response.match(/===JS===\s*([\s\S]*?)(?===HTML===|===CSS===|$)/i);

      if (htmlMatch && cssMatch && jsMatch) {
        return {
          html: htmlMatch[1].trim(),
          css: cssMatch[1].trim(),
          js: jsMatch[1].trim()
        };
      }

      // Fallback: try to extract code blocks
      const codeBlocks = response.match(/```(?:html|css|javascript|js)?\s*([\s\S]*?)```/g);
      if (codeBlocks && codeBlocks.length >= 3) {
        return {
          html: codeBlocks[0].replace(/```(?:html)?\s*/, '').replace(/```$/, '').trim(),
          css: codeBlocks[1].replace(/```(?:css)?\s*/, '').replace(/```$/, '').trim(),
          js: codeBlocks[2].replace(/```(?:javascript|js)?\s*/, '').replace(/```$/, '').trim()
        };
      }

      // If parsing fails, return the response as HTML and generate fallback CSS/JS
      return {
        html: response,
        css: this.generateFallbackCSS(),
        js: this.generateFallbackJS()
      };

    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return {
        html: response,
        css: this.generateFallbackCSS(),
        js: this.generateFallbackJS()
      };
    }
  }

  private generateFallbackWebsite(businessData: BusinessData): EdgeAIResponse {
    const { businessName, ownerName, description, category, products, phone, address } = businessData;
    const colors = this.getCategoryColors(category);
    
    const html = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${businessName} - ${this.getCategoryDisplayName(category)}</title>
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
                <div class="contact-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <div>
                        <h3>Alamat</h3>
                        <p>${address}</p>
                    </div>
                </div>
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

    return {
      html,
      css: this.generateFallbackCSS(),
      js: this.generateFallbackJS(),
      success: true
    };
  }

  private generateFallbackCSS(): string {
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
    color: #3498db;
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
    color: #3498db;
}

.hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
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
    color: #3498db;
}

.btn-secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
}

.section {
    padding: 100px 0;
}

.section h2 {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 3rem;
    color: #3498db;
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
    color: #3498db;
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
    color: #3498db;
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

  private generateFallbackJS(): string {
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
      technology: 'Teknologi',
      health: 'Kesehatan',
      education: 'Pendidikan',
      automotive: 'Otomotif',
      beauty: 'Kecantikan',
      fitness: 'Kebugaran',
      consulting: 'Konsultan'
    };
    return displayNames[category] || 'Bisnis';
  }

  private getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      restaurant: 'utensils',
      retail: 'shopping-bag',
      service: 'tools',
      technology: 'laptop',
      health: 'heartbeat',
      education: 'graduation-cap',
      automotive: 'car',
      beauty: 'spa',
      fitness: 'dumbbell',
      consulting: 'briefcase'
    };
    return icons[category] || 'store';
  }

  private getCategoryColors(category: string): { primary: string; secondary: string } {
    const colors: { [key: string]: { primary: string; secondary: string } } = {
      restaurant: { primary: '#e74c3c', secondary: '#c0392b' },
      retail: { primary: '#3498db', secondary: '#2980b9' },
      service: { primary: '#f39c12', secondary: '#e67e22' },
      technology: { primary: '#9b59b6', secondary: '#8e44ad' },
      health: { primary: '#2ecc71', secondary: '#27ae60' },
      education: { primary: '#1abc9c', secondary: '#16a085' },
      automotive: { primary: '#34495e', secondary: '#2c3e50' },
      beauty: { primary: '#e91e63', secondary: '#c2185b' },
      fitness: { primary: '#ff5722', secondary: '#e64a19' },
      consulting: { primary: '#607d8b', secondary: '#455a64' }
    };
    return colors[category] || { primary: '#3498db', secondary: '#2980b9' };
  }
} 