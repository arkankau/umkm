"use client"
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import NavDash from '@/components/dashboardnav'
import supabaseClient from '@/app/lib/supabase'

interface Product {
  id: string
  name: string
  price: number
  description: string
  image_url?: string
  imageFile?: File
}

interface MenuTemplate {
  id: string
  name: string
  description: string
  preview: string
}

const CreateMenu = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [products, setProducts] = useState<Product[]>([])
  const [showProductForm, setShowProductForm] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    imageFile: null as File | null
  })
  
  const [menuData, setMenuData] = useState({
    businessName: '',
    description: '',
    phone: '',
    address: ''
  })

  const templates: MenuTemplate[] = [
    {
      id: 'classic',
      name: 'Classic Menu',
      description: 'Clean and professional design with traditional layout',
      preview: '📋'
    },
    {
      id: 'modern',
      name: 'Modern Menu',
      description: 'Contemporary design with bold typography and spacing',
      preview: '🎨'
    },
    {
      id: 'elegant',
      name: 'Elegant Menu',
      description: 'Sophisticated design with premium styling',
      preview: '✨'
    }
  ]

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabaseClient.auth.getUser()
        if (error || !user) {
          router.push('/login')
          return
        }
        setUser(user)
        
        // Get business data from URL params or fetch from database
        const businessId = searchParams?.get('businessId')
        if (businessId) {
          await loadBusinessData(businessId)
        }
      } catch (error) {
        console.error('Error checking auth state:', error)
        router.push('/login')
      }
    }
    checkUser()
  }, [searchParams])

  const loadBusinessData = async (businessId: string) => {
    try {
      const { data, error } = await supabaseClient
        .from('websiteforms')
        .select('*')
        .eq('id', businessId)
        .single()

      if (data) {
        setMenuData({
          businessName: data.name || '',
          description: data.description || '',
          phone: data.phone || '',
          address: data.address || ''
        })

        // Load existing products
        const { data: productsData } = await supabaseClient
          .from('products')
          .select('*')
          .eq('website_id', businessId)

        if (productsData) {
          setProducts(productsData.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            description: p.description,
            image_url: p.image_url
          })))
        }
      }
    } catch (error) {
      console.error('Error loading business data:', error)
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
      const product: Product = {
        id: Date.now().toString(),
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        description: newProduct.description,
        image_url: newProduct.image
      }
      setProducts([...products, product])
      setNewProduct({ name: '', price: '', description: '', image: '', imageFile: null })
      setShowProductForm(false)
    }
  }

  const removeProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id))
  }

  const generateMenuHTML = () => {
    const template = templates.find(t => t.id === selectedTemplate)
    if (!template) return ''

    const productsHTML = products.map(product => `
      <div class="menu-item">
        <div class="item-image">
          ${product.image_url ? `<img src="${product.image_url}" alt="${product.name}" />` : ''}
        </div>
        <div class="item-details">
          <h3 class="item-name">${product.name}</h3>
          <p class="item-description">${product.description}</p>
          <span class="item-price">Rp ${product.price.toLocaleString()}</span>
        </div>
      </div>
    `).join('')

    return `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${menuData.businessName} - Menu</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
          }
          .menu-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .menu-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .menu-header h1 {
            margin: 0;
            font-size: 2.5rem;
            font-weight: bold;
          }
          .menu-header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
          }
          .menu-content {
            padding: 30px;
          }
          .menu-items {
            display: grid;
            gap: 20px;
          }
          .menu-item {
            display: flex;
            gap: 20px;
            padding: 20px;
            border: 1px solid #eee;
            border-radius: 8px;
            transition: transform 0.2s;
          }
          .menu-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          .item-image img {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 8px;
          }
          .item-details {
            flex: 1;
          }
          .item-name {
            margin: 0 0 8px 0;
            font-size: 1.2rem;
            font-weight: bold;
            color: #333;
          }
          .item-description {
            margin: 0 0 8px 0;
            color: #666;
            font-size: 0.9rem;
          }
          .item-price {
            font-weight: bold;
            color: #667eea;
            font-size: 1.1rem;
          }
          .menu-footer {
            background: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            border-top: 1px solid #eee;
          }
          .contact-info {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-top: 15px;
          }
          .contact-item {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #666;
          }
          @media print {
            body { background: white; }
            .menu-container { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="menu-container">
          <div class="menu-header">
            <h1>${menuData.businessName}</h1>
            <p>${menuData.description}</p>
          </div>
          <div class="menu-content">
            <div class="menu-items">
              ${productsHTML}
            </div>
          </div>
          <div class="menu-footer">
            <div class="contact-info">
              <div class="contact-item">
                📞 ${menuData.phone}
              </div>
              <div class="contact-item">
                📍 ${menuData.address}
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }

  const handleDownloadMenu = () => {
    if (!selectedTemplate) {
      alert('Please select a template first')
      return
    }

    const html = generateMenuHTML()
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${menuData.businessName}-menu.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handlePrintMenu = () => {
    if (!selectedTemplate) {
      alert('Please select a template first')
      return
    }

    const html = generateMenuHTML()
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(html)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <div>
      <NavDash/>
      <div className="section px-4 md:px-15 max-w-6xl mx-auto">
        <h1 className='font-mont font-bold text-3xl mb-6'>Create Your Menu</h1>
        
        {/* Template Selection */}
        <div className="mb-8">
          <h2 className='font-mont font-bold text-2xl mb-4'>Choose Template</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedTemplate === template.id
                    ? 'border-button bg-button/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-4xl mb-3">{template.preview}</div>
                <h3 className='font-mont font-bold text-lg mb-2'>{template.name}</h3>
                <p className='text-sm text-gray-600'>{template.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Business Information */}
        <div className="mb-8">
          <h2 className='font-mont font-bold text-2xl mb-4'>Business Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 font-inter">
              <h3 className='text-sm'>Business Name</h3>
              <input 
                className='bg-white px-3 py-2 text-sm border border-stroke rounded-md outline-none' 
                type="text" 
                value={menuData.businessName}
                onChange={(e) => setMenuData({...menuData, businessName: e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-1 font-inter">
              <h3 className='text-sm'>Phone</h3>
              <input 
                className='bg-white px-3 py-2 text-sm border border-stroke rounded-md outline-none' 
                type="text" 
                value={menuData.phone}
                onChange={(e) => setMenuData({...menuData, phone: e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-1 font-inter md:col-span-2">
              <h3 className='text-sm'>Description</h3>
              <textarea 
                className='bg-white px-3 py-2 text-sm border border-stroke rounded-md outline-none h-20'
                value={menuData.description}
                onChange={(e) => setMenuData({...menuData, description: e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-1 font-inter md:col-span-2">
              <h3 className='text-sm'>Address</h3>
              <input 
                className='bg-white px-3 py-2 text-sm border border-stroke rounded-md outline-none' 
                type="text" 
                value={menuData.address}
                onChange={(e) => setMenuData({...menuData, address: e.target.value})}
              />
            </div>
          </div>
        </div>
        
        {/* Products Section */}
        <div className="products-section mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className='font-mont font-bold text-2xl'>Menu Items</h2>
            <button 
              onClick={() => setShowProductForm(!showProductForm)} 
              className='bg-button text-white px-4 py-2 rounded-lg text-sm hover:bg-black transition-colors'
            >
              {showProductForm ? 'Cancel' : 'Add Item'}
            </button>
          </div>

          {showProductForm && (
            <div className="product-form bg-[#E9E4DA] p-4 rounded-xl mb-4">
              <h3 className='font-mont font-bold mb-3 text-lg'>Add Menu Item</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 font-inter">
                  <h4 className='text-sm'>Item Name</h4>
                  <input 
                    className='bg-white px-3 py-2 text-sm border border-stroke rounded-md outline-none' 
                    type="text" 
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-1 font-inter">
                  <h4 className='text-sm'>Price</h4>
                  <input 
                    className='bg-white px-3 py-2 text-sm border border-stroke rounded-md outline-none' 
                    type="number" 
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-1 font-inter md:col-span-2">
                  <h4 className='text-sm'>Description</h4>
                  <textarea 
                    className='bg-white px-3 py-2 text-sm border border-stroke rounded-md outline-none h-20'
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-1 font-inter md:col-span-2">
                  <h4 className='text-sm'>Item Image</h4>
                  <div className='flex items-center'>
                    <input 
                      className='text-sm h-10 rounded-md outline-none file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-button file:text-white file:cursor-pointer file:hover:bg-opacity-80 file:transition-colors' 
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
                Add Item
              </button>
            </div>
          )}

          <div className="products-list">
            {products.length === 0 ? (
              <p className='text-gray-500 text-sm font-inter'>No menu items added yet.</p>
            ) : (
              <div className="grid gap-3">
                {products.map((product) => (
                  <div key={product.id} className="product-item bg-[#E9E4DA] border border-stroke rounded-xl p-4 flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                      {product.image_url && (
                        <img src={product.image_url} alt={product.name} className="w-12 h-12 object-cover rounded" />
                      )}
                      <div>
                        <h4 className='font-inter font-semibold text-sm'>{product.name}</h4>
                        <p className='text-button font-bold text-sm'>Rp {product.price.toLocaleString()}</p>
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
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button 
            onClick={handleDownloadMenu}
            disabled={!selectedTemplate || products.length === 0}
            className='bg-button text-white px-6 py-3 rounded-lg font-mont font-semibold hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download HTML
          </button>
          <button 
            onClick={handlePrintMenu}
            disabled={!selectedTemplate || products.length === 0}
            className='bg-green-600 text-white px-6 py-3 rounded-lg font-mont font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Menu
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateMenu 