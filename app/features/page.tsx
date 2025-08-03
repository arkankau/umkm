import React from 'react'
import Navbar from '@/components/navbar'
import Link from 'next/link'
import { 
  Zap, 
  Smartphone, 
  Headphones, 
  Bot, 
  Palette, 
  Globe, 
  Shield, 
  BarChart3, 
  Users, 
  Rocket,
  Sparkles,
  Target,
  MessageCircle,
  TrendingUp,
  Image,
  Database,
  Cloud,
  Lock
} from 'lucide-react'

const Features = () => {
  const features = [
    {
      icon: Rocket,
      title: "AI-Powered Website Generation",
      description: "Revolutionary 30-second website creation using advanced AI. Our system analyzes your business data and generates professional, fully-functional websites with custom templates, content, and branding - all without any technical knowledge required.",
      highlight: "🏆 Hackathon Winner: Instant Website Creation"
    },
    {
      icon: Bot,
      title: "Advanced AI Marketing Consultant",
      description: "World-class digital marketing AI powered by Gemini, GPT-4, and Claude. Get personalized marketing strategies, social media advice, SEO optimization, and content marketing plans tailored to your business type and budget.",
      highlight: "🤖 Multi-AI Powered Intelligence"
    },
    {
      icon: Palette,
      title: "Smart Logo Generation",
      description: "AI-driven logo creation with business-type color schemes and professional styling. Generates brand-appropriate logos instantly with advanced placeholder technology and automatic database integration.",
      highlight: "🎨 Instant Brand Identity Creation"
    },
    {
      icon: Globe,
      title: "Global EdgeOne Deployment",
      description: "Lightning-fast global deployment using Cloudflare EdgeOne Functions. Your website goes live instantly across 200+ countries with enterprise-grade performance, security, and reliability.",
      highlight: "⚡ Sub-Second Global Deployment"
    },
    {
      icon: Database,
      title: "Dual Database Architecture",
      description: "Revolutionary multi-table database system supporting both legacy and modern business data structures. Seamless migration and compatibility ensuring no business data is ever lost.",
      highlight: "🔄 Future-Proof Data Architecture"
    },
    {
      icon: Smartphone,
      title: "Mobile-First Responsive Design",
      description: "Every website automatically optimized for mobile, tablet, and desktop. Advanced responsive design with touch-friendly interfaces and lightning-fast loading speeds across all devices.",
      highlight: "📱 Perfect Mobile Experience"
    },
    {
      icon: Target,
      title: "Context-Aware AI Systems",
      description: "Intelligent AI that understands your business context - type, experience level, budget, and target audience. Provides hyper-personalized recommendations and solutions.",
      highlight: "🧠 Contextual Intelligence"
    },
    {
      icon: MessageCircle,
      title: "Embedded Marketing Bot",
      description: "Seamlessly integrated AI marketing consultant within your business dashboard. Get instant marketing advice, strategy recommendations, and growth insights without leaving your workspace.",
      highlight: "💬 In-Workflow AI Assistance"
    },
    {
      icon: TrendingUp,
      title: "Real-Time Analytics & Insights",
      description: "Advanced analytics dashboard with real-time performance metrics, customer behavior tracking, and actionable insights to optimize your business growth and marketing strategies.",
      highlight: "📊 Data-Driven Growth"
    },
    {
      icon: Shield,
      title: "Enterprise Security & Privacy",
      description: "Bank-level security with end-to-end encryption, GDPR compliance, and enterprise-grade data protection. Your business data is protected with military-grade security protocols.",
      highlight: "🔒 Enterprise Security"
    },
    {
      icon: Users,
      title: "Multi-User Business Management",
      description: "Advanced business management center with team collaboration, role-based access control, and comprehensive business profile management. Perfect for growing businesses and teams.",
      highlight: "👥 Team Collaboration Ready"
    },
    {
      icon: Cloud,
      title: "Serverless Cloud Architecture",
      description: "Cutting-edge serverless architecture using Next.js 15, Supabase, and EdgeOne Functions. Infinite scalability, zero maintenance, and 99.9% uptime guaranteed.",
      highlight: "☁️ Infinite Scalability"
    }
  ]

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
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-yellow-500 mr-2" />
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
            🏆 Hackathon-Winning Technology
          </span>
        </div>
        <h1 className="font-mont font-bold text-4xl md:text-5xl leading-tight mb-6 max-w-4xl">
          Revolutionary Features for <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-yellow-500">Digital Transformation</span>
        </h1>
        
        <p className="font-inter text-lg text-gray-600 mb-12 max-w-3xl leading-relaxed">
          Experience the future of business technology with our AI-powered platform. From instant website creation to intelligent marketing automation - everything you need to dominate the digital landscape.
        </p>
      </div>

      {/* Demo Video Section - Mock */}
      <div className="demo-section px-4 md:px-15 py-16 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-mont font-bold text-3xl mb-4">See the Magic in Action</h2>
            <p className="font-inter text-xl text-gray-600">Watch how AI transforms business creation in real-time</p>
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
                <h3 className="font-mont font-semibold text-xl text-gray-700 mb-2">AI Website Generation Demo</h3>
                <p className="font-inter text-gray-500">From idea to live website in 30 seconds</p>
              </div>
            </div>
            
            {/* Video Controls Mock */}
            <div className="bg-white p-4 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="font-inter text-sm text-gray-600">Live AI Demo Available</span>
                <div className="ml-auto text-sm text-gray-500 font-inter">0:30</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="features-section px-4 md:px-15 py-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-mont font-bold text-4xl mb-4">Cutting-Edge Technology Stack</h2>
            <p className="font-inter text-xl text-gray-600 max-w-3xl mx-auto">
              Built with the latest AI, cloud, and web technologies to deliver unprecedented business value and user experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="feature-card bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-mont font-bold text-xl text-gray-900">{feature.title}</h3>
                    <div className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full font-semibold mt-1">
                      {feature.highlight}
                    </div>
                  </div>
                </div>
                <p className="font-inter text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technology Stack Section */}
      <div className="tech-stack-section px-4 md:px-15 py-20 relative z-10 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-mont font-bold text-4xl mb-4">Powered by Cutting-Edge Tech</h2>
            <p className="font-inter text-xl text-gray-600 max-w-2xl mx-auto">
              Built with the most advanced technologies for maximum performance and scalability
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[
              { name: "Next.js 15", icon: "⚡", desc: "Latest React Framework" },
              { name: "Gemini AI", icon: "🤖", desc: "Advanced AI Models" },
              { name: "Supabase", icon: "🗄️", desc: "Real-time Database" },
              { name: "EdgeOne", icon: "🌐", desc: "Global CDN" },
              { name: "TypeScript", icon: "📝", desc: "Type Safety" },
              { name: "Tailwind CSS", icon: "🎨", desc: "Modern Styling" }
            ].map((tech, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-2">{tech.icon}</div>
                <h3 className="font-mont font-semibold text-lg text-gray-900">{tech.name}</h3>
                <p className="font-inter text-sm text-gray-600">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="cta-section px-4 md:px-15 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/50">
            <div className="flex items-center justify-center mb-6">
              <Rocket className="w-8 h-8 text-green-600 mr-2" />
              <h2 className="font-mont font-bold text-4xl">
                Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Revolutionize</span> Your Business?
              </h2>
            </div>
            <p className="font-inter text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join the future of business technology. Create, manage, and grow your digital presence with AI-powered tools that actually work.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login" className="bg-gradient-to-r from-green-600 to-blue-600 font-mont rounded-2xl px-8 py-4 text-white text-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                🚀 Start Your Digital Journey
              </Link>
              <Link href="/marketing-consultant" className="bg-white border-2 border-green-600 font-mont rounded-2xl px-8 py-4 text-green-600 text-lg font-semibold hover:bg-green-50 transition-all duration-300 shadow-lg hover:shadow-xl">
                🤖 Try AI Marketing
              </Link>
            </div>
            
            <div className="flex items-center justify-center gap-8 mt-8 text-sm text-gray-500 font-inter">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-green-500" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-500" />
                <span>30-Second Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-green-500" />
                <span>Global Deployment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Features
