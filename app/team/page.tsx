import React from 'react'
import Navbar from '@/components/navbar'

const Team = () => {
  const teamMembers = [
    {
      name: 'Arkan',
      role: 'Product Manager & UX Designer',
      description: 'Passionate about creating intuitive user experiences and driving product strategy. Leads the vision for user-centered design and ensures our platform meets the needs of Indonesian UMKM businesses.',
      image: '/image.png', // You can replace with actual photos
      skills: ['Product Strategy', 'UX Design', 'User Research', 'Agile Management'],
      social: {
        linkedin: '#',
        github: '#',
        email: 'arkan@untukmukaryamu.com'
      }
    },
    {
      name: 'Clarissa',
      role: 'Full Stack Developer & Tech Lead',
      description: 'Experienced developer with expertise in modern web technologies. Leads the technical architecture and ensures robust, scalable solutions for our platform.',
      image: '/image.png', // You can replace with actual photos
      skills: ['React/Next.js', 'Node.js', 'TypeScript', 'AI Integration'],
      social: {
        linkedin: '#',
        github: '#',
        email: 'clarissa@untukmukaryamu.com'
      }
    },
    {
      name: 'Austin',
      role: 'AI Engineer & Backend Developer',
      description: 'Specializes in AI/ML integration and backend development. Focuses on creating intelligent solutions that power our website generation and marketing AI features.',
      image: '/image.png', // You can replace with actual photos
      skills: ['Machine Learning', 'Python', 'API Development', 'AI Integration'],
      social: {
        linkedin: '#',
        github: '#',
        email: 'austin@untukmukaryamu.com'
      }
    }
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <div className="px-15 py-16 text-center">
        <h1 className="font-mont font-bold text-4xl md:text-5xl mb-6">
          Meet Our <span className="text-green-600">Team</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto font-inter">
          We&apos;re a passionate team dedicated to empowering Indonesian UMKM businesses with cutting-edge technology and digital solutions.
        </p>
      </div>

      {/* Team Grid */}
      <div className="px-15 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Profile Image */}
                <div className="relative h-64 bg-gradient-to-br from-green-100 to-yellow-100">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center">
                      <span className="text-4xl font-bold text-gray-600">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Profile Content */}
                <div className="p-6">
                  <h3 className="font-mont font-bold text-xl mb-1 text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-green-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {member.description}
                  </p>

                  {/* Skills */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {member.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
                    <a
                      href={member.social.linkedin}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      title="LinkedIn"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                    <a
                      href={member.social.github}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="GitHub"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                    <a
                      href={`mailto:${member.social.email}`}
                      className="text-gray-400 hover:text-green-600 transition-colors"
                      title="Email"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="px-15 py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-mont font-bold text-3xl mb-6">
            Our <span className="text-green-600">Mission</span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed font-inter">
            We believe every Indonesian UMKM business deserves access to professional digital tools. 
            Our team combines expertise in design, development, and AI to create solutions that empower 
            local businesses to thrive in the digital economy.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Team
