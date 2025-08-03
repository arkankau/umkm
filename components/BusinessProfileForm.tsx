'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabaseClient from '@/app/lib/supabase';
import { User } from '@supabase/supabase-js';

interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string;
  imageFile: File | null;
}

interface BusinessProfileData {
  businessId: string;
  businessName: string;
  ownerName: string;
  category: string;
  description: string;
  products: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  instagram: string;
  logo: string;
  logoFile: File | null;
}

export default function BusinessProfileForm() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: '',
    description: '',
    image: '',
    imageFile: null
  });
  
  const [formData, setFormData] = useState<BusinessProfileData>({
    businessId: '',
    businessName: '',
    ownerName: '',
    category: 'restaurant',
    description: '',
    products: '',
    phone: '',
    email: '',
    address: '',
    whatsapp: '',
    instagram: '',
    logo: '',
    logoFile: null
  });

  const [businessIdError, setBusinessIdError] = useState<string>('');
  const [logoPrompt, setLogoPrompt] = useState<string>('');
  const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabaseClient.auth.getUser();
        if (error || !user) {
          router.push('/login');
          return;
        }
        setUser(user);
      } catch (error) {
        console.error('Error checking auth state:', error);
        router.push('/login');
      }
    };
    checkUser();
  }, [router]);

  const validateBusinessId = async (businessId: string) => {
    if (!businessId) {
      setBusinessIdError('Business ID is required');
      return false;
    }

    if (businessId.length < 3) {
      setBusinessIdError('Business ID must be at least 3 characters');
      return false;
    }

    if (!/^[a-zA-Z0-9-]+$/.test(businessId)) {
      setBusinessIdError('Business ID can only contain letters, numbers, and hyphens');
      return false;
    }

    try {
      const { data, error } = await supabaseClient
        .from('businesses')
        .select('businessId')
        .eq('businessId', businessId)
        .single();

      if (data) {
        setBusinessIdError('Business ID already exists');
        return false;
      }

      setBusinessIdError('');
      return true;
    } catch (error) {
      // If no record found, businessId is available
      setBusinessIdError('');
      return true;
    }
  };

  const handleBusinessIdChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
    setFormData(prev => ({ ...prev, businessId: value }));
    
    if (value.length >= 3) {
      await validateBusinessId(value);
    } else {
      setBusinessIdError('');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewProduct({...newProduct, image: imageUrl, imageFile: file});
    }
  };

  const uploadImageToSupabase = async (file: File, filename: string) => {
    try {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size exceeds 5MB limit');
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      // Use the correct bucket name from your Supabase setup
      const bucketName = 'productimages'; // this should match your Supabase bucket name

      // First, check if we can access the bucket
      const { data: bucket, error: bucketError } = await supabaseClient.storage
        .getBucket(bucketName);
      
      if (bucketError) {
        console.error('Error checking bucket:', bucketError);
        throw new Error('Unable to access storage. Please ensure you have created a bucket named "images" in your Supabase storage.');
      }

      const { data, error } = await supabaseClient.storage
        .from(bucketName)
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: true // Allow overwriting files
        });
      
      if (error) {
        console.error('Supabase upload error:', error);
        throw new Error(`Failed to upload image: ${error.message}`);
      }
      
      const { data: { publicUrl } } = supabaseClient.storage
        .from(bucketName)
        .getPublicUrl(filename);
      
      if (!publicUrl) {
        throw new Error('Failed to get public URL for uploaded image');
      }

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to upload image: unexpected error');
    }
  };

  const addProduct = () => {
    if (newProduct.name && newProduct.price) {
      setProducts([...products, { ...newProduct, id: String(Date.now()) }]);
      setNewProduct({ name: '', price: '', description: '', image: '', imageFile: null });
      setShowProductForm(false);
    }
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
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
          businessName: formData.businessName
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate logo');
      }

      const result = await response.json();
      
      if (result.success && result.imageUrl) {
        // Set the generated logo
        setFormData(prev => ({
          ...prev,
          logo: result.imageUrl,
          logoFile: null // Clear any uploaded file since we're using generated logo
        }));
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

  const handleSubmit = async () => {
    if (!user) {
      alert('Please log in to create a business profile');
      return;
    }

    if (!formData.businessId || !formData.businessName || !formData.ownerName || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    if (businessIdError) {
      alert('Please fix the Business ID error');
      return;
    }

    setLoading(true);
    
    try {
      // Upload logo if exists
      let logoUrl = '';
      if (formData.logoFile) {
        const filename = `${formData.businessId}-logo-${Date.now()}.${formData.logoFile.name.split('.').pop()}`;
        logoUrl = await uploadImageToSupabase(formData.logoFile, filename);
      }

      // Create business record
      const { data: businessData, error: businessError } = await supabaseClient
        .from('businesses')
        .insert({
          businessId: formData.businessId,
          businessName: formData.businessName,
          ownerName: formData.ownerName,
          description: formData.description,
          category: formData.category,
          products: formData.products,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          whatsapp: formData.whatsapp,
          instagram: formData.instagram,
          logoUrl: logoUrl,
          userId: user.id,
          createdAt: new Date().toISOString()
        })
        .select()
        .single();

      if (businessError) throw businessError;

      // Upload product images and create product records
      if (products.length > 0) {
        const productsToInsert = await Promise.all(
          products.map(async (product) => {
            let imageUrl = '';
            
            if (product.imageFile) {
              const filename = `${formData.businessId}-product-${Date.now()}-${product.imageFile.name}`;
              imageUrl = await uploadImageToSupabase(product.imageFile, filename);
            }
            
            return {
              name: product.name,
              description: product.description,
              price: parseFloat(product.price),
              imageUrl: imageUrl,
              businessId: formData.businessId
            };
          })
        );

        const { error: productsError } = await supabaseClient
          .from('products')
          .insert(productsToInsert);

        if (productsError) throw productsError;
      }

      alert('Business profile created successfully!');
      router.push(`/${user.id}/${formData.businessId}`);
      
    } catch (error) {
      console.error('Error creating business profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      alert(`Error creating business profile: ${errorMessage}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Business Information Form */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Business Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business ID *</label>
              <input 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text" 
                value={formData.businessId}
                onChange={handleBusinessIdChange}
                placeholder="e.g., warung-pak-budi"
              />
              {businessIdError && (
                <p className="text-red-500 text-sm mt-1">{businessIdError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
              <input 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text" 
                value={formData.businessName}
                onChange={(e) => setFormData({...formData, businessName: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name *</label>
              <input 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text" 
                value={formData.ownerName}
                onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="restaurant">Restaurant & Food</option>
                <option value="retail">Retail & Shop</option>
                <option value="service">Service & Business</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
              <input 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text" 
                value={formData.whatsapp}
                onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
              <input 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text" 
                value={formData.instagram}
                onChange={(e) => setFormData({...formData, instagram: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
          <input 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text" 
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Products/Services *</label>
          <textarea 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            value={formData.products}
            onChange={(e) => setFormData({...formData, products: e.target.value})}
            placeholder="e.g., Nasi goreng, Mie goreng, Soto ayam"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Logo</label>
          <div className="space-y-4">
            {/* File Upload */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Upload Logo File</label>
              <input 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const imageUrl = URL.createObjectURL(file);
                    setFormData({...formData, logo: imageUrl, logoFile: file});
                  }
                }}
              />
            </div>

            {/* AI Logo Generation */}
            <div className="border-t pt-4">
              <label className="block text-xs font-medium text-gray-600 mb-2">
                🎨 Generate Logo with AI
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
            {formData.logo && (
              <div className="border-t pt-4">
                <label className="block text-xs font-medium text-gray-600 mb-2">Logo Preview</label>
                <img src={formData.logo} alt="Logo Preview" className="w-32 h-32 object-contain rounded-lg border border-gray-300" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Products</h3>
          <button 
            onClick={() => setShowProductForm(!showProductForm)} 
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            {showProductForm ? 'Cancel' : 'Add Product'}
          </button>
        </div>

        {showProductForm && (
          <div className="bg-gray-50 p-6 rounded-xl space-y-4">
            <h4 className="font-medium text-gray-800">Add New Product</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  type="text" 
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  type="number" 
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={2}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                <input 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {newProduct.image && (
                  <img src={newProduct.image} alt="Preview" className="w-16 h-16 object-cover rounded-lg mt-2" />
                )}
              </div>
            </div>
            <button 
              onClick={addProduct} 
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Product
            </button>
          </div>
        )}

        <div className="space-y-3">
          {products.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No products added yet.</p>
          ) : (
            products.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-4">
                  {product.image && (
                    <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                  )}
                  <div>
                    <h4 className="font-medium text-gray-800">{product.name}</h4>
                    <p className="text-green-600 font-bold">${product.price}</p>
                    {product.description && (
                      <p className="text-gray-600 text-sm">{product.description}</p>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => removeProduct(product.id)} 
                  className="text-red-500 hover:text-red-700 px-2 py-1 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6 border-t">
        <button 
          onClick={handleSubmit}
          disabled={loading || !!businessIdError}
          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Business Profile...' : 'Create Business Profile'}
        </button>
      </div>
    </div>
  );
} 