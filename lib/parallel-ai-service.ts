export interface AIServiceConfig {
  name: string;
  apiKey?: string;
  baseUrl: string;
  model: string;
  weight: number; // For weighted selection
  maxTokens: number;
  temperature: number;
  priority: number; // For priority-based selection
  costPerToken?: number; // For cost optimization
  reliability: number; // 0-1, success rate
}

export interface AIRequest {
  prompt: string;
  context?: any;
  options?: {
    useParallel?: boolean;
    useWeighted?: boolean;
    usePriority?: boolean;
    useCostOptimized?: boolean;
    maxCost?: number;
    timeout?: number;
  };
}

export interface AIResponse {
  success: boolean;
  content: string;
  service: string;
  cost?: number;
  latency?: number;
  error?: string;
}

export class ParallelAIService {
  private services: Map<string, AIServiceConfig> = new Map();
  private serviceStats: Map<string, { success: number; total: number; avgLatency: number }> = new Map();

  constructor() {
    this.initializeServices();
  }

  private initializeServices() {
    // Initialize all available AI services
    this.services.set('gemini', {
      name: 'Gemini',
      apiKey: process.env.GEMINI_API_KEY,
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
      model: 'gemini-1.5-pro',
      weight: 0.4, // 40% chance in weighted selection
      priority: 1, // Highest priority
      maxTokens: 4000,
      temperature: 0.7,
      costPerToken: 0.0001, // Very low cost
      reliability: 0.95
    });

    this.services.set('openai', {
      name: 'OpenAI',
      apiKey: process.env.OPENAI_API_KEY,
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4',
      weight: 0.3, // 30% chance
      priority: 2,
      maxTokens: 4000,
      temperature: 0.7,
      costPerToken: 0.03, // Higher cost
      reliability: 0.98
    });

    this.services.set('anthropic', {
      name: 'Anthropic',
      apiKey: process.env.ANTHROPIC_API_KEY,
      baseUrl: 'https://api.anthropic.com/v1',
      model: 'claude-3-sonnet-20240229',
      weight: 0.2, // 20% chance
      priority: 3,
      maxTokens: 4000,
      temperature: 0.7,
      costPerToken: 0.015, // Medium cost
      reliability: 0.97
    });

    this.services.set('huggingface', {
      name: 'HuggingFace',
      apiKey: process.env.HUGGINGFACE_API_KEY,
      baseUrl: 'https://api-inference.huggingface.co/models',
      model: 'microsoft/DialoGPT-medium',
      weight: 0.1, // 10% chance
      priority: 4,
      maxTokens: 2000,
      temperature: 0.7,
      costPerToken: 0.0005, // Low cost
      reliability: 0.85
    });
  }

