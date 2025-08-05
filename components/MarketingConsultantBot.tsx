'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Lightbulb, TrendingUp, Target, MessageCircle, BarChart3, Zap, Settings, Brain } from 'lucide-react';
import { ChatMessage, MarketingContext } from '@/lib/marketing-chatbot-service';

const MarketingConsultantBot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const [context, setContext] = useState<MarketingContext>({});
  const messagesEndRef = useRef(null);

  // Handle hydration and initialize messages
  useEffect(() => {
    setMounted(true);
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: "👋 Hello! I'm your AI Digital Marketing Consultant powered by advanced AI models. I help small businesses grow their online presence and reach more customers with personalized, actionable advice. What marketing challenge can I help you with today?",
        timestamp: new Date(),
        suggestions: [
          "I need help with social media strategy",
          "How do I improve my website's SEO?",
          "I want to start paid advertising",
          "Tell me about content marketing"
        ]
      }
    ]);
  }, []);

  const quickActions = [
    { icon: TrendingUp, text: "Social Media Strategy", topic: "social-media" },
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

  const callChatbotAPI = async (message: string): Promise<ChatMessage> => {
    try {
      const response = await fetch('https://umkm-eight.vercel.app/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to get response');
      }

      return data.response;
    } catch (error) {
      console.error('Chatbot API error:', error);
      // Fallback to basic response
      return {
        id: Date.now(),
        type: 'bot',
        content: "I apologize, but I'm having trouble connecting to my advanced AI models right now. Let me provide you with some general marketing advice:\n\n" +
          "For the best experience, please try again in a moment. In the meantime, here are some key marketing areas to focus on:\n\n" +
          "• **Social Media**: Build presence on platforms your customers use\n" +
          "• **Content Marketing**: Create valuable content that solves customer problems\n" +
          "• **SEO**: Optimize your website for search engines\n" +
          "• **Paid Advertising**: Consider targeted ads for immediate results\n\n" +
          "What specific area would you like to learn more about?",
        timestamp: new Date(),
        suggestions: [
          "Tell me about social media strategy",
          "How do I improve my SEO?",
          "I want to start content marketing",
          "What's the best way to advertise online?"
        ]
      };
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Call the enhanced chatbot API
      const botResponse = await callChatbotAPI(inputMessage);
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error getting chatbot response:', error);
      // Fallback response
      const fallbackMessage: ChatMessage = {
        id: Date.now(),
        type: 'bot',
        content: "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment, or feel free to ask me about:\n\n• Social media strategy\n• SEO and website optimization\n• Content marketing\n• Paid advertising\n• Email marketing",
        timestamp: new Date(),
        suggestions: [
          "How do I improve my social media presence?",
          "What SEO strategies work best?",
          "Tell me about content marketing",
          "I want to start advertising"
        ]
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (topic) => {
    const topicMessages = {
      'social-media': 'I need help with social media strategy',
      'content': 'How do I create better content marketing?',
      'seo': 'I want to improve my SEO and analytics',
      'ads': 'Tell me about paid advertising options'
    };

    setInputMessage(topicMessages[topic] || '');
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
        return <strong key={index} className="text-blue-600">{part.slice(2, -2)}</strong>;
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading marketing consultant...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-inter bg-transparent">
      {/* Header */}
      <div className="bg-transparent font-inter">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center space-x-3">
            <div>
              <h1 className="text-xl  text-center font-mont font-bold text-gray-900">Personal Marketing Consultant</h1>
              <p className="text-sm font-mont text-gray-600">An AI trained to give you expert marketing insights</p>
            </div>
          </div>
        </div>
      </div>

              <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header with Context Settings */}
            <div className="bg-gray-50 border-b p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-600">Quick Actions:</p>
                <button
                  onClick={() => setShowContext(!showContext)}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-green-600 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>AI Context</span>
                </button>
              </div>
              
              {/* Context Settings Panel */}
              {showContext && (
                <div className="bg-white rounded-lg p-4 mb-3 border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Business Type</label>
                      <select
                        value={context.businessType || ''}
                        onChange={(e) => setContext(prev => ({ ...prev, businessType: e.target.value }))}
                        className="w-full text-xs p-2 border rounded focus:ring-1 focus:ring-green-500"
                      >
                        <option value="">Select business type</option>
                        <option value="restaurant">Restaurant/Food</option>
                        <option value="retail">Retail/Shop</option>
                        <option value="service">Service Business</option>
                        <option value="consulting">Consulting</option>
                        <option value="manufacturing">Manufacturing</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Experience Level</label>
                      <select
                        value={context.experience || ''}
                        onChange={(e) => setContext(prev => ({ ...prev, experience: e.target.value as any }))}
                        className="w-full text-xs p-2 border rounded focus:ring-1 focus:ring-green-500"
                      >
                        <option value="">Select experience</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Budget Level</label>
                      <select
                        value={context.budget || ''}
                        onChange={(e) => setContext(prev => ({ ...prev, budget: e.target.value as any }))}
                        className="w-full text-xs p-2 border rounded focus:ring-1 focus:ring-green-500"
                      >
                        <option value="">Select budget</option>
                        <option value="low">Low ($0-500/month)</option>
                        <option value="medium">Medium ($500-2000/month)</option>
                        <option value="high">High ($2000+/month)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Target Audience</label>
                      <input
                        type="text"
                        placeholder="e.g., Local customers, B2B, Young professionals"
                        value={context.targetAudience || ''}
                        onChange={(e) => setContext(prev => ({ ...prev, targetAudience: e.target.value }))}
                        className="w-full text-xs p-2 border rounded focus:ring-1 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-gray-600">
                      Setting context helps me provide more personalized marketing advice
                    </span>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.topic)}
                    className="flex items-center space-x-2 p-3 bg-white rounded-lg border hover:border-green-300 hover:bg-green-50 transition-all"
                  >
                    <action.icon className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-medium text-gray-700">{action.text}</span>
                  </button>
                ))}
              </div>
            </div>

          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl flex items-start space-x-2 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.type === 'user' ? 'bg-green-600' : 'bg-yellow-500'}`}>
                    {message.type === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`rounded-lg p-3 ${message.type === 'user' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.type === 'bot' ? formatMessage(message.content) : message.content}
                    </div>
                    {message.suggestions && (
                      <div className="mt-3 space-y-1">
                        <p className="text-xs text-gray-600 font-medium">Suggested questions:</p>
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="block w-full text-left text-xs bg-white hover:bg-green-50 border rounded p-2 text-gray-700 hover:text-green-600 transition-colors"
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
                  <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
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
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                rows="2"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white p-3 rounded-lg transition-colors flex items-center justify-center"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MarketingConsultantBot; 