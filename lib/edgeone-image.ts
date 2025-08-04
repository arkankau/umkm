// Only check API key when not in build mode
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
  console.log('🔑 Checking API key...');
  const api_key = process.env.EDGEONE_IMAGE_API_KEY 
  if (!api_key) {
    console.error('❌ EDGEONE_IMAGE_API_KEY not found in environment');
    throw new Error('EDGEONE_IMAGE_API_KEY is not set in environment variables');
  }
  console.log('✅ API key found, length:', api_key.length);
}


async function generateImageFromHTML(htmlCode :string ) {
    const response = await fetch('https://image.edgeone.app/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'OE-USER-ID': '704607876ebe4865917512487f1bf849',
        'OE-API-KEY': `${api_key}`, // <-- Replace with your actual API key
        'OE-TEMPLATE-ID': 'ep-LSFcccBDfIIn'
      },
      body: JSON.stringify({
        htmlCode
      })
    });
  
    if (!response.ok) {
      console.error('Error:', response.status, await response.text());
      return;
    }
  
    return await response.blob();
  
  }
  