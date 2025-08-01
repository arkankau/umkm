// Generate sample HTML for visual verification
// Run with: node test/generate-sample-html.js

import { validateBusinessData, generateUUID, generateSubdomain } from '../src/utils/validation.js';
import { loadTemplate, processTemplate } from '../src/utils/template.js';
import { writeFileSync } from 'fs';
import { join } from 'path';

// Sample business data
const sampleBusinessData = {
  businessName: "Warung Pak Budi",
  ownerName: "Budi Santoso",
  description: "Warung makan tradisional dengan cita rasa autentik Indonesia. Menyajikan berbagai masakan tradisional dengan bahan berkualitas dan rasa yang nikmat.",
  category: "restaurant",
  products: "Nasi goreng spesial, Mie goreng ayam, Soto ayam, Es teh manis, Es jeruk, Kopi hitam",
  phone: "081234567890",
  email: "budi@warungpakbudi.com",
  address: "Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10220",
  whatsapp: "081234567890",
  instagram: "warungpakbudi"
};

async function generateSampleHTML() {
  console.log("🎨 Generating sample HTML files...\n");
  
  try {
    // Validate and process data
    const validated = validateBusinessData(sampleBusinessData);
    const businessId = generateUUID();
    const subdomain = generateSubdomain(validated.businessName);
    
    console.log("✅ Business data validated");
    console.log("✅ Business ID:", businessId);
    console.log("✅ Subdomain:", subdomain);
    
    // Generate HTML for each template
    const categories = ['restaurant', 'retail', 'service', 'other'];
    
    for (const category of categories) {
      console.log(`\n📄 Generating ${category} template...`);
      
      const template = await loadTemplate(category);
      const processedHtml = processTemplate(template, validated);
      
      // Save to file
      const filename = `sample-${category}-website.html`;
      const filepath = join(process.cwd(), 'test', filename);
      
      writeFileSync(filepath, processedHtml, 'utf8');
      
      console.log(`✅ ${category} template saved to: ${filename}`);
      console.log(`   - File size: ${processedHtml.length} characters`);
      console.log(`   - Business name found: ${processedHtml.includes(validated.businessName)}`);
      console.log(`   - Phone number found: ${processedHtml.includes(validated.phone)}`);
    }
    
    // Create a summary file
    const summary = `
# UMKM Go Digital - Sample Websites

Generated on: ${new Date().toISOString()}
Business: ${validated.businessName}
Category: ${validated.category}
Subdomain: ${subdomain}

## Generated Files:
${categories.map(cat => `- sample-${cat}-website.html`).join('\n')}

## Business Information:
- Name: ${validated.businessName}
- Owner: ${validated.ownerName}
- Category: ${validated.category}
- Phone: ${validated.phone}
- Address: ${validated.address}
- WhatsApp: ${validated.whatsapp}
- Instagram: ${validated.instagram}

## Website URLs (simulated):
${categories.map(cat => `- ${cat}: https://${subdomain}.umkm.id`).join('\n')}

## Features Included:
✅ Mobile-responsive design
✅ Contact information integration
✅ Social media links
✅ Google Maps integration
✅ WhatsApp direct messaging
✅ Professional styling
✅ Indonesian language content
`;

    const summaryPath = join(process.cwd(), 'test', 'sample-websites-summary.md');
    writeFileSync(summaryPath, summary, 'utf8');
    
    console.log("\n📋 Summary saved to: sample-websites-summary.md");
    console.log("\n🎉 Sample HTML generation completed!");
    console.log("\n📁 Files generated in test/ directory:");
    categories.forEach(cat => console.log(`   - sample-${cat}-website.html`));
    console.log("   - sample-websites-summary.md");
    
  } catch (error) {
    console.error("❌ Error generating sample HTML:", error.message);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSampleHTML().catch(console.error);
}

export { generateSampleHTML }; 