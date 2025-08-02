"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NavDash from '@/components/dashboardnav'
import supabaseClient from '@/app/lib/supabase'

const Create = () => {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [showProductForm, setShowProductForm] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    imageFile: null
  })
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    phone: '',
    email: '',
    address: ''
  })

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
      }
    }
    checkUser()
  }, [])

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setNewProduct({...newProduct, image: imageUrl, imageFile: file})
    }
  }

  const uploadImageToSupabase = async (file, filename) => {
    try {
      const { data, error } = await supabaseClient.storage
        .from('productimages')
        .upload(filename, file)
      
      if (error) throw error
      
      const { data: { publicUrl } } = supabaseClient.storage
        .from('productimages')
        .getPublicUrl(filename)
      
      return publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    }
  }

  const addProduct = () => {
    if (newProduct.name && newProduct.price) {
      setProducts([...products, { ...newProduct, id: Date.now() }])
      setNewProduct({ name: '', price: '', description: '', image: '', imageFile: null })
      setShowProductForm(false)
    }
  }

  const handleSubmit = async () => {
    if (!user) {
      alert('Please log in to create a website')
      return
    }

    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all required fields (Name, Email, Phone)')
      return
    }

    setLoading(true)
    
    try {
      const { data: websiteData, error: websiteError } = await supabaseClient
        .from('websiteforms')
        .insert({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          user_id: user.id
        })
        .select()
        .single()

      if (websiteError) throw websiteError

      if (products.length > 0) {
        const productsToInsert = await Promise.all(
          products.map(async (product) => {
            let imageUrl = ''
            
            if (product.imageFile) {
              const filename = `${Date.now()}-${product.imageFile.name}`
              imageUrl = await uploadImageToSupabase(product.imageFile, filename)
            }
            
            return {
              name: product.name,
              description: product.description,
              price: parseFloat(product.price),
              image_url: imageUrl,
              website_id: websiteData.id
            }
          })
        )

        const { error: productsError } = await supabaseClient
          .from('products')
          .insert(productsToInsert)

        if (productsError) throw productsError
      }

      alert('Website created successfully!')
      router.push('/dashboard')
      
    } catch (error) {
      console.error('Error creating website:', error)
      alert('Error creating website. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const removeProduct = (id) => {
    setProducts(products.filter(product => product.id !== id))
  }
  return (
    <div>
      <NavDash/>
      <div className="section px-15">
        <h1 className='font-mont font-bold text-3xl mb-3'>Let's create your website</h1>
        <div className="form flex flex-col gap-3">
            <div className="flex flex-col gap-1 font-inter ">
                <h3 className='text-sm'>Name</h3>
                <input 
                  className='bg-white px-2 text-xs border-[1.6] w-[19rem] h-[2rem] border-stroke rounded-sm outline-none' 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
            </div>
            <div className="flex flex-col   gap-1 font-inter">
                <h3 className='text-sm'>Category</h3>
                <input 
                  className='bg-white px-2 text-xs border-[1.6] w-[19rem] h-[2rem] border-stroke rounded-sm outline-none' 
                  type="text" 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                />
            </div>
            <div className="flex flex-col gap-1 font-inter"> 
                <h3 className='text-sm'>Description</h3>
                <textarea 
                  className='bg-white px-2 py-2 text-xs border-[1.6] w-[19rem] h-[4rem] border-stroke rounded-sm outline-none'
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
            </div>
            <div className="flex flex-col  gap-1 font-inter ">
                <h3 className='text-sm'>Phone</h3>
                <input 
                  className='bg-white px-2  text-xs border-[1.6] w-[19rem] h-[2rem] border-stroke rounded-sm outline-none' 
                  type="text" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
            </div>
            <div className="flex flex-col gap-1 font-inter  ">
                <h3 className='text-sm'>Email</h3>
                <input 
                  className='bg-white px-2 text-xs border-[1.6] w-[19rem] h-[2rem] border-stroke rounded-sm outline-none' 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
            </div>
            <div className="flex flex-col gap-1 font-inter  ">
                <h3 className='text-sm'>Address</h3>
                <input 
                  className='bg-white px-2 text-xs border-[1.6] w-[19rem] h-[2rem] border-stroke rounded-sm outline-none' 
                  type="text" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
            </div>
            <div className="flex flex-col gap-1 font-inter"> 
                <h3 className='text-sm'>Extra Prompts</h3>
                <textarea className='bg-white px-2 py-2 text-xs border-[1.6] w-[19rem] h-[4rem] border-stroke rounded-sm outline-none'></textarea>
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
            disabled={loading}
            className='bg-button text-white px-8 py-3 rounded-lg font-mont font-semibold hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? 'Creating Website...' : 'Create Website'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Create
