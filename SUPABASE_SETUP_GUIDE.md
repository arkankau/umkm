# Supabase Setup Guide for OneStopUMKM

This guide will help you set up Supabase for the OneStopUMKM project, including database tables, storage buckets, and authentication.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `onestopumkm`
   - Database Password: (create a strong password)
   - Region: Choose closest to your users
5. Click "Create new project"

## 2. Get Your Project Credentials

1. Go to Settings → API in your Supabase dashboard
2. Copy the following values:
   - Project URL
   - Anon public key
   - Service role key (keep this secret)

## 3. Set Up Environment Variables

Create a `.env.local` file in your project root and add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

## 4. Set Up Database Schema

1. Go to SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `supabase-setup.sql`
3. Click "Run" to execute the SQL

This will create:
- `businesses` table with all necessary columns
- Indexes for better performance
- Row Level Security (RLS) policies
- Storage bucket for product images
- Sample data

## 5. Configure Storage

The SQL script automatically creates a `productimages` bucket, but you can verify it:

1. Go to Storage in your Supabase dashboard
2. You should see a `productimages` bucket
3. Make sure it's set to public

## 6. Test the Setup

### Test Database Connection

Create a simple test script:

```typescript
// test-supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .limit(1)
  
  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Success:', data)
  }
}

testConnection()
```

### Test Storage

```typescript
// test-storage.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function testStorage() {
  // Test uploading a file
  const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' })
  
  const { data, error } = await supabase.storage
    .from('productimages')
    .upload('test.txt', testFile)
  
  if (error) {
    console.error('Storage Error:', error)
  } else {
    console.log('Upload Success:', data)
  }
}

testStorage()
```

## 7. Common Issues and Solutions

### Issue: "Cannot find module '@supabase/supabase-js'"
**Solution:** Install the package:
```bash
npm install @supabase/supabase-js
```

### Issue: "Cannot find module '@google/generative-ai'"
**Solution:** Install the package:
```bash
npm install @google/generative-ai
```

### Issue: "Cannot find module 'clsx' or 'tailwind-merge'"
**Solution:** Install the packages:
```bash
npm install clsx tailwind-merge class-variance-authority
```

### Issue: "Cannot find module '@radix-ui/react-slot' or '@radix-ui/react-label'"
**Solution:** Install the packages:
```bash
npm install @radix-ui/react-slot @radix-ui/react-label
```

### Issue: Database connection fails
**Solutions:**
1. Check your environment variables are correct
2. Make sure your Supabase project is active
3. Verify the database password is correct
4. Check if your IP is allowed (if using IP restrictions)

### Issue: Storage upload fails
**Solutions:**
1. Make sure the `productimages` bucket exists
2. Check RLS policies are correctly set
3. Verify the bucket is public
4. Check file size limits (default is 50MB)

### Issue: RLS policies blocking operations
**Solutions:**
1. Check the policies in the SQL setup
2. For development, you can temporarily disable RLS:
   ```sql
   ALTER TABLE businesses DISABLE ROW LEVEL SECURITY;
   ```
3. For production, create proper user-based policies

## 8. Production Considerations

### Security
1. Use environment variables for all secrets
2. Set up proper RLS policies for production
3. Use service role key only on the server side
4. Implement proper authentication

### Performance
1. Add indexes for frequently queried columns
2. Use connection pooling for high traffic
3. Monitor query performance
4. Set up proper caching strategies

### Monitoring
1. Set up Supabase dashboard alerts
2. Monitor storage usage
3. Track API usage and limits
4. Set up error logging

## 9. Next Steps

After setting up Supabase:

1. Test the logo generator functionality
2. Verify business data can be created and retrieved
3. Test the complete workflow from business creation to logo generation
4. Set up proper error handling and user feedback
5. Implement authentication if needed

## 10. Support

If you encounter issues:

1. Check the Supabase documentation: https://supabase.com/docs
2. Review the error messages in your browser console
3. Check the Supabase dashboard logs
4. Verify all environment variables are set correctly
5. Test with the provided test scripts

## 11. Additional Resources

- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Environment Variables](https://nextjs.org/docs/basic-features/environment-variables) 