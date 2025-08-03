'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabaseClient from '@/app/lib/supabase';

interface BusinessData {
  businessId: string;
  businessName: string;
  ownerName: string;
  description: string;
  category: 'restaurant' | 'retail' | 'service' | 'other';
  products: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  instagram: string;
  logoUrl: string;
  userId: string;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
}

interface BusinessTabProps {
  businessData: BusinessData;
  onUpdate?: (updatedData: BusinessData) => void;
}

export default function BusinessTab({ businessData, onUpdate }: BusinessTabProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    description: '',
    imageUrl: ''
  });

  const [formData, setFormData] = useState<BusinessData>(businessData);

  useEffect(() => {
    loadProducts();
  }, [businessData.businessId]);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabaseClient
        .from('products')
        .select('*')
        .eq('businessId', businessData.businessId);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, logoUrl: imageUrl }));
    }
  };

  const uploadImageToSupabase = async (file: File, filename: string) => {
    try {
      const { data, error } = await supabaseClient.storage
        .from('businessimages')
        .upload(filename, file);
      
      if (error) throw error;
      
      const { data: { publicUrl } } = supabaseClient.storage
        .from('businessimages')
        .getPublicUrl(filename);
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Upload new logo if changed
      let logoUrl = formData.logoUrl;
      const logoInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (logoInput?.files?.[0]) {
        const filename = `${businessData.businessId}-logo-${Date.now()}.${logoInput.files[0].name.split('.').pop()}`;
        logoUrl = await uploadImageToSupabase(logoInput.files[0], filename);
      }

      // Update business data
      const { error } = await supabaseClient
        .from('businesses')
        .update({
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
          logoUrl: logoUrl
        })
        .eq('businessId', businessData.businessId);

      if (error) throw error;

      const updatedData = { ...formData, logoUrl };
      onUpdate?.(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating business:', error);
      alert('Error updating business. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || newProduct.price <= 0) {
      alert('Please fill in product name and price');
      return;
    }

    try {
      const { data, error } = await supabaseClient
        .from('products')
        .insert({
          name: newProduct.name,
          price: newProduct.price,
          description: newProduct.description,
          imageUrl: newProduct.imageUrl,
          businessId: businessData.businessId
        })
        .select()
        .single();

      if (error) throw error;

      setProducts([...products, data]);
      setNewProduct({ name: '', price: 0, description: '', imageUrl: '' });
      setShowProductForm(false);
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product. Please try again.');
    }
  };

  const handleRemoveProduct = async (productId: string) => {
    try {
      const { error } = await supabaseClient
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      setProducts(products.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Error removing product:', error);
      alert('Error removing product. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Business Information</h2>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Edit Information
            </button>
          )}
        </div>
      </div>

      {/* Business Information Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name *
              </label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Owner Name *
              </label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
              >
                <option value="restaurant">Restaurant & Food</option>
                <option value="retail">Retail & Shop</option>
                <option value="service">Service & Business</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Products/Services *
              </label>
              <textarea
                name="products"
                value={formData.products}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp
              </label>
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram
              </label>
              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Logo Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Business Logo</h3>
        <div className="flex items-center gap-6">
          {formData.logoUrl ? (
            <img 
              src={formData.logoUrl} 
              alt="Business Logo" 
              className="w-32 h-32 object-contain rounded border border-gray-200"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No Logo</span>
            </div>
          )}
          <div className="flex-1">
            {isEditing ? (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Upload a new logo for your business
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600">
                  {formData.logoUrl ? 'Logo uploaded successfully' : 'No logo uploaded yet'}
                </p>
                {!formData.logoUrl && (
                  <button
                    onClick={() => router.push(`/${businessData.userId}/generate-logo`)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-2"
                  >
                    Generate Logo
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Products</h3>
          {isEditing && (
            <button
              onClick={() => setShowProductForm(!showProductForm)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {showProductForm ? 'Cancel' : 'Add Product'}
            </button>
          )}
        </div>

        {showProductForm && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold mb-3">Add New Product</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                </label>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <button
              onClick={handleAddProduct}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors mt-3"
            >
              Add Product
            </button>
          </div>
        )}

        <div className="space-y-3">
          {products.length === 0 ? (
            <p className="text-gray-500 text-sm">No products added yet.</p>
          ) : (
            products.map((product) => (
              <div key={product.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  {product.imageUrl && (
                    <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded" />
                  )}
                  <div>
                    <h4 className="font-semibold text-sm">{product.name}</h4>
                    <p className="text-indigo-600 font-bold text-sm">Rp {product.price.toLocaleString()}</p>
                    {product.description && (
                      <p className="text-gray-600 text-xs mt-1">{product.description}</p>
                    )}
                  </div>
                </div>
                {isEditing && (
                  <button
                    onClick={() => handleRemoveProduct(product.id)}
                    className="text-red-500 hover:text-red-700 text-xs font-medium px-2 py-1 hover:bg-red-50 rounded transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 