import { MarketingChatbotService } from '../../lib/marketing-chatbot-service';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const chatbot = new MarketingChatbotService();
    
    // Set context if provided
    if (context) {
      chatbot.setContext(context);
    }

    // Generate response
    const response = await chatbot.generateResponse(message);

    res.status(200).json({
      success: true,
      response
    });

  } catch (error) {
    console.error('Chatbot API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate response',
      details: error.message
    });
  }
} 