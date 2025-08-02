// Template rendering system using Nunjucks
import nunjucks from 'nunjucks';
import { promises as fs } from 'fs';
import path from 'path';

// Initialize Nunjucks environment
const templatesPath = path.join(process.cwd(), 'templates');
const nunjucksEnv = nunjucks.configure(templatesPath, {
  autoescape: true,
  throwOnUndefined: false
});

// Add custom filters
nunjucksEnv.addFilter('date', (str, format) => {
  const date = new Date(str);
  // Simple format implementation - expand as needed
  return format.replace('YYYY', date.getFullYear());
});

nunjucksEnv.addFilter('absoluteUrl', (url) => {
  // In production, this would use the actual domain
  return `https://example.com${url}`;
});

nunjucksEnv.addFilter('formatCurrency', (price) => {
  return price.toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
});

// Load and compile templates
async function loadTemplateFile(category) {
  const templatePath = path.join(templatesPath, category, 'template.njk');
  try {
    return await fs.readFile(templatePath, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to load template for category ${category}: ${error.message}`);
  }
}

import { copyBaseAssets, copyCategoryAssets } from './asset-handler.js';

// Render template with business data and color scheme
export async function renderTemplate(category, businessData, colorScheme, outputDir = './generated') {
  try {
    // Copy assets and get their paths
    const baseAssets = await copyBaseAssets(outputDir);
    const categoryAssets = await copyCategoryAssets(category, outputDir);

    // Normalize the data structure
    const normalizedData = {
      business: {
        ...businessData,
        name: businessData.businessName,
        // Convert string products to proper format if needed
        menu: Array.isArray(businessData.products) ? businessData.products : 
              [{ 
                name: 'Menu', 
                items: businessData.products.split(',').map(item => ({
                  name: item.trim(),
                  price: 0,
                  description: ''
                }))
              }]
      },
      page: {
        url: '/',
        cssPath: baseAssets.cssPath,
        jsPath: baseAssets.jsPath,
        categoryAssetsPath: categoryAssets.categoryAssetsPath || '',
        theme: colorScheme
      }
    };

    // Render the template
    return nunjucks.render(`${category}/template.njk`, normalizedData);
  } catch (error) {
    throw new Error(`Failed to render template: ${error.message}`);
  }
}
