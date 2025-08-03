'use client';

import Image from "next/image";
import Navbar from "@/components/navbar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-bg via-purple-50 to-blue-50 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#C6AFFF] opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-blue-300 opacity-15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-300 opacity-10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-20">
        <Navbar/>
      </div>

      <div className="hero px-15 flex flex-col items-center justify-center mt-3 text-center relative z-10">
        
        <h1 className="font-mont font-bold text-5xl leading-tight mb-6 max-w-4xl">
          <span className="text-black">Untuk Mu</span> <span className="text-yellow-500">Karya Mu</span> <br />
          <span className="text-green-600">Create stunning websites</span> <br />for your  
          business in <br /> <span className="bg-yellow-500 text-black px-2 py-1 rounded-lg">3 minutes</span>
        </h1>
        
        <p className="font-inter text-lg text-gray-600 mb-8 max-w-2xl leading-relaxed">
          Join businesses who&apos;ve transformed their online presence with our AI-powered website builder. No technical skills needed.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <button 
            onClick={() => document.getElementById('create-website')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-green-600 font-mont rounded-2xl px-8 py-4 text-white text-lg font-semibold hover:bg-green-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            Start Building Free
          </button>
          <Link href="/features" className="border-2 border-yellow-500 font-mont rounded-2xl px-8 py-4 text-black text-lg font-semibold hover:bg-yellow-500 hover:text-black transition-colors duration-300">
            See How It Works
          </Link>
          <Link href="/marketing-consultant" className="bg-gradient-to-r from-yellow-500 to-red-500 font-mont rounded-2xl px-8 py-4 text-white text-lg font-semibold hover:from-yellow-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl">
            Get Marketing Advice
          </Link>
        </div>

        <div className="flex items-center gap-8 text-sm text-gray-500 font-inter">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span>24/7 support</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span>No code</span>
          </div>
        </div>
      </div>

      <div id="features" className="px-15 py-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-mont font-bold text-4xl mb-4">Everything you need to succeed online</h2>
          <p className="font-inter text-xl text-gray-600 max-w-2xl mx-auto">
            Our platform handles the technical stuff so you can focus on growing your business
          </p>
        </div>

        <div className="flex flex-col justify-center items-center gap-6 max-w-2xl mx-auto">
          <div className="flex justify-center gap-4 p-4">
            <div className="text-center">
              <h3 className="font-mont font-semibold text-lg mb-2">Lightning Fast Setup</h3>
              <p className="font-inter text-gray-600 text-sm">
                Get your professional website live in under 3 minutes.
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-4 p-4">
            <div className="text-center">
              <h3 className="font-mont font-semibold text-lg mb-2">Mobile-First Design</h3>
              <p className="font-inter text-gray-600 text-sm">
                Automatically optimized for mobile, tablet, and desktop.
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-4 p-4">
            <div className="text-center">
              <h3 className="font-mont font-semibold text-lg mb-2">Built for Conversions</h3>
              <p className="font-inter text-gray-600 text-sm">
                Every element is designed to turn visitors into customers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div id="create-website" className="px-15 py-20 relative z-10 bg-white">
        <div className="text-center mb-16">
          <h2 className="font-mont font-bold text-4xl mb-4">Create Your Website Now</h2>
          <p className="font-inter text-xl text-gray-600 max-w-2xl mx-auto">
            Get your AI-generated website in minutes with our professional form
          </p>
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <Link 
            href="/id/create-new" 
            className="inline-block bg-green-600 font-mont rounded-2xl px-8 py-4 text-white text-lg font-semibold hover:bg-green-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            Start Creating Your Website
          </Link>
          <p className="mt-4 text-gray-600">
            You&apos;ll need to log in first to access the website creation form
          </p>
        </div>
      </div>

    </div>
  );
}
