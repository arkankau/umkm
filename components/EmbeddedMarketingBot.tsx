'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, TrendingUp, Target, BarChart3, Zap } from 'lucide-react';

const EmbeddedMarketingBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef(null);

  // Handle hydration and initialize messages
  useEffect(() => {
    setMounted(true);
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: "👋 Hello! I'm your AI Digital Marketing Consultant. I help small businesses grow their online presence and reach more customers. What marketing challenge can I help you with today?",
        timestamp: new Date()
      }
    ]);
  }, []);

  const quickActions = [
    { icon: TrendingUp, text: "Social Media", topic: "social-media" },
    { icon: Target, text: "Content Marketing", topic: "content" },
    { icon: BarChart3, text: "SEO & Analytics", topic: "seo" },
    { icon: Zap, text: "Paid Advertising", topic: "ads" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getMarketingAdvice = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Social Media responses
    if (lowerMessage.includes('social media') || lowerMessage.includes('facebook') || lowerMessage.includes('instagram') || lowerMessage.includes('social')) {
      return {
        content: "🚀 **Social Media Strategy for Small Business:**\n\n**Key Platforms to Focus On:**\n• Facebook & Instagram for visual storytelling\n• LinkedIn for B2B networking\n• TikTok for younger demographics\n\n**Content Strategy:**\n• Post 3-5 times per week consistently\n• Share 80% value/entertainment, 20% promotional\n• Use local hashtags and engage with community\n• Share behind-the-scenes content\n\n**Quick Win:** Set up Facebook Business Manager and create your first Instagram Reel showcasing your product/service!",
        suggestions: ["Tell me about content calendars", "How do I measure social media ROI?", "What's the best posting schedule?"]
      };
    }
    
    // Content Marketing
    if (lowerMessage.includes('content') || lowerMessage.includes('blog') || lowerMessage.includes('writing')) {
      return {
        content: "✍️ **Content Marketing Essentials:**\n\n**Content Types That Work:**\n• How-to guides and tutorials\n• Customer success stories\n• Industry insights and trends\n• FAQ videos and posts\n\n**Content Calendar Strategy:**\n• Plan 1 month ahead\n• Mix educational (40%), entertaining (30%), promotional (30%)\n• Repurpose content across platforms\n\n**SEO Tips:**\n• Research keywords your customers search\n• Write compelling headlines\n• Include clear calls-to-action\n\n**Quick Win:** Write 3 blog posts answering your most common customer questions!",
        suggestions: ["How do I find content ideas?", "What's the ideal blog post length?", "How often should I publish content?"]
      };
    }
    
    // SEO and Analytics
    if (lowerMessage.includes('seo') || lowerMessage.includes('google') || lowerMessage.includes('search') || lowerMessage.includes('analytics')) {
      return {
        content: "📊 **SEO & Analytics for Small Business:**\n\n**Local SEO Priorities:**\n• Claim Google Business Profile\n• Get consistent NAP (Name, Address, Phone) across web\n• Collect customer reviews regularly\n• Create location-specific content\n\n**Website SEO Basics:**\n• Fast loading speeds (under 3 seconds)\n• Mobile-friendly design\n• Clear site structure and navigation\n• Regular content updates\n\n**Analytics to Track:**\n• Website traffic and sources\n• Conversion rates\n• Customer acquisition cost\n• Return on ad spend (ROAS)\n\n**Quick Win:** Set up Google Analytics and Google Search Console today!",
        suggestions: ["How do I improve my Google ranking?", "What are the most important metrics?", "How do I get more online reviews?"]
      };
    }
    
    // Paid Advertising
    if (lowerMessage.includes('ads') || lowerMessage.includes('advertising') || lowerMessage.includes('paid') || lowerMessage.includes('budget')) {
      return {
        content: "💰 **Paid Advertising Strategy:**\n\n**Best Platforms for Small Business:**\n• Google Ads for high-intent searches\n• Facebook/Instagram Ads for targeting\n• Local newspaper/radio for community reach\n\n**Budget Allocation:**\n• Start with $500-1000/month test budget\n• 60% search ads, 40% social media ads\n• Focus on 2-3 platforms maximum\n\n**Campaign Types:**\n• Search campaigns for immediate needs\n• Display campaigns for brand awareness\n• Retargeting campaigns for website visitors\n\n**Success Metrics:**\n• Cost per acquisition (CPA)\n• Return on ad spend (ROAS)\n• Click-through rate (CTR)\n\n**Quick Win:** Start with Google Ads targeting your top 5 service keywords!",
        suggestions: ["What's a good advertising budget?", "How do I create effective ad copy?", "Should I hire an agency or do it myself?"]
      };
    }
    
    // Email Marketing
    if (lowerMessage.includes('email') || lowerMessage.includes('newsletter') || lowerMessage.includes('list')) {
      return {
        content: "📧 **Email Marketing for Small Business:**\n\n**List Building Strategies:**\n• Offer valuable lead magnets (guides, discounts)\n• Add signup forms on website and social media\n• Collect emails at events and in-store\n\n**Email Types:**\n• Welcome series for new subscribers\n• Weekly newsletters with tips/updates\n• Promotional emails (limit to 20% of sends)\n• Customer stories and testimonials\n\n**Best Practices:**\n• Personalize subject lines\n• Mobile-optimized design\n• Clear call-to-action buttons\n• Segment your audience\n\n**Tools to Consider:**\n• Mailchimp, Constant Contact, or ConvertKit\n\n**Quick Win:** Create a simple lead magnet and start collecting emails this week!",
        suggestions: ["How often should I send emails?", "What makes a good subject line?", "How do I avoid spam filters?"]
      };
    }
    
    // Branding
    if (lowerMessage.includes('brand') || lowerMessage.includes('logo') || lowerMessage.includes('identity')) {
      return {
        content: "🎨 **Brand Building for Small Business:**\n\n**Brand Foundation:**\n• Define your unique value proposition\n• Identify your target audience clearly\n• Develop consistent brand voice and tone\n• Create visual identity (colors, fonts, logo)\n\n**Brand Consistency:**\n• Use same colors/fonts across all materials\n• Maintain consistent messaging\n• Professional photography and graphics\n• Regular posting schedule\n\n**Brand Storytelling:**\n• Share your business origin story\n• Highlight customer transformations\n• Show behind-the-scenes content\n• Demonstrate your values in action\n\n**Quick Win:** Write a one-paragraph brand story and share it on your About page!",
        suggestions: ["How do I find my brand voice?", "What colors should I use for my brand?", "How important is a professional logo?"]
      };
    }
    
    // General/Default response
    return {
      content: "I'd love to help you with your marketing! Here are some areas I can assist with:\n\n🚀 **Social Media Marketing** - Strategy, content planning, engagement\n✍️ **Content Marketing** - Blog posts, video content, storytelling\n📊 **SEO & Analytics** - Local SEO, website optimization, tracking\n💰 **Paid Advertising** - Google Ads, Facebook Ads, budget planning\n📧 **Email Marketing** - List building, campaigns, automation\n🎨 **Branding** - Brand voice, visual identity, storytelling\n\nWhat specific marketing challenge would you like to tackle first? Or tell me about your business and current marketing efforts!",
      suggestions: ["I'm just starting out", "I need more customers", "My website isn't getting traffic", "I want to improve my social media"]
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const advice = getMarketingAdvice(inputMessage);
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: advice.content,
        suggestions: advice.suggestions,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (topic) => {
    const topicMessages = {
      'social-media': 'I need help with social media marketing strategy',
      'content': 'How can I improve my content marketing?',
      'seo': 'What SEO strategies should I focus on?',
      'ads': 'I want to start paid advertising'
    };

    setInputMessage(topicMessages[topic] || 'Tell me about marketing');
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessage = (content) => {
    // Convert markdown-style formatting to JSX
    const parts = content.split(/(\*\*.*?\*\*|\*.*?\*|•.*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-green-600">{part.slice(2, -2)}</strong>;
      } else if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={index}>{part.slice(1, -1)}</em>;
      } else if (part.startsWith('•')) {
        return <div key={index} className="ml-4 mb-1">{part}</div>;
      }
      return part;
    });
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Loading marketing consultant...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Quick Actions */}
      <div className="bg-gray-50 border-b p-4">
        <p className="text-sm text-gray-600 mb-3">Quick Actions:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(action.topic)}
              className="flex items-center space-x-2 p-2 bg-white rounded-lg border hover:border-green-300 hover:bg-green-50 transition-all"
            >
              <action.icon className="w-3 h-3 text-green-600" />
              <span className="text-xs font-medium text-gray-700">{action.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="h-80 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg flex items-start space-x-2 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${message.type === 'user' ? 'bg-green-600' : 'bg-yellow-500'}`}>
                {message.type === 'user' ? (
                  <User className="w-3 h-3 text-white" />
                ) : (
                  <Bot className="w-3 h-3 text-white" />
                )}
              </div>
              <div className={`rounded-lg p-2 ${message.type === 'user' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                <div className="whitespace-pre-wrap text-xs leading-relaxed">
                  {message.type === 'bot' ? formatMessage(message.content) : message.content}
                </div>
                {message.suggestions && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-600 font-medium">Suggested questions:</p>
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="block w-full text-left text-xs bg-white hover:bg-green-50 border rounded p-1 text-gray-700 hover:text-green-600 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                <Bot className="w-3 h-3 text-white" />
              </div>
              <div className="bg-gray-100 rounded-lg p-2">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-gray-50 p-4">
        <div className="flex space-x-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about social media, content marketing, SEO, advertising, or any marketing challenge..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm"
            rows="2"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmbeddedMarketingBot; 