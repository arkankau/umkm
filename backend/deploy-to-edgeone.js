import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

async function deployToEdgeOne() {
  console.log('🚀 Deploying to EdgeOne...\n');
  
  try {
    const deployDir = path.join(process.cwd(), 'deploy', 'warungpakbudit5m0');
    const htmlPath = path.join(deployDir, 'index.html');
    
    // Check if files exist
    console.log('1️⃣ Checking deployment files...');
    const files = await fs.readdir(deployDir);
    console.log('✅ Files found:', files);
    
    // Read the HTML content
    console.log('\n2️⃣ Reading HTML content...');
    const html = await fs.readFile(htmlPath, 'utf8');
    console.log('✅ HTML content loaded (length):', html.length);
    
    // Create a temporary wrangler.toml for this deployment
    console.log('\n3️⃣ Creating deployment configuration...');
    const tempWranglerConfig = `
name = "warungpakbudit5m0"
compatibility_date = "2024-01-01"

[site]
bucket = "./deploy/warungpakbudit5m0"
entry-point = ""

[env.production]
name = "warungpakbudit5m0-prod"
    `.trim();
    
    const tempWranglerPath = path.join(process.cwd(), 'wrangler-deploy.toml');
    await fs.writeFile(tempWranglerPath, tempWranglerConfig);
    console.log('✅ Temporary wrangler config created');
    
    // Try to deploy using wrangler
    console.log('\n4️⃣ Attempting deployment with Wrangler...');
    try {
      const deployCommand = `npx wrangler pages deploy deploy/warungpakbudit5m0 --project-name=warungpakbudit5m0`;
      console.log('Running:', deployCommand);
      
      const result = execSync(deployCommand, { 
        cwd: process.cwd(),
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      console.log('✅ Deployment successful!');
      console.log('Output:', result);
      
    } catch (error) {
      console.log('❌ Wrangler deployment failed:', error.message);
      
      // Try alternative deployment method
      console.log('\n5️⃣ Trying alternative deployment method...');
      try {
        const pagesDeployCommand = `npx wrangler pages project create warungpakbudit5m0`;
        console.log('Creating Pages project...');
        execSync(pagesDeployCommand, { cwd: process.cwd(), stdio: 'pipe' });
        
        const deployCommand = `npx wrangler pages deploy deploy/warungpakbudit5m0 --project-name=warungpakbudit5m0`;
        console.log('Deploying to Pages...');
        const result = execSync(deployCommand, { cwd: process.cwd(), encoding: 'utf8', stdio: 'pipe' });
        
        console.log('✅ Alternative deployment successful!');
        console.log('Output:', result);
        
      } catch (altError) {
        console.log('❌ Alternative deployment also failed:', altError.message);
        console.log('\n📋 Manual deployment instructions:');
        console.log('1. Go to EdgeOne/Cloudflare dashboard');
        console.log('2. Create a new Pages project');
        console.log('3. Upload the files from:', deployDir);
        console.log('4. Configure custom domain if needed');
      }
    }
    
    // Clean up temporary file
    await fs.unlink(tempWranglerPath);
    console.log('\n✅ Cleanup completed');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error);
  }
}

// Run the deployment
deployToEdgeOne(); 