import { MarketingKnowledgeBase } from './marketing-knowledge-base';

export interface ChatMessage {
  id: number;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  metadata?: {
    topic?: string;
    confidence?: number;
    sources?: string[];
  };
}

export interface MarketingContext {
  businessType?: string;
  industry?: string;
  targetAudience?: string;
  currentChallenges?: string[];
  marketingGoals?: string[];
  budget?: 'low' | 'medium' | 'high';
  experience?: 'beginner' | 'intermediate' | 'advanced';
}

export class MarketingChatbotService {
  private apiKeys: {
    gemini?: string;
    openai?: string;
    anthropic?: string;
  };

  private context: MarketingContext = {};
  private knowledgeBase: MarketingKnowledgeBase;

  constructor() {
    this.apiKeys = {
      gemini: process.env.GEMINI_API_KEY,
      openai: process.env.OPENAI_API_KEY,
      anthropic: process.env.ANTHROPIC_API_KEY,
    };
    this.knowledgeBase = new MarketingKnowledgeBase();
  }

  setContext(context: Partial<MarketingContext>) {
    this.context = { ...this.context, ...context };
  }

  async generateResponse(userMessage: string): Promise<ChatMessage> {
    const enhancedPrompt = this.createEnhancedPrompt(userMessage);
    
    // Try AI services in order of preference
    const aiServices = [
      { name: 'Gemini', method: this.generateWithGemini.bind(this) },
      { name: 'OpenAI', method: this.generateWithOpenAI.bind(this) },
      { name: 'Anthropic', method: this.generateWithAnthropic.bind(this) }
    ];

    for (const service of aiServices) {
      try {
        console.log(`Attempting response with ${service.name}...`);
        const result = await service.method(enhancedPrompt);
        if (result.success) {
          console.log(`Successfully generated response with ${service.name}`);
          return this.formatResponse(result.content, result.suggestions);
        }
      } catch (error) {
        console.error(`${service.name} failed:`, error);
        continue;
      }
    }

    // Fallback to rule-based responses
    return this.generateRuleBasedResponse(userMessage);
  }

  private createEnhancedPrompt(userMessage: string): string {
    const contextInfo = this.buildContextString();
    
    return `You are an expert digital marketing consultant specializing in helping small businesses and UMKM (Micro, Small, and Medium Enterprises) in Indonesia grow their online presence. You have 15+ years of experience and provide actionable, practical advice that's easy to implement.

YOUR EXPERTISE:
- Social media marketing (Instagram, Facebook, TikTok, LinkedIn)
- Content marketing and storytelling
- SEO and website optimization
- Paid advertising (Google Ads, Facebook Ads, Instagram Ads)
- Email marketing and automation
- Local business marketing
- E-commerce marketing
- Brand building and reputation management

CONTEXT INFORMATION:
${contextInfo}

USER QUESTION: ${userMessage}

INSTRUCTIONS:
1. Provide comprehensive, actionable marketing advice tailored to the business context
2. Include specific strategies, tools, and step-by-step guidance
3. Consider the business type, experience level, and budget constraints
4. Provide 3-4 relevant follow-up questions as suggestions
5. Use a friendly, encouraging tone with Indonesian cultural sensitivity
6. Include practical examples, quick wins, and case studies
7. Mention relevant tools, platforms, or resources when appropriate
8. Structure your response with clear sections and bullet points
9. Keep the response conversational but professional
10. Focus on ROI and measurable results
11. Consider local market conditions and cultural factors

RESPONSE FORMAT:
Provide your marketing advice in a clear, structured format with:
- Executive summary of the key points
- Detailed strategies and tactics
- Step-by-step implementation guide
- Tools and resources needed
- Expected outcomes and timeline
- 3-4 suggested follow-up questions

Focus on practical, implementable strategies that will help the business achieve their marketing goals and grow their customer base.`;
  }

