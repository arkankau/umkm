'use client';

import GuideOutput from '@/components/guideoutput';

export default function GuideDemo() {
  // Sample business data with products
  const sampleData = {
    // Basic Info
    businessName: "Coffee Corner",
    ownerName: "John Doe",
    description: "A cozy coffee shop serving premium coffee and fresh pastries",
    category: "Coffee Shop",
    
    // Contact Info
    phone: "+62 812 3456 7890",
    email: "contact@coffeecorner.com",
    address: "Jl. Sudirman No. 123, Jakarta",
    whatsapp: "+62 812 3456 7890",
    instagram: "@coffeecorner",
    
    // Business Hours
    businessHours: {
      monday: "08:00 - 22:00",
      tuesday: "08:00 - 22:00",
      wednesday: "08:00 - 22:00",
      thursday: "08:00 - 22:00",
      friday: "08:00 - 23:00",
      saturday: "09:00 - 23:00",
      sunday: "09:00 - 21:00"
    },
    
    // Products/Menu Items
    menuProducts: [
      {
        id: "1",
        category: "Coffee",
        name: "Espresso",
        price: 15000,
        description: "Strong Italian coffee",
        image_url: "",
        is_available: true
      },
      {
        id: "2",
        category: "Coffee", 
        name: "Cappuccino",
        price: 25000,
        description: "Coffee with steamed milk foam",
        image_url: "",
        is_available: true
      },
      {
        id: "3",
        category: "Pastries",
        name: "Croissant",
        price: 18000,
        description: "Buttery French pastry",
        image_url: "",
        is_available: true
      },
      {
        id: "4",
        category: "Coffee",
        name: "Cafe Latte",
        price: 23000,
        description: "Espresso with steamed milk",
        image_url: "",
        is_available: true
      },
      {
        id: "5",
        category: "Pastries",
        name: "Chocolate Danish",
        price: 20000,
        description: "Flaky pastry with chocolate filling",
        image_url: "",
        is_available: true
      }
    ],

    // Website Details
    website: {
      url: "coffee-corner.onestopumkm.com",
      template: "restaurant",
      theme: "modern",
      last_updated: "2025-08-01"
    },

    // Analytics (if you want to show some business metrics)
    analytics: {
      monthly_views: 1200,
      total_orders: 450,
      average_rating: 4.5,
      total_reviews: 128
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="max-w-4xl mx-auto px-4">
        <GuideOutput data={sampleData} />
      </div>
    </div>
  );
}
