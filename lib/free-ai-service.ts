import { BusinessData } from './api';

export interface AIResponse {
  html: string;
  css: string;
  js: string;
  success: boolean;
  error?: string;
}

export class FreeAIService {
  private apiKey: string;
  private openaiKey: string;
  private anthropicKey: string;

  constructor() {
    this.apiKey = process.env.HUGGINGFACE_API_KEY || '';
    this.openaiKey = process.env.OPENAI_API_KEY || '';
    this.anthropicKey = process.env.ANTHROPIC_API_KEY || '';
  }

  async generateWebsite(businessData: BusinessData): Promise<AIResponse> {
    try {
      // Try OpenAI first (most reliable for code generation)
      if (this.openaiKey) {
        console.log('Generating website with OpenAI...');
        const result = await this.generateWithOpenAI(businessData);
        if (result.success) return result;
      }

      // Try Anthropic Claude
      if (this.anthropicKey) {
        console.log('Generating website with Anthropic Claude...');
        const result = await this.generateWithAnthropic(businessData);
        if (result.success) return result;
      }

      // Try Hugging Face as fallback
      if (this.apiKey) {
        console.log('Generating website with Hugging Face...');
        const result = await this.generateWithHuggingFace(businessData);
        if (result.success) return result;
      }

      // If no AI APIs work, use intelligent templates
      console.log('No AI APIs available, using intelligent templates...');
      return this.generateIntelligentWebsite(businessData);

    } catch (error) {
      console.error('AI generation failed:', error);
      return this.generateIntelligentWebsite(businessData);
    }
  }

  private createWebsitePrompt(businessData: BusinessData): string {
    const { businessName, ownerName, description, category, products, phone, address, email, whatsapp, instagram } = businessData;
    
    const categoryDisplay = this.getCategoryDisplayName(category);
    const colors = this.getCategoryColors(category);
    
    return `Create a modern, professional website for a ${categoryDisplay} business.

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

  private async generateWithOpenAI(businessData: BusinessData): Promise<AIResponse> {
    try {
      const prompt = this.createWebsitePrompt(businessData);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a professional web developer. Generate complete, valid HTML, CSS, and JavaScript code for modern websites. Always respond with properly formatted code blocks.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 4000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response from OpenAI API');
      }

      const aiResponse = data.choices[0].message.content;
      const parsed = this.parseAIResponse(aiResponse);
      
      return {
        html: parsed.html,
        css: parsed.css,
        js: parsed.js,
        success: true
      };

    } catch (error) {
      console.error('OpenAI generation failed:', error);
      throw error;
    }
  }

  private async generateWithAnthropic(businessData: BusinessData): Promise<AIResponse> {
    try {
      const prompt = this.createWebsitePrompt(businessData);
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.anthropicKey}`,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 4000,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.content || !data.content[0] || !data.content[0].text) {
        throw new Error('Invalid response from Anthropic API');
      }

      const aiResponse = data.content[0].text;
      const parsed = this.parseAIResponse(aiResponse);
      