  // Method 1: Parallel AI Calling
  async callParallel(request: AIRequest): Promise<AIResponse[]> {
    const availableServices = Array.from(this.services.values())
      .filter(service => service.apiKey);

    const promises = availableServices.map(service => 
      this.callService(service, request.prompt)
        .catch(error => ({
          success: false,
          content: '',
          service: service.name,
          error: error.message,
          latency: 0
        }))
    );

    const results = await Promise.allSettled(promises);
    return results
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<AIResponse>).value);
  }

  // Method 2: Weighted Random Selection
  async callWeighted(request: AIRequest): Promise<AIResponse> {
    const availableServices = Array.from(this.services.values())
      .filter(service => service.apiKey);

    if (availableServices.length === 0) {
      throw new Error('No AI services available');
    }

    // Calculate total weight
    const totalWeight = availableServices.reduce((sum, service) => sum + service.weight, 0);
    
    // Generate random number
    const random = Math.random() * totalWeight;
    
    // Select service based on weight
    let currentWeight = 0;
    for (const service of availableServices) {
      currentWeight += service.weight;
      if (random <= currentWeight) {
        return this.callService(service, request.prompt);
      }
    }

    // Fallback to first available service
    return this.callService(availableServices[0], request.prompt);
  }

  // Method 3: Priority-Based Selection
  async callPriority(request: AIRequest): Promise<AIResponse> {
    const availableServices = Array.from(this.services.values())
      .filter(service => service.apiKey)
      .sort((a, b) => a.priority - b.priority);

    if (availableServices.length === 0) {
      throw new Error('No AI services available');
    }

    // Try services in priority order
    for (const service of availableServices) {
      try {
        const result = await this.callService(service, request.prompt);
        if (result.success) {
          return result;
        }
      } catch (error) {
        console.error(`${service.name} failed:`, error);
        continue;
      }
    }

    throw new Error('All AI services failed');
  }

  // Method 4: Cost-Optimized Selection
  async callCostOptimized(request: AIRequest, maxCost: number = 0.01): Promise<AIResponse> {
    const availableServices = Array.from(this.services.values())
      .filter(service => service.apiKey && service.costPerToken)
      .sort((a, b) => (a.costPerToken || 0) - (b.costPerToken || 0));

    if (availableServices.length === 0) {
      throw new Error('No AI services available');
    }

    // Estimate cost for each service
    const estimatedTokens = Math.ceil(request.prompt.length / 4); // Rough estimation
    
    for (const service of availableServices) {
      const estimatedCost = (service.costPerToken || 0) * estimatedTokens;
      
      if (estimatedCost <= maxCost) {
        try {
          const result = await this.callService(service, request.prompt);
          if (result.success) {
            return result;
          }
        } catch (error) {
          console.error(`${service.name} failed:`, error);
          continue;
        }
      }
    }

    throw new Error('No affordable AI service available');
  }

  // Method 5: Reliability-Based Selection
  async callReliabilityBased(request: AIRequest): Promise<AIResponse> {
    const availableServices = Array.from(this.services.values())
      .filter(service => service.apiKey)
      .sort((a, b) => b.reliability - a.reliability);

    if (availableServices.length === 0) {
      throw new Error('No AI services available');
    }

    // Try most reliable services first
    for (const service of availableServices) {
      try {
        const result = await this.callService(service, request.prompt);
        if (result.success) {
          this.updateStats(service.name, true, result.latency || 0);
          return result;
        }
      } catch (error) {
        this.updateStats(service.name, false, 0);
        console.error(`${service.name} failed:`, error);
        continue;
      }
    }

    throw new Error('All AI services failed');
  }

  // Method 6: Hybrid Approach (Best of Multiple)
  async callHybrid(request: AIRequest): Promise<AIResponse> {
    const availableServices = Array.from(this.services.values())
      .filter(service => service.apiKey)
      .slice(0, 3); // Use top 3 services

    const promises = availableServices.map(service => 
      this.callService(service, request.prompt)
        .catch(error => ({
          success: false,
          content: '',
          service: service.name,
          error: error.message,
          latency: 0
        }))
    );

    const results = await Promise.allSettled(promises);
    const successfulResults = results
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<AIResponse>).value)
      .filter(result => result.success);

    if (successfulResults.length === 0) {
      throw new Error('All AI services failed');
    }

    // Return the fastest successful result
    return successfulResults.reduce((best, current) => 
      (current.latency || 0) < (best.latency || 0) ? current : best
    );
  }

  // Method 7: Adaptive Selection (Based on Performance History)
  async callAdaptive(request: AIRequest): Promise<AIResponse> {
    const availableServices = Array.from(this.services.values())
      .filter(service => service.apiKey);

    if (availableServices.length === 0) {
      throw new Error('No AI services available');
    }

    // Sort by success rate and average latency
    const scoredServices = availableServices.map(service => {
      const stats = this.serviceStats.get(service.name) || { success: 0, total: 0, avgLatency: 1000 };
      const successRate = stats.total > 0 ? stats.success / stats.total : service.reliability;
      const score = successRate * (1 / (stats.avgLatency + 1)); // Higher score = better
      
      return { service, score };
    }).sort((a, b) => b.score - a.score);

    // Try services in order of performance
    for (const { service } of scoredServices) {
      try {
        const result = await this.callService(service, request.prompt);
        if (result.success) {
          this.updateStats(service.name, true, result.latency || 0);
          return result;
        }
      } catch (error) {
        this.updateStats(service.name, false, 0);
        console.error(`${service.name} failed:`, error);
        continue;
      }
    }

    throw new Error('All AI services failed');
  }

  private async callService(service: AIServiceConfig, prompt: string): Promise<AIResponse> {
    const startTime = Date.now();

    try {
      let response: Response;
      let data: any;

      switch (service.name.toLowerCase()) {
        case 'gemini':
          response = await fetch(`${service.baseUrl}/${service.model}:generateContent?key=${service.apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: service.temperature,
                maxOutputTokens: service.maxTokens,
              }
            })
          });
          data = await response.json();
          return {
            success: true,
            content: data.candidates?.[0]?.content?.parts?.[0]?.text || '',
            service: service.name,
            latency: Date.now() - startTime
          };

        case 'openai':
          response = await fetch(`${service.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${service.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: service.model,
              messages: [{ role: 'user', content: prompt }],
              max_tokens: service.maxTokens,
              temperature: service.temperature
            })
          });
          data = await response.json();
          return {
            success: true,
            content: data.choices?.[0]?.message?.content || '',
            service: service.name,
            latency: Date.now() - startTime
          };

        case 'anthropic':
          response = await fetch(`${service.baseUrl}/messages`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${service.apiKey}`,
              'Content-Type': 'application/json',
              'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
              model: service.model,
              max_tokens: service.maxTokens,
              messages: [{ role: 'user', content: prompt }]
            })
          });
          data = await response.json();
          return {
            success: true,
            content: data.content?.[0]?.text || '',
            service: service.name,
            latency: Date.now() - startTime
          };

        default:
          throw new Error(`Unsupported service: ${service.name}`);
      }
    } catch (error) {
      return {
        success: false,
        content: '',
        service: service.name,
        error: error instanceof Error ? error.message : 'Unknown error',
        latency: Date.now() - startTime
      };
    }
  }

  private updateStats(serviceName: string, success: boolean, latency: number) {
    const current = this.serviceStats.get(serviceName) || { success: 0, total: 0, avgLatency: 0 };
    const newTotal = current.total + 1;
    const newSuccess = current.success + (success ? 1 : 0);
    const newAvgLatency = (current.avgLatency * current.total + latency) / newTotal;

    this.serviceStats.set(serviceName, {
      success: newSuccess,
      total: newTotal,
      avgLatency: newAvgLatency
    });
  }

  // Get service statistics
  getServiceStats() {
    return Object.fromEntries(this.serviceStats);
  }

  // Reset statistics
  resetStats() {
    this.serviceStats.clear();
  }
}

// Export singleton instance
export const parallelAIService = new ParallelAIService(); 