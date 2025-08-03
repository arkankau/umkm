'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Image, Download } from 'lucide-react';

interface BusinessData {
  businessName: string;
  ownerName: string;
  description: string;
  category: string;
  products: string;
  phone: string;
  email?: string;
  address: string;
  whatsapp?: string;
  instagram?: string;
  logoUrl?: string;
}

interface LogoGeneratorProps {
  businessData: BusinessData;
  businessId: string;
  onLogoGenerated?: (logoUrl: string) => void;
}

export default function LogoGenerator({ businessData, businessId, onLogoGenerated }: LogoGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLogoUrl, setGeneratedLogoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generatePromptFromBusiness = () => {
    const basePrompt = `Create a professional logo for "${businessData.businessName}", a ${businessData.category} business. 
    
Business Details:
- Owner: ${businessData.ownerName}
- Description: ${businessData.description}
- Products/Services: ${businessData.products}
- Category: ${businessData.category}

Requirements:
- Modern, clean, and professional design
- Suitable for ${businessData.category} business
- Should be scalable and work well in different sizes
- Use colors that represent trust and professionalism
- Include the business name "${businessData.businessName}"
- Make it suitable for both digital and print use`;

    setPrompt(basePrompt);
  };

  const generateLogo = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt for logo generation');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-logo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          businessId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate logo');
      }

      setGeneratedLogoUrl(data.logoUrl);
      onLogoGenerated?.(data.logoUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate logo');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadLogo = () => {
    if (!generatedLogoUrl) return;
    
    const link = document.createElement('a');
    link.href = generatedLogoUrl;
    link.download = `${businessData.businessName}-logo.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Logo Generator
          </CardTitle>
          <CardDescription>
            Generate a professional logo for your business using AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Logo Description</Label>
            <Textarea
              id="prompt"
              placeholder="Describe the logo you want to generate..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={generatePromptFromBusiness}
              className="mt-2"
            >
              Auto-generate prompt from business data
            </Button>
          </div>

          <Button
            onClick={generateLogo}
            disabled={isGenerating || !prompt.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Logo...
              </>
            ) : (
              <>
                <Image className="mr-2 h-4 w-4" />
                Generate Logo
              </>
            )}
          </Button>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {generatedLogoUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Logo</CardTitle>
            <CardDescription>
              Your logo has been generated and saved to your business profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <img
                src={generatedLogoUrl}
                alt={`${businessData.businessName} logo`}
                className="max-w-full h-auto max-h-64 object-contain border rounded-lg shadow-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={downloadLogo} variant="outline" className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download Logo
              </Button>
              <Button
                onClick={() => window.open(generatedLogoUrl, '_blank')}
                variant="outline"
                className="flex-1"
              >
                View Full Size
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