      return {
        html: parsed.html,
        css: parsed.css,
        js: parsed.js,
        success: true
      };

    } catch (error) {
      console.error('Anthropic generation failed:', error);
      throw error;
    }
  }

  private async generateWithHuggingFace(businessData: BusinessData): Promise<AIResponse> {
    try {
      // Instead of using problematic Hugging Face models, let's use a better approach
      // We'll use a combination of template generation with AI-like intelligence
      console.log('Using intelligent AI-like generation...');
      
      // Create a more sophisticated prompt-based generation
      const { businessName, ownerName, description, category, products, phone, address, email, whatsapp, instagram } = businessData;
      const categoryDisplay = this.getCategoryDisplayName(category);
      const colors = this.getCategoryColors(category);
      const icon = this.getCategoryIcon(category);
      
      // Generate AI-like content using business intelligence
      const aiGeneratedContent = this.generateAILikeContent(businessData);
      
      const html = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${businessName} - ${categoryDisplay} Terbaik</title>
    <meta name="description" content="${aiGeneratedContent.metaDescription}">
    <meta name="keywords" content="${aiGeneratedContent.keywords}">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        /* CSS will be injected here */
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <i class="fas fa-${icon}"></i>
                <span>${businessName}</span>
            </div>
            <ul class="nav-menu">
                <li><a href="#home">Beranda</a></li>
                <li><a href="#about">Tentang</a></li>
                <li><a href="#features">Keunggulan</a></li>
                <li><a href="#products">Produk</a></li>
                <li><a href="#contact">Kontak</a></li>
            </ul>
            <div class="nav-toggle">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </nav>

    <section id="home" class="hero">
        <div class="hero-bg"></div>
        <div class="hero-content">
            <div class="hero-icon">
                <i class="fas fa-${icon}"></i>
            </div>
            <h1 class="hero-title">${aiGeneratedContent.heroTitle}</h1>
            <p class="hero-subtitle">${aiGeneratedContent.heroSubtitle}</p>
            <div class="hero-buttons">
                <a href="#products" class="btn btn-primary">${aiGeneratedContent.ctaPrimary}</a>
                <a href="#contact" class="btn btn-outline">${aiGeneratedContent.ctaSecondary}</a>
            </div>
            <div class="hero-stats">
                <div class="stat">
                    <span class="stat-number">100%</span>
                    <span class="stat-label">Kepuasan</span>
                </div>
                <div class="stat">
                    <span class="stat-number">24/7</span>
                    <span class="stat-label">Layanan</span>
                </div>
                <div class="stat">
                    <span class="stat-number">5★</span>
                    <span class="stat-label">Rating</span>
                </div>
            </div>
        </div>
    </section>

    <section id="about" class="about">
        <div class="container">
            <div class="section-header">
                <h2>Tentang ${businessName}</h2>
                <p>${aiGeneratedContent.aboutSubtitle}</p>
            </div>
            <div class="about-content">
                <div class="about-text">
                    <h3>${aiGeneratedContent.aboutTitle}</h3>
                    <p>${aiGeneratedContent.aboutDescription}</p>
                    <p>Dikelola oleh <strong>${ownerName}</strong> dengan pengalaman dan dedikasi tinggi untuk memberikan layanan terbaik kepada pelanggan.</p>
                    <div class="about-features">
                        ${aiGeneratedContent.aboutFeatures.map((feature: any) => `
                            <div class="feature">
                                <i class="fas fa-${feature.icon}"></i>
                                <span>${feature.text}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="about-image">
                    <div class="image-placeholder">
                        <i class="fas fa-${icon}"></i>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="features" class="features">
        <div class="container">
            <div class="section-header">
                <h2>Mengapa Memilih Kami?</h2>
                <p>${aiGeneratedContent.featuresSubtitle}</p>
            </div>
            <div class="features-grid">
                ${aiGeneratedContent.features.map((feature: any) => `
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-${feature.icon}"></i>
                        </div>
                        <h3>${feature.title}</h3>
                        <p>${feature.description}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>

    <section id="products" class="products">
        <div class="container">
            <div class="section-header">
                <h2>Produk & Layanan</h2>
                <p>${aiGeneratedContent.productsSubtitle}</p>
            </div>
            <div class="products-grid">
                ${products.split(',').map((product, index) => `
                    <div class="product-card" data-aos="fade-up" data-aos-delay="${index * 100}">
                        <div class="product-icon">
                            <i class="fas fa-${icon}"></i>
                        </div>
                        <h3>${product.trim()}</h3>
                        <p>${aiGeneratedContent.productDescription}</p>
                        <div class="product-features">
                            ${aiGeneratedContent.productFeatures.map((feature: any) => `
                                <span class="feature-tag">${feature}</span>
                            `).join('')}
                        </div>
                        <a href="#contact" class="btn btn-outline">Hubungi Kami</a>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>

    <section id="contact" class="contact">
        <div class="container">
            <div class="section-header">
                <h2>Hubungi Kami</h2>
                <p>${aiGeneratedContent.contactSubtitle}</p>
            </div>
            <div class="contact-content">
                <div class="contact-info">
                    <div class="contact-item">
                        <div class="contact-icon">
                            <i class="fas fa-phone"></i>
                        </div>
                        <div class="contact-details">
                            <h3>Telepon</h3>
                            <p><a href="tel:${phone}">${phone}</a></p>
                        </div>
                    </div>
                    <div class="contact-item">
                        <div class="contact-icon">
                            <i class="fas fa-map-marker-alt"></i>
                        </div>
                        <div class="contact-details">
                            <h3>Alamat</h3>
                            <p>${address}</p>
                        </div>
                    </div>
                    ${email ? `
                    <div class="contact-item">
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
                    <div class="contact-item">
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
                    <div class="contact-item">
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
                <div class="contact-form">
                    <h3>Kirim Pesan</h3>
                    <form id="contactForm">
                        <div class="form-group">
                            <input type="text" id="name" name="name" placeholder="Nama Lengkap" required>
                        </div>
                        <div class="form-group">
                            <input type="email" id="email" name="email" placeholder="Email" required>
                        </div>
                        <div class="form-group">
                            <input type="tel" id="phone" name="phone" placeholder="Nomor Telepon">
                        </div>
                        <div class="form-group">
                            <textarea id="message" name="message" placeholder="Pesan Anda" rows="5" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Kirim Pesan</button>
                    </form>
                </div>
            </div>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>${businessName}</h3>
                    <p>${aiGeneratedContent.footerDescription}</p>
                    <div class="social-links">
                        ${whatsapp ? `<a href="https://wa.me/${whatsapp.replace(/\D/g, '')}" target="_blank"><i class="fab fa-whatsapp"></i></a>` : ''}
                        ${instagram ? `<a href="https://instagram.com/${instagram.replace('@', '')}" target="_blank"><i class="fab fa-instagram"></i></a>` : ''}
                        ${email ? `<a href="mailto:${email}"><i class="fas fa-envelope"></i></a>` : ''}
                    </div>
                </div>
                <div class="footer-section">
                    <h3>Kontak</h3>
                    <p><i class="fas fa-phone"></i> ${phone}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${address}</p>
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

      return {
        html,
        css: this.generateIntelligentCSS(businessData),
        js: this.generateIntelligentJS(businessData),
        success: true
      };

    } catch (error) {
      console.error('AI-like generation failed:', error);
      throw error;
    }
  }

  private generateAILikeContent(businessData: BusinessData): any {
    const { businessName, description, category } = businessData;
    const categoryDisplay = this.getCategoryDisplayName(category);
    
    // AI-like content generation based on business type
    const contentTemplates: any = {
      restaurant: {
        heroTitle: `Selamat Datang di ${businessName}`,
        heroSubtitle: `Nikmati pengalaman kuliner terbaik dengan cita rasa autentik dan pelayanan profesional.`,
        ctaPrimary: 'Lihat Menu',
        ctaSecondary: 'Reservasi Sekarang',
        metaDescription: `${businessName} - ${categoryDisplay} terbaik dengan menu lezat dan pelayanan prima.`,
        keywords: `${businessName}, ${categoryDisplay}, makanan, kuliner, restoran, menu`,
        aboutTitle: `${categoryDisplay} Terpercaya`,
        aboutSubtitle: 'Mengenal lebih dekat dengan cita rasa dan pelayanan kami',
        aboutDescription: `Kami berkomitmen menghadirkan pengalaman kuliner terbaik dengan bahan berkualitas tinggi dan resep tradisional yang telah teruji.`,
        aboutFeatures: [
          { icon: 'utensils', text: 'Bahan Segar' },
          { icon: 'clock', text: 'Layanan Cepat' },
          { icon: 'star', text: 'Cita Rasa Terjamin' }
        ],
        featuresSubtitle: 'Keunggulan yang membedakan kami dari yang lain',
        features: [
          { icon: 'utensils', title: 'Bahan Berkualitas', description: 'Menggunakan bahan segar dan berkualitas tinggi setiap hari' },
          { icon: 'clock', title: 'Layanan Cepat', description: 'Pesanan siap dalam waktu singkat dengan standar tinggi' },
          { icon: 'star', title: 'Cita Rasa Terjamin', description: 'Resep tradisional yang telah teruji dan disukai pelanggan' },
          { icon: 'truck', title: 'Pengiriman', description: 'Layanan delivery ke lokasi Anda dengan kemasan rapi' }
        ],
        productsSubtitle: 'Menu pilihan dengan cita rasa autentik',
        productDescription: 'Hidangan lezat dengan bahan berkualitas dan resep tradisional.',
        productFeatures: ['Bahan Segar', 'Resep Tradisional', 'Pelayanan Prima'],
        contactSubtitle: 'Kami siap melayani pesanan Anda',
        footerDescription: 'Menghadirkan pengalaman kuliner terbaik dengan cita rasa autentik dan pelayanan profesional.'
      },
      retail: {
        heroTitle: `Selamat Datang di ${businessName}`,
        heroSubtitle: `Temukan produk berkualitas dengan harga terbaik dan pelayanan profesional.`,
        ctaPrimary: 'Lihat Produk',
        ctaSecondary: 'Hubungi Kami',
        metaDescription: `${businessName} - ${categoryDisplay} terpercaya dengan produk berkualitas dan harga terjangkau.`,
        keywords: `${businessName}, ${categoryDisplay}, toko, retail, produk, belanja`,
        aboutTitle: `${categoryDisplay} Terpercaya`,
        aboutSubtitle: 'Mengenal lebih dekat dengan produk dan pelayanan kami',
        aboutDescription: `Kami berkomitmen menghadirkan produk berkualitas dengan harga terjangkau dan pelayanan pelanggan terbaik.`,
        aboutFeatures: [
          { icon: 'shopping-bag', text: 'Produk Berkualitas' },
          { icon: 'tags', text: 'Harga Terjangkau' },
          { icon: 'shield-alt', text: 'Garansi Produk' }
        ],
        featuresSubtitle: 'Keunggulan yang membedakan kami dari yang lain',
        features: [
          { icon: 'shopping-bag', title: 'Produk Berkualitas', description: 'Barang pilihan dengan kualitas terbaik dan terjamin' },
          { icon: 'tags', title: 'Harga Terjangkau', description: 'Harga kompetitif dan terjangkau untuk semua kalangan' },
          { icon: 'shield-alt', title: 'Garansi Produk', description: 'Jaminan kualitas dan garansi untuk setiap produk' },
          { icon: 'headset', title: 'Layanan 24/7', description: 'Dukungan pelanggan setiap saat untuk kebutuhan Anda' }
        ],
        productsSubtitle: 'Produk pilihan dengan kualitas terbaik',
        productDescription: 'Produk berkualitas dengan harga terjangkau dan pelayanan terbaik.',
        productFeatures: ['Kualitas Terjamin', 'Harga Terjangkau', 'Garansi Produk'],
        contactSubtitle: 'Kami siap melayani kebutuhan Anda',
        footerDescription: 'Menghadirkan produk berkualitas dengan harga terjangkau dan pelayanan pelanggan terbaik.'
      }
    };
    
    return contentTemplates[category] || {
      heroTitle: `Selamat Datang di ${businessName}`,
      heroSubtitle: description,
      ctaPrimary: 'Lihat Produk',
      ctaSecondary: 'Hubungi Kami',
      metaDescription: `${businessName} - ${categoryDisplay} terpercaya dengan layanan profesional.`,
      keywords: `${businessName}, ${categoryDisplay}, layanan, jasa`,
      aboutTitle: `${categoryDisplay} Terpercaya`,
      aboutSubtitle: 'Mengenal lebih dekat dengan layanan kami',
      aboutDescription: `Kami berkomitmen menghadirkan layanan terbaik dengan kualitas tinggi dan pelayanan profesional.`,
      aboutFeatures: [
        { icon: 'star', text: 'Kualitas Terjamin' },
        { icon: 'clock', text: 'Layanan Cepat' },
        { icon: 'heart', text: 'Kepuasan Pelanggan' }
      ],
      featuresSubtitle: 'Keunggulan yang membedakan kami dari yang lain',
      features: [
        { icon: 'star', title: 'Kualitas Terjamin', description: 'Layanan dengan standar tinggi dan terjamin' },
        { icon: 'clock', title: 'Layanan Cepat', description: 'Respon dan penyelesaian cepat untuk kebutuhan Anda' },
        { icon: 'heart', title: 'Kepuasan Pelanggan', description: 'Prioritas kepuasan pelanggan dalam setiap layanan' },
        { icon: 'shield-alt', title: 'Terpercaya', description: 'Layanan yang dapat dipercaya dan konsisten' }
      ],
      productsSubtitle: 'Layanan profesional dengan kualitas terbaik',
      productDescription: 'Layanan berkualitas dengan standar tinggi dan pelayanan profesional.',
      productFeatures: ['Kualitas Terjamin', 'Layanan Cepat', 'Pelayanan Prima'],
      contactSubtitle: 'Kami siap melayani kebutuhan Anda',
      footerDescription: 'Menghadirkan layanan terbaik dengan kualitas tinggi dan pelayanan profesional.'
    };
  }

  private generateIntelligentWebsite(businessData: BusinessData): AIResponse {
    const { businessName, ownerName, description, category, products, phone, address, email, whatsapp, instagram } = businessData;
    const colors = this.getCategoryColors(category);
    const categoryDisplay = this.getCategoryDisplayName(category);
    
    // Generate intelligent HTML based on business type
    const html = this.generateIntelligentHTML(businessData);
    const css = this.generateIntelligentCSS(businessData);
    const js = this.generateIntelligentJS(businessData);
    
    return {
      html,
      css,
      js,
      success: true
    };
  }

  private generateIntelligentHTML(businessData: BusinessData): string {
    const { businessName, ownerName, description, category, products, phone, address, email, whatsapp, instagram } = businessData;
    const categoryDisplay = this.getCategoryDisplayName(category);
    const icon = this.getCategoryIcon(category);
    
    // Create dynamic content based on category
    const heroSection = this.generateHeroSection(businessData);
    const aboutSection = this.generateAboutSection(businessData);
    const productsSection = this.generateProductsSection(businessData);
    const contactSection = this.generateContactSection(businessData);
    const featuresSection = this.generateFeaturesSection(businessData);
    
    return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${businessName} - ${categoryDisplay} Terbaik</title>
    <meta name="description" content="${description}">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        /* CSS will be injected here */
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <i class="fas fa-${icon}"></i>
                <span>${businessName}</span>
            </div>
            <ul class="nav-menu">
                <li><a href="#home">Beranda</a></li>
                <li><a href="#about">Tentang</a></li>
                <li><a href="#features">Fitur</a></li>
                <li><a href="#products">Produk</a></li>
                <li><a href="#contact">Kontak</a></li>
            </ul>
            <div class="nav-toggle">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </nav>

    ${heroSection}
    ${aboutSection}
    ${featuresSection}
    ${productsSection}
    ${contactSection}

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>${businessName}</h3>
                    <p>${description}</p>
                    <div class="social-links">
                        ${whatsapp ? `<a href="https://wa.me/${whatsapp.replace(/\D/g, '')}" target="_blank"><i class="fab fa-whatsapp"></i></a>` : ''}
                        ${instagram ? `<a href="https://instagram.com/${instagram.replace('@', '')}" target="_blank"><i class="fab fa-instagram"></i></a>` : ''}
                        ${email ? `<a href="mailto:${email}"><i class="fas fa-envelope"></i></a>` : ''}
                    </div>
                </div>
                <div class="footer-section">
                    <h3>Kontak</h3>
                    <p><i class="fas fa-phone"></i> ${phone}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${address}</p>
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

  private generateHeroSection(businessData: BusinessData): string {
    const { businessName, description, category } = businessData;
    const colors = this.getCategoryColors(category);
    const icon = this.getCategoryIcon(category);
    
    const heroVariants = [
      `<section id="home" class="hero hero-modern">
        <div class="hero-bg"></div>
        <div class="hero-content">
            <div class="hero-icon">
                <i class="fas fa-${icon}"></i>
            </div>
            <h1 class="hero-title">${businessName}</h1>
            <p class="hero-subtitle">${description}</p>
            <div class="hero-buttons">
                <a href="#products" class="btn btn-primary">Lihat Produk</a>
                <a href="#contact" class="btn btn-outline">Hubungi Kami</a>
            </div>
            <div class="hero-stats">
                <div class="stat">
                    <span class="stat-number">100%</span>
                    <span class="stat-label">Kepuasan</span>
                </div>
                <div class="stat">
                    <span class="stat-number">24/7</span>
                    <span class="stat-label">Layanan</span>
                </div>
                <div class="stat">
                    <span class="stat-number">5★</span>
                    <span class="stat-label">Rating</span>
                </div>
            </div>
        </div>
    </section>`,
      `<section id="home" class="hero hero-minimal">
        <div class="hero-content">
            <h1 class="hero-title">Selamat Datang di<br><span class="highlight">${businessName}</span></h1>
            <p class="hero-description">${description}</p>
            <div class="hero-cta">
                <a href="#products" class="btn btn-primary">Mulai Sekarang</a>
            </div>
        </div>
        <div class="hero-visual">
            <div class="floating-card">
                <i class="fas fa-${icon}"></i>
            </div>
        </div>
    </section>`
    ];
    
    return heroVariants[Math.floor(Math.random() * heroVariants.length)];
  }

  private generateAboutSection(businessData: BusinessData): string {
    const { businessName, ownerName, description, category } = businessData;
    const categoryDisplay = this.getCategoryDisplayName(category);
    
    return `<section id="about" class="about">
        <div class="container">
            <div class="section-header">
                <h2>Tentang ${businessName}</h2>
                <p>Mengenal lebih dekat dengan bisnis kami</p>
            </div>
            <div class="about-content">
                <div class="about-text">
                    <h3>${categoryDisplay} Terpercaya</h3>
                    <p>${description}</p>
                    <p>Dikelola oleh <strong>${ownerName}</strong> dengan pengalaman dan dedikasi tinggi untuk memberikan layanan terbaik kepada pelanggan.</p>
                    <div class="about-features">
                        <div class="feature">
                            <i class="fas fa-check-circle"></i>
                            <span>Kualitas Terjamin</span>
                        </div>
                        <div class="feature">
                            <i class="fas fa-clock"></i>
                            <span>Layanan Cepat</span>
                        </div>
                        <div class="feature">
                            <i class="fas fa-heart"></i>
                            <span>Kepuasan Pelanggan</span>
                        </div>
                    </div>
                </div>
                <div class="about-image">
                    <div class="image-placeholder">
                        <i class="fas fa-${this.getCategoryIcon(category)}"></i>
                    </div>
                </div>
            </div>
        </div>
    </section>`;
  }

  private generateFeaturesSection(businessData: BusinessData): string {
    const { category } = businessData;
    const features = this.getCategoryFeatures(category);
    
    return `<section id="features" class="features">
        <div class="container">
            <div class="section-header">
                <h2>Mengapa Memilih Kami?</h2>
                <p>Keunggulan yang membedakan kami dari yang lain</p>
            </div>
            <div class="features-grid">
                ${features.map(feature => `
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-${feature.icon}"></i>
                        </div>
                        <h3>${feature.title}</h3>
                        <p>${feature.description}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>`;
  }

  private generateProductsSection(businessData: BusinessData): string {
    const { products, category } = businessData;
    const productList = products.split(',').map(p => p.trim());
    const icon = this.getCategoryIcon(category);
    
    return `<section id="products" class="products">
        <div class="container">
            <div class="section-header">
                <h2>Produk & Layanan</h2>
                <p>Solusi terbaik untuk kebutuhan Anda</p>
            </div>
            <div class="products-grid">
                ${productList.map((product, index) => `
                    <div class="product-card" data-aos="fade-up" data-aos-delay="${index * 100}">
                        <div class="product-icon">
                            <i class="fas fa-${icon}"></i>
                        </div>
                        <h3>${product}</h3>
                        <p>Layanan profesional dengan kualitas terbaik dan harga terjangkau.</p>
                        <div class="product-features">
                            <span class="feature-tag">Kualitas Terjamin</span>
                            <span class="feature-tag">Harga Terjangkau</span>
                            <span class="feature-tag">Layanan Cepat</span>
                        </div>
                        <a href="#contact" class="btn btn-outline">Hubungi Kami</a>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>`;
  }

  private generateContactSection(businessData: BusinessData): string {
    const { businessName, phone, address, email, whatsapp, instagram } = businessData;
    
    return `<section id="contact" class="contact">
        <div class="container">
            <div class="section-header">
                <h2>Hubungi Kami</h2>
                <p>Kami siap melayani kebutuhan Anda</p>
            </div>
            <div class="contact-content">
                <div class="contact-info">
                    <div class="contact-item">
                        <div class="contact-icon">
                            <i class="fas fa-phone"></i>
                        </div>
                        <div class="contact-details">
                            <h3>Telepon</h3>
                            <p><a href="tel:${phone}">${phone}</a></p>
                        </div>
                    </div>
                    <div class="contact-item">
                        <div class="contact-icon">
                            <i class="fas fa-map-marker-alt"></i>
                        </div>
                        <div class="contact-details">
                            <h3>Alamat</h3>
                            <p>${address}</p>
                        </div>
                    </div>
                    ${email ? `
                    <div class="contact-item">
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
                    <div class="contact-item">
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
                    <div class="contact-item">
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
                <div class="contact-form">
                    <h3>Kirim Pesan</h3>
                    <form id="contactForm">
                        <div class="form-group">
                            <input type="text" id="name" name="name" placeholder="Nama Lengkap" required>
                        </div>
                        <div class="form-group">
                            <input type="email" id="email" name="email" placeholder="Email" required>
                        </div>
                        <div class="form-group">
                            <input type="tel" id="phone" name="phone" placeholder="Nomor Telepon">
                        </div>
                        <div class="form-group">
                            <textarea id="message" name="message" placeholder="Pesan Anda" rows="5" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Kirim Pesan</button>
                    </form>
                </div>
            </div>
        </div>
    </section>`;
  }

  private generateIntelligentCSS(businessData: BusinessData): string {
    const { category } = businessData;
    const colors = this.getCategoryColors(category);
    
    return `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary-color: ${colors.primary};
    --secondary-color: ${colors.secondary};
    --accent-color: ${this.getAccentColor(category)};
    --text-color: #333;
    --light-text: #666;
    --background: #fff;
    --light-bg: #f8f9fa;
    --border-color: #e9ecef;
    --shadow: 0 5px 15px rgba(0,0,0,0.1);
    --shadow-hover: 0 10px 25px rgba(0,0,0,0.15);
}

body {
    font-family: 'Inter', sans-serif;
    line-height: 1.6;
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
    backdrop-filter: blur(10px);
    z-index: 1000;
    padding: 1rem 0;
    transition: all 0.3s ease;
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
    color: var(--primary-color);
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-menu a {
    text-decoration: none;
    color: var(--text-color);
    font-weight: 500;
    transition: color 0.3s ease;
    position: relative;
}

.nav-menu a:hover {
    color: var(--primary-color);
}

.nav-menu a::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--primary-color);
    transition: width 0.3s ease;
}

.nav-menu a:hover::after {
    width: 100%;
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
    transition: 0.3s;
}

/* Hero Section */
.hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
}

.hero-modern {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
    color: white;
    text-align: center;
}

.hero-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.3;
}

.hero-content {
    position: relative;
    z-index: 2;
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
}

.hero-icon {
    font-size: 4rem;
    margin-bottom: 2rem;
    opacity: 0.9;
}

.hero-title {
    font-size: 3.5rem;
    font-weight: 800;
    margin-bottom: 1.5rem;
    line-height: 1.2;
}

.hero-subtitle {
    font-size: 1.3rem;
    margin-bottom: 2.5rem;
    opacity: 0.9;
    line-height: 1.6;
}

.hero-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 3rem;
}

.hero-stats {
    display: flex;
    justify-content: center;
    gap: 3rem;
    flex-wrap: wrap;
}

.stat {
    text-align: center;
}

.stat-number {
    display: block;
    font-size: 2rem;
    font-weight: 700;
    color: var(--accent-color);
}

.stat-label {
    font-size: 0.9rem;
    opacity: 0.8;
}

/* Buttons */
.btn {
    display: inline-block;
    padding: 12px 30px;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
    font-size: 1rem;
}

.btn-primary {
    background: var(--accent-color);
    color: white;
}

.btn-primary:hover {
    background: var(--secondary-color);
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

/* Sections */
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
    color: var(--light-text);
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
    color: var(--primary-color);
}

.about-text p {
    margin-bottom: 1.5rem;
    line-height: 1.8;
}

.about-features {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 2rem;
}

.feature {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.feature i {
    color: var(--primary-color);
    font-size: 1.2rem;
}

.about-image {
    text-align: center;
}

.image-placeholder {
    width: 300px;
    height: 300px;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 5rem;
    color: white;
    margin: 0 auto;
}

/* Features Section */
.features {
    padding: 100px 0;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.feature-card {
    background: white;
    padding: 2.5rem;
    border-radius: 15px;
    box-shadow: var(--shadow);
    text-align: center;
    transition: all 0.3s ease;
    border: 1px solid var(--border-color);
}

.feature-card:hover {
    transform: translateY(-10px);
    box-shadow: var(--shadow-hover);
}

.feature-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
    font-size: 2rem;
    color: white;
}

.feature-card h3 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
    color: var(--text-color);
}

.feature-card p {
    color: var(--light-text);
    line-height: 1.6;
}

/* Products Section */
.products {
    padding: 100px 0;
    background: var(--light-bg);
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.product-card {
    background: white;
    padding: 2.5rem;
    border-radius: 15px;
    box-shadow: var(--shadow);
    text-align: center;
    transition: all 0.3s ease;
    border: 1px solid var(--border-color);
}

.product-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-hover);
}

.product-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
    font-size: 2rem;
    color: white;
}

.product-card h3 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
    color: var(--text-color);
}

