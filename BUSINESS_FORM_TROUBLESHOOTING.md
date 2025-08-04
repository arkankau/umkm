# BusinessProfileForm Troubleshooting Guide

This guide will help you identify and fix common errors in the BusinessProfileForm component.

## Common Errors and Solutions

### 1. **"Cannot find module '@supabase/supabase-js'"**
**Error:** Module not found error when importing Supabase
**Solution:** Install the package:
```bash
npm install @supabase/supabase-js
```

### 2. **"Table 'businesses-2' does not exist"**
**Error:** Wrong table name in the code
**Solution:** ✅ **FIXED** - Changed from `businesses-2` to `businesses`

### 3. **"Column 'businessName' does not exist"**
**Error:** Wrong column names in database insert
**Solution:** ✅ **FIXED** - Updated column names to match Supabase schema:
- `businessName` → `business_name`
- `ownerName` → `owner_name`
- `logoUrl` → `logo_url`

### 4. **"Bucket 'images' does not exist"**
**Error:** Wrong bucket name in error message
**Solution:** ✅ **FIXED** - Updated error message to reference `productimages` bucket

### 5. **"Column 'businessId' does not exist"**
**Error:** Wrong column name in validation query
**Solution:** ✅ **FIXED** - Changed from `businessId` to `business_id`

### 6. **"Table 'products' does not exist"**
**Error:** Products table missing from database
**Solution:** ✅ **FIXED** - Added products table to `supabase-setup.sql`

### 7. **"Foreign key constraint failed"**
**Error:** Invalid business_id reference in products table
**Solution:** ✅ **FIXED** - Updated to use `businessData.id` instead of `formData.businessId`

## Database Schema Issues

### Missing Tables
If you're getting "table does not exist" errors, run the updated SQL setup:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-setup.sql`
4. Click "Run"

This will create:
- `businesses` table with correct column names
- `products` table for individual products
- Storage bucket `productimages`
- Proper RLS policies

### Column Name Mismatches
The database uses snake_case column names:
- `business_name` (not `businessName`)
- `owner_name` (not `ownerName`)
- `logo_url` (not `logoUrl`)
- `business_id` (not `businessId`)

## Environment Variables

Make sure your `.env.local` file has:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Storage Bucket Issues

### Bucket Not Found
1. Check if `productimages` bucket exists in Supabase Storage
2. Make sure it's set to public
3. Verify RLS policies allow uploads

### Upload Permissions
The storage policies should allow:
- Public read access
- Authenticated user uploads
- Authenticated user updates/deletes

## Authentication Issues

### User Not Logged In
The form checks for user authentication. If you're getting redirected to login:
1. Make sure you're logged in to Supabase
2. Check if the auth session is valid
3. Verify the user exists in the auth.users table

## Testing the Fixes

Run the test script to verify everything works:
```bash
node test-supabase-setup.js
```

This will test:
- Database connection
- Storage bucket access
- Business creation
- Product creation

## Debug Steps

### 1. Check Browser Console
Open browser dev tools and look for:
- Network errors (failed API calls)
- JavaScript errors
- Supabase client errors

### 2. Check Supabase Logs
In your Supabase dashboard:
- Go to Logs section
- Look for failed requests
- Check for RLS policy violations

### 3. Test Database Connection
```javascript
// Add this to your component temporarily
useEffect(() => {
  const testConnection = async () => {
    const { data, error } = await supabaseClient
      .from('businesses')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Database error:', error);
    } else {
      console.log('Database connected:', data);
    }
  };
  
  testConnection();
}, []);
```

### 4. Test Storage Upload
```javascript
// Add this to test storage
const testStorage = async () => {
  const testFile = new File(['test'], 'test.txt', { type: 'text/plain' });
  
  const { data, error } = await supabaseClient.storage
    .from('productimages')
    .upload('test.txt', testFile);
  
  if (error) {
    console.error('Storage error:', error);
  } else {
    console.log('Storage works:', data);
  }
};
```

## Common Form Validation Errors

### Business ID Validation
- Must be at least 3 characters
- Can only contain letters, numbers, and hyphens
- Must be unique in the database

### Required Fields
- Business ID
- Business Name
- Owner Name
- Phone Number

### File Upload Validation
- Maximum file size: 5MB
- Must be an image file
- Supported formats: jpg, jpeg, png, gif, webp

## Performance Issues

### Large File Uploads
- Compress images before upload
- Use appropriate image formats
- Consider implementing progress indicators

### Database Queries
- Add proper indexes (already included in setup)
- Use pagination for large datasets
- Optimize queries with proper WHERE clauses

## Security Considerations

### RLS Policies
The current setup allows all operations for development. For production:
1. Create user-specific policies
2. Restrict access based on user ownership
3. Implement proper authentication checks

### File Upload Security
- Validate file types on server side
- Scan for malware
- Implement file size limits
- Use secure file naming

## Next Steps After Fixes

1. **Test the form** with sample data
2. **Verify file uploads** work correctly
3. **Check database records** are created properly
4. **Test the complete workflow** from form submission to business creation
5. **Implement proper error handling** for production use

## Still Having Issues?

If you're still experiencing errors:

1. **Check the exact error message** in browser console
2. **Verify your Supabase setup** is complete
3. **Run the test script** to identify specific issues
4. **Check the Supabase dashboard** for any configuration issues
5. **Review the updated code** for any remaining issues

## Support Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables) 