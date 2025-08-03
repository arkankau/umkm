import { BusinessData, AIWebsiteResponse, GeneratedWebsite } from './types';
import { IntelligentTemplateGenerator } from './intelligent-template-generator';

export class AIWebsiteService {
  private apiKeys: {
    gemini?: string;
    openai?: string;
    anthropic?: string;
    huggingface?: string;
  };

  constructor() {
    this.apiKeys = {
      gemini: process.env.GEMINI_API_KEY,
      openai: process.env.OPENAI_API_KEY,
      anthropic: process.env.ANTHROPIC_API_KEY,
      huggingface: process.env.HUGGINGFACE_API_KEY,
    };
  }

  async generateWebsite(businessData: BusinessData, customPrompt?: string): Promise<AIWebsiteResponse> {
    const prompt = this.createWebsitePrompt(businessData, customPrompt);
    
    // Try different AI services in order of preference (Gemini first since it's free)
    const aiServices = [
      { name: 'Gemini', method: this.generateWithGemini.bind(this) },
      { name: 'OpenAI', method: this.generateWithOpenAI.bind(this) },
      { name: 'Anthropic', method: this.generateWithAnthropic.bind(this) },
      { name: 'HuggingFace', method: this.generateWithHuggingFace.bind(this) }
    ];

    for (const service of aiServices) {
      try {
        console.log(`Attempting generation with ${service.name}...`);
        const result = await service.method(prompt, businessData);
        if (result.success) {
          console.log(`Successfully generated with ${service.name}`);
          return result;
        }
      } catch (error) {
        console.error(`${service.name} failed:`, error);
        continue;
      }
    }

    // If all AI services fail, use intelligent template generation
    console.log('All AI services failed, using intelligent templates...');
    return this.generateIntelligentTemplate(businessData, customPrompt);
  }

  async modifyWebsite(
    currentWebsite: GeneratedWebsite, 
    modificationPrompt: string
  ): Promise<AIWebsiteResponse> {
    const prompt = this.createModificationPrompt(currentWebsite, modificationPrompt);
    
    // Try AI services for modification (Gemini first since it's free)
    const aiServices = [
      { name: 'Gemini', method: this.generateWithGemini.bind(this) },
      { name: 'OpenAI', method: this.generateWithOpenAI.bind(this) },
      { name: 'Anthropic', method: this.generateWithAnthropic.bind(this) }
    ];

    for (const service of aiServices) {
      try {
        console.log(`Attempting modification with ${service.name}...`);
        const result = await service.method(prompt, currentWebsite.metadata.businessData);
        if (result.success) {
          console.log(`Successfully modified with ${service.name}`);
          return result;
        }
      } catch (error) {
        console.error(`${service.name} modification failed:`, error);
        continue;
      }
    }

    // Fallback to intelligent modification
    return this.generateIntelligentModification(currentWebsite, modificationPrompt);
  }

  private createModificationPrompt(currentWebsite: GeneratedWebsite, modificationPrompt: string): string {
    const { businessData } = currentWebsite.metadata;
    
    return `Modify the existing website for "${businessData.businessName}" based on the following request:

MODIFICATION REQUEST:
${modificationPrompt}

CURRENT WEBSITE STRUCTURE:
The website currently has these sections:
- Header/Navigation
- Hero section
- About section
- Products/Services section
- Contact section
- Footer

BUSINESS DETAILS:
- Business Name: ${businessData.businessName}
- Category: ${businessData.category}
- Description: ${businessData.description}

INSTRUCTIONS:
- Keep the overall structure and functionality intact
- Apply the requested modifications while maintaining professionalism
- Ensure the changes are consistent with the business type and branding
- Maintain responsive design and accessibility
- Keep all existing contact information and business details

Please provide the complete modified code in this exact format:

===HTML===
[Complete modified HTML code]
===CSS===
[Complete modified CSS code]
===JS===
[Complete modified JavaScript code]
===END===

Focus on implementing the requested changes while keeping the website professional and functional.`;
  }

  private createWebsitePrompt(businessData: BusinessData, customPrompt?: string): string {
    const { businessName, ownerName, description, category, products, phone, address, email, whatsapp, instagram } = businessData;
    
    const basePrompt = `Create a modern, professional website for "${businessName}".

BUSINESS DETAILS:
- Business Name: ${businessName}
- Owner: ${ownerName}
- Description: ${description}
- Category: ${category}
- Products/Services: ${products}
- Phone: ${phone}
- Address: ${address}
- Email: ${email || 'Not provided'}
- WhatsApp: ${whatsapp || 'Not provided'}
- Instagram: ${instagram || 'Not provided'}

${customPrompt ? `CUSTOM REQUIREMENTS: ${customPrompt}` : ''}

DESIGN REQUIREMENTS:
- Modern, responsive design with mobile-first approach
- Professional color scheme appropriate for ${category} business
- Smooth animations and transitions
- Clean typography using Inter or similar fonts
- Font Awesome icons for visual elements
- Accessible design with proper contrast
- SEO-friendly structure

SECTIONS TO INCLUDE:
1. Header with navigation and business logo/name
2. Hero section with compelling headline and call-to-action
3. About section highlighting business strengths
4. Products/Services showcase
5. Contact section with all provided contact information
6. Footer with business details and social links

TECHNICAL REQUIREMENTS:
- Valid HTML5 structure
- Modern CSS with Flexbox/Grid layouts
- JavaScript for interactivity and smooth scrolling
- Responsive breakpoints for mobile, tablet, desktop
- Fast loading and optimized performance

Please provide the complete code in this exact format:

===HTML===
[Complete HTML code with proper DOCTYPE, head, and body sections]
===CSS===
[Complete CSS code with modern styling and responsive design]
===JS===
[Complete JavaScript code for interactivity]
===END===

Make the website visually appealing and professional for a ${category} business.`;

    return basePrompt;
  }

