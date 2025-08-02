import Link from 'next/link';

export default function MenuCTA() {
  return (
<div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
  <h3 className="text-xl font-semibold mb-2">Want to create a menu automatically?</h3>
  <p className="text-gray-600 mb-4">
    Generate a beautiful, professional menu for your business with our menu builder.
  </p>
  <Link 
    href="/[id]/create-menu" 
    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
  >
    <span>Create Menu</span>
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  </Link>
</div>
  );
}
