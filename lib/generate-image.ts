import { GoogleGenAI, Modality } from "@google/genai"
import supabaseClient from '@/app/lib/supabase';
import fs from 'fs';

const api_key = process.env.GEMINI_API_KEY;
if (!api_key) {
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}

const ai = new GoogleGenAI({apiKey: api_key});

export async function generateImage(prompt: string): Promise<string> {
  let buffer: Buffer | undefined;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    for (const part of response?.candidates?.[0]?.content?.parts || []) {
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

  if (!buffer) throw new Error("No image buffer generated");
  return buffer.toString("base64"); // or send this to frontend as data:image/jpeg;base64,...
}

export async function generateAndUploadLogo(prompt: string, businessId: string): Promise<string> {
  try {
    // Generate the image
    const imageBase64 = await generateImage(prompt);
    
    // Convert base64 to buffer
    const buffer = Buffer.from(imageBase64, 'base64');
    console.log(buffer);
    // Upload to Supabase Storage
    const fileName = `${businessId}-logo.png`;
    

    const { data, error } = await supabaseClient.storage
      .from('productimages')
      .upload(fileName, buffer, {
        contentType: 'image/png',
        upsert: false
      });

    if (error) {
      console.log("Upload error")
      throw error;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabaseClient.storage
      .from('productimages')
      .getPublicUrl(fileName);

    return publicUrl;

  } catch (error) {
    console.error('Error in generateAndUploadLogo:', error);
    throw error;
  }
}


