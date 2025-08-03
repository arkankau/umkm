"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NavDash from '@/components/dashboardnav'
import supabaseClient from '@/app/lib/supabase'
import { User } from '@supabase/supabase-js'

interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string;
  imageFile: File | null;
}

interface FormData {
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

const Create = () => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [showProductForm, setShowProductForm] = useState(false)
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: '',
    description: '',
    image: '',
    imageFile: null
  })
  
  const [formData, setFormData] = useState<FormData>({
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
  })

  const [businessIdError, setBusinessIdError] = useState<string>('')

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabaseClient.auth.getUser()
        if (error || !user) {
          router.push('/login')
          return
        }
        setUser(user)
      } catch (error) {
        console.error('Error checking auth state:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }
    checkUser()
  }, [])

  const validateBusinessId = async (businessId: string) => {
    if (!businessId) {
      setBusinessIdError('Business ID is required')
      return false
    }

    if (businessId.length < 3) {
      setBusinessIdError('Business ID must be at least 3 characters')
      return false
    }

    if (!/^[a-zA-Z0-9-]+$/.test(businessId)) {
      setBusinessIdError('Business ID can only contain letters, numbers, and hyphens')
      return false
    }

    try {
      const { data, error } = await supabaseClient
        .from('businesses')
        .select('businessId')
        .eq('businessId', businessId)
        .single()

      if (data) {
        setBusinessIdError('Business ID already exists')
        return false
      }

      setBusinessIdError('')
      return true
    } catch (error) {
      // If no record found, businessId is available
      setBusinessIdError('')
      return true
    }
  }

  const handleBusinessIdChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-zA-Z0-9-]/g, '')
    setFormData(prev => ({ ...prev, businessId: value }))
    
    if (value.length >= 3) {
      await validateBusinessId(value)
    } else {
      setBusinessIdError('')
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setNewProduct({...newProduct, image: imageUrl, imageFile: file})
    }
  }

  const uploadImageToSupabase = async (file: File, filename: string) => {
    try {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size exceeds 5MB limit')
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image')
      }

      // Use the correct bucket name from your Supabase setup
      const bucketName = 'productimages' // this should match your Supabase bucket name

      // First, check if we can access the bucket
      const { data: bucket, error: bucketError } = await supabaseClient.storage
        .getBucket(bucketName)
      
      if (bucketError) {
        console.error('Error checking bucket:', bucketError)
        throw new Error('Unable to access storage. Please ensure you have created a bucket named "images" in your Supabase storage.')

      const { data, error } = await supabaseClient.storage
        .from(bucketName)
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: true // Allow overwriting files
        })
      
      if (error) {
        console.error('Supabase upload error:', error)
        throw new Error(`Failed to upload image: ${error.message}`)
      }
      
      const { data: { publicUrl } } = supabaseClient.storage
        .from(bucketName)
        .getPublicUrl(filename)
      
      if (!publicUrl) {
        throw new Error('Failed to get public URL for uploaded image')
      }

      return publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Failed to upload image: unexpected error')
    }
  }

  const addProduct = () => {
    if (newProduct.name && newProduct.price) {
      setProducts([...products, { ...newProduct, id: String(Date.now()) }])
      setNewProduct({ name: '', price: '', description: '', image: '', imageFile: null })
      setShowProductForm(false)
    }
  }

  const handleSubmit = async () => {
    if (!user) {
      alert('Please log in to create a business')
      return
    }

    if (!formData.businessId || !formData.businessName || !formData.ownerName || !formData.phone) {
      alert('Please fill in all required fields')
      return
    }

    if (businessIdError) {
      alert('Please fix the Business ID error')
      return
    }

    setLoading(true)
    
    try {
      // Upload logo if exists
      let logoUrl = ''
      if (formData.logoFile) {
        const filename = `${formData.businessId}-logo-${Date.now()}.${formData.logoFile.name.split('.').pop()}`
        logoUrl = await uploadImageToSupabase(formData.logoFile, filename)
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
        .single()

      if (businessError) throw businessError

      // Upload product images and create product records
      if (products.length > 0) {
        const productsToInsert = await Promise.all(
          products.map(async (product) => {
            let imageUrl = ''
            
            if (product.imageFile) {
              const filename = `${formData.businessId}-product-${Date.now()}-${product.imageFile.name}`
              imageUrl = await uploadImageToSupabase(product.imageFile, filename)
            }
            
            return {
              name: product.name,
              description: product.description,
              price: parseFloat(product.price),
              imageUrl: imageUrl,
              businessId: formData.businessId
            }
          })
        )

        const { error: productsError } = await supabaseClient
          .from('products')
          .insert(productsToInsert)

        if (productsError) throw productsError
      }

      alert('Business created successfully!')
      router.push(`/${user.id}/${formData.businessId}`)
      
    } catch (error) {
      console.error('Error creating business:', error)
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      alert(`Error creating business: ${errorMessage}. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  const removeProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id))
  }

  return (
    <div>
      <NavDash/>
      <div className="section px-15">
        <h1 className='font-mont font-bold text-3xl mb-3'>Let's create your business</h1>
        <div className="form flex flex-col gap-3">
            <div className="flex flex-col gap-1 font-inter">
                <h3 className='text-sm'>Business ID *</h3>
                <input 
                  className='bg-white px-2 text-xs border-[1.6] w-[19rem] h-[2rem] border-stroke rounded-sm outline-none' 
                  type="text" 
                  value={formData.businessId}
                  onChange={handleBusinessIdChange}
                  placeholder="e.g., warung-pak-budi"
                />
                {businessIdError && (
                  <p className="text-red-500 text-xs mt-1">{businessIdError}</p>
                )}
            </div>
            <div className="flex flex-col gap-1 font-inter">
                <h3 className='text-sm'>Business Name *</h3>
                <input 
                  className='bg-white px-2 text-xs border-[1.6] w-[19rem] h-[2rem] border-stroke rounded-sm outline-none' 
                  type="text" 
                  value={formData.businessName}
                  onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                />
            </div>
            <div className="flex flex-col gap-1 font-inter">
                <h3 className='text-sm'>Owner Name *</h3>
                <input 
                  className='bg-white px-2 text-xs border-[1.6] w-[19rem] h-[2rem] border-stroke rounded-sm outline-none' 
                  type="text" 
                  value={formData.ownerName}
                  onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                />
            </div>
            <div className="flex flex-col gap-1 font-inter">
                <h3 className='text-sm'>Category *</h3>
                <select
                  className='bg-white px-2 text-xs border-[1.6] w-[19rem] h-[2rem] border-stroke rounded-sm outline-none'
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="restaurant">Restaurant & Food</option>
                  <option value="retail">Retail & Shop</option>
                  <option value="service">Service & Business</option>
                  <option value="other">Other</option>
                </select>
            </div>
            <div className="flex flex-col gap-1 font-inter"> 
                <h3 className='text-sm'>Description *</h3>
                <textarea 
                  className='bg-white px-2 py-2 text-xs border-[1.6] w-[19rem] h-[4rem] border-stroke rounded-sm outline-none'
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
            </div>
            <div className="flex flex-col gap-1 font-inter">
                <h3 className='text-sm'>Products/Services *</h3>
                <textarea 
                  className='bg-white px-2 py-2 text-xs border-[1.6] w-[19rem] h-[4rem] border-stroke rounded-sm outline-none'
                  value={formData.products}
                  onChange={(e) => setFormData({...formData, products: e.target.value})}
                  placeholder="e.g., Nasi goreng, Mie goreng, Soto ayam"
                ></textarea>
            </div>
            <div className="flex flex-col gap-1 font-inter">
                <h3 className='text-sm'>Phone *</h3>
                <input 
                  className='bg-white px-2 text-xs border-[1.6] w-[19rem] h-[2rem] border-stroke rounded-sm outline-none' 
                  type="text" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
            </div>
            <div className="flex flex-col gap-1 font-inter">
                <h3 className='text-sm'>Email</h3>
                <input 
                  className='bg-white px-2 text-xs border-[1.6] w-[19rem] h-[2rem] border-stroke rounded-sm outline-none' 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
            </div>
            <div className="flex flex-col gap-1 font-inter">
                <h3 className='text-sm'>Address *</h3>
                <input 
                  className='bg-white px-2 text-xs border-[1.6] w-[19rem] h-[2rem] border-stroke rounded-sm outline-none' 
                  type="text" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
            </div>
            <div className="flex flex-col gap-1 font-inter">
                <h3 className='text-sm'>WhatsApp</h3>
                <input 
                  className='bg-white px-2 text-xs border-[1.6] w-[19rem] h-[2rem] border-stroke rounded-sm outline-none' 
                  type="text" 
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                />
            </div>
            <div className="flex flex-col gap-1 font-inter">
                <h3 className='text-sm'>Instagram</h3>
                <input 
                  className='bg-white px-2 text-xs border-[1.6] w-[19rem] h-[2rem] border-stroke rounded-sm outline-none' 
                  type="text" 
                  value={formData.instagram}
                  onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                />
            </div>
            <div className="flex flex-col gap-1 font-inter">
                <h3 className='text-sm'>Business Logo</h3>
                <div className='flex flex-col gap-2'>
                  <input 
                    className='text-xs rounded-sm outline-none file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-button file:text-white file:cursor-pointer file:hover:bg-opacity-80 file:transition-colors' 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const imageUrl = URL.createObjectURL(file)
                        setFormData({...formData, logo: imageUrl, logoFile: file})
                      }
                    }}
                  />
                  {formData.logo && (
                    <img src={formData.logo} alt="Logo Preview" className="w-32 h-32 object-contain rounded border border-stroke" />
                  )}
                  {!formData.logo && (
                    <div className='bg-[#E9E4DA] p-4 rounded-lg w-fit'>
                      <p className='text-xs text-gray-600 mb-2'>Don't have a logo yet?</p>
                      <button 
                        onClick={() => router.push(`/${user?.id}/generate-logo`)}
                        className='bg-button text-white px-3 py-1 rounded text-xs hover:bg-black transition-colors'
                      >
                        Generate Logo
                      </button>
                    </div>
                  )}
                </div>
            </div>
        </div>
        
        <div className="products-section mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className='font-mont font-bold text-2xl'>Products</h2>
            <button 
              onClick={() => setShowProductForm(!showProductForm)} 
              className='bg-button text-white px-4 py-2 rounded-lg text-sm hover:bg-black transition-colors'
            >
              {showProductForm ? 'Cancel' : 'Add Product'}
            </button>
          </div>

          {showProductForm && (
            <div className="product-form bg-[#E9E4DA] p-4 rounded-xl mb-4">
              <h3 className='font-mont font-bold mb-3 text-lg'>Add New Product</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 font-inter">
                  <h4 className='text-sm'>Product Name</h4>
                  <input 
                    className='bg-white px-2 text-xs border-[1.6] h-[2rem] border-stroke rounded-sm outline-none' 
                    type="text" 
                    value={newProduct.name || ''}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-1 font-inter">
                  <h4 className='text-sm'>Price</h4>
                  <input 
                    className='bg-white px-2 text-xs border-[1.6] h-[2rem] border-stroke rounded-sm outline-none' 
                    type="number" 
                    value={newProduct.price || ''}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-1 font-inter">
                  <h4 className='text-sm'>Description</h4>
                  <textarea 
                    className='bg-white px-2 py-2 text-xs border-[1.6] h-[3rem] border-stroke rounded-sm outline-none'
                    value={newProduct.description || ''}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  ></textarea>
                </div>
                <div className="flex flex-col gap-1 font-inter">
                  <h4 className='text-sm'>Product Image</h4>
                  <div className='flex items-center h-[2rem]'>
                    <input 
                      className=' text-xs  h-full rounded-sm outline-none file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-button file:text-white file:cursor-pointer file:hover:bg-opacity-80 file:transition-colors' 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                  {newProduct.image && (
                    <img src={newProduct.image} alt="Preview" className="w-16 h-16 object-cover rounded mt-2" />
                  )}
                </div>
              </div>
              <button 
                onClick={addProduct} 
                className='bg-button text-white px-4 py-2 rounded-lg text-sm mt-3 hover:bg-black transition-colors'
              >
                Add Product
              </button>
            </div>
          )}

          <div className="products-list">
            {products.length === 0 ? (
              <p className='text-gray-500 text-sm font-inter'>No products added yet.</p>
            ) : (
              <div className="grid gap-3">
                {products.map((product) => (
                  <div key={product.id} className="product-item bg-[#E9E4DA] border-[1.6] border-stroke rounded-xl p-4 flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                      {product.image && (
                        <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                      )}
                      <div>
                        <h4 className='font-inter font-semibold text-sm'>{product.name}</h4>
                        <p className='text-button font-bold text-sm'>${product.price}</p>
                        {product.description && (
                          <p className='text-gray-600 text-xs mt-1'>{product.description}</p>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => removeProduct(product.id)} 
                      className='text-red-500 hover:text-red-700 text-xs font-inter px-2 py-1 hover:bg-red-50 rounded transition-colors'
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="submit-section mt-8 mb-8">
          <button 
            onClick={handleSubmit}
            disabled={loading || !!businessIdError}
            className='bg-button text-white px-8 py-3 rounded-lg font-mont font-semibold hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? 'Creating Business...' : 'Create Business'}
          </button>
        </div>
      </div>
    </div>
  )
}}

export default Create
