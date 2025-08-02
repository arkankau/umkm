'use client'
import React, { useState } from 'react'
import Link from "next/link";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <div className='py-10 px-4 md:px-15 font-mont relative'>
      {/* Desktop & Mobile Header */}
      <div className='flex items-center justify-between'>
        <Link className='text-xl font-bold hover:text-[#C6AFFF] transition-colors duration-300' href=''>
          OneStopUMKM
        </Link>
        
        {/* Desktop Navigation */}
        <div className='hidden md:flex items-center gap-15 absolute left-1/2 transform -translate-x-1/2'>
          <Link className='mx-4 font-normal text-md hover:text-[#C6AFFF] transition-colors duration-300' href='/'>
            Home
          </Link>
          <Link className='mx-4 text-md hover:text-[#C6AFFF] transition-colors duration-300' href='/features'>
            Features
          </Link>
          <Link className='mx-4 text-md hover:text-[#C6AFFF] transition-colors duration-300' href='/team'>
            Team
          </Link>
        </div>

        {/* Desktop Login Button */}
        <Link href='/login' className='hidden md:block px-7 bg-button text-white py-2 rounded-lg text-md hover:bg-opacity-80 hover:scale-105 transition-all duration-300'>
          Login
        </Link>

        {/* Mobile Hamburger Button */}
        <button 
          onClick={toggleMenu}
          className='md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none'
          aria-label='Toggle menu'
        >
          <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className='md:hidden absolute top-full left-0 right-0 z-[9999] bg-white shadow-lg border-t border-gray-200 animate-fadeIn'>
          <div className='flex flex-col p-4 space-y-3'>
            <Link 
              className='text-lg font-normal hover:text-[#C6AFFF] transition-colors duration-300 py-3 px-2 hover:bg-gray-50 rounded-lg' 
              href='/'
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link 
              className='text-lg hover:text-[#C6AFFF] transition-colors duration-300 py-3 px-2 hover:bg-gray-50 rounded-lg' 
              href='/features'
              onClick={closeMenu}
            >
              Features
            </Link>
            <Link 
              className='text-lg hover:text-[#C6AFFF] transition-colors duration-300 py-3 px-2 hover:bg-gray-50 rounded-lg' 
              href='/team'
              onClick={closeMenu}
            >
              Team
            </Link>
            <div className='border-t border-gray-200 pt-3 mt-3'>
              <Link 
                href='/login' 
                className='block w-full px-6 bg-button text-white py-3 rounded-lg text-center hover:bg-opacity-80 transition-all duration-300'
                onClick={closeMenu}
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar
