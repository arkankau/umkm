-- Create menus table for storing business menus
CREATE TABLE IF NOT EXISTS menus (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    businessId VARCHAR(255) REFERENCES businessesNeo(businessId) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    submenus JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_menus_businessId ON menus(businessId);

-- Enable Row Level Security (RLS)
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can modify this based on your security needs)
CREATE POLICY "Allow all operations on menus" ON menus
    FOR ALL USING (true);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_menus_updated_at 
    BEFORE UPDATE ON menus 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 