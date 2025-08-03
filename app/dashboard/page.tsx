'use client'
import React, { useState, useEffect } from 'react'
import NavDash from '@/components/dashboardnav'
import Link from "next/link";
import Card from '@/components/card';
import { useRouter } from 'next/navigation';
import supabaseClient from '@/app/lib/supabase';

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
  };
}

interface Business {
  id: string;
  businessName: string;
  ownerName: string;
  description: string;
  category: string;
  products: string;
  phone: string;
  email?: string;
  address: string;
  whatsapp?: string;
  instagram?: string;
  logoUrl?: string;
  websiteUrl?: string;
  subdomain?: string;
  status: string;
  createdAt: number;
  deployedAt?: number;
  updatedAt: number;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [businessesLoading, setBusinessesLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabaseClient.auth.getUser();
        
        if (error || !user) {
          router.push('/login');
          return;
        }
        
        setUser(user);
        await fetchBusinesses();
      } catch (error) {
        console.error('Error checking auth state:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          router.push('/login');
        } else if (session?.user) {
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  const fetchBusinesses = async () => {
    try {
      setBusinessesLoading(true);
      const response = await fetch('/api/list-businesses');
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        // If it's a database error, show a helpful message
        if (errorData.error === 'Database Error') {
          console.log('Database table not set up yet. Please run the SQL script in Supabase dashboard.');
        }
        setBusinesses([]);
        return;
      }
      
      const data = await response.json();
      setBusinesses(data.businesses || []);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      setBusinesses([]);
    } finally {
      setBusinessesLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabaseClient.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

    // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center'>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-button mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center'>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-button mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || 'User';
  const userEmail = user.email || 'No email provided';

  return (
    <div>
      <NavDash/>
      <div className="profile flex flex-col sm:flex-row gap-4 sm:gap-3 items-center sm:items-center justify-center sm:justify-start px-4 sm:px-8 lg:px-15 py-6">
        <div className="image rounded-full bg-gradient-to-br from-purple-400 to-blue-500 w-20 h-20 flex items-center justify-center text-white font-mont font-bold text-xl">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div className="information font-mont text-center sm:text-left">
            <h2 className='text-lg font-bold'>{displayName}</h2>
            <h3 className='text-sm mb-2 sm:mb-1 text-gray-600'>{userEmail}</h3>
            <div className="flex gap-2 flex-col sm:flex-row">
              <Link className='px-4 py-1 bg-button text-white rounded-lg text-xs hover:bg-black transition-colors' href='/settings'>Settings</Link>
              <button 
                onClick={handleSignOut}
                className='px-4 py-1 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 transition-colors'
              >
                Sign Out
              </button>
            </div>
        </div>
      </div>
      <div className="dashboard max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 sm:px-8 lg:px-15 py-8 md:justify-items-start justify-items-center">
        {businessesLoading ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-button mx-auto mb-4"></div>
              <p className="text-gray-600 font-inter">Loading your businesses...</p>
            </div>
          </div>
        ) : (
          <>
            {businesses.map((business) => (
              <Card 
                key={business.id}
                name={business.businessName} 
                url={business.websiteUrl || `www.onestop.com/${business.subdomain || business.businessName.toLowerCase().replace(/\s+/g, '-')}`}
                preview='/image.png'
              />
            ))}
            <Link href='/id/create-new' className='group cursor-pointer w-[15rem] h-[16rem] bg-white/60 backdrop-blur-sm rounded-2xl relative overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border-2 border-dashed border-gray-300/50 flex flex-col justify-center items-center hover:border-purple-300/50 hover:bg-purple-50/30'>
              <div className='text-4xl text-gray-400 mb-3 group-hover:text-purple-400 transition-colors'>+</div>
              <p className='text-gray-500 font-inter font-medium group-hover:text-purple-600 transition-colors'>Add New</p>
            </Link>
          </>
        )}
        
        {!businessesLoading && businesses.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="font-mont font-semibold text-lg text-gray-600 mb-2">No businesses yet</h3>
            <p className="text-gray-500 font-inter mb-6">Create your first business website to get started!</p>
            <div className="space-y-3">
              <Link href='/id/create-new' className="inline-block bg-button text-white px-6 py-3 rounded-lg font-mont font-semibold hover:bg-black transition-colors">
                Create Your First Website
              </Link>
              <div className="text-xs text-gray-400 mt-4">
                💡 If you&apos;re seeing database errors, make sure to run the SQL setup script in your Supabase dashboard
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
