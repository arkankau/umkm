# BusinessProfileForm Debugging Checklist

## 🔍 **Step-by-Step Debugging Process**

### **Step 1: Environment Setup Check**
- [ ] **Environment Variables**: Check `.env.local` has correct Supabase credentials
- [ ] **Supabase Project**: Verify project is active and accessible
- [ ] **Database Tables**: Confirm `businessesNeo` and `products` tables exist
- [ ] **Storage Bucket**: Verify `productimages` bucket exists and is public

### **Step 2: Browser Console Analysis**
1. **Open Developer Tools** (F12)
2. **Go to Console tab**
3. **Try submitting the form**
4. **Look for these specific logs**:

#### ✅ **Expected Success Logs:**
```
🚀 Starting form submission...
📋 Form data: {businessId: "...", businessName: "...", ...}
👤 User: {id: "...", email: "..."}
✅ Validation passed, starting submission...
📤 Starting logo upload...
🆔 Generated UUID: "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
📝 Inserting business data: {...}
✅ Business created successfully: {...}
📦 Processing products: X
✅ Products created successfully
🎉 Business profile created successfully!
🏁 Form submission completed
```

#### ❌ **Error Indicators:**
- **"Cannot find module"** → Missing dependencies
- **"Table does not exist"** → Database schema issue
- **"Column does not exist"** → Column name mismatch
- **"Foreign key constraint failed"** → Relationship issue
- **"Bucket does not exist"** → Storage setup issue
- **"Authentication failed"** → User/session issue

### **Step 3: Database Verification**

#### **Check Supabase Dashboard:**
1. **Go to Table Editor**
2. **Verify tables exist**:
   - `businessesNeo` table
   - `products` table
3. **Check column names** in `businessesNeo`:
   - `id` (VARCHAR(255))
   - `businessId` (VARCHAR(255))
   - `businessName` (VARCHAR(255))
   - `ownerName` (VARCHAR(255))
   - `logoUrl` (TEXT)
   - etc.

#### **Check RLS Policies:**
1. **Go to Authentication → Policies**
2. **Verify policies exist** for:
   - `businessesNeo` table
   - `products` table
   - `storage.objects` (for `productimages` bucket)

### **Step 4: Storage Verification**

#### **Check Storage Bucket:**
1. **Go to Storage**
2. **Verify `productimages` bucket exists**
3. **Check bucket is public**
4. **Verify RLS policies allow uploads**

### **Step 5: API Testing**

#### **Test Database Connection:**
```bash
node test-supabase-setup.js
```

#### **Expected Output:**
```
🚀 Starting Supabase setup verification...

📋 Testing: Database Connection
✅ Database connection successful
📊 Found X business records in businessesNeo

📋 Testing: Storage Bucket
✅ Storage bucket accessible
📁 Found X files in bucket

📋 Testing: Business Creation
✅ Business creation successful
🆔 Created business with ID: test-uuid-...
✅ Product creation successful
🆔 Created product with ID: ...
🧹 Test data cleaned up

📊 Test Results: 3/3 tests passed
🎉 All tests passed! Your Supabase setup is working correctly.
```

### **Step 6: Common Error Solutions**

#### **Error: "Table 'businessesNeo' does not exist"**
**Solution:**
1. Run the SQL setup script in Supabase dashboard
2. Copy `supabase-setup.sql` content
3. Execute in SQL Editor

#### **Error: "Column 'businessName' does not exist"**
**Solution:**
1. Check table structure in Supabase dashboard
2. Verify column names match exactly
3. Re-run SQL setup if needed

#### **Error: "Foreign key constraint failed"**
**Solution:**
1. Check `products.business_id` references `businessesNeo.id`
2. Verify data types match (VARCHAR(255))
3. Check if business record exists before creating products

#### **Error: "Bucket 'productimages' does not exist"**
**Solution:**
1. Create bucket manually in Storage section
2. Set bucket to public
3. Add RLS policies for uploads

#### **Error: "Authentication failed"**
**Solution:**
1. Check user is logged in
2. Verify Supabase auth session
3. Check environment variables

### **Step 7: Manual Testing Steps**

#### **Test Form Submission:**
1. **Fill out all required fields**:
   - Business ID: `test-business-123`
   - Business Name: `Test Business`
   - Owner Name: `Test Owner`
   - Phone: `081234567890`
   - Address: `Test Address`
   - Description: `Test description`

2. **Submit form and watch console**

3. **Check for specific error messages**

#### **Test Logo Upload:**
1. **Select a logo file** (JPG/PNG, < 5MB)
2. **Submit form**
3. **Check if logo uploads successfully**

#### **Test Product Creation:**
1. **Add a product** with image
2. **Submit form**
3. **Check if product and image upload successfully**

### **Step 8: Data Verification**

#### **After Successful Submission:**
1. **Check `businessesNeo` table** for new record
2. **Check `products` table** for product records
3. **Check `productimages` bucket** for uploaded files
4. **Verify foreign key relationships**

### **Step 9: Performance Issues**

#### **If Form is Slow:**
1. **Check network tab** for slow requests
2. **Verify image file sizes** (< 5MB)
3. **Check Supabase project region** (should be close to users)
4. **Monitor Supabase dashboard** for performance metrics

### **Step 10: Final Verification**

#### **Complete Workflow Test:**
1. ✅ **Create business** via form
2. ✅ **Upload logo** via logo generator
3. ✅ **Add products** with images
4. ✅ **Retrieve business** via API
5. ✅ **Display business** in dashboard

## 🚨 **Emergency Debugging**

### **If Nothing Works:**
1. **Check Supabase project status** (dashboard)
2. **Verify billing/quotas** (free tier limits)
3. **Check environment variables** are loaded
4. **Restart development server**
5. **Clear browser cache**
6. **Check for TypeScript errors**

### **Quick Fix Commands:**
```bash
# Install missing dependencies
npm install @supabase/supabase-js @google/generative-ai

# Run test script
node test-supabase-setup.js

# Restart dev server
npm run dev
```

## 📞 **Getting Help**

### **When to Ask for Help:**
- All tests pass but form still fails
- Specific error message not in this guide
- Database/API works but UI doesn't
- Performance issues after optimization

### **What to Include:**
- Exact error message from console
- Screenshot of Supabase dashboard
- Test script output
- Environment variables (without sensitive data)
- Browser console logs

This checklist should help you systematically identify and fix any issues with the BusinessProfileForm! 