console.log('📦 Loading Google GenAI...');
import { GoogleGenAI, Modality } from "@google/genai"
import supabaseServer from '@/lib/supabase-server';

console.log('🔑 Checking API key...');
const api_key = process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY;
if (!api_key) {
  console.error('❌ GEMINI_API_KEY not found in environment');
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}
console.log('✅ API key found, length:', api_key.length);

console.log('🤖 Initializing GoogleGenAI...');
const ai = new GoogleGenAI({apiKey: api_key});
console.log('✅ GoogleGenAI initialized');

export async function generateImage(prompt: string): Promise<string> {
  console.log('🎨 Starting image generation with prompt:', prompt);
  let buffer: Buffer | undefined;

  try {
    console.log('📡 Calling Gemini API...');
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: [{
        role: "user",
        parts: [{ text: prompt }]
      }],
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });
    console.log('✅ Got response from Gemini API');

    console.log('Gemini response:', JSON.stringify(response, null, 2));

    for (const part of response?.candidates?.[0]?.content?.parts || []) {
      if (part.text) {
        console.log('Generated text:', part.text);
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        buffer = Buffer.from(imageData, "base64");
        console.log('Generated image buffer size:', buffer.length);
      }
    }
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error(`Image generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  if (!buffer) {
    throw new Error("No image buffer generated - check if the model supports image generation");
  }
  return buffer.toString("base64");
}

export async function generateAndUploadLogo(prompt: string, businessId: string): Promise<string> {
  try {
    console.log(`Generating logo for business ${businessId} with prompt: ${prompt}`);
    
    // Generate the image
    const imageBase64 = await generateImage(prompt);
    
    // Convert base64 to buffer
    const buffer = Buffer.from(imageBase64, 'base64');
    console.log('Image buffer created, size:', buffer.length);
    
    // Upload to Supabase Storage with unique filename to avoid conflicts
    const timestamp = Date.now();
    const fileName = `logos/${businessId}-logo-${timestamp}.png`;
    
    console.log('Uploading to Supabase storage:', fileName);
    const { data, error } = await supabaseServer.storage
      .from('generatedlogo')
      .upload(fileName, buffer, {
        contentType: 'image/png',
        upsert: true // Allow overwriting if file exists
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw new Error(`Failed to upload logo: ${error.message}`);
    }

    console.log('Upload successful:', data);
    
    // Get the public URL
    const { data: { publicUrl } } = supabaseServer.storage
      .from('generatedlogo')
      .getPublicUrl(fileName);

    console.log('Generated public URL:', publicUrl);
    return publicUrl;

  } catch (error) {
    console.error('Error in generateAndUploadLogo:', error);
    throw new Error(`Logo generation and upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}


