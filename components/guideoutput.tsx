'use client';

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface BusinessData {
  businessName: string;
  ownerName: string;
  description: string;
  category: string;
  products: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  instagram: string;
  businessId?: string;
  userId?: string;
  menu_url?: string;
  menuProducts?: Array<{
    id: string;
    category: string;
    name: string;
    price: number;
    description: string;
    image_url: string;
    is_available: boolean;
  }>;
  businessHours?: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  website?: {
    url: string;
    template: string;
    theme: string;
    last_updated: string;
  };
  analytics?: {
    monthly_views: number;
    total_orders: number;
    average_rating: number;
    total_reviews: number;
  };
}

interface GuideOutputProps {
  data: BusinessData;
}

export default function GuideOutput({ data }: GuideOutputProps) {
  const router = useRouter();
  const [lang, setLang] = useState<"en" | "id">("en");
  const [activeTab, setActiveTab] = useState<"business-info" | "products" | "website" | "analytics" | "guide">("business-info");
  const guideRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [menu, setMenu] = useState<any>(null);
  const [menuProducts, setMenuProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Visual feedback for copy action
      const buttons = document.getElementsByClassName('copy-button');
      Array.from(buttons).forEach((button) => {
        if (button instanceof HTMLButtonElement && button.dataset.copied === text) {
          button.classList.add('copied');
          setTimeout(() => {
            button.classList.remove('copied');
          }, 2000);
        }
      });
    });
  };

  const handleCreateMenu = () => {
    // Navigate to menu creation page with business data
    if (data.businessId && data.userId) {
      router.push(`/${data.userId}/${data.businessId}/create-menu`);
    } else {
      alert('Business ID not available');
    }
  };

  // Fetch products and menu data when component mounts or businessId changes
  useEffect(() => {
    const fetchProductsAndMenu = async () => {
      if (!data.businessId) return;
      
      setLoadingProducts(true);
      try {
        const response = await fetch(`/api/get-menu?businessId=${data.businessId}`);
        const result = await response.json();
        
        if (result.success) {
          setProducts(result.products || []);
          setMenu(result.menu);
          setMenuProducts(result.menuProducts || []);
        }
      } catch (error) {
        console.error('Error fetching products and menu:', error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProductsAndMenu();
  }, [data.businessId]);

  const handleDownload = () => {
    if (guideRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        const htmlContent = `
          <html>
            <head>
              <title>Google Business Profile  - ${data.businessName}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .step { margin-bottom: 20px; }
                .step-number { font-weight: bold; color: #4F46E5; }
                .copy-box {
                  background: #1f2937;
                  border: 1px solid #374151;
                  padding: 10px;
                  margin: 10px 0;
                  border-radius: 6px;
                  font-family: monospace;
                  color: #f9fafb;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                }
                .copy-button {
                  background-color: #4b5563;
                  color: white;
                  font-size: 0.75rem;
                  padding: 0.25rem 0.5rem;
                  border-radius: 0.375rem;
                  transition: background-color 0.2s;
                }
                .copy-button:hover {
                  background-color: #10b981;
                }
                .copy-button.copied {
                  background-color: #10b981;
                }
                h1 { color: #1f2937; }
                .business-info { 
                  background: #f9fafb; 
                  padding: 15px; 
                  border-radius: 5px; 
                  margin-bottom: 20px;
                }
              </style>
            </head>
            <body>
              ${generateHtmlGuideForPrint(data, lang)}
            </body>
          </html>
        `;
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const CopyData = (copyData: string) => {
    return (
      <div className="copy-box bg-gray-900 border border-gray-700 rounded-lg p-3 mt-2 group hover:border-gray-500 transition-all">
        <div className="flex items-center justify-between">
          <code className="text-sm text-gray-200 break-all">{copyData}</code>
          <button
            onClick={() => handleCopy(copyData)}
            data-copied={copyData}
            className="copy-button bg-gray-700 text-white text-xs px-3 py-1.5 rounded-md hover:bg-gray-600 transition-all duration-200 ml-2 flex items-center gap-2 group-hover:bg-gray-600"
          >
            <span>Copy</span>
            <svg className="w-4 h-4 opacity-0 check-icon transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  const generateStepContent = (stepNumber: number, stepText: string, copyData: string) => {
    return (
      <div className="step mb-6 p-4 border border-gray-200 rounded-lg bg-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <span className="step-number text-indigo-600 font-bold mr-3">{stepNumber}.</span>
              <span className="text-gray-800 text-sm md:text-base">{stepText}</span>
            </div>
            {CopyData(copyData)}
          </div>
        </div>
      </div>
    );
  };

  const generateHtmlGuideForPrint = (data: BusinessData, lang: "en" | "id"): string => {
    const t = translations[lang];
    
    return `
      <div class="max-w-4xl mx-auto">
        <div class="business-info bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">${t.businessInfo}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><strong>${t.businessName}:</strong> ${data.businessName}</div>
            <div><strong>${t.ownerName}:</strong> ${data.ownerName}</div>
            <div><strong>${t.category}:</strong> ${data.category}</div>
            <div><strong>${t.phone}:</strong> ${data.phone}</div>
            <div><strong>${t.address}:</strong> ${data.address}</div>
            <div><strong>${t.description}:</strong> ${data.description}</div>
          </div>
        </div>

        <h1 class="text-2xl font-bold text-gray-800 mb-6">${t.title}</h1>
        
        <div class="step mb-6 p-4 border border-gray-200 rounded-lg bg-white">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center mb-2">
                <span class="step-number text-indigo-600 font-bold mr-3">1.</span>
                <span class="text-gray-800">${t.step1}</span>
              </div>
              <div class="copy-box bg-gray-50 border border-gray-200 rounded p-3 mt-2">
                <div class="flex items-center justify-between">
                  <code class="text-sm text-gray-700 break-all">https://www.google.com/business</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="step mb-6 p-4 border border-gray-200 rounded-lg bg-white">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center mb-2">
                <span class="step-number text-indigo-600 font-bold mr-3">2.</span>
                <span class="text-gray-800">${t.step2.replace("{name}", data.businessName)}</span>
              </div>
              <div class="copy-box bg-gray-50 border border-gray-200 rounded p-3 mt-2">
                <div class="flex items-center justify-between">
                  <code class="text-sm text-gray-700 break-all">${data.businessName}</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="step mb-6 p-4 border border-gray-200 rounded-lg bg-white">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center mb-2">
                <span class="step-number text-indigo-600 font-bold mr-3">3.</span>
                <span class="text-gray-800">${t.step3}</span>
              </div>
              <div class="copy-box bg-gray-50 border border-gray-200 rounded p-3 mt-2">
                <div class="flex items-center justify-between">
                  <code class="text-sm text-gray-700 break-all">${data.address}</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="step mb-6 p-4 border border-gray-200 rounded-lg bg-white">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center mb-2">
                <span class="step-number text-indigo-600 font-bold mr-3">4.</span>
                <span class="text-gray-800">${t.step4.replace("{category}", data.category)}</span>
              </div>
              <div class="copy-box bg-gray-50 border border-gray-200 rounded p-3 mt-2">
                <div class="flex items-center justify-between">
                  <code class="text-sm text-gray-700 break-all">${data.category}</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="step mb-6 p-4 border border-gray-200 rounded-lg bg-white">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center mb-2">
                <span class="step-number text-indigo-600 font-bold mr-3">5.</span>
                <span class="text-gray-800">${t.step5}</span>
              </div>
              <div class="copy-box bg-gray-50 border border-gray-200 rounded p-3 mt-2">
                <div class="flex items-center justify-between">
                  <code class="text-sm text-gray-700 break-all">${data.phone}</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="step mb-6 p-4 border border-gray-200 rounded-lg bg-white">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center mb-2">
                <span class="step-number text-indigo-600 font-bold mr-3">6.</span>
                <span class="text-gray-800">${t.step6}</span>
              </div>
              <div class="copy-box bg-gray-50 border border-gray-200 rounded p-3 mt-2">
                <div class="flex items-center justify-between">
                  <code class="text-sm text-gray-700 break-all">${data.description}</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="step mb-6 p-4 border border-gray-200 rounded-lg bg-white">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center mb-2">
                <span class="step-number text-indigo-600 font-bold mr-3">7.</span>
                <span class="text-gray-800">${t.step7}</span>
              </div>
              <div class="copy-box bg-gray-50 border border-gray-200 rounded p-3 mt-2">
                <div class="flex items-center justify-between">
                  <code class="text-sm text-gray-700 break-all">${data.products}</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="step mb-6 p-4 border border-gray-200 rounded-lg bg-white">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center mb-2">
                <span class="step-number text-indigo-600 font-bold mr-3">8.</span>
                <span class="text-gray-800">${t.step8}</span>
              </div>
              <div class="copy-box bg-gray-50 border border-gray-200 rounded p-3 mt-2">
                <div class="flex items-center justify-between">
                  <code class="text-sm text-gray-700 break-all">${data.email || "N/A"}</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="step mb-6 p-4 border border-gray-200 rounded-lg bg-white">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center mb-2">
                <span class="step-number text-indigo-600 font-bold mr-3">9.</span>
                <span class="text-gray-800">${t.step9}</span>
              </div>
              <div class="copy-box bg-gray-50 border border-gray-200 rounded p-3 mt-2">
                <div class="flex items-center justify-between">
                  <code class="text-sm text-gray-700 break-all">${data.whatsapp || "N/A"}</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="step mb-6 p-4 border border-gray-200 rounded-lg bg-white">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center mb-2">
                <span class="step-number text-indigo-600 font-bold mr-3">10.</span>
                <span class="text-gray-800">${t.step10}</span>
              </div>
              <div class="copy-box bg-gray-50 border border-gray-200 rounded p-3 mt-2">
                <div class="flex items-center justify-between">
                  <code class="text-sm text-gray-700 break-all">${data.instagram || "N/A"}</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="step mb-6 p-4 border border-gray-200 rounded-lg bg-white">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center mb-2">
                <span class="step-number text-indigo-600 font-bold mr-3">11.</span>
                <span class="text-gray-800">${t.step11}</span>
              </div>
              <div class="copy-box bg-gray-50 border border-gray-200 rounded p-3 mt-2">
                <div class="flex items-center justify-between">
                  <code class="text-sm text-gray-700 break-all">${t.verificationNote}</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const generateTextGuide = (data: BusinessData, lang: "en" | "id") => {
    const t = translations[lang];
    
    return [
      `${t.title}`,
      ``,
      `${t.businessInfo}:`,
      `${t.businessName}: ${data.businessName}`,
      `${t.ownerName}: ${data.ownerName}`,
      `${t.category}: ${data.category}`,
      `${t.phone}: ${data.phone}`,
      `${t.address}: ${data.address}`,
      `${t.description}: ${data.description}`,
      ``,
      `1. ${t.step1}`,
      `   Copy: https://www.google.com/business`,
      ``,
      `2. ${t.step2.replace("{name}", data.businessName)}`,
      `   Copy: ${data.businessName}`,
      ``,
      `3. ${t.step3}`,
      `   Copy: ${data.address}`,
      ``,
      `4. ${t.step4.replace("{category}", data.category)}`,
      `   Copy: ${data.category}`,
      ``,
      `5. ${t.step5}`,
      `   Copy: ${data.phone}`,
      ``,
      `6. ${t.step6}`,
      `   Copy: ${data.description}`,
      ``,
      `7. ${t.step7}`,
      `   Copy: ${data.products}`,
      ``,
      `8. ${t.step8}`,
      `   Copy: ${data.email || "N/A"}`,
      ``,
      `9. ${t.step9}`,
      `   Copy: ${data.whatsapp || "N/A"}`,
      ``,
      `10. ${t.step10}`,
      `   Copy: ${data.instagram || "N/A"}`,
      ``,
      `11. ${t.step11}`,
      `   Note: ${t.verificationNote}`,
    ].join("\n");
  };

  const generateMenuGuide = (data: BusinessData, lang: "en" | "id") => {
    const t = translations[lang];
    
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-green-800 mb-3">
            {lang === "en" ? "Create Professional Menu" : "Buat Menu Profesional"}
          </h3>
          <p className="text-green-700 mb-4">
            {lang === "en" 
              ? "Create a beautiful menu for your business with multiple templates and easy customization."
              : "Buat menu yang indah untuk bisnis Anda dengan berbagai template dan kustomisasi yang mudah."
            }
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-2xl mb-2">📋</div>
              <h4 className="font-semibold text-sm">Classic Menu</h4>
              <p className="text-xs text-gray-600">Clean and professional</p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-2xl mb-2">🎨</div>
              <h4 className="font-semibold text-sm">Modern Menu</h4>
              <p className="text-xs text-gray-600">Contemporary design</p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-2xl mb-2">✨</div>
              <h4 className="font-semibold text-sm">Elegant Menu</h4>
              <p className="text-xs text-gray-600">Premium styling</p>
            </div>
          </div>
          <button
            onClick={handleCreateMenu}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {lang === "en" ? "Create Menu" : "Buat Menu"}
          </button>
        </div>

        {data.menuProducts && data.menuProducts.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {lang === "en" ? "Sample Menu Items" : "Contoh Item Menu"}
            </h3>
            <div className="grid gap-3">
              {data.menuProducts.map((product) => (
                <div key={product.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-sm">{product.name}</h4>
                    <p className="text-xs text-gray-600">{product.description}</p>
                  </div>
                  <span className="font-bold text-green-600">Rp {product.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            {data.businessName}
          </h2>
          <p className="text-gray-600 text-sm">{data.category}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setLang("en")}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              lang === "en" 
                ? "bg-indigo-600 text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLang("id")}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              lang === "id" 
                ? "bg-indigo-600 text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            ID
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab("business-info")}
            className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === "business-info"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {lang === "en" ? "Business Info" : "Info Bisnis"}
          </button>
          
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === "products"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {lang === "en" ? "Products & Menu" : "Produk & Menu"}
          </button>

          <button
            onClick={() => setActiveTab("guide")}
            className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === "guide"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {lang === "en" ? "Setup Guide" : "Panduan"}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end mb-4 gap-2">
        <button
          onClick={handleDownload}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {lang === "en" ? "Download PDF" : "Unduh PDF"}
        </button>
      </div>

      {/* Content */}
      {activeTab === "business-info" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">{lang === "en" ? "Basic Information" : "Informasi Dasar"}</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm text-gray-600">{lang === "en" ? "Business Name" : "Nama Bisnis"}</dt>
                  <dd className="text-base font-medium">{data.businessName}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">{lang === "en" ? "Category" : "Kategori"}</dt>
                  <dd className="text-base font-medium">{data.category}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">{lang === "en" ? "Description" : "Deskripsi"}</dt>
                  <dd className="text-base">{data.description}</dd>
                </div>
              </dl>
            </div>

            {/* Contact Info */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">{lang === "en" ? "Contact Information" : "Informasi Kontak"}</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm text-gray-600">{lang === "en" ? "Phone" : "Telepon"}</dt>
                  <dd className="text-base font-medium">{data.phone}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">{lang === "en" ? "Email" : "Email"}</dt>
                  <dd className="text-base font-medium">{data.email}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">{lang === "en" ? "Address" : "Alamat"}</dt>
                  <dd className="text-base">{data.address}</dd>
                </div>
              </dl>
            </div>

            {/* Business Hours */}
            {data.businessHours && (
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">{lang === "en" ? "Business Hours" : "Jam Operasional"}</h3>
                <dl className="space-y-2">
                  {Object.entries(data.businessHours).map(([day, hours]) => (
                    <div key={day} className="grid grid-cols-2">
                      <dt className="text-sm capitalize">{day}</dt>
                      <dd className="text-sm font-medium">{hours}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Social Media */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">{lang === "en" ? "Social Media" : "Media Sosial"}</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm text-gray-600">WhatsApp</dt>
                  <dd className="text-base font-medium">{data.whatsapp}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Instagram</dt>
                  <dd className="text-base font-medium">{data.instagram}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}

      {activeTab === "products" && (
        <div className="space-y-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">{lang === "en" ? "Products & Menu" : "Produk & Menu"}</h3>
          </div>

          {/* Menu Preview */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800">
                {lang === "en" ? "Digital Menu" : "Menu Digital"}
              </h3>
              <button
                onClick={handleCreateMenu}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {data.menu_url ? (lang === "en" ? 'Edit Menu' : 'Ubah Menu') : (lang === "en" ? 'Create Menu' : 'Buat Menu')}
              </button>
            </div>

            {data.menu_url ? (
              <div className="relative">
                <img 
                  src={data.menu_url} 
                  alt="Business Menu"
                  className="w-full rounded-lg shadow-md" 
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity flex items-center justify-center">
                  <a 
                    href={data.menu_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white text-gray-800 px-4 py-2 rounded-md shadow hover:bg-gray-100 transition-colors opacity-0 hover:opacity-100"
                  >
                    {lang === "en" ? "View Full Size" : "Lihat Ukuran Penuh"}
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">
                  {lang === "en" ? "No menu has been created yet." : "Menu belum dibuat."}
                </p>
                <p className="text-gray-400 mt-2">
                  {lang === "en" ? "Click the Create Menu button to get started." : "Klik tombol Buat Menu untuk memulai."}
                </p>
              </div>
            )}
          </div>

          {/* Products List */}
          {loadingProducts ? (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <span className="ml-2 text-gray-600">Loading menu...</span>
              </div>
            </div>
                    ) : menu && menuProducts.length > 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {lang === "en" ? "Menu Products" : "Produk Menu"}
              </h3>
              <p className="text-gray-600 mb-4">
                {lang === "en" 
                  ? `Menu: ${menu.name}`
                  : `Menu: ${menu.name}`
                }
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuProducts.map((product) => (
                  <div key={product.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    {product.image_url && (
                      <div className="mb-3">
                        <img 
                          src={product.image_url} 
                          alt={product.name} 
                          className="w-full h-40 object-cover rounded-lg shadow-sm" 
                        />
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-800">{product.name}</h4>
                        <p className="text-sm text-gray-600">{product.category}</p>
                      </div>
                      <span className={`text-sm font-medium px-2 py-1 rounded ${product.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.is_available ? (lang === "en" ? "Available" : "Tersedia") : (lang === "en" ? "Sold Out" : "Habis")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                    <p className="font-bold text-indigo-600">Rp {product.price.toLocaleString()}</p>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleCopy(product.name)}
                        className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                      >
                        {lang === "en" ? "Copy Name" : "Salin Nama"}
                      </button>
                      <button
                        onClick={() => handleCopy(product.description)}
                        className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors"
                      >
                        {lang === "en" ? "Copy Desc" : "Salin Desk"}
                      </button>
                      <button
                        onClick={() => handleCopy(product.price.toString())}
                        className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors"
                      >
                        {lang === "en" ? "Copy Price" : "Salin Harga"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  {lang === "en" 
                    ? "No menu has been created yet. Create a menu in the business dashboard to see products here."
                    : "Belum ada menu yang dibuat. Buat menu di dashboard bisnis untuk melihat produk di sini."
                  }
                </p>
                <button
                  onClick={handleCreateMenu}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {lang === "en" ? "Create Menu" : "Buat Menu"}
                </button>
              </div>
            </div>
          )}

           

           {/* Google Business Profile Tips */}
           <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-blue-800 mb-3">
              {lang === "en" ? "Google Business Profile Tips" : "Tips Google Business Profile"}
            </h3>
            <div className="space-y-3 text-sm text-blue-700">
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">📸</span>
                <p>{lang === "en" ? "Upload high-quality product images to attract customers" : "Upload gambar produk berkualitas tinggi untuk menarik pelanggan"}</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">💰</span>
                <p>{lang === "en" ? "Keep prices updated and accurate" : "Jaga harga tetap terbaru dan akurat"}</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">📝</span>
                <p>{lang === "en" ? "Write clear, descriptive product descriptions" : "Tulis deskripsi produk yang jelas dan informatif"}</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✅</span>
                <p>{lang === "en" ? "Mark products as available/unavailable to manage inventory" : "Tandai produk tersedia/tidak tersedia untuk mengelola inventori"}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "website" && data.website && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">{lang === "en" ? "Website Information" : "Informasi Website"}</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-gray-600">URL</dt>
                <dd className="text-base font-medium">
                  <a href={`https://${data.website.url}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                    {data.website.url}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600">{lang === "en" ? "Template" : "Template"}</dt>
                <dd className="text-base font-medium capitalize">{data.website.template}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600">{lang === "en" ? "Theme" : "Tema"}</dt>
                <dd className="text-base font-medium capitalize">{data.website.theme}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600">{lang === "en" ? "Last Updated" : "Terakhir Diperbarui"}</dt>
                <dd className="text-base">{new Date(data.website.last_updated).toLocaleDateString()}</dd>
              </div>
            </dl>
          </div>
        </div>
      )}

      {activeTab === "analytics" && data.analytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h4 className="text-sm text-gray-600 mb-2">{lang === "en" ? "Monthly Views" : "Kunjungan Bulanan"}</h4>
              <p className="text-2xl font-semibold">{data.analytics.monthly_views.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h4 className="text-sm text-gray-600 mb-2">{lang === "en" ? "Total Orders" : "Total Pesanan"}</h4>
              <p className="text-2xl font-semibold">{data.analytics.total_orders.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h4 className="text-sm text-gray-600 mb-2">{lang === "en" ? "Average Rating" : "Rating Rata-rata"}</h4>
              <p className="text-2xl font-semibold">{data.analytics.average_rating.toFixed(1)}</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h4 className="text-sm text-gray-600 mb-2">{lang === "en" ? "Total Reviews" : "Total Ulasan"}</h4>
              <p className="text-2xl font-semibold">{data.analytics.total_reviews.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "guide" && (
        <div className="space-y-4" ref={guideRef}>
          {generateStepContent(1, translations[lang].step1, "https://www.google.com/business")}
          {generateStepContent(2, translations[lang].step2.replace("{name}", data.businessName), data.businessName)}
          {generateStepContent(3, translations[lang].step3, data.address)}
          {generateStepContent(4, translations[lang].step4.replace("{category}", data.phone), data.phone)}
          {generateStepContent(5, translations[lang].step5, "Mon-Fri: 9am-7pm")}
          {generateStepContent(6, translations[lang].step6, data.description)}
          {generateStepContent(7, translations[lang].step8, data.email || "N/A")}
          {generateStepContent(8, translations[lang].step9, data.whatsapp || "N/A")}
          {generateStepContent(9, translations[lang].step10, data.instagram || "N/A")}
          {generateStepContent(10, translations[lang].step11, translations[lang].verificationNote)}
          {generateStepContent(11, translations[lang].step12, "Done!")}
        </div>
      )}
    </div>
  );
}

const translations = {
  en: {
    title: "Complete Google Business Profile Setup Guide",
    businessInfo: "Business Information",
    businessName: "Business Name",
    ownerName: "Owner Name",
    category: "Category",
    phone: "Phone",
    address: "Address",
    description: "Description",
    step1: "Go to Google Business Profile and click 'Manage Now'. If you already have a business profile, click the three dots menu and select 'Add another business'",
    step2: "Enter your business name and category",
    step3: "Select 'Yes' if you want your location to be displayed to customers, then enter your business address",
    step4: "Add your business phone number and get verified. If you don't receive the verification code, check your phone credit balance",
    step5: "Set your business hours",
    step6: "Add your business description",
    step7: "Complete verification process. Your business won't be visible without verification. Verify using your phone number and business information. The process usually takes up to 5 days",
    step8: "Add your business email address",
    step9: "Add your WhatsApp number for customer contact",
    step10: "Add your Instagram handle for social media presence",
    step11: "Complete verification process. Your business won't be visible without verification. Verify using your phone number and business information. The process usually takes up to 5 days",
    step12: "Add menu and pictures to promote your business. We have a function to generate menus.",
    verificationNote: "Important: Your business will not be visible on Google until verification is complete. Make sure to provide accurate information to speed up the verification process."
  },
  id: {
    title: "Panduan Lengkap Setup Google Business Profile",
    businessInfo: "Informasi Bisnis",
    businessName: "Nama Bisnis",
    ownerName: "Nama Pemilik",
    category: "Kategori",
    phone: "Telepon",
    address: "Alamat",
    description: "Deskripsi",
    step1: "Buka Google Business Profile dan klik 'Kelola Sekarang'. Jika Anda sudah memiliki profil bisnis, klik ikon tiga titik dan pilih 'Tambah bisnis lain'",
    step2: "Masukkan nama bisnis dan kategori bisnis Anda",
    step3: "Pilih 'Ya' jika Anda ingin lokasi bisnis Anda ditampilkan ke pelanggan, lalu masukkan alamat bisnis",
    step4: "Tambahkan nomor telepon bisnis, lalu dapatkan verifikasi. Apabila tidak menerima kode, cek sisa pulsa anda.",
    step5: "Atur jam operasional bisnis Anda",
    step6: "Tambahkan deskripsi bisnis Anda",
    step7: "Selesaikan proses verifikasi. Bisnis Anda tidak akan terlihat tanpa verifikasi. Verifikasi menggunakan nomor telepon dan informasi bisnis. Proses biasanya memakan waktu hingga 5 hari",
    step8: "Tambahkan alamat email bisnis Anda",
    step9: "Tambahkan nomor WhatsApp untuk kontak pelanggan",
    step10: "Tambahkan handle Instagram untuk kehadiran media sosial",
    step11: "Selesaikan proses verifikasi. Bisnis Anda tidak akan terlihat tanpa verifikasi. Verifikasi menggunakan nomor telepon dan informasi bisnis. Proses biasanya memakan waktu hingga 5 hari",
    step12: "Tambahkan menu dan gambar-gambar untuk mempromosikan bisnis anda. Kita ada fitur untuk menambahkan menu.",
    verificationNote: "Penting: Bisnis Anda tidak akan terlihat di Google sampai verifikasi selesai. Pastikan untuk memberikan informasi yang akurat untuk mempercepat proses verifikasi."
  }
};
