import React from 'react'
import Navbar from '@/components/navbar'
import Link from 'next/link'

const Features = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-bg via-purple-50 to-blue-50 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-400 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-yellow-300 opacity-15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-300 opacity-10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-20">
        <Navbar />
      </div>

      {/* Hero Section */}
      <div className="hero px-4 md:px-15 flex flex-col items-center justify-center mt-8 text-center relative z-10">
        <h1 className="font-mont font-bold text-4xl md:text-5xl leading-tight mb-6 max-w-4xl">
          Powerful Features for <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-yellow-500">Modern Businesses</span>
        </h1>
        
        <p className="font-inter text-lg text-gray-600 mb-12 max-w-2xl leading-relaxed">
          Everything you need to create, manage, and grow your online presence. No technical expertise required.
        </p>
      </div>

      {/* Demo Video Section - Mock */}
      <div className="demo-section px-4 md:px-15 py-16 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-mont font-bold text-3xl mb-4">See It In Action</h2>
            <p className="font-inter text-xl text-gray-600">Watch how easy it is to build your website</p>
          </div>
          
          {/* Mock Video Player */}
          <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-green-700 transition-colors cursor-pointer">
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <h3 className="font-mont font-semibold text-xl text-gray-700 mb-2">Demo Video</h3>
                <p className="font-inter text-gray-500">3 minutes to website success</p>
              </div>
            </div>
            
            {/* Video Controls Mock */}
            <div className="bg-white p-4 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="font-inter text-sm text-gray-600">Live Demo Available</span>
                <div className="ml-auto text-sm text-gray-500 font-inter">3:24</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="features-section px-4 md:px-15 py-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-mont font-bold text-4xl mb-4">Everything You Need to Succeed</h2>
            <p className="font-inter text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform takes care of the technical details so you can focus on growing your business
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="feature-card p-6">
              <h3 className="font-mont font-semibold text-lg mb-2">Lightning Fast Setup</h3>
              <p className="font-inter text-gray-600 text-sm leading-relaxed">
                Get your professional website live in under 3 minutes. Our AI-powered builder handles all the technical work for you.
              </p>
            </div>

            <div className="feature-card p-6">
              <h3 className="font-mont font-semibold text-lg mb-2">Mobile-First Design</h3>
              <p className="font-inter text-gray-600 text-sm leading-relaxed">
                Every website is automatically optimized for mobile, tablet, and desktop. Your customers get a perfect experience on any device.
              </p>
            </div>


            <div className="feature-card p-6">
              <h3 className="font-mont font-semibold text-lg mb-2">Customer Support</h3>
              <p className="font-inter text-gray-600 text-sm leading-relaxed">
                24/7 support from real humans. Get help when you need it with our responsive customer success team.
              </p>
            </div>

            <div className="feature-card p-6">
              <h3 className="font-mont font-semibold text-lg mb-2">AI Marketing Consultant</h3>
              <p className="font-inter text-gray-600 text-sm leading-relaxed">
                Get expert digital marketing advice from our AI consultant. Covers social media, SEO, content marketing, and more.
              </p>
              <Link href="/marketing-consultant" className="inline-block mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm">
                Try Marketing AI →
              </Link>
            </div>


          </div>
        </div>
      </div>

      <div className="cta-section px-4 md:px-15 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/50">
            <h2 className="font-mont font-bold text-4xl mb-6">
              Ready to Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Dream Website?</span>
            </h2>
            <p className="font-inter text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join businesses who&apos;ve already transformed their online presence with Untuk Mu Karya Mu.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login" className="bg-button font-mont rounded-2xl px-8 py-4 text-white text-lg font-semibold hover:bg-black transition-colors duration-300 shadow-lg hover:shadow-xl">
                Start Building Free
              </Link>
            </div>
            
            <div className="flex items-center justify-center gap-8 mt-8 text-sm text-gray-500 font-inter">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Free forever plan</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Features
