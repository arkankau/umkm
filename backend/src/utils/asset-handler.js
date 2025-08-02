import { promises as fs } from 'fs';
import path from 'path';

// Copy base assets (CSS, JS) to the output directory
export async function copyBaseAssets(outputDir) {
  const baseDir = path.join(process.cwd(), 'templates', 'base');
  
  try {
    // Create assets directory if it doesn't exist
    await fs.mkdir(path.join(outputDir, 'assets'), { recursive: true });
    
    // Copy CSS
    const cssContent = await fs.readFile(path.join(baseDir, 'styles.css'), 'utf-8');
    await fs.writeFile(path.join(outputDir, 'assets', 'styles.css'), cssContent);
    
    // Copy JS
    const jsContent = await fs.readFile(path.join(baseDir, 'scripts.js'), 'utf-8');
    await fs.writeFile(path.join(outputDir, 'assets', 'scripts.js'), jsContent);
    
    return {
      cssPath: '/assets/styles.css',
      jsPath: '/assets/scripts.js'
    };
  } catch (error) {
    console.error('Error copying base assets:', error);
    throw error;
  }
}

// Copy category-specific assets
export async function copyCategoryAssets(category, outputDir) {
  const categoryDir = path.join(process.cwd(), 'templates', category, 'assets');
  
  try {
    // Check if category has assets directory
    try {
      await fs.access(categoryDir);
    } catch {
      return {}; // No assets directory, return empty object
    }
    
    // Create category assets directory
    const categoryAssetsDir = path.join(outputDir, 'assets', category);
    await fs.mkdir(categoryAssetsDir, { recursive: true });
    
    // Copy all files from category assets
    const files = await fs.readdir(categoryDir);
    for (const file of files) {
      const content = await fs.readFile(path.join(categoryDir, file));
      await fs.writeFile(path.join(categoryAssetsDir, file), content);
    }
    
    return {
      categoryAssetsPath: `/assets/${category}`
    };
  } catch (error) {
    console.error(`Error copying ${category} assets:`, error);
    throw error;
  }
}
