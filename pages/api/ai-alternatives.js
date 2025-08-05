import { parallelAIService } from 'https://umkm-eight.vercel.app/lib/parallel-ai-service';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, method = 'priority', options = {} } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log(`Calling AI with method: ${method}`);

    const request = {
      prompt,
      options
    };

    let result;

    switch (method) {
      case 'parallel':
        // Call all AI services in parallel and return all results
        result = await parallelAIService.callParallel(request);
        return res.status(200).json({
          success: true,
          method: 'parallel',
          results: result,
          message: `Called ${result.length} AI services in parallel`
        });

      case 'weighted':
        // Use weighted random selection
        result = await parallelAIService.callWeighted(request);
        return res.status(200).json({
          success: true,
          method: 'weighted',
          result: result,
          message: `Used weighted selection with ${result.service}`
        });

      case 'priority':
        // Use priority-based selection (current default)
        result = await parallelAIService.callPriority(request);
        return res.status(200).json({
          success: true,
          method: 'priority',
          result: result,
          message: `Used priority selection with ${result.service}`
        });

      case 'cost-optimized':
        // Use cost-optimized selection
        const maxCost = options.maxCost || 0.01;
        result = await parallelAIService.callCostOptimized(request, maxCost);
        return res.status(200).json({
          success: true,
          method: 'cost-optimized',
          result: result,
          maxCost,
          message: `Used cost-optimized selection with ${result.service}`
        });

      case 'reliability':
        // Use reliability-based selection
        result = await parallelAIService.callReliabilityBased(request);
        return res.status(200).json({
          success: true,
          method: 'reliability',
          result: result,
          message: `Used reliability-based selection with ${result.service}`
        });

      case 'hybrid':
        // Use hybrid approach (best of multiple)
        result = await parallelAIService.callHybrid(request);
        return res.status(200).json({
          success: true,
          method: 'hybrid',
          result: result,
          message: `Used hybrid approach with ${result.service}`
        });

      case 'adaptive':
        // Use adaptive selection based on performance history
        result = await parallelAIService.callAdaptive(request);
        return res.status(200).json({
          success: true,
          method: 'adaptive',
          result: result,
          message: `Used adaptive selection with ${result.service}`
        });

      case 'stats':
        // Get service statistics
        const stats = parallelAIService.getServiceStats();
        return res.status(200).json({
          success: true,
          method: 'stats',
          stats: stats,
          message: 'Service performance statistics'
        });

      default:
        return res.status(400).json({
          error: 'Invalid method',
          availableMethods: [
            'parallel',
            'weighted', 
            'priority',
            'cost-optimized',
            'reliability',
            'hybrid',
            'adaptive',
            'stats'
          ]
        });
    }

  } catch (error) {
    console.error('AI alternative calling error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to call AI service',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 