import EleventyService from '../services/eleventy-service';
import { BusinessData } from '../types/business';

async function generateExampleSite() {
  // Initialize the Eleventy service
  const eleventyService = new EleventyService('templates', '_site');

  // Example business data for a restaurant
  const restaurantData: BusinessData = {
    id: 'restaurant-001',
    name: 'Warung Makan Sederhana',
    tagline: 'Nikmati hidangan lezat dengan cita rasa autentik',
    description: 'Warung makan tradisional yang menyajikan berbagai hidangan Indonesia dengan cita rasa yang memukau. Berdiri sejak 2010, kami berkomitmen untuk memberikan pengalaman makan yang nyaman dan lezat.',
    phone: '08123456789',
    whatsapp: '628123456789',
    email: 'info@warungsederhana.com',
    address: 'Jl. Sudirman No. 123, Jakarta Pusat',
    opening_hours: 'Senin - Minggu: 06:00 - 22:00',
    subdomain: 'warung-sederhana',
    
    // Restaurant-specific data
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

  try {
    console.log('🚀 Starting site generation...');
    
    // Generate the site
    const result = await eleventyService.generateSite(restaurantData, 'restaurant');
    
    if (result.success) {
      console.log('✅ Site generated successfully!');
      console.log(`📍 Site URL: ${result.siteUrl}`);
      console.log(`📁 Generated files: ${result.files?.length || 0} files`);
    } else {
      console.error('❌ Site generation failed:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Error during site generation:', error);
  }
}

// Example for retail business
async function generateRetailSite() {
  const eleventyService = new EleventyService('templates', '_site');

  const retailData: BusinessData = {
    id: 'retail-001',
    name: 'Toko Fashion Trendy',
    tagline: 'Temukan gaya fashion terbaru dengan harga terjangkau',
    description: 'Toko fashion yang menyediakan berbagai pakaian trendy untuk pria dan wanita. Kami berkomitmen memberikan produk berkualitas dengan harga yang ramah di kantong.',
    phone: '08123456789',
    whatsapp: '628123456789',
    email: 'info@fashiontrendy.com',
    address: 'Jl. Thamrin No. 45, Jakarta Pusat',
    opening_hours: 'Senin - Sabtu: 10:00 - 21:00, Minggu: 12:00 - 20:00',
    subdomain: 'fashion-trendy',
    
    products: [
      {
        name: 'Kemeja Pria Casual',
        description: 'Kemeja pria dengan bahan katun yang nyaman',
        price: 150000,
        image: '/images/kemeja-pria.jpg',
        available: true,
        ecommerce_links: [
          {
            platform: 'Shopee',
            url: 'https://shopee.co.id/kemeja-pria'
          },
          {
            platform: 'Tokopedia',
            url: 'https://tokopedia.com/kemeja-pria'
          }
        ]
      },
      {
        name: 'Dress Wanita Elegant',
        description: 'Dress wanita dengan desain yang elegan',
        price: 250000,
        image: '/images/dress-wanita.jpg',
        available: true,
        ecommerce_links: [
          {
            platform: 'Shopee',
            url: 'https://shopee.co.id/dress-wanita'
          }
        ]
      }
    ],
    
    services: [
      {
        name: 'Konsultasi Fashion',
        description: 'Layanan konsultasi untuk membantu Anda memilih pakaian yang tepat',
        icon: '💬',
        price: 'Gratis',
        contact_info: {
          phone: '08123456789'
        }
      },
      {
        name: 'Pengiriman',
        description: 'Layanan pengiriman ke seluruh Indonesia',
        icon: '🚚',
        price: 'Mulai Rp 15.000',
        contact_info: {
          phone: '08123456789'
        }
      }
    ],
    
    ecommerce_links: [
      {
        name: 'Shopee',
        url: 'https://shopee.co.id/fashiontrendy',
        icon: '🛒',
        description: 'Toko online di Shopee'
      },
      {
        name: 'Tokopedia',
        url: 'https://tokopedia.com/fashiontrendy',
        icon: '🛍️',
        description: 'Toko online di Tokopedia'
      }
    ],
    
    social_links: {
      instagram: 'https://instagram.com/fashiontrendy',
      facebook: 'https://facebook.com/fashiontrendy'
    }
  };

  try {
    console.log('🚀 Starting retail site generation...');
    
    const result = await eleventyService.generateSite(retailData, 'retail');
    
    if (result.success) {
      console.log('✅ Retail site generated successfully!');
      console.log(`📍 Site URL: ${result.siteUrl}`);
    } else {
      console.error('❌ Retail site generation failed:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Error during retail site generation:', error);
  }
}

// Example for service business
async function generateServiceSite() {
  const eleventyService = new EleventyService('templates', '_site');

  const serviceData: BusinessData = {
    id: 'service-001',
    name: 'Digital Marketing Pro',
    tagline: 'Layanan profesional untuk memenuhi kebutuhan digital marketing Anda',
    description: 'Konsultan digital marketing yang membantu bisnis Anda berkembang di era digital. Kami menyediakan layanan strategi marketing, social media management, dan content creation.',
    phone: '08123456789',
    whatsapp: '628123456789',
    email: 'info@digitalmarketingpro.com',
    address: 'Jl. Gatot Subroto No. 67, Jakarta Selatan',
    opening_hours: 'Senin - Jumat: 09:00 - 18:00',
    subdomain: 'digital-marketing-pro',
    
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
        ],
        contact_info: {
          phone: '08123456789'
        }
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
        ],
        contact_info: {
          phone: '08123456789'
        }
      }
    ],
    
    testimonials: [
      {
        name: 'Ahmad Rahman',
        position: 'CEO, PT Maju Bersama',
        message: 'Layanan yang sangat profesional dan hasil yang memuaskan. Sangat direkomendasikan!',
        rating: 5,
        avatar: '/images/testimonial1.jpg'
      },
      {
        name: 'Sarah Wijaya',
        position: 'Pemilik, Toko Sarah',
        message: 'Tim yang responsif dan hasil kerja yang berkualitas tinggi.',
        rating: 5,
        avatar: '/images/testimonial2.jpg'
      }
    ],
    
    why_choose_us: [
      {
        icon: '⭐',
        title: 'Berpengalaman',
        description: 'Tim kami memiliki pengalaman lebih dari 5 tahun di industri ini'
      },
      {
        icon: '🎯',
        title: 'Fokus pada Hasil',
        description: 'Kami berkomitmen untuk memberikan hasil yang terbaik'
      }
    ],
    
    social_links: {
      instagram: 'https://instagram.com/digitalmarketingpro',
      facebook: 'https://facebook.com/digitalmarketingpro',
      linkedin: 'https://linkedin.com/company/digitalmarketingpro'
    }
  };

  try {
    console.log('🚀 Starting service site generation...');
    
    const result = await eleventyService.generateSite(serviceData, 'service');
    
    if (result.success) {
      console.log('✅ Service site generated successfully!');
      console.log(`📍 Site URL: ${result.siteUrl}`);
    } else {
      console.error('❌ Service site generation failed:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Error during service site generation:', error);
  }
}

// Run examples
async function runExamples() {
  console.log('🎯 UMKM Go Digital - Site Generation Examples\n');
  
  await generateExampleSite();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await generateRetailSite();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await generateServiceSite();
  
  console.log('\n✅ All examples completed!');
}

// Export for use in other files
export {
  generateExampleSite,
  generateRetailSite,
  generateServiceSite,
  runExamples
};

// Run if this file is executed directly
if (require.main === module) {
  runExamples().catch(console.error);
} 