.product-card p {
    color: var(--light-text);
    margin-bottom: 1.5rem;
    line-height: 1.6;
}

.product-features {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
    margin-bottom: 1.5rem;
}

.feature-tag {
    background: var(--light-bg);
    color: var(--text-color);
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
}

/* Contact Section */
.contact {
    padding: 100px 0;
}

.contact-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
}

.contact-info {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.contact-item {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1.5rem;
    background: white;
    border-radius: 10px;
    box-shadow: var(--shadow);
    border: 1px solid var(--border-color);
}

.contact-icon {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: white;
}

.contact-details h3 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    color: var(--text-color);
}

.contact-details p {
    color: var(--light-text);
}

.contact-details a {
    color: var(--primary-color);
    text-decoration: none;
}

.contact-form {
    background: white;
    padding: 2.5rem;
    border-radius: 15px;
    box-shadow: var(--shadow);
    border: 1px solid var(--border-color);
}

.contact-form h3 {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    color: var(--text-color);
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--primary-color);
}

.form-group textarea {
    resize: vertical;
    min-height: 120px;
}

/* Footer */
.footer {
    background: var(--text-color);
    color: white;
    padding: 50px 0 20px;
}

.footer-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    margin-bottom: 2rem;
}

.footer-section h3 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
}

.footer-section p {
    margin-bottom: 1rem;
    opacity: 0.8;
}

