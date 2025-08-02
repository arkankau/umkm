'use client';

import GuideOutput from '@/components/guideoutput';

export default function GuideDemo() {
  // Sample business data
  const sampleData = {
    businessName: "Coffee Corner",
    ownerName: "John Doe",
    description: "A cozy coffee shop serving premium coffee and fresh pastries",
    category: "Coffee Shop",
    products: "Coffee, Espresso, Cappuccino, Pastries, Sandwiches",
    phone: "+62 812 3456 7890",
    email: "contact@coffeecorner.com",
    address: "Jl. Sudirman No. 123, Jakarta",
    whatsapp: "+62 812 3456 7890",
    instagram: "@coffeecorner"
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <GuideOutput data={sampleData} />
    </div>
  );
}
