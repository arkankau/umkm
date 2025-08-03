-- Create businesses table for Untuk Mu Karya Mu
CREATE TABLE IF NOT EXISTS businesses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    user_id UUID,
    business_name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    products TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT NOT NULL,
    whatsapp VARCHAR(20),
    instagram VARCHAR(100),
    logo_url TEXT,
    subdomain VARCHAR(255),
    website_url TEXT,
    status VARCHAR(20) DEFAULT 'processing' CHECK (status IN ('processing', 'live', 'error')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deployed_at TIMESTAMP WITH TIME ZONE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_businesses_business_id ON businesses(business_id);
CREATE INDEX IF NOT EXISTS idx_businesses_user_id ON businesses(user_id);
CREATE INDEX IF NOT EXISTS idx_businesses_subdomain ON businesses(subdomain);
CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses(status);
CREATE INDEX IF NOT EXISTS idx_businesses_created_at ON businesses(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can modify this based on your security needs)
CREATE POLICY "Allow all operations on businesses" ON businesses
    FOR ALL USING (true);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_businesses_updated_at 
    BEFORE UPDATE ON businesses 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (optional)
INSERT INTO businesses (
    business_name, 
    owner_name, 
    description, 
    category, 
    products, 
    phone, 
    email, 
    address, 
    whatsapp, 
    instagram,
    status
) VALUES 
(
    'Warung Pak Budi',
    'Budi Santoso',
    'Warung makan tradisional dengan cita rasa autentik Indonesia',
    'restaurant',
    'Nasi goreng, Mie goreng, Soto ayam, Gado-gado',
    '081234567890',
    'budi@warungpakbudi.com',
    'Jl. Sudirman No. 123, Jakarta Pusat',
    '081234567890',
    '@warungpakbudi',
    'live'
),
(
    'Toko Elektronik Maju',
    'Siti Aminah',
    'Toko elektronik terpercaya dengan harga terjangkau',
    'retail',
    'TV, Kulkas, AC, Kipas angin, Lampu LED',
    '081876543210',
    'siti@tokomaju.com',
    'Jl. Thamrin No. 456, Jakarta Selatan',
    '081876543210',
    '@tokomaju',
    'live'
)
ON CONFLICT DO NOTHING;

-- Migration: Add missing columns to existing businesses table (run this if table already exists)
-- ALTER TABLE businesses ADD COLUMN IF NOT EXISTS business_id UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL;
-- ALTER TABLE businesses ADD COLUMN IF NOT EXISTS user_id UUID;
-- CREATE INDEX IF NOT EXISTS idx_businesses_business_id ON businesses(business_id);
-- CREATE INDEX IF NOT EXISTS idx_businesses_user_id ON businesses(user_id); 