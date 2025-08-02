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
  const router = useRouter();

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
    <div className='min-h-screen flex flex-col font-inter'>
      <div className="px-15 pt-10 relative z-10">
        <Link href='/'><h1 className='font-mont text-2xl font-bold '>OneStopUMKM</h1></Link>
      </div>
      <div className="section flex flex-col -mt-3 items-center justify-center flex-1 gap-3 px-15">
            <h1 className='font-bold font-mont text-center text-2xl'>Welcome Back</h1>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded w-[19rem] text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-3">
              <div className="flex flex-col gap-2 mx-auto">
                  <h3 className='text-sm'>Email</h3>
                  <input 
                    className='bg-white border-[1.6] w-[19rem] h-[2rem] border-stroke rounded-sm outline-none px-2' 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
              </div>
              <div className="flex flex-col gap-2 mx-auto">
                  <h3 className='text-sm'>Password</h3>
                  <input 
                    className='bg-white border-[1.6] w-[19rem] h-[2rem] border-stroke rounded-sm outline-none px-2' 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
              </div>
              <div className="flex flex-col mt-4 mx-auto">
                  <button 
                    type="submit"
                    disabled={loading}
                    className='bg-button text-white flex items-center text-sm justify-center font-mont w-[19rem] text-center h-[2rem] rounded-sm hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {loading ? 'Signing in...' : 'Continue'}
                  </button>
              </div>
            </form>

            <h3 className='text-center font-mont text-sm'>OR</h3>
            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className='bg-[#A8CBFF] flex flex-col justify-center items-center font-mont text-sm mx-auto w-[19rem] h-[2rem] rounded-sm hover:bg-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
                {loading ? 'Loading...' : 'Continue with Google'}
            </button>
            <h3 className='text-xs font-mont text-center'>Don't have an account? <Link className='text-blue-400 hover:text-blue-600' href='/signup'>Sign up</Link></h3>
        </div>
    </div>
  )
}

export default Login
