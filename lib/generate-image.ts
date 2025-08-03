import {
  GoogleGenAI, Modality
} from '@google/genai';
import { createClient } from '@supabase/supabase-js';

const api_key = process.env.GEMINI_API_KEY || 'AIzaSyCIhllWKPJ8yfnYdTQT20rJG1rTf1BsAjo';
if (!api_key) {
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}

const ai = new GoogleGenAI({apiKey: api_key});
// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function generateImage(prompt: string): Promise<string> {
  let buffer: Buffer;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    for (const part of response?.candidates?.[0]?.content?.parts) {
      // Based on the part type, either show the text or save the image
      if (part.text) {
        console.log(part.text);
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
         buffer = Buffer.from(imageData, "base64");
      }
    }
    
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
  return buffer;
}

export async function generateAndUploadLogo(prompt: string, businessId: string): Promise<string> {
  try {
    // Generate the image
    const imageData = await generateImage(prompt);
    
    // Convert base64 to blob
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    const blob = Buffer.from(base64Data, 'base64');
    
    // Generate unique filename
    const timestamp = Date.now();
    const filename = `logo-${businessId}-${timestamp}.png`;
    
    // Upload to Supabase storage bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('productimages')
      .upload(filename, blob, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error('Error uploading to Supabase:', uploadError);
      throw new Error('Failed to upload image to storage');
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('productimages')
      .getPublicUrl(filename);
    
    const publicUrl = urlData.publicUrl;
    
    // Update business record with new logo URL
    const { error: updateError } = await supabase
      .from('businessesNeo')
      .update({ logoUrl: publicUrl })
      .eq('id', businessId);
    
    if (updateError) {
      console.error('Error updating business logo:', updateError);
      throw new Error('Failed to update business logo URL');
    }
    
    return publicUrl;
  } catch (error) {
    console.error('Error in generateAndUploadLogo:', error);
    throw error;
  }
}
