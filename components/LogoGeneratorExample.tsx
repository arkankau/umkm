'use client';

import { useState } from 'react';
import LogoGenerator from './LogoGenerator';

// Example 1: Modal/Overlay usage
export function LogoGeneratorModal({ businessName, onClose }: { businessName: string; onClose: () => void }) {
  const [generatedLogo, setGeneratedLogo] = useState<string>('');

  const handleLogoGenerated = (logoUrl: string) => {
    setGeneratedLogo(logoUrl);
    console.log('Logo generated:', logoUrl);
    // You can save this to your database or state management
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <LogoGenerator
          businessName={businessName}
          onLogoGenerated={handleLogoGenerated}
          onClose={onClose}
          showCloseButton={true}
        />
      </div>
    </div>
  );
}

// Example 2: Inline usage in a form
export function LogoGeneratorInline({ businessName, onLogoGenerated }: { businessName: string; onLogoGenerated: (logoUrl: string) => void }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Generate Business Logo</h3>
      <LogoGenerator
        businessName={businessName}
        onLogoGenerated={onLogoGenerated}
        showCloseButton={false}
      />
    </div>
  );
}

// Example 3: Tab/Accordion usage
export function LogoGeneratorTab({ businessName }: { businessName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [generatedLogo, setGeneratedLogo] = useState<string>('');

  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center"
      >
        <span className="font-medium">🎨 Generate Logo with AI</span>
        <span className="text-gray-500">{isOpen ? '−' : '+'}</span>
      </button>
      
      {isOpen && (
        <div className="p-4">
          <LogoGenerator
            businessName={businessName}
            onLogoGenerated={setGeneratedLogo}
            showCloseButton={false}
          />
        </div>
      )}
    </div>
  );
}

// Example 4: Sidebar usage
export function LogoGeneratorSidebar({ businessName }: { businessName: string }) {
  const [generatedLogo, setGeneratedLogo] = useState<string>('');

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-4">Logo Generator</h3>
      <LogoGenerator
        businessName={businessName}
        onLogoGenerated={setGeneratedLogo}
        showCloseButton={false}
      />
    </div>
  );
}

// Example 5: Usage in BusinessForm
export function BusinessFormWithLogoGenerator() {
  const [businessName, setBusinessName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [showLogoGenerator, setShowLogoGenerator] = useState(false);

  const handleLogoGenerated = (logoUrl: string) => {
    setLogoUrl(logoUrl);
    setShowLogoGenerator(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Business Name
        </label>
        <input
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="Enter your business name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Business Logo
        </label>
        {logoUrl ? (
          <div className="flex items-center gap-4">
            <img src={logoUrl} alt="Business Logo" className="w-16 h-16 object-contain rounded-lg border" />
            <button
              onClick={() => setShowLogoGenerator(true)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Generate New Logo
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowLogoGenerator(true)}
            disabled={!businessName.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Generate Logo with AI
          </button>
        )}
      </div>

      {showLogoGenerator && (
        <LogoGeneratorModal
          businessName={businessName}
          onClose={() => setShowLogoGenerator(false)}
        />
      )}
    </div>
  );
} 