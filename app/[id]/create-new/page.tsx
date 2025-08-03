"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NavDash from '@/components/dashboardnav'
import supabaseClient from '@/app/lib/supabase'
import BusinessForm from '@/components/BusinessForm'

const Create = () => {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

    if (!user) {
    return null
  }

  return (
    <div>
      <NavDash/>
      <div className="section px-15 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className='font-mont font-bold text-3xl mb-6 text-center'>Buat Website UMKM Anda</h1>
          <p className="text-gray-600 text-center mb-8">
            Isi formulir di bawah ini untuk membuat website profesional untuk bisnis Anda
          </p>
          <BusinessForm />
        </div>
      </div>
    </div>
  )
}

export default Create
