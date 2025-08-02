"use client"
import React, { useState } from 'react'
import NavDash from '@/components/dashboardnav'

const Create = () => {
  const [products, setProducts] = useState([])
  const [showProductForm, setShowProductForm] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    image: ''
  })

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setNewProduct({...newProduct, image: imageUrl})
    }
  }

  const addProduct = () => {
    if (newProduct.name && newProduct.price) {
      setProducts([...products, { ...newProduct, id: Date.now() }])
      setNewProduct({ name: '', price: '', description: '', image: '' })
      setShowProductForm(false)
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
                <input className='bg-white px-2 text-xs border-[1.6] w-[19rem] h-[2rem] border-stroke rounded-sm outline-none' type="text" />
            </div>
            <div className="flex flex-col   gap-1 font-inter">
                <h3 className='text-sm'>Category</h3>
                <input className='bg-white px-2 text-xs border-[1.6] w-[19rem] h-[2rem] border-stroke rounded-sm outline-none' type="text" />
            </div>
            <div className="flex flex-col gap-1 font-inter"> 
                <h3 className='text-sm'>Description</h3>
                <textarea className='bg-white px-2 py-2 text-xs border-[1.6] w-[19rem] h-[4rem] border-stroke rounded-sm outline-none'></textarea>
            </div>
            <div className="flex flex-col  gap-1 font-inter ">
                <h3 className='text-sm'>Phone</h3>
                <input className='bg-white px-2  text-xs border-[1.6] w-[19rem] h-[2rem] border-stroke rounded-sm outline-none' type="text" />
            </div>
            <div className="flex flex-col gap-1 font-inter  ">
                <h3 className='text-sm'>Email</h3>
                <input className='bg-white px-2 text-xs border-[1.6] w-[19rem] h-[2rem] border-stroke rounded-sm outline-none' type="text" />
            </div>
            <div className="flex flex-col gap-1 font-inter  ">
                <h3 className='text-sm'>Location</h3>
                <input className='bg-white px-2 text-xs border-[1.6] w-[19rem] h-[2rem] border-stroke rounded-sm outline-none' type="text" />
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
          <button className='bg-button text-white px-8 py-3 rounded-lg font-mont font-semibold hover:bg-black transition-colors'>
            Create Website
          </button>
        </div>
      </div>
    </div>
  )
}

export default Create
