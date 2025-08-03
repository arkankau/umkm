-- Simple fix: Add website_html column to businesses table
-- Run this in your Supabase SQL Editor

ALTER TABLE businesses ADD COLUMN website_html TEXT;

-- Verify it was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'businesses' 
AND column_name = 'website_html'; 