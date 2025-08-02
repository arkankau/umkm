'use client'
import React, { useState, useEffect } from 'react'
import Link from "next/link";
import { useRouter } from 'next/navigation';
import supabaseClient from '@/app/lib/supabase';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess('Account created successfully! Please check your email to verify your account. Redirecting to login...');
        // Clear form
        setFullName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        // Redirect to login after successful signup
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
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
      setError('Failed to sign up with Google');
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
            <h1 className='font-bold font-mont text-center text-2xl'>Create Your Account</h1>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded w-[19rem] text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded w-[19rem] text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSignup} className="flex flex-col gap-3">
              <div className="flex flex-col gap-2 mx-auto">
                  <h3 className='text-sm'>Full Name</h3>
                  <input 
                    className='bg-white border-[1.6] w-[19rem] h-[2rem] border-stroke rounded-sm outline-none px-2' 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    disabled={loading}
                  />
              </div>
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
                    minLength={6}
                  />
              </div>
              <div className="flex flex-col gap-2 mx-auto">
                  <h3 className='text-sm'>Confirm Password</h3>
                  <input 
                    className='bg-white border-[1.6] w-[19rem] h-[2rem] border-stroke rounded-sm outline-none px-2' 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
              </div>
            </form>

            <h3 className='text-center font-mont text-sm'>OR</h3>
            <button 
              onClick={handleGoogleSignup}
              disabled={loading}
              className='bg-[#A8CBFF] flex flex-col justify-center items-center font-mont text-sm mx-auto w-[19rem] h-[2rem] rounded-sm hover:bg-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
                {loading ? 'Loading...' : 'Continue with Google'}
            </button>
            <h3 className='text-xs font-mont text-center'>Already have an account? <Link className='text-blue-400 hover:text-blue-600' href='/login'>Sign in</Link></h3>
        </div>
    </div>
  )
}

export default Signup