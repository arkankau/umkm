"use client"
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import NavDash from '@/components/dashboardnav'
import supabaseClient from '@/app/lib/supabase'

interface MenuItem {
  id: string
  name: string
  price: number
  description: string
  image_url?: string
  imageFile?: File
  category: string
  is_available: boolean
  submenu_id: string
}

interface ExistingProduct {
  id: string
  name: string
  price: number
  description: string
  image_url?: string
  category: string
  is_available: boolean
}

interface Submenu {
  id: string
  name: string
  description?: string
  items: MenuItem[]
}

interface Menu {
  id: string
  business_id: string
  template: string
  layout: 'single' | 'double'
  submenus: Submenu[]
  style: {
    font_heading: string
    font_body: string
    color_primary: string
    color_secondary: string
    border_radius: string
    spacing: string
  }
}

interface MenuTemplate {
  id: string
  name: string
  description: string
  preview: string
  style: {
    font_heading: string
    font_body: string
    color_primary: string
    color_secondary: string
    border_radius: string
    spacing: string
  }
}

const CreateMenu = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [layoutType, setLayoutType] = useState<'single' | 'double'>('single')
  const [showSubmenuForm, setShowSubmenuForm] = useState(false)
  const [showItemForm, setShowItemForm] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const [showExistingProducts, setShowExistingProducts] = useState(false)
  const [existingProducts, setExistingProducts] = useState<ExistingProduct[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [productView, setProductView] = useState<'grid' | 'list'>('grid')
  const [productFilter, setProductFilter] = useState('')
  
  const [menu, setMenu] = useState<Menu>({
    id: '',
    business_id: '',
    template: '',
    layout: 'single',
    submenus: [],
    style: {
      font_heading: '',
      font_body: '',
      color_primary: '',
      color_secondary: '',
      border_radius: '',
      spacing: ''
    }
  })

  const [newSubmenu, setNewSubmenu] = useState({
    name: '',
    description: ''
  })

  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    image: '',
    is_available: true,
    imageFile: null as File | null
  })
  
  const [businessData, setBusinessData] = useState({
    businessName: '',
    description: '',
    phone: '',
    address: '',
    menuProducts: [] as ExistingProduct[]
  })

  const templates: MenuTemplate[] = [
    {
      id: 'classic',
      name: 'Classic Menu',
      description: 'Traditional restaurant menu with timeless appeal',
      preview: '📋',
      style: {
        font_heading: 'Times New Roman, serif',
        font_body: 'Georgia, serif',
        color_primary: '#2c1810',
        color_secondary: '#8b4513',
        border_radius: '0px',
        spacing: 'comfortable'
      }
    },
    {
      id: 'modern',
      name: 'Modern Menu',
      description: 'Clean, minimalist design with bold typography',
      preview: '🎨',
      style: {
        font_heading: 'Helvetica Neue, sans-serif',
        font_body: 'Inter, sans-serif',
        color_primary: '#1a1a1a',
        color_secondary: '#0066cc',
        border_radius: '12px',
        spacing: 'airy'
      }
    },
    {
      id: 'rustic',
      name: 'Rustic Menu',
      description: 'Warm, handcrafted feel with vintage elements',
      preview: '�',
      style: {
        font_heading: 'Playfair Display, serif',
        font_body: 'Lora, serif',
        color_primary: '#5c4836',
        color_secondary: '#8b7355',
        border_radius: '4px',
        spacing: 'cozy'
      }
    },
    {
      id: 'elegant',
      name: 'Elegant Menu',
      description: 'Sophisticated design with premium styling',
      preview: '✨',
      style: {
        font_heading: 'Cormorant Garamond, serif',
        font_body: 'Montserrat, sans-serif',
        color_primary: '#2c3e50',
        color_secondary: '#8e44ad',
        border_radius: '8px',
        spacing: 'refined'
      }
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
        const businessId = searchParams.get('businessId')
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

  const addSubmenu = () => {
    if (newSubmenu.name) {
      const submenu: Submenu = {
        id: Date.now().toString(),
        name: newSubmenu.name,
        description: newSubmenu.description,
        items: []
      }
      setMenu({
        ...menu,
        submenus: [...menu.submenus, submenu]
      })
      setNewSubmenu({ name: '', description: '' })
      setShowSubmenuForm(false)
    }
  }

  const removeSubmenu = (id: string) => {
    setMenu({
      ...menu,
      submenus: menu.submenus.filter(submenu => submenu.id !== id)
    })
  }

  const addMenuItem = () => {
    if (activeSubmenu && newItem.name && newItem.price) {
      const item: MenuItem = {
        id: Date.now().toString(),
        name: newItem.name,
        price: parseFloat(newItem.price),
        description: newItem.description,
        category: newItem.category,
        image_url: newItem.image,
        is_available: newItem.is_available,
        submenu_id: activeSubmenu
      }
      
      setMenu({
        ...menu,
        submenus: menu.submenus.map(submenu =>
          submenu.id === activeSubmenu
            ? { ...submenu, items: [...submenu.items, item] }
            : submenu
        )
      })
      setNewItem({ 
        name: '', 
        price: '', 
        description: '', 
        category: '',
        image: '', 
        is_available: true,
        imageFile: null 
      })
      setShowItemForm(false)
    }
  }

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const addSelectedProductsToSubmenu = (submenuId: string) => {
    const selectedItems = existingProducts
      .filter(product => selectedProducts.includes(product.id))
      .map(product => ({
        ...product,
        submenu_id: submenuId,
        id: `${product.id}-${submenuId}` // Create unique ID for menu item
      }))

    setMenu(prevMenu => ({
      ...prevMenu,
      submenus: prevMenu.submenus.map(submenu =>
        submenu.id === submenuId
          ? { ...submenu, items: [...submenu.items, ...selectedItems] }
          : submenu
      )
    }))

    // Clear selections
    setSelectedProducts([])
  const removeMenuItem = (submenuId: string, itemId: string) => {
    setMenu({
      ...menu,
      submenus: menu.submenus.map(submenu => 
        submenu.id === submenuId
          ? { ...submenu, items: submenu.items.filter(item => item.id !== itemId) }
          : submenu
      )
    })
  }

  const saveMenu = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabaseClient
        .from('menus')
        .upsert({
          id: menu.id || undefined,
          business_id: searchParams?.get('businessId'),
          template: selectedTemplate,
          layout: layoutType,
          style: templates.find(t => t.id === selectedTemplate)?.style || {},
          submenus: menu.submenus
        })
        .select()

      if (error) throw error
      
      if (data) {
        // Handle success
        alert('Menu saved successfully!')
      }
    } catch (error) {
      console.error('Error saving menu:', error)
      alert('Error saving menu')
    } finally {
      setLoading(false)
    }
  }

  const generateMenuHTML = () => {
    const template = templates.find(t => t.id === selectedTemplate)
    if (!template) return ''

    const generateSubmenuHTML = (submenu: Submenu) => {
      const itemsHTML = submenu.items.map(item => `
        <div class="menu-item">
          <div class="item-image">
            ${item.image_url ? `<img src="${item.image_url}" alt="${item.name}" />` : ''}
          </div>
          <div class="item-details">
            <h3 class="item-name">${item.name}</h3>
            <p class="item-description">${item.description}</p>
            <span class="item-price">Rp ${item.price.toLocaleString()}</span>
          </div>
        </div>
      `).join('')

      return `
        <div class="submenu-section">
          <h2 class="submenu-title">${submenu.name}</h2>
          ${submenu.description ? `<p class="submenu-description">${submenu.description}</p>` : ''}
          <div class="menu-items ${layoutType === 'double' ? 'two-columns' : ''}">
            ${itemsHTML}
          </div>
        </div>
      `
    }

    const allSubmenusHTML = menu.submenus.map(generateSubmenuHTML).join('')

    return `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${businessData.businessName} - Menu</title>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lora:wght@400;700&family=Cormorant+Garamond:wght@400;700&family=Montserrat:wght@400;700&family=Inter:wght@400;700&display=swap" rel="stylesheet">
        <style>
          :root {
            --color-primary: ${template.style.color_primary};
            --color-secondary: ${template.style.color_secondary};
            --border-radius: ${template.style.border_radius};
            --spacing: ${template.style.spacing === 'airy' ? '2rem' : 
                        template.style.spacing === 'comfortable' ? '1.5rem' : 
                        template.style.spacing === 'cozy' ? '1rem' : '1.25rem'};
          }
          
          body {
            font-family: ${template.style.font_body};
            margin: 0;
            padding: var(--spacing);
            background: ${template.id === 'rustic' ? '#f8f3e9' : 
                        template.id === 'elegant' ? '#fff' : 
                        template.id === 'modern' ? '#fafafa' : '#fff'};
            color: var(--color-primary);
          }

          .menu-container {
            max-width: ${layoutType === 'double' ? '1200px' : '800px'};
            margin: 0 auto;
            background: white;
            border-radius: var(--border-radius);
            box-shadow: ${template.id === 'modern' ? '0 20px 40px rgba(0,0,0,0.1)' : 
                        template.id === 'elegant' ? '0 8px 30px rgba(0,0,0,0.08)' : 
                        template.id === 'rustic' ? 'none' : '0 4px 6px rgba(0,0,0,0.1)'};
            overflow: hidden;
            border: ${template.id === 'rustic' ? '2px solid var(--color-secondary)' : 'none'};
          }

          .menu-header {
            background: ${template.id === 'modern' ? 'var(--color-primary)' :
                        template.id === 'elegant' ? 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)' :
                        template.id === 'rustic' ? 'transparent' : 'var(--color-primary)'};
            color: ${template.id === 'rustic' ? 'var(--color-primary)' : 'white'};
            padding: calc(var(--spacing) * 2);
            text-align: center;
            border-bottom: ${template.id === 'rustic' ? '2px solid var(--color-secondary)' : 'none'};
          }

          .menu-header h1 {
            font-family: ${template.style.font_heading};
            margin: 0;
            font-size: ${template.id === 'elegant' ? '3.5rem' : 
                        template.id === 'modern' ? '3rem' : '2.5rem'};
            font-weight: bold;
            letter-spacing: ${template.id === 'elegant' ? '0.05em' : 
                           template.id === 'modern' ? '0' : 'normal'};
          }

          .menu-content {
            padding: calc(var(--spacing) * 2);
          }

          .menu-items {
            display: ${layoutType === 'double' ? 'grid' : 'block'};
            ${layoutType === 'double' ? 'grid-template-columns: 1fr 1fr; gap: calc(var(--spacing) * 2);' : ''}
          }

          .submenu-section {
            margin-bottom: calc(var(--spacing) * 2);
          }

          .submenu-title {
            font-family: ${template.style.font_heading};
            color: var(--color-primary);
            font-size: ${template.id === 'elegant' ? '2.2rem' : '1.8rem'};
            margin-bottom: var(--spacing);
            ${template.id === 'rustic' ? 'border-bottom: 2px solid var(--color-secondary);' : ''}
            ${template.id === 'modern' ? 'text-transform: uppercase; letter-spacing: 0.1em;' : ''}
          }

          .menu-item {
            display: flex;
            gap: var(--spacing);
            padding: var(--spacing);
            margin-bottom: var(--spacing);
            border: ${template.id === 'classic' ? '1px solid #eee' : 
                     template.id === 'rustic' ? '1px solid var(--color-secondary)' : 'none'};
            border-radius: var(--border-radius);
            transition: transform 0.2s;
            background: ${template.id === 'modern' ? '#ffffff' : 'transparent'};
          }

          .menu-item:hover {
            transform: ${template.id === 'modern' ? 'translateY(-2px)' : 'none'};
            box-shadow: ${template.id === 'modern' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'};
          }

          .item-image img {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: var(--border-radius);
          }

          .item-name {
            font-family: ${template.style.font_heading};
            margin: 0 0 0.5rem 0;
            font-size: 1.2rem;
            font-weight: bold;
            color: var(--color-primary);
          }

          .item-description {
            margin: 0 0 0.5rem 0;
            color: ${template.id === 'modern' ? '#666' : 
                    template.id === 'elegant' ? '#4a4a4a' : 
                    template.id === 'rustic' ? '#5c4836' : '#333'};
            font-size: 0.9rem;
            line-height: 1.5;
          }

          .item-price {
            font-family: ${template.style.font_heading};
            font-weight: bold;
            color: var(--color-secondary);
            font-size: 1.1rem;
          }

          .menu-footer {
            background: ${template.id === 'rustic' ? 'transparent' : '#f8f9fa'};
            padding: calc(var(--spacing) * 1.5);
            text-align: center;
            border-top: ${template.id === 'rustic' ? '2px solid var(--color-secondary)' : '1px solid #eee'};
          }

          .contact-info {
            display: flex;
            justify-content: center;
            gap: calc(var(--spacing) * 1.5);
            margin-top: var(--spacing);
            flex-wrap: wrap;
          }

          .contact-item {
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--color-primary);
            font-family: ${template.style.font_body};
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
        
        {/* Template and Layout Selection */}
        <div className="mb-8">
          <h2 className='font-mont font-bold text-2xl mb-4'>Choose Template & Layout</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => {
                  setSelectedTemplate(template.id);
                  setMenu(prev => ({
                    ...prev,
                    style: template.style
                  }));
                }}
                className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedTemplate === template.id
                    ? 'border-button bg-button/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-4xl mb-3">{template.preview}</div>
                <h3 className='font-mont font-bold text-lg mb-2'>{template.name}</h3>
                <p className='text-sm text-gray-600'>{template.description}</p>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Preview styles:</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 text-xs rounded" 
                          style={{
                            background: template.style.color_primary,
                            color: '#fff',
                            fontFamily: template.style.font_heading
                          }}>
                      Aa
                    </span>
                    <span className="px-2 py-1 text-xs rounded" 
                          style={{
                            background: template.style.color_secondary,
                            color: '#fff',
                            fontFamily: template.style.font_body
                          }}>
                      Bb
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <h3 className='font-mont font-bold text-lg mb-3'>Select Layout</h3>
            <div className="flex gap-4">
              <button
                onClick={() => setLayoutType('single')}
                className={`p-4 border-2 rounded-lg flex items-center gap-2 ${
                  layoutType === 'single'
                    ? 'border-button bg-button/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-6 h-6">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
                <span>Single Column</span>
              </button>
              <button
                onClick={() => setLayoutType('double')}
                className={`p-4 border-2 rounded-lg flex items-center gap-2 ${
                  layoutType === 'double'
                    ? 'border-button bg-button/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-6 h-6">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h7m3 0h6M4 12h7m3 0h6M4 18h7m3 0h6" />
                  </svg>
                </div>
                <span>Two Columns</span>
              </button>
            </div>
          </div>
        </div>

        {/* Product Management */}
        <div className="mb-8">
          <h2 className='font-mont font-bold text-2xl mb-4'>Products</h2>
          
          {/* Toggle Existing Products */}
          <button
            onClick={() => setShowExistingProducts(!showExistingProducts)}
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d={showExistingProducts ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"} />
            </svg>
            {showExistingProducts ? 'Hide' : 'Show'} Existing Products
          </button>

          {/* Existing Products View */}
          {showExistingProducts && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    placeholder="Filter products..."
                    value={productFilter}
                    onChange={(e) => setProductFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setProductView('grid')}
                      className={`p-2 rounded-lg ${productView === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setProductView('list')}
                      className={`p-2 rounded-lg ${productView === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4M4 13h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4" />
                      </svg>
                    </button>
                  </div>
                </div>
                {selectedProducts.length > 0 && activeSubmenu && (
                  <button
                    onClick={() => addSelectedProductsToSubmenu(activeSubmenu)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add {selectedProducts.length} {selectedProducts.length === 1 ? 'Product' : 'Products'} to Menu
                  </button>
                )}
              </div>

              <div className={`${productView === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-4' : 'space-y-3'}`}>
                {existingProducts
                  .filter(product => 
                    product.name.toLowerCase().includes(productFilter.toLowerCase()) ||
                    product.category.toLowerCase().includes(productFilter.toLowerCase())
                  )
                  .map(product => (
                    <div
                      key={product.id}
                      className={`
                        ${productView === 'grid' 
                          ? 'p-4 border rounded-lg' 
                          : 'flex items-center gap-4 p-3 border rounded-lg'
                        }
                        ${selectedProducts.includes(product.id) ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}
                        cursor-pointer hover:border-indigo-300 transition-colors
                      `}
                      onClick={() => toggleProductSelection(product.id)}
                    >
                      {product.image_url && (
                        <div className={productView === 'grid' ? 'mb-3' : 'flex-shrink-0'}>
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className={`rounded-lg ${productView === 'grid' ? 'w-full h-48' : 'w-16 h-16'} object-cover`}
                          />
                        </div>
                      )}
                      <div className={productView === 'list' ? 'flex-grow' : ''}>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-semibold">{product.name}</h4>
                            <p className="text-sm text-gray-600">{product.category}</p>
                          </div>
                          <span className="font-bold text-green-600">
                            Rp {product.price.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                        <div className="mt-2">
                          <span className={`
                            text-xs px-2 py-1 rounded-full
                            ${product.is_available 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                            }
                          `}>
                            {product.is_available ? 'Available' : 'Sold Out'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
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
                value={businessData.businessName}
                onChange={(e) => setBusinessData({...businessData, businessName: e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-1 font-inter">
              <h3 className='text-sm'>Phone</h3>
              <input 
                className='bg-white px-3 py-2 text-sm border border-stroke rounded-md outline-none' 
                type="text" 
                value={businessData.phone}
                onChange={(e) => setBusinessData({...businessData, phone: e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-1 font-inter md:col-span-2">
              <h3 className='text-sm'>Description</h3>
              <textarea 
                className='bg-white px-3 py-2 text-sm border border-stroke rounded-md outline-none h-20'
                value={businessData.description}
                onChange={(e) => setBusinessData({...businessData, description: e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-1 font-inter md:col-span-2">
              <h3 className='text-sm'>Address</h3>
              <input 
                className='bg-white px-3 py-2 text-sm border border-stroke rounded-md outline-none' 
                type="text" 
                value={businessData.address}
                onChange={(e) => setBusinessData({...businessData, address: e.target.value})}
              />
            </div>
          </div>
        </div>
        
        {/* Submenus Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className='font-mont font-bold text-2xl'>Menu Sections</h2>
            <button 
              onClick={() => setShowSubmenuForm(!showSubmenuForm)}
              className='bg-button text-white px-4 py-2 rounded-lg text-sm hover:bg-black transition-colors'
            >
              {showSubmenuForm ? 'Cancel' : 'Add Section'}
            </button>
          </div>

          {showSubmenuForm && (
            <div className="bg-[#E9E4DA] p-4 rounded-xl mb-4">
              <h3 className='font-mont font-bold mb-3 text-lg'>Add Menu Section</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-1 font-inter">
                  <h4 className='text-sm'>Section Name</h4>
                  <input 
                    className='bg-white px-3 py-2 text-sm border border-stroke rounded-md outline-none'
                    type="text"
                    value={newSubmenu.name}
                    onChange={(e) => setNewSubmenu({...newSubmenu, name: e.target.value})}
                    placeholder="e.g., Appetizers, Main Course, Desserts"
                  />
                </div>
                <div className="flex flex-col gap-1 font-inter">
                  <h4 className='text-sm'>Description (optional)</h4>
                  <textarea
                    className='bg-white px-3 py-2 text-sm border border-stroke rounded-md outline-none h-20'
                    value={newSubmenu.description}
                    onChange={(e) => setNewSubmenu({...newSubmenu, description: e.target.value})}
                    placeholder="Add a description for this section..."
                  />
                </div>
              </div>
              <button
                onClick={addSubmenu}
                className='bg-button text-white px-4 py-2 rounded-lg text-sm mt-3 hover:bg-black transition-colors'
              >
                Add Section
              </button>
            </div>
          )}

          <div className="space-y-4">
            {menu.submenus.map((submenu) => (
              <div key={submenu.id} className="border border-stroke rounded-xl p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-mont font-bold text-lg">{submenu.name}</h3>
                    {submenu.description && (
                      <p className="text-sm text-gray-600 mt-1">{submenu.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setActiveSubmenu(submenu.id);
                        setShowItemForm(true);
                      }}
                      className="text-button hover:text-black text-sm px-3 py-1 rounded border border-stroke hover:bg-gray-50"
                    >
                      Add Item
                    </button>
                    <button
                      onClick={() => removeSubmenu(submenu.id)}
                      className="text-red-500 hover:text-red-700 text-sm px-3 py-1 rounded border border-stroke hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {submenu.items.length > 0 ? (
                  <div className="grid gap-3">
                    {submenu.items.map((item) => (
                      <div key={item.id} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                        <div className="flex gap-4 items-center">
                          {item.image_url && (
                            <img src={item.image_url} alt={item.name} className="w-12 h-12 object-cover rounded" />
                          )}
                          <div>
                            <h4 className="font-inter font-semibold text-sm">{item.name}</h4>
                            <p className="text-button font-bold text-sm">Rp {item.price.toLocaleString()}</p>
                            {item.description && (
                              <p className="text-gray-600 text-xs mt-1">{item.description}</p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removeMenuItem(submenu.id, item.id)}
                          className="text-red-500 hover:text-red-700 text-xs px-2 py-1 hover:bg-red-50 rounded transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No items in this section yet.</p>
                )}
              </div>
            ))}
            {menu.submenus.length === 0 && (
              <p className="text-gray-500 text-sm font-inter">No menu sections added yet. Add a section to get started!</p>
            )}
          </div>
        </div>
        
        {/* Item Form Modal */}
        {showItemForm && activeSubmenu && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className='font-mont font-bold text-lg'>Add Menu Item</h3>
                <button 
                  onClick={() => {
                    setShowItemForm(false);
                    setActiveSubmenu(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 font-inter">
                  <h4 className='text-sm'>Item Name</h4>
                  <input 
                    className='bg-white px-3 py-2 text-sm border border-stroke rounded-md outline-none' 
                    type="text" 
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-1 font-inter">
                  <h4 className='text-sm'>Price</h4>
                  <input 
                    className='bg-white px-3 py-2 text-sm border border-stroke rounded-md outline-none' 
                    type="number" 
                    value={newItem.price}
                    onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-1 font-inter md:col-span-2">
                  <h4 className='text-sm'>Description</h4>
                  <textarea 
                    className='bg-white px-3 py-2 text-sm border border-stroke rounded-md outline-none h-20'
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
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
                  {newItem.image && (
                    <img src={newItem.image} alt="Preview" className="w-16 h-16 object-cover rounded mt-2" />
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={() => {
                    setShowItemForm(false);
                    setActiveSubmenu(null);
                  }}
                  className='px-4 py-2 rounded-lg text-sm border border-gray-300 hover:bg-gray-50'
                >
                  Cancel
                </button>
                <button 
                  onClick={addMenuItem}
                  className='bg-button text-white px-4 py-2 rounded-lg text-sm hover:bg-black transition-colors'
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button 
            onClick={saveMenu}
            disabled={!selectedTemplate || menu.submenus.length === 0}
            className='bg-button text-white px-6 py-3 rounded-lg font-mont font-semibold hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save Menu
          </button>
          <button 
            onClick={handlePrintMenu}
            disabled={!selectedTemplate || menu.submenus.length === 0}
            className='bg-green-600 text-white px-6 py-3 rounded-lg font-mont font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Menu
          </button>
          <button 
            onClick={handleDownloadMenu}
            disabled={!selectedTemplate || menu.submenus.length === 0}
            className='bg-indigo-600 text-white px-6 py-3 rounded-lg font-mont font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download HTML
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateMenu 