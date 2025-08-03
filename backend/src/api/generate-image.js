// Note: This file is now deprecated as image generation has been moved to the frontend
// using Gemini Image Service. The frontend now handles all image generation directly.

export default async function handler(req, res) {
  res.status(200).json({
    message: 'Image generation has been moved to the frontend using Gemini AI',
    note: 'Please use the frontend /api/generate-image endpoint instead'
  });
}
