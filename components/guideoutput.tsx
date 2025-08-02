'use client';

import { useState, useRef } from "react";

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
}

interface GuideOutputProps {
  data: BusinessData;
}

export default function GuideOutput({ data }: GuideOutputProps) {
  const [lang, setLang] = useState<"en" | "id">("en");
  const [activeTab, setActiveTab] = useState<"guide" | "text">("guide");
  const guideRef = useRef<HTMLDivElement>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // We'll handle the visual feedback through CSS
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


  const handleDownload = () => {
    if (guideRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        const htmlContent = `
          <html>
            <head>
              <title>Google Business Profile Guide - ${data.businessName}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .step { margin-bottom: 20px; }
                .step-number { font-weight: bold; color: #4F46E5; }
                .copy-box {
                  background: #1f2937; /* dark */
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
                  background-color: #10b981; /* green */
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
    return (<div className="copy-box bg-gray-900 border border-gray-700 rounded-lg p-3 mt-2 group hover:border-gray-500 transition-all">
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
        </div>)
  }

  const generateStepContent = (stepNumber: number, stepText: string, copyData: string) => {
    return (
      <div className="step mb-6 p-4 border border-gray-200 rounded-lg bg-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <span className="step-number text-indigo-600 font-bold mr-3">{stepNumber}.</span>
              <span className="text-gray-800">{stepText}</span>
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
      `7. ${t.step7}`,
      `   Note: ${t.verificationNote}`,
    ].join("\n");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Google Business Profile Guide</h2>
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

      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("guide")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "guide"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Interactive Guide
          </button>
          <button
            onClick={() => setActiveTab("text")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "text"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Text Version
          </button>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={handleDownload}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download PDF
        </button>
      </div>

      {activeTab === "guide" ? (
        <div className="space-y-4" ref={guideRef}>
          <div className="business-info bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{translations[lang].businessInfo}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><strong>{translations[lang].businessName}:</strong> {data.businessName}</div>
              <div><strong>{translations[lang].ownerName}:</strong> {data.ownerName}</div>
              <div><strong>{translations[lang].category}:</strong> {data.category}</div>
              <div><strong>{translations[lang].phone}:</strong> {data.phone}</div>
              <div><strong>{translations[lang].address}:</strong> {data.address}</div>
              <div><strong>{translations[lang].description}:</strong> {data.description}</div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-6">{translations[lang].title}</h1>
          
          {generateStepContent(1, translations[lang].step1, "https://www.google.com/business")}
          {generateStepContent(2, translations[lang].step2.replace("{name}", data.businessName), data.businessName)}
          {CopyData(data.category)}
          {generateStepContent(3, translations[lang].step3, data.address)}
          {generateStepContent(4, translations[lang].step4.replace("{category}", data.category), data.category)}
          {generateStepContent(5, translations[lang].step5, data.phone)}
          {generateStepContent(6, translations[lang].step6, data.description)}
          {generateStepContent(7, translations[lang].step7, data.products)}
          </div>
      ) : (
        <div>
          <textarea
            className="w-full h-96 text-sm p-4 border border-gray-300 rounded-md font-mono"
            value={generateTextGuide(data, lang)}
            readOnly
          />
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
    verificationNote: "Penting: Bisnis Anda tidak akan terlihat di Google sampai verifikasi selesai. Pastikan untuk memberikan informasi yang akurat untuk mempercepat proses verifikasi."
  }
};
