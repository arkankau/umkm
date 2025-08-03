'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { submitBusiness, BusinessData, SubmitBusinessResponse } from '../lib/api';
import WebsitePreview from './WebsitePreview';

interface BusinessFormProps {
  initialData?: Partial<BusinessData>;
  onSubmit?: (formData: BusinessData) => Promise<void>;
  isEditing?: boolean;
}

export default function BusinessForm({ initialData, onSubmit, isEditing = false }: BusinessFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<BusinessData>({
    businessName: '',
    ownerName: '',
    description: '',
    category: 'restaurant',
    products: '',
    phone: '',
    email: '',
    address: '',
    whatsapp: '',
    instagram: '',
    ...initialData
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<SubmitBusinessResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [logoPrompt, setLogoPrompt] = useState<string>('');
  const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [savedBusinessId, setSavedBusinessId] = useState<string | null>(null);
  const [isSavingData, setIsSavingData] = useState(false);

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveBusinessData = async () => {
    if (!formData.businessName || !formData.ownerName || !formData.description || !formData.phone || !formData.address) {
      alert('Please fill in all required fields first');
      return;
    }

    setIsSavingData(true);
    setError(null);

    try {
      // Save business data to database without deploying
      const response = await fetch('/api/save-business-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          logoUrl: logoUrl || undefined
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save business data');
      }

      const result = await response.json();
      setSavedBusinessId(result.businessId);
      alert('Business data saved successfully! You can now preview and modify the website.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      alert(`Error saving business data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSavingData(false);
    }
  };

  const generateLogo = async () => {
    if (!logoPrompt.trim() || !formData.businessName.trim()) {
      alert('Please enter both a logo prompt and business name');
      return;
    }

    setIsGeneratingLogo(true);
    
    try {
      const response = await fetch('/api/generate-logo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: logoPrompt,
          businessName: formData.businessName,
          businessType: formData.category,
          description: formData.description,
          style: 'modern and professional',
          colors: ['#22c55e', '#ffffff', '#1f2937']
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate logo');
      }

      const result = await response.json();
      
      if (result.success && result.imageUrl) {
        setLogoUrl(result.imageUrl);
        setLogoPrompt(''); // Clear the prompt
        alert('Logo generated successfully!');
      } else {
        throw new Error(result.error || 'Failed to generate logo');
      }
    } catch (error) {
      console.error('Logo generation error:', error);
      alert(`Error generating logo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGeneratingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSubmitResult(null);

    try {
      if (onSubmit) {
        // If onSubmit is provided, use it (for editing mode)
        const formDataWithLogo = {
          ...formData,
          logoUrl: logoUrl || undefined
        };
        await onSubmit(formDataWithLogo);
      } else {
        // Deploy the current HTML from database
        if (!savedBusinessId) {
          throw new Error('Please save business data first before deploying');
        }

        const response = await fetch('/api/deploy-website', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            businessId: savedBusinessId
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to deploy website');
        }

        const result = await response.json();
        setSubmitResult(result);
        
        // Redirect to status page after successful deployment
        setTimeout(() => {
          router.push(`/status/${result.businessId}`);
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isEditing ? 'Edit Business Information' : 'Buat Website Untuk Mu Karya Mu Anda'}
      </h2>
      
      {submitResult && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          <h3 className="font-bold">Berhasil!</h3>
          <p>Business ID: {submitResult.businessId}</p>
          <p>Subdomain: {submitResult.subdomain}</p>
          <p>Status: {submitResult.status}</p>
          <p>{submitResult.message}</p>
          <p className="mt-2 text-sm">Redirecting to status page...</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <h3 className="font-bold">Error:</h3>
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
            Nama Bisnis *
          </label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">
            Nama Pemilik *
          </label>
          <input
            type="text"
            id="ownerName"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Deskripsi Bisnis *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Kategori *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="restaurant">Restoran & Kuliner</option>
            <option value="retail">Retail & Toko</option>
            <option value="service">Jasa & Layanan</option>
            <option value="other">Lainnya</option>
          </select>
        </div>

        <div>
          <label htmlFor="products" className="block text-sm font-medium text-gray-700">
            Produk/Layanan *
          </label>
          <textarea
            id="products"
            name="products"
            value={formData.products}
            onChange={handleInputChange}
            required
            rows={2}
            placeholder="Contoh: Nasi goreng, Mie goreng, Soto ayam"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Nomor Telepon *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            placeholder="081234567890"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Alamat *
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
            rows={2}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">
            WhatsApp
          </label>
          <input
            type="tel"
            id="whatsapp"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleInputChange}
            placeholder="081234567890"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
            Instagram
          </label>
          <input
            type="text"
            id="instagram"
            name="instagram"
            value={formData.instagram}
            onChange={handleInputChange}
            placeholder="username"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Logo Generation Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🎨 Business Logo (Optional)
          </label>
          <div className="space-y-4">
            {/* AI Logo Generation */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Generate Logo with AI
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={logoPrompt}
                  onChange={(e) => setLogoPrompt(e.target.value)}
                  placeholder="e.g., modern coffee cup logo, restaurant fork and knife, tech startup abstract symbol..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={isGeneratingLogo}
                />
                <button
                  type="button"
                  onClick={generateLogo}
                  disabled={!logoPrompt.trim() || !formData.businessName.trim() || isGeneratingLogo}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isGeneratingLogo ? 'Generating Logo...' : 'Generate AI Logo'}
                </button>
                {(!logoPrompt.trim() || !formData.businessName.trim()) && (
                  <p className="text-xs text-gray-500 mt-1">
                    {!formData.businessName.trim() ? 'Please enter a business name first' : 'Please enter a logo description'}
                  </p>
                )}
              </div>
            </div>

            {/* Logo Preview */}
            {logoUrl && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Generated Logo Preview</label>
                <img src={logoUrl} alt="Generated Logo" className="w-32 h-32 object-contain rounded-lg border border-gray-300" />
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Deploying...' : (isEditing ? 'Update Information' : 'Deploy Website')}
          </button>
          
          {!isEditing && (
            <button
              type="button"
              onClick={saveBusinessData}
              disabled={isSavingData || !formData.businessName || !formData.ownerName || !formData.description || !formData.phone || !formData.address}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSavingData ? 'Saving...' : 'Save Data'}
            </button>
          )}
          
          {!isEditing && (
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              disabled={!formData.businessName || !formData.ownerName || !formData.description || !formData.phone || !formData.address}
              className="bg-yellow-500 text-black py-2 px-4 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Preview
            </button>
          )}
        </div>
      </form>
      
      {showPreview && (
        <WebsitePreview
          businessData={{
            ...formData,
            businessId: savedBusinessId || undefined,
            logoUrl: logoUrl || undefined
          }}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
} 