-- Create businessesNeo table with proper schema
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
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Add user_id for ownership
    websiteGenerated BOOLEAN DEFAULT FALSE, -- Track if website is generated
    websiteUrl TEXT, -- Store website URL
    deployed_at TIMESTAMP WITH TIME ZONE, -- Track deployment time
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_businessesNeo_user_id ON businessesNeo(user_id);
CREATE INDEX IF NOT EXISTS idx_businessesNeo_businessId ON businessesNeo(businessId);
CREATE INDEX IF NOT EXISTS idx_businessesNeo_created_at ON businessesNeo(created_at);

-- Enable Row Level Security
ALTER TABLE businessesNeo ENABLE ROW LEVEL SECURITY;

-- Create policy for user-specific access
CREATE POLICY "Users can only access their own businesses" ON businessesNeo
    FOR ALL USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_businessesNeo_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_businessesNeo_updated_at 
    BEFORE UPDATE ON businessesNeo
    FOR EACH ROW 
    EXECUTE FUNCTION update_businessesNeo_updated_at();