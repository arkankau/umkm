import React from 'react';

interface MenuItem {
  name: string;
  price: string;
}

interface MenuCategory {
  title: string;
  items: MenuItem[];
}

interface MenuProps {
  logo: string;
  businessName: string;
  categories: MenuCategory[];
  images: string[]; // Two image URLs
}

const MenuComponent: React.FC<MenuProps> = ({ logo, businessName, categories, images }) => {
  return (
    <div className="bg-black text-white font-sans p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <img src={logo} alt="Logo" className="w-16 h-16 object-contain" />
        <h1 className="text-4xl font-bold text-center flex-1">{businessName}</h1>
        <div className="w-16 h-16" /> {/* spacer */}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* First image */}
        <div className="flex justify-center">
          <img src={images[0]} alt="Food 1" className="rounded-full w-60 h-60 object-cover border-4 border-yellow-500" />
        </div>

        {/* Menu items */}
        <div className="col-span-2 space-y-8">
          {categories.map((category, index) => (
            <div key={index}>
              <h2 className="text-yellow-400 text-xl font-bold border-b border-yellow-400 mb-2">{category.title}</h2>
              <ul className="space-y-1">
                {category.items.map((item, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{item.name}</span>
                    <span className="text-yellow-200">{item.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Second image */}
        <div className="flex justify-center">
          <img src={images[1]} alt="Food 2" className="rounded-full w-60 h-60 object-cover border-4 border-yellow-500" />
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm mt-10 text-gray-400">
        <p>+123-456-7890 | 123 Anywhere St., Any City, ST 12345</p>
      </div>
    </div>
  );
};

export default MenuComponent;
