'use client'
import React, { useState, useEffect } from 'react'
import Link from "next/link";
import { useRouter } from 'next/navigation';
import supabaseClient from '@/app/lib/supabase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (user) {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
      } finally {
        setChecking(false);
      }
    };

    checkUser();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) {
        setError(error.message);
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to sign in with Google');
      setLoading(false);
    }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className='min-h-screen flex flex-col font-inter items-center justify-center'>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-button mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (checking) {
    return (
      <div className='min-h-screen flex flex-col font-inter items-center justify-center'>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-button mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex flex-col font-inter bg-gray-50'>
      <div className="px-15 pt-10 relative z-10">
        <Link href='/'><h1 className='font-mont text-2xl font-bold'><span className="text-black">Untuk Mu</span> <span className="text-yellow-500">Karya Mu</span></h1></Link>
      </div>
      <div className="section flex flex-col -mt-3 items-center justify-center flex-1 gap-6 px-15">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
              <h1 className='font-bold font-mont text-center text-2xl mb-6'>Welcome Back</h1>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h3 className='text-sm font-medium text-gray-700'>Email</h3>
                    <input 
                      className='bg-white border border-gray-300 w-full h-12 rounded-lg outline-none px-3 focus:ring-2 focus:ring-green-500 focus:border-transparent' 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className='text-sm font-medium text-gray-700'>Password</h3>
                    <input 
                      className='bg-white border border-gray-300 w-full h-12 rounded-lg outline-none px-3 focus:ring-2 focus:ring-green-500 focus:border-transparent' 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                </div>
                <div className="flex flex-col mt-4">
                    <button 
                      type="submit"
                      disabled={loading}
                      className='bg-green-600 text-white flex items-center text-sm justify-center font-mont w-full text-center h-12 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium'
                    >
                      {loading ? 'Signing in...' : 'Continue'}
                    </button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">OR</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleGoogleLogin}
                disabled={loading}
                className='bg-white border border-gray-300 flex flex-col justify-center items-center font-mont text-sm mx-auto w-full h-12 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4'
              >
                  {loading ? 'Loading...' : 'Continue with Google'}
              </button>
              <h3 className='text-xs font-mont text-center mt-6 text-gray-600'>Don&apos;t have an account? <Link className='text-green-600 hover:text-green-700 font-medium' href='/signup'>Sign up</Link></h3>
            </div>
        </div>
    </div>
  )
}

export default Login