  private async generateWithGemini(prompt: string, businessData: BusinessData): Promise<AIWebsiteResponse> {
    if (!this.apiKeys.gemini) {
      throw new Error('Gemini API key not configured');
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${this.apiKeys.gemini}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are an expert web developer specializing in creating modern, responsive websites for small businesses. Always provide complete, valid HTML, CSS, and JavaScript code that is production-ready and follows best practices.

${prompt}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4000,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response from Gemini API');
    }

    const aiResponse = data.candidates[0].content.parts[0].text;
    const parsed = this.parseAIResponse(aiResponse);
    
    return {
      ...parsed,
      success: true,
      explanation: 'Generated using Google Gemini Pro'
    };
  }

  private async generateWithOpenAI(prompt: string, businessData: BusinessData): Promise<AIWebsiteResponse> {
    if (!this.apiKeys.openai) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKeys.openai}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert web developer specializing in creating modern, responsive websites for small businesses. Always provide complete, valid HTML, CSS, and JavaScript code that is production-ready and follows best practices.'
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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI API');
    }

    const aiResponse = data.choices[0].message.content;
    const parsed = this.parseAIResponse(aiResponse);
    
    return {
      ...parsed,
      success: true,
      explanation: 'Generated using OpenAI GPT-4'
    };
  }

  private async generateWithAnthropic(prompt: string, businessData: BusinessData): Promise<AIWebsiteResponse> {
    if (!this.apiKeys.anthropic) {
      throw new Error('Anthropic API key not configured');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKeys.anthropic}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Anthropic API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.content?.[0]?.text) {
      throw new Error('Invalid response from Anthropic API');
    }

    const aiResponse = data.content[0].text;
    const parsed = this.parseAIResponse(aiResponse);
    
    return {
      ...parsed,
      success: true,
      explanation: 'Generated using Anthropic Claude'
    };
  }

  private async generateWithHuggingFace(prompt: string, businessData: BusinessData): Promise<AIWebsiteResponse> {
    if (!this.apiKeys.huggingface) {
      throw new Error('HuggingFace API key not configured');
    }

    // Use HuggingFace Inference API with a code generation model
    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKeys.huggingface}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 4000,
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HuggingFace API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data[0]?.generated_text) {
      throw new Error('Invalid response from HuggingFace API');
    }

    const aiResponse = data[0].generated_text;
    const parsed = this.parseAIResponse(aiResponse);
    
    return {
      ...parsed,
      success: true,
      explanation: 'Generated using HuggingFace'
    };
  }

  private parseAIResponse(response: string): { html: string; css: string; js: string } {
    try {
      // Parse structured response with markers
      const htmlMatch = response.match(/===HTML===\s*([\s\S]*?)(?===CSS===|===JS===|===END===|$)/i);
      const cssMatch = response.match(/===CSS===\s*([\s\S]*?)(?===HTML===|===JS===|===END===|$)/i);
      const jsMatch = response.match(/===JS===\s*([\s\S]*?)(?===HTML===|===CSS===|===END===|$)/i);

      if (htmlMatch && cssMatch && jsMatch) {
        return {
          html: this.cleanCode(htmlMatch[1]),
          css: this.cleanCode(cssMatch[1]),
          js: this.cleanCode(jsMatch[1])
        };
      }

      // Fallback: try to extract code blocks
      const codeBlocks = response.match(/```(?:html|css|javascript|js)?\s*([\s\S]*?)```/g);
      if (codeBlocks && codeBlocks.length >= 3) {
        return {
          html: this.cleanCode(codeBlocks[0]),
          css: this.cleanCode(codeBlocks[1]),
          js: this.cleanCode(codeBlocks[2])
        };
      }

      // If parsing fails, assume the entire response is HTML and generate basic CSS/JS
      return {
        html: response.includes('<html') ? response : this.wrapInBasicHTML(response),
        css: this.generateBasicCSS(),
        js: this.generateBasicJS()
      };

    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return {
        html: this.wrapInBasicHTML(response),
        css: this.generateBasicCSS(),
        js: this.generateBasicJS()
      };
    }
  }

  private cleanCode(code: string): string {
    return code
      .replace(/```(?:html|css|javascript|js)?\s*/gi, '')
      .replace(/```\s*$/g, '')
      .trim();
  }

  private wrapInBasicHTML(content: string): string {
    return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Website</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    ${content}
</body>
</html>`;
  }

  private generateIntelligentTemplate(businessData: BusinessData, customPrompt?: string): AIWebsiteResponse {
    const template = new IntelligentTemplateGenerator(businessData, customPrompt);
    const result = template.generate();
    
    return {
      ...result,
      success: true,
      explanation: 'Generated using intelligent templates with custom requirements'
    };
  }

  private generateIntelligentModification(currentWebsite: GeneratedWebsite, modificationPrompt: string): AIWebsiteResponse {
    // For now, return the original website with a note about the modification
    return {
      html: currentWebsite.html,
      css: currentWebsite.css,
      js: currentWebsite.js,
      success: true,
      explanation: 'Modification requested but AI services unavailable. Original website returned.'
    };
  }

  private generateBasicCSS(): string {
    return `
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
`;
  }

  private generateBasicJS(): string {
    return `
document.addEventListener('DOMContentLoaded', function() {
    console.log('Website loaded successfully');
});
`;
  }
} 