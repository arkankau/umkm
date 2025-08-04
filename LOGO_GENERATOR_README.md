# Logo Generator Feature

This feature allows users to generate professional logos for their businesses using AI and automatically upload them to Supabase storage.

## Features

- 🤖 AI-powered logo generation using Google's Gemini AI
- 📝 Auto-generate prompts based on business data
- 🎨 Custom prompt input for personalized logos
- 📤 Automatic upload to Supabase storage bucket
- 🔄 Update business profile with new logo URL
- 💾 Download generated logos
- 📱 Responsive design

## Components

### 1. LogoGenerator Component (`components/LogoGenerator.tsx`)

A React component that provides the logo generation interface.

**Props:**
- `businessData`: Business information object
- `businessId`: Unique business identifier
- `onLogoGenerated`: Callback function when logo is generated

**Features:**
- Text area for custom prompts
- Auto-generate prompt button
- Generate logo button with loading state
- Display generated logo with download/view options
- Error handling and user feedback

### 2. Generate Logo Page (`app/[id]/[businessId]/generate-logo/page.tsx`)

The page that hosts the logo generator for a specific business.

**Features:**
- Fetches business data using business ID
- Displays business information sidebar
- Shows current logo if exists
- Responsive layout with grid system

### 3. API Route (`app/api/generate-logo/route.ts`)

Handles logo generation requests.

**Endpoint:** `POST /api/generate-logo`

**Request Body:**
```json
{
  "prompt": "Logo description",
  "businessId": "business-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "logoUrl": "https://...",
  "message": "Logo generated and uploaded successfully"
}
```

## Backend Functions

### 1. generateAndUploadLogo (`lib/generate-image.ts`)

Main function that handles the complete logo generation workflow.

**Process:**
1. Generate image using Gemini AI
2. Convert base64 to blob
3. Upload to Supabase storage bucket (`productimages`)
4. Get public URL
5. Update business record with new logo URL

**Parameters:**
- `prompt`: Text description for logo generation
- `businessId`: Business identifier

**Returns:** Public URL of uploaded logo

## Setup Requirements

### 1. Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

### 2. Supabase Setup

1. Create a `productimages` storage bucket
2. Set bucket to public
3. Configure RLS policies for storage
4. Run the SQL setup script

### 3. Dependencies

Install required packages:

```bash
npm install @google/generative-ai @supabase/supabase-js clsx tailwind-merge class-variance-authority @radix-ui/react-slot @radix-ui/react-label
```

## Usage

### 1. Access the Logo Generator

Navigate to: `/[id]/[businessId]/generate-logo`

Replace:
- `[id]` with your user ID
- `[businessId]` with the business UUID

### 2. Generate a Logo

1. **Auto-generate prompt**: Click "Auto-generate prompt from business data"
2. **Custom prompt**: Write your own description in the text area
3. **Generate**: Click "Generate Logo" button
4. **Wait**: The AI will generate and upload the logo
5. **Download**: Use the download button to save the logo

### 3. View Generated Logo

The generated logo will be:
- Displayed on the page
- Automatically saved to the business profile
- Available for download
- Stored in Supabase storage

## File Structure

```
├── components/
│   ├── LogoGenerator.tsx          # Main logo generator component
│   └── ui/                        # UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       └── textarea.tsx
├── app/
│   ├── [id]/
│   │   └── [businessId]/
│   │       └── generate-logo/
│   │           └── page.tsx       # Logo generator page
│   └── api/
│       └── generate-logo/
│           └── route.ts           # API endpoint
├── lib/
│   ├── generate-image.ts          # Logo generation logic
│   ├── api.ts                     # API client functions
│   └── utils.ts                   # Utility functions
└── supabase-setup.sql             # Database setup
```

## Error Handling

The system handles various error scenarios:

- **Missing API keys**: Clear error messages for missing environment variables
- **Network errors**: User-friendly error messages for API failures
- **Storage errors**: Proper error handling for upload failures
- **Database errors**: Graceful handling of database update failures

## Customization

### 1. Modify Logo Generation

Edit the `generateImage` function in `lib/generate-image.ts` to:
- Change AI model parameters
- Modify image generation settings
- Add different image formats

### 2. Customize UI

The components use Tailwind CSS and can be customized by:
- Modifying CSS classes
- Adding new UI components
- Changing the layout structure

### 3. Add New Features

Extend the functionality by:
- Adding logo templates
- Implementing logo editing
- Adding multiple logo variations
- Creating logo history

## Testing

Run the test script to verify setup:

```bash
node test-supabase-setup.js
```

This will test:
- Database connection
- Storage bucket access
- Business creation/retrieval
- Logo generation workflow

## Troubleshooting

### Common Issues

1. **"Cannot find module" errors**
   - Install missing dependencies
   - Check package.json for required packages

2. **Supabase connection fails**
   - Verify environment variables
   - Check Supabase project status
   - Ensure RLS policies are correct

3. **Logo generation fails**
   - Check Gemini API key
   - Verify API quotas
   - Check network connectivity

4. **Storage upload fails**
   - Verify bucket exists
   - Check bucket permissions
   - Ensure RLS policies allow uploads

### Debug Steps

1. Check browser console for errors
2. Verify environment variables are loaded
3. Test Supabase connection
4. Check API response logs
5. Verify storage bucket configuration

## Security Considerations

- API keys are stored in environment variables
- Supabase RLS policies control access
- Storage bucket has appropriate permissions
- Error messages don't expose sensitive information

## Performance

- Images are optimized for web use
- Storage uses CDN for fast delivery
- Database queries are indexed
- UI components are optimized for React

## Future Enhancements

- Logo templates and presets
- Multiple logo variations
- Logo editing capabilities
- Integration with design tools
- Logo analytics and usage tracking 