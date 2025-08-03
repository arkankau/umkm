-- Fix Storage RLS Policies for productimages bucket
-- Run this in your Supabase SQL Editor

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view files" ON storage.objects;

-- Policy 1: Allow anyone to view files in productimages bucket
CREATE POLICY "Anyone can view files" ON storage.objects
FOR SELECT USING (bucket_id = 'productimages');

-- Policy 2: Allow authenticated users to upload files to productimages bucket
CREATE POLICY "Authenticated users can upload files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'productimages' 
  AND auth.role() = 'authenticated'
);

-- Policy 3: Allow users to update their own files
CREATE POLICY "Users can update own files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'productimages' 
  AND auth.role() = 'authenticated'
);

-- Policy 4: Allow users to delete their own files
CREATE POLICY "Users can delete own files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'productimages' 
  AND auth.role() = 'authenticated'
);

-- Verify the policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
ORDER BY policyname; 