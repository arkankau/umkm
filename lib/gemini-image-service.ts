export interface GeminiImageResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  prompt?: string;
}

export interface LogoGenerationRequest {
  businessName: string;
  businessType: string;
  description: string;
  style?: string;
  colors?: string[];
  additionalDetails?: string;
}

export class GeminiImageService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
  }

  /**
   * Generate a logo using Gemini's image generation capabilities
   */
  async generateLogo(request: LogoGenerationRequest): Promise<GeminiImageResponse> {
    try {
      if (!this.apiKey) {
        throw new Error('Gemini API key not configured');
      }

      const prompt = this.createLogoPrompt(request);
      console.log('Generating logo with prompt:', prompt);

      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an expert logo designer. Create a professional logo for the following business:

BUSINESS DETAILS:
- Name: ${request.businessName}
- Type: ${request.businessType}
- Description: ${request.description}
${request.style ? `- Style: ${request.style}` : ''}
${request.colors && request.colors.length > 0 ? `- Colors: ${request.colors.join(', ')}` : ''}
${request.additionalDetails ? `- Additional Details: ${request.additionalDetails}` : ''}

REQUIREMENTS:
- Create a modern, professional logo
- Make it suitable for a ${request.businessType} business
- Ensure it's scalable and works in different sizes
- Use appropriate colors and typography
- Make it memorable and distinctive

Please generate a high-quality logo image that represents this business professionally.`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
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

      // Extract image URL from response
      const imageUrl = this.extractImageUrl(data.candidates[0].content.parts[0].text);
      
      if (!imageUrl) {
        // Fallback to placeholder logo
        return this.generatePlaceholderLogo(request.businessName);
      }

      return {
        success: true,
        imageUrl,
        prompt
      };

    } catch (error) {
      console.error('Gemini logo generation failed:', error);
      
      // Fallback to placeholder logo
      return this.generatePlaceholderLogo(request.businessName);
    }
  }

  /**
   * Generate a general image using Gemini
   */
  async generateImage(prompt: string): Promise<GeminiImageResponse> {
    try {
      if (!this.apiKey) {
        throw new Error('Gemini API key not configured');
      }

      console.log('Generating image with prompt:', prompt);

      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an expert image generator. Create a high-quality image based on this description:

${prompt}

Please generate a professional, high-quality image that matches this description exactly.`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
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

      // Extract image URL from response
      const imageUrl = this.extractImageUrl(data.candidates[0].content.parts[0].text);
      
      if (!imageUrl) {
        throw new Error('No image URL found in response');
      }

      return {
        success: true,
        imageUrl,
        prompt
      };

    } catch (error) {
      console.error('Gemini image generation failed:', error);
      return {
        success: false,
        error: `Image generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Generate business-related images for website
   */
  async generateBusinessImages(businessData: {
    businessName: string;
    businessType: string;
    description: string;
    products: string;
  }): Promise<string[]> {
    try {
      const images: string[] = [];
      
      // Generate hero image
      const heroPrompt = `Create a professional hero image for a ${businessData.businessType} business called "${businessData.businessName}". The business ${businessData.description}. Show the business in a positive, professional light with modern design.`;
      const heroResult = await this.generateImage(heroPrompt);
      if (heroResult.success && heroResult.imageUrl) {
        images.push(heroResult.imageUrl);
      }

      // Generate product/service image
      const productPrompt = `Create a professional image showcasing ${businessData.products} for a ${businessData.businessType} business. Make it appealing and professional.`;
      const productResult = await this.generateImage(productPrompt);
      if (productResult.success && productResult.imageUrl) {
        images.push(productResult.imageUrl);
      }

      // Generate team/about image
      const teamPrompt = `Create a professional image representing a team or business environment for a ${businessData.businessType} business. Show professionalism and trust.`;
      const teamResult = await this.generateImage(teamPrompt);
      if (teamResult.success && teamResult.imageUrl) {
        images.push(teamResult.imageUrl);
      }

      return images;

    } catch (error) {
      console.error('Business image generation failed:', error);
      return [];
    }
  }

  /**
   * Create a comprehensive logo prompt
   */
  private createLogoPrompt(request: LogoGenerationRequest): string {
    const { businessName, businessType, description, style, colors, additionalDetails } = request;
    
    let prompt = `Create a professional logo for "${businessName}", a ${businessType} business. `;
    prompt += `The business ${description}. `;
    
    if (style) {
      prompt += `Style: ${style}. `;
    }
    
    if (colors && colors.length > 0) {
      prompt += `Use these colors: ${colors.join(', ')}. `;
    }
    
    if (additionalDetails) {
      prompt += `Additional requirements: ${additionalDetails}. `;
    }
    
    prompt += `Make it modern, scalable, and memorable. The logo should work well in different sizes and formats.`;
    
    return prompt;
  }

  /**
   * Extract image URL from Gemini response
   */
  private extractImageUrl(responseText: string): string | null {
    // Look for image URLs in the response
    const urlMatch = responseText.match(/https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp)/i);
    if (urlMatch) {
      return urlMatch[0];
    }

    // Look for base64 encoded images
    const base64Match = responseText.match(/data:image\/[^;]+;base64,[^\s]+/);
    if (base64Match) {
      return base64Match[0];
    }

    return null;
  }

  /**
   * Generate a placeholder logo when Gemini fails
   */
  private generatePlaceholderLogo(businessName: string): GeminiImageResponse {
    const encodedName = encodeURIComponent(businessName);
    const placeholderUrl = `https://ui-avatars.com/api/?name=${encodedName}&background=22c55e&color=ffffff&size=512&bold=true&font-size=0.4`;
    
    console.log('Using placeholder logo:', placeholderUrl);
    
    return {
      success: true,
      imageUrl: placeholderUrl,
      prompt: `Placeholder logo for ${businessName}`
    };
  }

  /**
   * Check if Gemini API is available
   */
  isAvailable(): boolean {
    return !!this.apiKey;
  }
}

// Export singleton instance
export const geminiImageService = new GeminiImageService(); 