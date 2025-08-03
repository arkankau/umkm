"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NavDash from '@/components/dashboardnav'
import supabaseClient from '@/app/lib/supabase'
import { User } from '@supabase/supabase-js'
import BusinessForm from '@/components/BusinessForm'
import BusinessProfileForm from '@/components/BusinessProfileForm'



const Create = () => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-button mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center'>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-button mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <NavDash/>
      <div className="section px-15 py-8">
        <h1 className='font-mont font-bold text-3xl mb-8 text-center'>Business Management</h1>
        
        {/* Two Feature Sections */}
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Business Profile Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className='font-mont font-bold text-2xl mb-2'>Business Profile</h2>
              <p className='text-gray-600 font-inter'>Create and manage your business information, products, and settings</p>
            </div>
            <BusinessProfileForm />
          </div>

          {/* Website Generation Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className='font-mont font-bold text-2xl mb-2'>Website Generation</h2>
              <p className='text-gray-600 font-inter'>Generate a professional website for your business using AI</p>
            </div>
            <BusinessForm />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Create;
