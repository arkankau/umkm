-- Add website_html column to businesses table if it doesn't exist
-- Run this in your Supabase SQL editor

-- Check if column exists first
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'businesses' 
        AND column_name = 'website_html'
    ) THEN
        -- Add the column
        ALTER TABLE businesses ADD COLUMN website_html TEXT;
        RAISE NOTICE 'Added website_html column to businesses table';
    ELSE
        RAISE NOTICE 'website_html column already exists in businesses table';
    END IF;
END $$;

-- Verify the column was added
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'businesses' 
AND column_name = 'website_html'; 