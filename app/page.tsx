import Image from "next/image";
import Navbar from "@/components/navbar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br ">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#C6AFFF] opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-blue-300 opacity-15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-300 opacity-10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <Navbar/>
      </div>

      {/* Hero Section */}
      <div className="hero px-15 flex flex-col items-center justify-center mt-3 text-center relative z-10">
        
        <h1 className="font-mont font-bold text-5xl leading-tight mb-6 max-w-4xl">
          Create a <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">stunning website</span> <br />for your  
          business in <br /> <span className="bg-[#C6AFFF] px-2 py-1 rounded-lg">3 minutes</span>
        </h1>
        
        <p className="font-inter text-lg text-gray-600 mb-8 max-w-2xl leading-relaxed">
          Join thousands of small businesses who've transformed their online presence with our AI-powered website builder. No technical skills needed.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Link href="/login" className="bg-button font-mont rounded-2xl px-8 py-4 text-white text-lg font-semibold hover:bg-black transition-colors duration-300 shadow-lg hover:shadow-xl">
            Start Building Free
          </Link>
          <Link href="/features" className="border-2 border-gray-300 font-mont rounded-2xl px-8 py-4 text-gray-700 text-lg font-semibold hover:border-purple-400 hover:text-purple-600 transition-colors duration-300">
            See How It Works
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="flex items-center gap-8 text-sm text-gray-500 font-inter">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>24/7 support</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>No code</span>
          </div>
        </div>
      </div>

      {/* Features Section */}
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

    </div>
  );
}
