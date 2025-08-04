export interface ModificationRequest {
  currentHtml: string;
  modificationRequest: string;
  businessData: any;
}

export interface ModificationResult {
  success: boolean;
  modifiedHtml: string;
  method: string;
  error?: string;
}

export class WebsiteModificationFallback {
  private commonModifications = new Map<string, (html: string, businessData: any) => string>();

  constructor() {
    this.initializeCommonModifications();
  }

  private initializeCommonModifications() {
    // Color modifications
    this.commonModifications.set('change color', (html: string, businessData: any) => {
      const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      return html.replace(/color:\s*#[0-9a-fA-F]{6}/g, `color: ${randomColor}`)
                 .replace(/background-color:\s*#[0-9a-fA-F]{6}/g, `background-color: ${randomColor}`);
    });

    this.commonModifications.set('blue', (html: string, businessData: any) => {
      return html.replace(/color:\s*#[0-9a-fA-F]{6}/g, 'color: #3b82f6')
                 .replace(/background-color:\s*#[0-9a-fA-F]{6}/g, 'background-color: #3b82f6');
    });

    this.commonModifications.set('green', (html: string, businessData: any) => {
      return html.replace(/color:\s*#[0-9a-fA-F]{6}/g, 'color: #10b981')
                 .replace(/background-color:\s*#[0-9a-fA-F]{6}/g, 'background-color: #10b981');
    });

    this.commonModifications.set('red', (html: string, businessData: any) => {
      return html.replace(/color:\s*#[0-9a-fA-F]{6}/g, 'color: #ef4444')
                 .replace(/background-color:\s*#[0-9a-fA-F]{6}/g, 'background-color: #ef4444');
    });

    // Font modifications
    this.commonModifications.set('bigger font', (html: string, businessData: any) => {
      return html.replace(/font-size:\s*\d+px/g, (match) => {
        const size = parseInt(match.match(/\d+/)?.[0] || '16');
        return `font-size: ${size + 4}px`;
      });
    });

    this.commonModifications.set('smaller font', (html: string, businessData: any) => {
      return html.replace(/font-size:\s*\d+px/g, (match) => {
        const size = parseInt(match.match(/\d+/)?.[0] || '16');
        return `font-size: ${Math.max(size - 2, 12)}px`;
      });
    });

    this.commonModifications.set('bold', (html: string, businessData: any) => {
      return html.replace(/font-weight:\s*normal/g, 'font-weight: bold')
                 .replace(/font-weight:\s*400/g, 'font-weight: bold');
    });

    // Layout modifications
    this.commonModifications.set('center', (html: string, businessData: any) => {
      return html.replace(/text-align:\s*left/g, 'text-align: center')
                 .replace(/text-align:\s*right/g, 'text-align: center');
    });

    this.commonModifications.set('left', (html: string, businessData: any) => {
      return html.replace(/text-align:\s*center/g, 'text-align: left')
                 .replace(/text-align:\s*right/g, 'text-align: left');
    });

    this.commonModifications.set('right', (html: string, businessData: any) => {
      return html.replace(/text-align:\s*center/g, 'text-align: right')
                 .replace(/text-align:\s*left/g, 'text-align: right');
    });

    // Spacing modifications
    this.commonModifications.set('more space', (html: string, businessData: any) => {
      return html.replace(/padding:\s*\d+px/g, (match) => {
        const size = parseInt(match.match(/\d+/)?.[0] || '16');
        return `padding: ${size + 8}px`;
      }).replace(/margin:\s*\d+px/g, (match) => {
        const size = parseInt(match.match(/\d+/)?.[0] || '16');
        return `margin: ${size + 8}px`;
      });
    });

    this.commonModifications.set('less space', (html: string, businessData: any) => {
      return html.replace(/padding:\s*\d+px/g, (match) => {
        const size = parseInt(match.match(/\d+/)?.[0] || '16');
        return `padding: ${Math.max(size - 4, 4)}px`;
      }).replace(/margin:\s*\d+px/g, (match) => {
        const size = parseInt(match.match(/\d+/)?.[0] || '16');
        return `margin: ${Math.max(size - 4, 4)}px`;
      });
    });

    // Contact form addition
    this.commonModifications.set('contact form', (html: string, businessData: any) => {
      const contactForm = `
        <div class="contact-form" style="background: #f8fafc; padding: 2rem; border-radius: 8px; margin: 2rem 0;">
          <h3 style="color: #1f2937; margin-bottom: 1rem;">Hubungi Kami</h3>
          <form style="display: grid; gap: 1rem;">
            <input type="text" placeholder="Nama Anda" style="padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 4px;">
            <input type="email" placeholder="Email Anda" style="padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 4px;">
            <textarea placeholder="Pesan Anda" rows="4" style="padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 4px; resize: vertical;"></textarea>
            <button type="submit" style="background: #3b82f6; color: white; padding: 0.75rem; border: none; border-radius: 4px; cursor: pointer;">Kirim Pesan</button>
          </form>
        </div>
      `;
      
      // Insert before closing body tag
      return html.replace('</body>', `${contactForm}\n</body>`);
    });

    // Social media links
    this.commonModifications.set('social media', (html: string, businessData: any) => {
      const socialLinks = `
        <div class="social-links" style="text-align: center; padding: 1rem; background: #f1f5f9;">
          <h4 style="color: #374151; margin-bottom: 1rem;">Ikuti Kami</h4>
          <div style="display: flex; justify-content: center; gap: 1rem;">
            ${businessData.whatsapp ? `<a href="https://wa.me/${businessData.whatsapp}" style="color: #25d366; font-size: 1.5rem; text-decoration: none;">📱 WhatsApp</a>` : ''}
            ${businessData.instagram ? `<a href="https://instagram.com/${businessData.instagram}" style="color: #e4405f; font-size: 1.5rem; text-decoration: none;">📸 Instagram</a>` : ''}
            <a href="tel:${businessData.phone}" style="color: #3b82f6; font-size: 1.5rem; text-decoration: none;">📞 Telepon</a>
          </div>
        </div>
      `;
      
      return html.replace('</body>', `${socialLinks}\n</body>`);
    });

    // Business hours
    this.commonModifications.set('business hours', (html: string, businessData: any) => {
      const businessHours = `
        <div class="business-hours" style="background: #fef3c7; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
          <h4 style="color: #92400e; margin-bottom: 0.5rem;">🕒 Jam Operasional</h4>
          <p style="color: #92400e; margin: 0;">Senin - Jumat: 08:00 - 17:00</p>
          <p style="color: #92400e; margin: 0;">Sabtu: 08:00 - 15:00</p>
          <p style="color: #92400e; margin: 0;">Minggu: Tutup</p>
        </div>
      `;
      
      return html.replace('</body>', `${businessHours}\n</body>`);
    });

    // Product showcase
    this.commonModifications.set('products', (html: string, businessData: any) => {
      const products = `
        <div class="products" style="padding: 2rem; background: #f8fafc;">
          <h3 style="color: #1f2937; text-align: center; margin-bottom: 2rem;">Produk Unggulan</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
            <div style="background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h4 style="color: #374151; margin-bottom: 0.5rem;">Produk 1</h4>
              <p style="color: #6b7280; font-size: 0.9rem;">Deskripsi produk unggulan kami</p>
            </div>
            <div style="background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h4 style="color: #374151; margin-bottom: 0.5rem;">Produk 2</h4>
              <p style="color: #6b7280; font-size: 0.9rem;">Produk berkualitas tinggi</p>
            </div>
            <div style="background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h4 style="color: #374151; margin-bottom: 0.5rem;">Produk 3</h4>
              <p style="color: #6b7280; font-size: 0.9rem;">Pilihan terbaik untuk Anda</p>
            </div>
          </div>
        </div>
      `;
      
      return html.replace('</body>', `${products}\n</body>`);
    });
  }

  async modifyWithFallback(request: ModificationRequest): Promise<ModificationResult> {
    const { currentHtml, modificationRequest, businessData } = request;

    try {
      // Try rule-based modification first (no external API calls)
      const ruleResult = this.tryRuleBasedModification(request);
      if (ruleResult.success) {
        return {
          success: true,
          modifiedHtml: ruleResult.modifiedHtml,
          method: 'Rule-based'
        };
      }

      // If rule-based fails, try template-based modification
      const templateResult = this.tryTemplateBasedModification(request);
      if (templateResult.success) {
        return {
          success: true,
          modifiedHtml: templateResult.modifiedHtml,
          method: 'Template-based'
        };
      }

      // Final fallback: return original with error message
      return {
        success: false,
        modifiedHtml: this.addErrorMessage(currentHtml, modificationRequest),
        method: 'Error fallback',
        error: 'Unable to process modification request'
      };

    } catch (error) {
      console.error('Modification fallback error:', error);
      return {
        success: false,
        modifiedHtml: this.addErrorMessage(currentHtml, modificationRequest),
        method: 'Error fallback',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async tryAIModification(request: ModificationRequest): Promise<ModificationResult> {
    try {
      // Use absolute URL for server-side fetch
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:4000';
      const response = await fetch(`${baseUrl}/api/modify-website`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
        signal: AbortSignal.timeout(15000) // 15 second timeout
      });

      if (!response.ok) {
        throw new Error(`AI API failed: ${response.status}`);
      }

      const result = await response.json();
      if (result.modifiedHtml) {
        return {
          success: true,
          modifiedHtml: result.modifiedHtml,
          method: 'AI'
        };
      }

      throw new Error('AI returned invalid response');
    } catch (error) {
      console.log('AI modification failed, trying fallback:', error);
      return { success: false, modifiedHtml: '', method: 'AI' };
    }
  }

  private tryRuleBasedModification(request: ModificationRequest): ModificationResult {
    const { currentHtml, modificationRequest, businessData } = request;
    const lowerRequest = modificationRequest.toLowerCase();

    // Check for common modification patterns
    for (const [pattern, modifier] of this.commonModifications) {
      if (lowerRequest.includes(pattern)) {
        try {
          const modifiedHtml = modifier(currentHtml, businessData);
          return {
            success: true,
            modifiedHtml,
            method: 'Rule-based'
          };
        } catch (error) {
          console.error(`Rule-based modification failed for pattern "${pattern}":`, error);
        }
      }
    }

    // Try keyword-based modifications
    const keywordModifications = this.getKeywordModifications(lowerRequest);
    if (keywordModifications.length > 0) {
      try {
        let modifiedHtml = currentHtml;
        for (const modification of keywordModifications) {
          modifiedHtml = modification(modifiedHtml, businessData);
        }
        return {
          success: true,
          modifiedHtml,
          method: 'Rule-based (keywords)'
        };
      } catch (error) {
        console.error('Keyword-based modification failed:', error);
      }
    }

    return { success: false, modifiedHtml: '', method: 'Rule-based' };
  }

  private getKeywordModifications(request: string): Array<(html: string, businessData: any) => string> {
    const modifications: Array<(html: string, businessData: any) => string> = [];

    // Color keywords
    if (request.includes('biru') || request.includes('blue')) {
      modifications.push((html: string) => 
        html.replace(/color:\s*#[0-9a-fA-F]{6}/g, 'color: #3b82f6')
            .replace(/background-color:\s*#[0-9a-fA-F]{6}/g, 'background-color: #3b82f6')
      );
    }

    if (request.includes('hijau') || request.includes('green')) {
      modifications.push((html: string) => 
        html.replace(/color:\s*#[0-9a-fA-F]{6}/g, 'color: #10b981')
            .replace(/background-color:\s*#[0-9a-fA-F]{6}/g, 'background-color: #10b981')
      );
    }

    if (request.includes('merah') || request.includes('red')) {
      modifications.push((html: string) => 
        html.replace(/color:\s*#[0-9a-fA-F]{6}/g, 'color: #ef4444')
            .replace(/background-color:\s*#[0-9a-fA-F]{6}/g, 'background-color: #ef4444')
      );
    }

    // Size keywords
    if (request.includes('besar') || request.includes('big') || request.includes('besar')) {
      modifications.push((html: string) => 
        html.replace(/font-size:\s*\d+px/g, (match) => {
          const size = parseInt(match.match(/\d+/)?.[0] || '16');
          return `font-size: ${size + 6}px`;
        })
      );
    }

    if (request.includes('kecil') || request.includes('small')) {
      modifications.push((html: string) => 
        html.replace(/font-size:\s*\d+px/g, (match) => {
          const size = parseInt(match.match(/\d+/)?.[0] || '16');
          return `font-size: ${Math.max(size - 4, 12)}px`;
        })
      );
    }

    // Alignment keywords
    if (request.includes('tengah') || request.includes('center')) {
      modifications.push((html: string) => 
        html.replace(/text-align:\s*(left|right)/g, 'text-align: center')
      );
    }

    if (request.includes('kiri') || request.includes('left')) {
      modifications.push((html: string) => 
        html.replace(/text-align:\s*(center|right)/g, 'text-align: left')
      );
    }

    return modifications;
  }

  private tryTemplateBasedModification(request: ModificationRequest): ModificationResult {
    const { currentHtml, modificationRequest, businessData } = request;
    const lowerRequest = modificationRequest.toLowerCase();

    // Template-based modifications for common requests
    if (lowerRequest.includes('modern') || lowerRequest.includes('kontemporer')) {
      const modernStyles = `
        <style>
          body { font-family: 'Inter', sans-serif; line-height: 1.6; }
          .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem 0; }
          .section { padding: 3rem 0; }
          .card { background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); padding: 2rem; margin: 1rem 0; }
          .button { background: #3b82f6; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; display: inline-block; }
        </style>
      `;
      
      const modifiedHtml = currentHtml.replace('</head>', `${modernStyles}\n</head>`);
      return {
        success: true,
        modifiedHtml,
        method: 'Template-based (modern)'
      };
    }

    if (lowerRequest.includes('elegant') || lowerRequest.includes('elegan')) {
      const elegantStyles = `
        <style>
          body { font-family: 'Playfair Display', serif; line-height: 1.8; color: #2d3748; }
          .container { max-width: 1000px; margin: 0 auto; padding: 0 2rem; }
          .header { background: #f7fafc; border-bottom: 2px solid #e2e8f0; padding: 3rem 0; }
          .section { padding: 4rem 0; }
          .card { background: white; border: 1px solid #e2e8f0; border-radius: 0; padding: 3rem; margin: 2rem 0; }
          .button { background: #2d3748; color: white; padding: 1rem 2rem; border: none; text-decoration: none; display: inline-block; }
        </style>
      `;
      
      const modifiedHtml = currentHtml.replace('</head>', `${elegantStyles}\n</head>`);
      return {
        success: true,
        modifiedHtml,
        method: 'Template-based (elegant)'
      };
    }

    if (lowerRequest.includes('minimal') || lowerRequest.includes('minimalis')) {
      const minimalStyles = `
        <style>
          body { font-family: 'Inter', sans-serif; line-height: 1.5; color: #1a202c; background: #fafafa; }
          .container { max-width: 800px; margin: 0 auto; padding: 0 1rem; }
          .header { background: white; border-bottom: 1px solid #e2e8f0; padding: 2rem 0; }
          .section { padding: 3rem 0; background: white; margin: 1rem 0; }
          .card { background: white; padding: 2rem; margin: 1rem 0; }
          .button { background: #1a202c; color: white; padding: 0.75rem 1.5rem; border: none; text-decoration: none; display: inline-block; }
        </style>
      `;
      
      const modifiedHtml = currentHtml.replace('</head>', `${minimalStyles}\n</head>`);
      return {
        success: true,
        modifiedHtml,
        method: 'Template-based (minimal)'
      };
    }

    return { success: false, modifiedHtml: '', method: 'Template-based' };
  }

  private addErrorMessage(html: string, request: string): string {
    const errorMessage = `
      <div style="position: fixed; top: 20px; right: 20px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 1rem; max-width: 300px; z-index: 1000;">
        <h4 style="color: #dc2626; margin: 0 0 0.5rem 0;">⚠️ Modification Failed</h4>
        <p style="color: #7f1d1d; margin: 0; font-size: 0.9rem;">Unable to process: "${request}"</p>
        <p style="color: #7f1d1d; margin: 0.5rem 0 0 0; font-size: 0.8rem;">Try simpler requests like "change color", "bigger font", or "add contact form"</p>
      </div>
    `;
    
    return html.replace('</body>', `${errorMessage}\n</body>`);
  }

  // Get available modification suggestions
  getAvailableModifications(): string[] {
    return [
      'Change color to blue/green/red',
      'Make font bigger/smaller',
      'Center align text',
      'Add more spacing',
      'Add contact form',
      'Add social media links',
      'Add business hours',
      'Add product showcase',
      'Make it modern/elegant/minimal',
      'Make text bold',
      'Add background color'
    ];
  }
}

// Export singleton instance
export const websiteModificationFallback = new WebsiteModificationFallback(); 