#!/usr/bin/env node

/**
 * Test the new integrated template system with color customization
 * Run with: node test-template-system.js
 */

import { loadTemplate, getAvailableThemes } from './src/utils/template-system.js';

// Sample business data for testing
const sampleBusinessData = {
  businessName: 'Warung Makan Sederhana',
  ownerName: 'Budi Santoso',
  description: 'Warung makan tradisional yang menyajikan berbagai hidangan Indonesia dengan cita rasa yang memukau. Berdiri sejak 2010, kami berkomitmen untuk memberikan pengalaman makan yang nyaman dan lezat.',
  category: 'restaurant',
  products: 'Nasi goreng, Mie goreng, Sate ayam, Es teh manis',
  phone: '08123456789',
  email: 'info@warungsederhana.com',
  address: 'Jl. Sudirman No. 123, Jakarta Pusat',
  whatsapp: '628123456789',
  instagram: 'warungsederhana',
  logoUrl: '/default-logo.png',
  
  // Enhanced data for new template system
  tagline: 'Nikmati hidangan lezat dengan cita rasa autentik',
  menu: [
    {
      name: 'Makanan Utama',
      items: [
        {
          name: 'Nasi Goreng Spesial',
          description: 'Nasi goreng dengan telur, ayam, dan sayuran segar',
          price: 25000,
          available: true
        },
        {
          name: 'Mie Goreng',
          description: 'Mie goreng dengan bumbu khas',
          price: 22000,
          available: true
        },
        {
          name: 'Sate Ayam',
          description: 'Sate ayam dengan bumbu kacang',
          price: 30000,
          available: true
        }
      ]
    },
    {
      name: 'Minuman',
      items: [
        {
          name: 'Es Teh Manis',
          description: 'Teh manis dingin',
          price: 5000,
          available: true
        },
        {
          name: 'Es Jeruk',
          description: 'Jeruk peras segar',
          price: 8000,
          available: true
        }
      ]
    }
  ],
  
  gallery: [
    {
      url: '/images/restaurant-interior.jpg',
      caption: 'Suasana warung makan'
    },
    {
      url: '/images/nasi-goreng.jpg',
      caption: 'Nasi Goreng Spesial'
    },
    {
      url: '/images/sate-ayam.jpg',
      caption: 'Sate Ayam'
    }
  ],
  
  delivery_apps: [
    {
      name: 'GoFood',
      link: 'https://gofood.co.id/warung-sederhana'
    },
    {
      name: 'GrabFood',
      link: 'https://food.grab.com/warung-sederhana'
    }
  ],
  
  social_links: {
    instagram: 'https://instagram.com/warungsederhana',
    facebook: 'https://facebook.com/warungsederhana'
  }
};

