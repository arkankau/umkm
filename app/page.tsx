import BusinessForm from '../components/BusinessForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            UMKM Go Digital
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Buat website profesional untuk bisnis UMKM Anda dalam hitungan menit. 
            Website otomatis dengan desain modern dan responsif.
          </p>
        </div>
        
        <BusinessForm />
        
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Fitur Website UMKM
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Desain Responsif</h3>
              <p className="text-gray-600">Website yang terlihat sempurna di desktop, tablet, dan smartphone</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Integrasi Sosial Media</h3>
              <p className="text-gray-600">WhatsApp, Instagram, dan Google Maps terintegrasi langsung</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Hosting Gratis</h3>
              <p className="text-gray-600">Website dihosting gratis dengan domain .umkm.id</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
