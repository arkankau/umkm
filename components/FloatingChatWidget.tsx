'use client';

import React, { useState } from 'react';
import { MessageCircle, X, Bot } from 'lucide-react';
import Link from 'next/link';

const FloatingChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleChat}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
          aria-label="Open marketing consultant chat"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Chat Widget Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Marketing Consultant AI</h3>
                <p className="text-xs opacity-90">Get expert marketing advice</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600 mb-3">
                Need help with your marketing strategy?
              </p>
              <div className="space-y-2">
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  💡 Social Media Strategy
                </div>
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  📊 SEO & Analytics
                </div>
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  ✍️ Content Marketing
                </div>
              </div>
            </div>

            <Link
              href="/marketing-consultant"
              className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-center py-3 px-4 rounded-lg font-medium transition-all duration-300"
            >
              Start Chatting Now
            </Link>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={toggleChat}
        />
      )}
    </>
  );
};

export default FloatingChatWidget; 