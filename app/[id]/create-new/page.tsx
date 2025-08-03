"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NavDash from '@/components/dashboardnav'
import supabaseClient from '@/app/lib/supabase'
import { User } from '@supabase/supabase-js'
import BusinessForm from '@/components/BusinessForm'
import BusinessProfileForm from '@/components/BusinessProfileForm'
import EmbeddedMarketingBot from '@/components/EmbeddedMarketingBot'

const Create = () => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState<'profile' | 'website' | 'chatbot'>('profile')

  // Handle URL parameter for section
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const section = urlParams.get('section') as 'profile' | 'website' | 'chatbot';
      if (section && ['profile', 'website', 'chatbot'].includes(section)) {
        setActiveSection(section);
      }
    }
  }, []);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center'>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center'>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <NavDash/>
      <div className="section px-15 py-8">
        <h1 className='font-mont font-bold text-3xl mb-8 text-center'>Business Management Center</h1>
        
        {/* Navigation Tabs */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex justify-center space-x-2 bg-white rounded-xl p-2 shadow-sm">
            <button
              onClick={() => setActiveSection('profile')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeSection === 'profile'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Business Profile</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveSection('website')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeSection === 'website'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Website Deployment</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveSection('chatbot')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeSection === 'chatbot'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Marketing AI</span>
              </div>
            </button>
          </div>
        </div>

        {/* Content Sections */}
        <div className="max-w-6xl mx-auto">
          {/* Business Profile Section */}
          {activeSection === 'profile' && (
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className='font-mont font-bold text-2xl mb-2'>Business Profile</h2>
                <p className='text-gray-600 font-inter'>Create and manage your business information, products, and settings</p>
              </div>
              <BusinessProfileForm />
            </div>
          )}

          {/* Website Deployment Section */}
          {activeSection === 'website' && (
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className='font-mont font-bold text-2xl mb-2'>Website Deployment</h2>
                <p className='text-gray-600 font-inter'>Generate a professional website for your business using AI</p>
              </div>
              <BusinessForm />
            </div>
          )}

          {/* Marketing AI Chatbot Section */}
          {activeSection === 'chatbot' && (
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h2 className='font-mont font-bold text-2xl mb-2'>Marketing AI Consultant</h2>
                <p className='text-gray-600 font-inter'>Get expert digital marketing advice for your business</p>
              </div>
              <EmbeddedMarketingBot />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Create;