async function testTemplateSystem() {
  console.log('🎨 Testing Integrated Template System with Color Customization\n');
  
  // Test 1: Get available themes
  console.log('📋 Available Themes:');
  const themes = getAvailableThemes();
  Object.entries(themes).forEach(([key, name]) => {
    console.log(`   ${key}: ${name}`);
  });
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Test 2: Generate restaurant template with default theme
  console.log('🍽️  Testing Restaurant Template (Default Theme):');
  try {
    const defaultHtml = await loadTemplate('restaurant', sampleBusinessData);
    console.log('✅ Default theme generated successfully');
    console.log(`📄 HTML length: ${defaultHtml.length} characters`);
    
    // Save to file for inspection
    const fs = await import('fs');
    fs.writeFileSync('test-restaurant-default.html', defaultHtml);
    console.log('💾 Saved as: test-restaurant-default.html');
  } catch (error) {
    console.error('❌ Default theme failed:', error.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Test 3: Generate restaurant template with modern theme
  console.log('🎨 Testing Restaurant Template (Modern Theme):');
  try {
    const modernHtml = await loadTemplate('restaurant', sampleBusinessData, 'modern');
    console.log('✅ Modern theme generated successfully');
    console.log(`📄 HTML length: ${modernHtml.length} characters`);
    
    // Save to file for inspection
    const fs = await import('fs');
    fs.writeFileSync('test-restaurant-modern.html', modernHtml);
    console.log('💾 Saved as: test-restaurant-modern.html');
  } catch (error) {
    console.error('❌ Modern theme failed:', error.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Test 4: Generate retail template with elegant theme
  console.log('🛍️  Testing Retail Template (Elegant Theme):');
  try {
    const retailData = {
      ...sampleBusinessData,
      category: 'retail',
      tagline: 'Temukan produk berkualitas dengan harga terbaik',
      products: [
        {
          name: 'Kemeja Pria Casual',
          description: 'Kemeja pria dengan bahan katun yang nyaman',
          price: 150000,
          image: '/images/kemeja-pria.jpg',
          available: true
        },
        {
          name: 'Dress Wanita Elegant',
          description: 'Dress wanita dengan desain yang elegan',
          price: 250000,
          image: '/images/dress-wanita.jpg',
          available: true
        }
      ]
    };
    
    const elegantHtml = await loadTemplate('retail', retailData, 'elegant');
    console.log('✅ Elegant theme generated successfully');
    console.log(`📄 HTML length: ${elegantHtml.length} characters`);
    
    // Save to file for inspection
    const fs = await import('fs');
    fs.writeFileSync('test-retail-elegant.html', elegantHtml);
    console.log('💾 Saved as: test-retail-elegant.html');
  } catch (error) {
    console.error('❌ Elegant theme failed:', error.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Test 5: Generate service template with vibrant theme
  console.log('💼 Testing Service Template (Vibrant Theme):');
  try {
    const serviceData = {
      ...sampleBusinessData,
      category: 'service',
      tagline: 'Layanan profesional untuk memenuhi kebutuhan Anda',
      services: [
        {
          name: 'Konsultasi Digital Marketing',
          description: 'Layanan konsultasi untuk mengembangkan strategi digital marketing',
          icon: '💼',
          price: 500000,
          features: [
            'Analisis bisnis',
            'Strategi pengembangan',
            'Laporan komprehensif',
            'Follow-up 1 bulan'
          ]
        },
        {
          name: 'Social Media Management',
          description: 'Layanan pengelolaan social media untuk bisnis Anda',
          icon: '📱',
          price: 1000000,
          features: [
            'Content creation',
            'Posting schedule',
            'Engagement management',
            'Analytics report'
          ]
        }
      ],
      testimonials: [
        {
          name: 'Ahmad Rahman',
          position: 'CEO, PT Maju Bersama',
          message: 'Layanan yang sangat profesional dan hasil yang memuaskan. Sangat direkomendasikan!',
          rating: 5
        },
        {
          name: 'Sarah Wijaya',
          position: 'Pemilik, Toko Sarah',
          message: 'Tim yang responsif dan hasil kerja yang berkualitas tinggi.',
          rating: 5
        }
      ]
    };
    
    const vibrantHtml = await loadTemplate('service', serviceData, 'vibrant');
    console.log('✅ Vibrant theme generated successfully');
    console.log(`📄 HTML length: ${vibrantHtml.length} characters`);
    
    // Save to file for inspection
    const fs = await import('fs');
    fs.writeFileSync('test-service-vibrant.html', vibrantHtml);
    console.log('💾 Saved as: test-service-vibrant.html');
  } catch (error) {
    console.error('❌ Vibrant theme failed:', error.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Test 6: Test minimal theme
  console.log('⚪ Testing Minimal Theme:');
  try {
    const minimalHtml = await loadTemplate('restaurant', sampleBusinessData, 'minimal');
    console.log('✅ Minimal theme generated successfully');
    console.log(`📄 HTML length: ${minimalHtml.length} characters`);
    
    // Save to file for inspection
    const fs = await import('fs');
    fs.writeFileSync('test-restaurant-minimal.html', minimalHtml);
    console.log('💾 Saved as: test-restaurant-minimal.html');
  } catch (error) {
    console.error('❌ Minimal theme failed:', error.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  console.log('🎉 Template System Testing Completed!');
  console.log('\n📁 Generated files:');
  console.log('   - test-restaurant-default.html');
  console.log('   - test-restaurant-modern.html');
  console.log('   - test-retail-elegant.html');
  console.log('   - test-service-vibrant.html');
  console.log('   - test-restaurant-minimal.html');
  
  console.log('\n💡 Open these files in a browser to see the different themes in action!');
}

// Run the test
testTemplateSystem().catch(console.error); 