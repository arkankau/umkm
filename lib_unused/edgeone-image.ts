console.log('🔑 Checking API key...');
const api_key = process.env.EDGEONE_IMAGE_API_KEY;
if (!api_key) {
  console.error('❌ EDGEONE_IMAGE_API_KEY not found in environment');
  throw new Error('EDGEONE_IMAGE_API_KEY is not set in environment variables');
}
console.log('✅ API key found, length:', api_key.length);

const API_CONFIG = {
  userId: '704607876ebe4865917512487f1bf849',
  apiKey: api_key,
  templateId: 'ep-LSFcccBDfIIn'
} as const;


export async function generateImageFromHTML(htmlCode: string): Promise<Blob | undefined> {
    console.log('🌐 Calling EdgeOne API...');
    try {
      const headers = new Headers({
        'Content-Type': 'application/json',
        'OE-USER-ID': API_CONFIG.userId,
        'OE-API-KEY': API_CONFIG.apiKey,
        'OE-TEMPLATE-ID': API_CONFIG.templateId
      });

      const cleanedHtmlCode = htmlCode.replaceAll(":hover", "").replaceAll(/\s+/g, ' ');
      console.log(JSON.stringify({htmlCode: cleanedHtmlCode}));

      const response = await fetch('https://image.edgeone.app/', {
        method: 'POST',
        headers,
        body: JSON.stringify({ htmlCode: cleanedHtmlCode })
      });
    
      if (!response.ok) {
        console.error('❌ EdgeOne API Error:', response.status);
        const errorText = await response.text();
        console.error('Error details:', errorText);
        throw new Error(`EdgeOne API returned ${response.status}: ${errorText}`);
      }
    
      console.log('✅ EdgeOne API call successful');
      return await response.blob();
    
    } catch (error) {
      console.error('❌ Failed to generate image:', error);
      throw error;
    }
}
  