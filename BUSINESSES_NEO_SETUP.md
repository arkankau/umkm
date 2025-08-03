# BusinessesNeo Table Setup Guide

This guide explains the new `businessesNeo` table structure and how it integrates with your existing code.

## 🆕 What's New

### 1. **businessesNeo Table**
Created a new table that matches your exact BusinessProfileForm structure:

```sql
CREATE TABLE businessesNeo (
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
```

### 2. **UUID Generation Function**
Added a utility function to generate random UUIDs:

```typescript
// lib/utils.ts
export function generateBusinessId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
```

### 3. **Updated Products Table**
Products now reference `businessesNeo`:

```sql
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    image_url TEXT,
    business_id VARCHAR(255) REFERENCES businessesNeo(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔧 Updated Components

### 1. **BusinessProfileForm.tsx**
- ✅ Uses `businessesNeo` table
- ✅ Generates random UUID for `id` field
- ✅ Uses correct column names (camelCase)
- ✅ Products reference the correct business_id

### 2. **API Functions**
- ✅ Added `getBusinessInfoNeo()` function
- ✅ Created `/api/get-business-neo` endpoint
- ✅ Updated logo generator to work with businessesNeo

### 3. **Logo Generator**
- ✅ Updated to use `businessesNeo` table
- ✅ Uses correct column names (`logoUrl` instead of `logo_url`)

## 📋 Column Mapping

| BusinessProfileForm | businessesNeo Table |
|-------------------|-------------------|
| `businessId` | `businessId` |
| `businessName` | `businessName` |
| `ownerName` | `ownerName` |
| `description` | `description` |
| `category` | `category` |
| `products` | `products` |
| `phone` | `phone` |
| `email` | `email` |
| `address` | `address` |
| `whatsapp` | `whatsapp` |
| `instagram` | `instagram` |
| `logoFile` | `logoUrl` (after upload) |

## 🚀 How It Works

### 1. **Business Creation Flow**
```typescript
// 1. Generate UUID for business
const businessUuid = generateBusinessId();

// 2. Insert into businessesNeo
const { data: businessData } = await supabaseClient
  .from('businessesNeo')
  .insert({
    id: businessUuid,
    businessId: formData.businessId,
    businessName: formData.businessName,
    // ... other fields
  });

// 3. Create products with correct business_id
const productsToInsert = products.map(product => ({
  name: product.name,
  business_id: businessData.id, // References businessesNeo.id
  // ... other fields
}));
```

### 2. **Logo Generation Flow**
```typescript
// 1. Generate logo using AI
const logoUrl = await generateAndUploadLogo(prompt, businessId);

// 2. Update businessesNeo table
await supabase
  .from('businessesNeo')
  .update({ logoUrl: logoUrl })
  .eq('id', businessId);
```

### 3. **Business Retrieval Flow**
```typescript
// 1. Get business from businessesNeo
const business = await supabase
  .from('businessesNeo')
  .select('*')
  .eq('businessId', businessId)
  .single();

// 2. Get associated products
const products = await supabase
  .from('products')
  .select('*')
  .eq('business_id', business.id);
```

## 🧪 Testing

### Run the Test Script
```bash
node test-supabase-setup.js
```

This will test:
- ✅ Database connection to businessesNeo
- ✅ Business creation in businessesNeo
- ✅ Product creation with correct business_id
- ✅ Storage bucket access
- ✅ Data cleanup

### Manual Testing
1. **Create a business** using BusinessProfileForm
2. **Check businessesNeo table** in Supabase dashboard
3. **Verify products** are created with correct business_id
4. **Test logo generation** - should update businessesNeo.logoUrl
5. **Test business retrieval** via API

## 🔍 Database Schema

### businessesNeo Table
```sql
id VARCHAR(255) PRIMARY KEY           -- Generated UUID
businessId VARCHAR(255) UNIQUE NOT NULL -- User-provided business ID
businessName VARCHAR(255) NOT NULL
ownerName VARCHAR(255) NOT NULL
description TEXT NOT NULL
category VARCHAR(50) NOT NULL
products TEXT NOT NULL
phone VARCHAR(20) NOT NULL
email VARCHAR(255)
address TEXT NOT NULL
whatsapp VARCHAR(20)
instagram VARCHAR(100)
logoUrl TEXT
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

### products Table
```sql
id UUID DEFAULT gen_random_uuid() PRIMARY KEY
name VARCHAR(255) NOT NULL
description TEXT
price DECIMAL(10,2)
image_url TEXT
business_id VARCHAR(255) REFERENCES businessesNeo(id) ON DELETE CASCADE
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

## 🔗 Relationships

- **businessesNeo** ← Primary table for business data
- **products** → References `businessesNeo.id` via `business_id`
- **Storage** → Stores images in `productimages` bucket

## 🎯 Benefits

1. **Exact Code Match** - Table structure matches your existing code
2. **Proper UUIDs** - Generated UUIDs for unique identification
3. **Correct Relationships** - Products properly reference businesses
4. **Logo Integration** - Logo generator works with the new structure
5. **API Compatibility** - All existing APIs work with the new table

## 🚨 Important Notes

1. **Run the SQL Setup** - Execute `supabase-setup.sql` in your Supabase dashboard
2. **Environment Variables** - Make sure your `.env.local` has the correct Supabase credentials
3. **Test Everything** - Use the test script to verify the setup works
4. **Backup Data** - If you have existing data, consider backing it up before switching

## 🔧 Troubleshooting

### Common Issues

1. **"Table 'businessesNeo' does not exist"**
   - Run the SQL setup script in Supabase dashboard

2. **"Column 'businessName' does not exist"**
   - Make sure you're using the businessesNeo table, not businesses

3. **"Foreign key constraint failed"**
   - Verify products.business_id references businessesNeo.id

4. **"Cannot find module" errors**
   - Install missing dependencies: `npm install @supabase/supabase-js`

### Debug Steps

1. **Check Supabase Dashboard** - Verify tables exist
2. **Run Test Script** - `node test-supabase-setup.js`
3. **Check Browser Console** - Look for API errors
4. **Verify Environment Variables** - Check .env.local file

## 📚 Next Steps

1. **Test the complete workflow** from business creation to logo generation
2. **Verify all features work** with the new table structure
3. **Update any other components** that might reference the old table
4. **Consider data migration** if you have existing data in the old table

The new `businessesNeo` table should now work perfectly with your existing BusinessProfileForm code! 