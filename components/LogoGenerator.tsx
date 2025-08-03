'use client';

import React, { useState } from 'react';
import { Wand2, Download, RefreshCw, Palette, Type, Sparkles } from 'lucide-react';

interface LogoGeneratorProps {
  businessName: string;
  businessType?: string;
  description?: string;
  onLogoGenerated?: (logoUrl: string) => void;
  onClose?: () => void;
  showCloseButton?: boolean;
}

interface LogoStyle {
  id: string;
  name: string;
  description: string;
  colors: string[];
  icon: React.ReactNode;
}

const logoStyles: LogoStyle[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean, minimalist design',
    colors: ['#22c55e', '#ffffff', '#1f2937'],
    icon: <Sparkles className="w-4 h-4" />
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Corporate and trustworthy',
    colors: ['#3b82f6', '#ffffff', '#1e40af'],
    icon: <Type className="w-4 h-4" />
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold and artistic',
    colors: ['#8b5cf6', '#f59e0b', '#ffffff'],
    icon: <Palette className="w-4 h-4" />
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated and refined',
    colors: ['#6b7280', '#ffffff', '#374151'],
    icon: <Wand2 className="w-4 h-4" />
  }
];

export default function LogoGenerator({ 
  businessName, 
  businessType = 'business', 
  description = '', 
  onLogoGenerated,
  onClose,
  showCloseButton = true 
}: LogoGeneratorProps) {
  const [selectedStyle, setSelectedStyle] = useState<string>('modern');
  const [customColors, setCustomColors] = useState<string[]>(['#22c55e', '#ffffff', '#1f2937']);
  const [additionalDetails, setAdditionalDetails] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLogo, setGeneratedLogo] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [generationHistory, setGenerationHistory] = useState<string[]>([]);

  const handleGenerateLogo = async () => {
    if (!businessName.trim()) {
      setError('Business name is required');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const selectedStyleData = logoStyles.find(style => style.id === selectedStyle);
      const colors = selectedStyle === 'custom' ? customColors : selectedStyleData?.colors || ['#22c55e', '#ffffff', '#1f2937'];

      const response = await fetch('/api/generate-logo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessName,
          businessType,
          description: description || `A professional ${businessType} called ${businessName}`,
          style: selectedStyleData?.description || 'modern and professional',
          colors,
          additionalDetails
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate logo');
      }

      const result = await response.json();
      
      if (result.success && result.imageUrl) {
        setGeneratedLogo(result.imageUrl);
        setGenerationHistory(prev => [...prev, result.imageUrl]);
        onLogoGenerated?.(result.imageUrl);
        setError(null);
      } else {
        throw new Error(result.error || 'Failed to generate logo');
      }
    } catch (err) {
      console.error('Logo generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate logo');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadLogo = () => {
    if (generatedLogo) {
      const link = document.createElement('a');
      link.href = generatedLogo;
      link.download = `${businessName.toLowerCase().replace(/\s+/g, '-')}-logo.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleRegenerate = () => {
    setGeneratedLogo('');
    setError(null);
    handleGenerateLogo();
  };

  const handleStyleChange = (styleId: string) => {
    setSelectedStyle(styleId);
    if (styleId !== 'custom') {
      const style = logoStyles.find(s => s.id === styleId);
      if (style) {
        setCustomColors(style.colors);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🎨 AI Logo Generator</h2>
          <p className="text-gray-600">Generate professional logos for {businessName}</p>
        </div>
        {showCloseButton && onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Controls */}
        <div className="space-y-6">
          {/* Style Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Logo Style
            </label>
            <div className="grid grid-cols-2 gap-3">
              {logoStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => handleStyleChange(style.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedStyle === style.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {style.icon}
                    <span className="font-medium text-sm">{style.name}</span>
                  </div>
                  <p className="text-xs text-gray-600">{style.description}</p>
                  <div className="flex gap-1 mt-2">
                    {style.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          {selectedStyle === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Colors
              </label>
              <div className="flex gap-2">
                {customColors.map((color, index) => (
                  <input
                    key={index}
                    type="color"
                    value={color}
                    onChange={(e) => {
                      const newColors = [...customColors];
                      newColors[index] = e.target.value;
                      setCustomColors(newColors);
                    }}
                    className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Additional Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Details (Optional)
            </label>
            <textarea
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              placeholder="e.g., include food elements, make it more playful, add a specific icon..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="3"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateLogo}
            disabled={isGenerating || !businessName.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Generating Logo...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                Generate AI Logo
              </>
            )}
          </button>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Right Panel - Preview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Generated Logo</h3>
          
          {generatedLogo ? (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center min-h-[200px]">
                <img
                  src={generatedLogo}
                  alt={`${businessName} Logo`}
                  className="max-w-full max-h-48 object-contain"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleDownloadLogo}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Logo
                </button>
                <button
                  onClick={handleRegenerate}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Regenerate
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center min-h-[200px] border-2 border-dashed border-gray-300">
              <div className="text-center text-gray-500">
                <Wand2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Your generated logo will appear here</p>
                <p className="text-xs mt-1">Click "Generate AI Logo" to create your logo</p>
              </div>
            </div>
          )}

          {/* Generation History */}
          {generationHistory.length > 1 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Previous Versions</h4>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {generationHistory.slice(-3).map((logo, index) => (
                  <button
                    key={index}
                    onClick={() => setGeneratedLogo(logo)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden ${
                      generatedLogo === logo ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={logo}
                      alt={`Version ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span>Powered by Gemini AI</span>
          </div>
          <span>High-quality, scalable logos</span>
        </div>
      </div>
    </div>
  );
} 