  private buildContextString(): string {
    const context = this.context;
    let contextStr = '';

    if (context.businessType) {
      contextStr += `Business Type: ${context.businessType}\n`;
    }
    if (context.industry) {
      contextStr += `Industry: ${context.industry}\n`;
    }
    if (context.targetAudience) {
      contextStr += `Target Audience: ${context.targetAudience}\n`;
    }
    if (context.budget) {
      contextStr += `Budget Level: ${context.budget}\n`;
    }
    if (context.experience) {
      contextStr += `Experience Level: ${context.experience}\n`;
    }
    if (context.currentChallenges?.length) {
      contextStr += `Current Challenges: ${context.currentChallenges.join(', ')}\n`;
    }
    if (context.marketingGoals?.length) {
      contextStr += `Marketing Goals: ${context.marketingGoals.join(', ')}\n`;
    }

    return contextStr || 'No specific business context provided';
  }

  private async generateWithGemini(prompt: string): Promise<{ success: boolean; content: string; suggestions: string[] }> {
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
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2000,
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
    const { content, suggestions } = this.parseAIResponse(aiResponse);
    
    return {
      success: true,
      content,
      suggestions
    };
  }

  private async generateWithOpenAI(prompt: string): Promise<{ success: boolean; content: string; suggestions: string[] }> {
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
            content: 'You are an expert digital marketing consultant with 15+ years of experience helping small businesses and UMKM grow their online presence. Provide actionable, practical advice that\'s easy to implement.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.8
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
    const { content, suggestions } = this.parseAIResponse(aiResponse);
    
    return {
      success: true,
      content,
      suggestions
    };
  }

  private async generateWithAnthropic(prompt: string): Promise<{ success: boolean; content: string; suggestions: string[] }> {
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
        max_tokens: 2000,
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
    const { content, suggestions } = this.parseAIResponse(aiResponse);
    
    return {
      success: true,
      content,
      suggestions
    };
  }