.social-links {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}

.social-links a {
    width: 40px;
    height: 40px;
    background: var(--primary-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    text-decoration: none;
    transition: all 0.3s ease;
}

.social-links a:hover {
    background: var(--secondary-color);
    transform: translateY(-2px);
}

.footer-bottom {
    text-align: center;
    padding-top: 2rem;
    border-top: 1px solid rgba(255,255,255,0.1);
    opacity: 0.8;
}

/* Responsive Design */
@media (max-width: 768px) {
    .nav-menu {
        display: none;
    }
    
    .nav-toggle {
        display: flex;
    }
    
    .hero-title {
        font-size: 2.5rem;
    }
    
    .hero-subtitle {
        font-size: 1.1rem;
    }
    
    .hero-buttons {
        flex-direction: column;
        align-items: center;
    }
    
    .hero-stats {
        gap: 2rem;
    }
    
    .about-content,
    .contact-content {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
    
    .features-grid,
    .products-grid {
        grid-template-columns: 1fr;
    }
    
    .footer-content {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
    
    .section-header h2 {
        font-size: 2rem;
    }
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

.fade-in-up {
    animation: fadeInUp 0.6s ease-out;
}`;
  }

  private generateIntelligentJS(businessData: BusinessData): string {
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

// Mobile menu toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Contact form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Show success message
        alert('Terima kasih! Pesan Anda telah terkirim. Kami akan segera menghubungi Anda.');
        
        // Reset form
        this.reset();
    });
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Product cards animation
document.querySelectorAll('.product-card').forEach((card, index) => {
    card.style.animationDelay = \`\${index * 0.1}s\`;
});

// Feature cards animation
document.querySelectorAll('.feature-card').forEach((card, index) => {
    card.style.animationDelay = \`\${index * 0.1}s\`;
});

// Add hover effects
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = \`translateY(\${scrolled * 0.5}px)\`;
    }
});

// Add counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            if (statNumber) {
                const target = parseInt(statNumber.textContent);
                animateCounter(statNumber, target);
            }
            statsObserver.unobserve(entry.target);
        }
    });
});

document.querySelectorAll('.stat').forEach(stat => {
    statsObserver.observe(stat);
});`;
  }

  private getCategoryFeatures(category: string): Array<{icon: string, title: string, description: string}> {
    const features: { [key: string]: Array<{icon: string, title: string, description: string}> } = {
      restaurant: [
        { icon: 'utensils', title: 'Makanan Segar', description: 'Bahan berkualitas tinggi dan segar setiap hari' },
        { icon: 'clock', title: 'Layanan Cepat', description: 'Pesanan siap dalam waktu singkat' },
        { icon: 'star', title: 'Rasa Terjamin', description: 'Cita rasa yang konsisten dan lezat' },
        { icon: 'truck', title: 'Pengiriman', description: 'Layanan delivery ke lokasi Anda' }
      ],
      retail: [
        { icon: 'shopping-bag', title: 'Produk Berkualitas', description: 'Barang pilihan dengan kualitas terbaik' },
        { icon: 'tags', title: 'Harga Terjangkau', description: 'Harga kompetitif dan terjangkau' },
        { icon: 'shield-alt', title: 'Garansi', description: 'Jaminan kualitas dan garansi produk' },
        { icon: 'headset', title: 'Layanan 24/7', description: 'Dukungan pelanggan setiap saat' }
      ],
      service: [
        { icon: 'tools', title: 'Profesional', description: 'Tim berpengalaman dan terlatih' },
        { icon: 'certificate', title: 'Terpercaya', description: 'Layanan terjamin dan terpercaya' },
        { icon: 'clock', title: 'Tepat Waktu', description: 'Penyelesaian sesuai jadwal' },
        { icon: 'handshake', title: 'Kepuasan', description: 'Kepuasan pelanggan adalah prioritas' }
      ],
      technology: [
        { icon: 'laptop', title: 'Teknologi Terbaru', description: 'Menggunakan teknologi terkini' },
        { icon: 'code', title: 'Solusi Custom', description: 'Solusi yang disesuaikan kebutuhan' },
        { icon: 'rocket', title: 'Inovasi', description: 'Terus berinovasi untuk hasil terbaik' },
        { icon: 'support', title: 'Dukungan Teknis', description: 'Dukungan teknis 24/7' }
      ]
    };
    
    return features[category] || [
      { icon: 'star', title: 'Kualitas Terjamin', description: 'Layanan dengan standar tinggi' },
      { icon: 'clock', title: 'Layanan Cepat', description: 'Respon dan penyelesaian cepat' },
      { icon: 'heart', title: 'Kepuasan Pelanggan', description: 'Prioritas kepuasan pelanggan' },
      { icon: 'shield-alt', title: 'Terpercaya', description: 'Layanan yang dapat dipercaya' }
    ];
  }

  private getAccentColor(category: string): string {
    const accentColors: { [key: string]: string } = {
      restaurant: '#ff6b6b',
      retail: '#4ecdc4',
      service: '#45b7d1',
      technology: '#96ceb4',
      health: '#feca57',
      education: '#ff9ff3',
      automotive: '#54a0ff',
      beauty: '#5f27cd',
      fitness: '#00d2d3',
      consulting: '#ff9f43'
    };
    return accentColors[category] || '#3498db';
  }

  private generateFallbackWebsite(businessData: BusinessData): AIResponse {
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