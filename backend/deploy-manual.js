import fs from 'fs/promises';
import path from 'path';

async function prepareForManualDeployment() {
  console.log('🚀 Preparing website for manual deployment...\n');
  
  try {
    const deployDir = path.join(process.cwd(), 'deploy', 'warungpakbudit5m0');
    
    // Check files
    console.log('1️⃣ Checking deployment files...');
    const files = await fs.readdir(deployDir);
    console.log('✅ Files found:', files);
    
    // Read HTML content
    const htmlPath = path.join(deployDir, 'index.html');
    const html = await fs.readFile(htmlPath, 'utf8');
    console.log('✅ HTML content loaded (length):', html.length);
    
    // Create deployment instructions
    console.log('\n2️⃣ Creating deployment instructions...');
    const instructions = `
# 🚀 Manual Deployment Instructions

## Website Details
- **Business Name**: Warung Pak Budi
- **Subdomain**: warungpakbudit5m0
- **Target URL**: https://warungpakbudit5m0.umkm.id
- **Files**: ${deployDir}

## Deployment Options

### Option 1: EdgeOne Pages (Recommended)
1. Go to EdgeOne dashboard: https://edgeone.com
2. Navigate to Pages section
3. Create new project: "warungpakbudit5m0"
4. Upload files from: ${deployDir}
5. Configure custom domain: warungpakbudit5m0.umkm.id
6. Deploy

### Option 2: Cloudflare Pages
1. Go to Cloudflare dashboard: https://dash.cloudflare.com
2. Navigate to Pages section
3. Create new project: "warungpakbudit5m0"
4. Upload files from: ${deployDir}
5. Configure custom domain: warungpakbudit5m0.umkm.id
6. Deploy

### Option 3: Any Web Hosting
1. Upload files from: ${deployDir}
2. Configure DNS for: warungpakbudit5m0.umkm.id
3. Set up SSL certificate
4. Deploy

## Files to Upload
- index.html (main website)
- deployment-info.json (metadata)

## Website Features
✅ Responsive design
✅ Contact information
✅ Social media links
✅ Google Maps integration
✅ WhatsApp direct messaging
✅ Instagram profile link

## Next Steps
1. Choose deployment option above
2. Upload the files
3. Configure DNS if needed
4. Test the live website
5. Share the URL with the business owner

🎉 Your website is ready for deployment!
    `.trim();
    
    const instructionsPath = path.join(deployDir, 'DEPLOYMENT_INSTRUCTIONS.md');
    await fs.writeFile(instructionsPath, instructions);
    console.log('✅ Deployment instructions created');
    
    // Create a zip file for easy upload
    console.log('\n3️⃣ Creating deployment package...');
    const { execSync } = await import('child_process');
    
    try {
      const zipCommand = `cd ${deployDir} && zip -r ../warungpakbudit5m0-website.zip .`;
      execSync(zipCommand, { stdio: 'pipe' });
      console.log('✅ Deployment package created: warungpakbudit5m0-website.zip');
    } catch (error) {
      console.log('⚠️ Could not create zip file, but files are ready for manual upload');
    }
    
    console.log('\n🎉 Website ready for deployment!');
    console.log('📁 Deployment directory:', deployDir);
    console.log('📄 Files available:');
    console.log('   - index.html (main website)');
    console.log('   - deployment-info.json (metadata)');
    console.log('   - DEPLOYMENT_INSTRUCTIONS.md (instructions)');
    
    console.log('\n🌐 Target URL: https://warungpakbudit5m0.umkm.id');
    console.log('📋 Next: Follow the instructions in DEPLOYMENT_INSTRUCTIONS.md');
    
  } catch (error) {
    console.error('❌ Error preparing deployment:', error);
  }
}

// Run the preparation
prepareForManualDeployment(); 