  private parseAIResponse(response: string): { content: string; suggestions: string[] } {
    // Try to extract suggestions from the end of the response
    const lines = response.split('\n');
    const suggestions: string[] = [];
    let content = response;

    // Look for suggestion patterns at the end
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i].trim();
      if (line.match(/^\d+\.\s/) || line.match(/^[-•]\s/) || line.match(/^suggestion/i)) {
        const suggestion = line.replace(/^\d+\.\s|^[-•]\s|^suggestion:\s*/i, '').trim();
        if (suggestion && suggestions.length < 4) {
          suggestions.unshift(suggestion);
        }
      } else if (line && !line.match(/^(follow-up|suggested|next steps)/i)) {
        break;
      }
    }

    // If we found suggestions, remove them from the content
    if (suggestions.length > 0) {
      const suggestionStart = response.lastIndexOf(suggestions[0]);
      if (suggestionStart > 0) {
        content = response.substring(0, suggestionStart).trim();
      }
    }

    // If no suggestions found, generate some based on the content
    if (suggestions.length === 0) {
      suggestions.push(
        "Can you provide more specific examples for my industry?",
        "What tools would you recommend for this strategy?",
        "How do I measure the success of this approach?",
        "What's the next step I should take?"
      );
    }

    return { content, suggestions: suggestions.slice(0, 4) };
  }

  private generateRuleBasedResponse(userMessage: string): ChatMessage {
    const lowerMessage = userMessage.toLowerCase();
    
    // Try to find relevant topic from knowledge base
    const relevantTopics = this.knowledgeBase.searchTopics(userMessage);
    
    if (relevantTopics.length > 0) {
      const bestTopic = relevantTopics[0];
      const suggestions = this.knowledgeBase.getTopicSuggestions(userMessage);
      
      return this.formatResponse(
        bestTopic.content,
        suggestions
      );
    }
    
    // Enhanced rule-based responses with more sophisticated logic
    if (lowerMessage.includes('social media') || lowerMessage.includes('facebook') || lowerMessage.includes('instagram')) {
      const socialMediaTopic = this.knowledgeBase.getTopic('social-media');
      if (socialMediaTopic) {
        return this.formatResponse(
          socialMediaTopic.content,
          this.knowledgeBase.getTopicSuggestions(userMessage)
        );
      }
    }

    if (lowerMessage.includes('seo') || lowerMessage.includes('google') || lowerMessage.includes('search')) {
      const seoTopic = this.knowledgeBase.getTopic('seo');
      if (seoTopic) {
        return this.formatResponse(
          seoTopic.content,
          this.knowledgeBase.getTopicSuggestions(userMessage)
        );
      }
    }

    if (lowerMessage.includes('content') || lowerMessage.includes('blog') || lowerMessage.includes('writing')) {
      const contentTopic = this.knowledgeBase.getTopic('content-marketing');
      if (contentTopic) {
        return this.formatResponse(
          contentTopic.content,
          this.knowledgeBase.getTopicSuggestions(userMessage)
        );
      }
    }

    if (lowerMessage.includes('ads') || lowerMessage.includes('advertising') || lowerMessage.includes('paid')) {
      const adsTopic = this.knowledgeBase.getTopic('paid-advertising');
      if (adsTopic) {
        return this.formatResponse(
          adsTopic.content,
          this.knowledgeBase.getTopicSuggestions(userMessage)
        );
      }
    }

    // Check for email marketing
    if (lowerMessage.includes('email') || lowerMessage.includes('newsletter') || lowerMessage.includes('list')) {
      const emailTopic = this.knowledgeBase.getTopic('email-marketing');
      if (emailTopic) {
        return this.formatResponse(
          emailTopic.content,
          this.knowledgeBase.getTopicSuggestions(userMessage)
        );
      }
    }

    // Check for analytics
    if (lowerMessage.includes('analytics') || lowerMessage.includes('tracking') || lowerMessage.includes('measure') || lowerMessage.includes('metrics')) {
      const analyticsTopic = this.knowledgeBase.getTopic('analytics');
      if (analyticsTopic) {
        return this.formatResponse(
          analyticsTopic.content,
          this.knowledgeBase.getTopicSuggestions(userMessage)
        );
      }
    }

    // Default comprehensive response
    return this.formatResponse(
      "🎯 **Digital Marketing Strategy Framework**\n\n" +
      "I'd love to help you develop a comprehensive digital marketing strategy! Here's my approach to helping businesses grow online:\n\n" +
      "**Strategic Pillars:**\n" +
      "• **Brand Awareness**: Building recognition and trust\n" +
      "• **Lead Generation**: Attracting potential customers\n" +
      "• **Customer Conversion**: Turning prospects into customers\n" +
      "• **Customer Retention**: Building long-term relationships\n\n" +
      "**Key Marketing Channels:**\n" +
      "• **Organic**: SEO, content marketing, social media\n" +
      "• **Paid**: Google Ads, social media advertising\n" +
      "• **Owned**: Website, email marketing, customer database\n" +
      "• **Earned**: PR, influencer partnerships, word-of-mouth\n\n" +
      "**Success Framework:**\n" +
      "• Set SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound)\n" +
      "• Track key performance indicators (KPIs)\n" +
      "• Continuously test and optimize strategies\n" +
      "• Focus on customer lifetime value (CLV)\n\n" +
      "Tell me about your business, current challenges, and goals so I can provide personalized recommendations!",
      [
        "I'm just starting my business",
        "I need more customers and sales",
        "My website isn't getting traffic",
        "I want to improve my social media presence"
      ]
    );
  }

  private formatResponse(content: string, suggestions: string[]): ChatMessage {
    return {
      id: Date.now(),
      type: 'bot',
      content,
      timestamp: new Date(),
      suggestions,
      metadata: {
        topic: this.detectTopic(content),
        confidence: 0.9,
        sources: ['Digital Marketing Best Practices', 'Industry Research', 'Expert Consultation']
      }
    };
  }

  private detectTopic(content: string): string {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('social media')) return 'social-media';
    if (lowerContent.includes('seo') || lowerContent.includes('search')) return 'seo';
    if (lowerContent.includes('content') || lowerContent.includes('blog')) return 'content';
    if (lowerContent.includes('ads') || lowerContent.includes('advertising')) return 'advertising';
    if (lowerContent.includes('email')) return 'email';
    if (lowerContent.includes('brand')) return 'branding';
    return 'general';
  }
} 