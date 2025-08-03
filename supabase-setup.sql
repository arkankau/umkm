-- Create businesses table for Untuk Mu Karya Mu
CREATE TABLE IF NOT EXISTS businesses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- Create businessesNeo table with the exact structure from BusinessProfileForm
CREATE TABLE IF NOT EXISTS businessesNeo (
    id VARCHAR(255) PRIMARY KEY,
    businessId VARCHAR(255) UNIQUE NOT NULL,
    businessName VARCHAR(255) NOT NULL,
    ownerName VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    products TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT NOT NULL,
    whatsapp VARCHAR(20),
    instagram VARCHAR(100),
    logoUrl TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_businesses_subdomain ON businesses(subdomain);
CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses(status);
CREATE INDEX IF NOT EXISTS idx_businesses_created_at ON businesses(created_at);

-- Create indexes for businessesNeo
CREATE INDEX IF NOT EXISTS idx_businessesNeo_businessId ON businessesNeo(businessId);
CREATE INDEX IF NOT EXISTS idx_businessesNeo_created_at ON businessesNeo(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE businessesNeo ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can modify this based on your security needs)
CREATE POLICY "Allow all operations on businesses" ON businesses
    FOR ALL USING (true);

CREATE POLICY "Allow all operations on businessesNeo" ON businessesNeo
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

CREATE TRIGGER update_businessesNeo_updated_at 
    BEFORE UPDATE ON businessesNeo 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create products table for individual product management
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    image_url TEXT,
    business_id VARCHAR(255) REFERENCES businessesNeo(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for products table
CREATE INDEX IF NOT EXISTS idx_products_business_id ON products(business_id);

-- Enable RLS for products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy for products table
CREATE POLICY "Allow all operations on products" ON products
    FOR ALL USING (true);

-- Create trigger for products updated_at
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('productimages', 'productimages', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for productimages bucket
CREATE POLICY "Public Access" ON storage.objects
    FOR SELECT USING (bucket_id = 'productimages');

CREATE POLICY "Authenticated users can upload" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'productimages' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update" ON storage.objects
    FOR UPDATE USING (bucket_id = 'productimages' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete" ON storage.objects
    FOR DELETE USING (bucket_id = 'productimages' AND auth.role() = 'authenticated');

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