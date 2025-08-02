import { BusinessData, TemplateConfig, GeneratedSite, BuildResult, EleventyBuildConfig } from '../types/business';
import { promises as fs } from 'fs';
import path from 'path';

// Mock EleventyConfig for now - in real implementation, you'd import from @11ty/eleventy
interface EleventyConfig {
  addPassthroughCopy(path: string): void;
  addFilter(name: string, filter: Function): void;
  addShortcode(name: string, shortcode: Function): void;
  setLibrary(name: string, library: any): void;
  getLibrary(name: string): any;
}

class MockEleventyConfig implements EleventyConfig {
  addPassthroughCopy(path: string): void {}
  addFilter(name: string, filter: Function): void {}
  addShortcode(name: string, shortcode: Function): void {}
  setLibrary(name: string, library: any): void {}
  getLibrary(name: string): any {
    return {};
  }
}

interface TemplateData {
  business: BusinessData;
  template: TemplateConfig;
  site: {
    title: string;
    description: string;
    url: string;
  };
}

export class EleventyService {
  private config: EleventyConfig;
  private templatesDir: string;
  private outputDir: string;

  constructor(templatesDir: string = 'templates', outputDir: string = '_site') {
    this.templatesDir = templatesDir;
    this.outputDir = outputDir;
    this.config = new MockEleventyConfig();
    this.setupConfig();
  }

  private setupConfig(): void {
    // Set input and output directories
    this.config.addPassthroughCopy('templates/base/styles.css');
    this.config.addPassthroughCopy('templates/base/scripts.js');
    this.config.addPassthroughCopy('templates/*/assets/**/*');

    // Add Nunjucks filters
    this.config.addFilter('formatCurrency', (amount: number): string => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(amount);
    });

    this.config.addFilter('urlencode', (str: string): string => {
      return encodeURIComponent(str);
    });

    this.config.addFilter('absoluteUrl', (url: string): string => {
      // This would be replaced with actual domain logic
      return `https://yourdomain.com${url}`;
    });

    // Add shortcodes
    this.config.addShortcode('businessInfo', (business: BusinessData): string => {
      return `
        <div class="business-info">
          <h1>${business.name}</h1>
          <p>${business.description}</p>
        </div>
      `;
    });

    // Configure Nunjucks
    this.config.setLibrary('njk', this.config.getLibrary('njk'));
  }

  /**
   * Generate a complete website for a business
   */
  async generateSite(businessData: BusinessData, templateId: string): Promise<GeneratedSite> {
    try {
      // Validate business data
      this.validateBusinessData(businessData, templateId);

      // Load template configuration
      const templateConfig = await this.loadTemplateConfig(templateId);

      // Create temporary data file
      const dataFile = await this.createDataFile(businessData, templateConfig);

      // Set up Eleventy configuration for this build
      const buildConfig = this.createBuildConfig(templateId, dataFile);

      // Build the site
      const buildResult = await this.buildSite(buildConfig);

      // Clean up temporary files
      await this.cleanup(dataFile);

      return {
        success: true,
        siteUrl: buildResult.siteUrl,
        files: buildResult.files,
        businessId: businessData.id,
        templateId: templateId
      };

    } catch (error) {
      console.error('Error generating site:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        businessId: businessData.id,
        templateId: templateId
      };
    }
  }

  /**
   * Validate business data against template requirements
   */
  private validateBusinessData(businessData: BusinessData, templateId: string): void {
    const templateConfig = this.loadTemplateConfigSync(templateId);
    const requiredFields = templateConfig.required_fields || [];

    for (const field of requiredFields) {
      if (!businessData[field as keyof BusinessData]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
  }

  /**
   * Load template configuration
   */
  private async loadTemplateConfig(templateId: string): Promise<TemplateConfig> {
    const configPath = path.join(this.templatesDir, templateId, 'config.json');
    
    try {
      const configContent = await fs.readFile(configPath, 'utf-8');
      return JSON.parse(configContent);
    } catch (error) {
      throw new Error(`Failed to load template config for ${templateId}: ${error}`);
    }
  }

  /**
   * Load template configuration synchronously
   */
  private loadTemplateConfigSync(templateId: string): TemplateConfig {
    const configPath = path.join(this.templatesDir, templateId, 'config.json');
    
    try {
      const configContent = fs.readFileSync(configPath, 'utf-8');
      return JSON.parse(configContent);
    } catch (error) {
      throw new Error(`Failed to load template config for ${templateId}: ${error}`);
    }
  }

  /**
   * Create temporary data file for Eleventy
   */
  private async createDataFile(businessData: BusinessData, templateConfig: TemplateConfig): Promise<string> {
    const data: TemplateData = {
      business: businessData,
      template: templateConfig,
      site: {
        title: businessData.name,
        description: businessData.description,
        url: `https://${businessData.subdomain || businessData.id}.umkmgodigital.com`
      }
    };

    const dataFile = path.join(process.cwd(), 'temp', `data-${businessData.id}.json`);
    await fs.mkdir(path.dirname(dataFile), { recursive: true });
    await fs.writeFile(dataFile, JSON.stringify(data, null, 2));

    return dataFile;
  }

  /**
   * Create build configuration for Eleventy
   */
  private createBuildConfig(templateId: string, dataFile: string): EleventyBuildConfig {
    return {
      input: path.join(this.templatesDir, templateId),
      output: path.join(this.outputDir, templateId),
      data: dataFile,
      config: this.config
    };
  }

  /**
   * Build the site using Eleventy
   */
  private async buildSite(buildConfig: EleventyBuildConfig): Promise<BuildResult> {
    // This would integrate with Eleventy's build process
    // For now, we'll simulate the build process
    
    const { input, output } = buildConfig;
    
    // Read the template file
    const templatePath = path.join(input, 'template.njk');
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    
    // Load the data file
    const dataContent = await fs.readFile(buildConfig.data, 'utf-8');
    const data: TemplateData = JSON.parse(dataContent);
    
    // Process the template with data
    const processedContent = await this.processTemplate(templateContent, data);
    
    // Create output directory
    await fs.mkdir(output, { recursive: true });
    
    // Write the processed HTML
    const outputFile = path.join(output, 'index.html');
    await fs.writeFile(outputFile, processedContent);
    
    // Copy assets
    await this.copyAssets(input, output);
    
    return {
      siteUrl: `https://${data.business.subdomain || data.business.id}.umkmgodigital.com`,
      files: [outputFile]
    };
  }

  /**
   * Process template with data (simplified version)
   */
  private async processTemplate(templateContent: string, data: TemplateData): Promise<string> {
    // This is a simplified template processor
    // In a real implementation, you'd use Nunjucks or similar
    
    let processed = templateContent;
    
    // Replace basic variables
    processed = processed.replace(/\{\{\s*business\.name\s*\}\}/g, data.business.name);
    processed = processed.replace(/\{\{\s*business\.description\s*\}\}/g, data.business.description);
    processed = processed.replace(/\{\{\s*business\.phone\s*\}\}/g, data.business.phone || '');
    processed = processed.replace(/\{\{\s*business\.address\s*\}\}/g, data.business.address || '');
    
    // Handle conditional blocks
    if (data.business.menu) {
      processed = this.processMenuSection(processed, data.business.menu);
    }
    
    if (data.business.gallery) {
      processed = this.processGallerySection(processed, data.business.gallery);
    }
    
    return processed;
  }

  /**
   * Process menu section
   */
  private processMenuSection(template: string, menu: any[]): string {
    let menuHtml = '';
    
    for (const category of menu) {
      menuHtml += `<div class="card slide-up"><div class="card-body">`;
      menuHtml += `<h3 class="text-xl font-semibold mb-4">${category.name}</h3>`;
      menuHtml += `<div class="space-y-4">`;
      
      for (const item of category.items) {
        menuHtml += `<div class="flex justify-between items-start">`;
        menuHtml += `<div class="flex-1"><h4 class="font-medium">${item.name}</h4>`;
        if (item.description) {
          menuHtml += `<p class="text-sm text-gray-600 mt-1">${item.description}</p>`;
        }
        menuHtml += `</div>`;
        menuHtml += `<div class="text-right ml-4">`;
        menuHtml += `<p class="font-semibold text-green-600">Rp ${item.price.toLocaleString('id-ID')}</p>`;
        if (item.available === false) {
          menuHtml += `<p class="text-xs text-red-500">Habis</p>`;
        }
        menuHtml += `</div></div>`;
      }
      
      menuHtml += `</div></div></div>`;
    }
    
    // Use a simpler regex without the 's' flag for broader compatibility
    return template.replace(/\{%\s*for category in business\.menu\s*%\}([\s\S]*?)\{%\s*endfor\s*%\}/g, menuHtml);
  }

  /**
   * Process gallery section
   */
  private processGallerySection(template: string, gallery: any[]): string {
    let galleryHtml = '';
    
    for (const image of gallery) {
      galleryHtml += `<div class="card slide-up">`;
      galleryHtml += `<img src="${image.url}" alt="${image.caption || 'Gallery image'}" `;
      galleryHtml += `class="card-image gallery-image cursor-pointer" data-caption="${image.caption || ''}">`;
      galleryHtml += `</div>`;
    }
    
    // Use a simpler regex without the 's' flag for broader compatibility
    return template.replace(/\{%\s*for image in business\.gallery\s*%\}([\s\S]*?)\{%\s*endfor\s*%\}/g, galleryHtml);
  }

  /**
   * Copy assets from template to output
   */
  private async copyAssets(input: string, output: string): Promise<void> {
    const assetsDir = path.join(input, 'assets');
    
    try {
      await fs.access(assetsDir);
      const assetsOutputDir = path.join(output, 'assets');
      await fs.mkdir(assetsOutputDir, { recursive: true });
      
      // Copy assets recursively
      await this.copyDirectory(assetsDir, assetsOutputDir);
    } catch (error) {
      // Assets directory doesn't exist, skip
    }
  }

  /**
   * Copy directory recursively
   */
  private async copyDirectory(src: string, dest: string): Promise<void> {
    const entries = await fs.readdir(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        await fs.mkdir(destPath, { recursive: true });
        await this.copyDirectory(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  }

  /**
   * Clean up temporary files
   */
  private async cleanup(dataFile: string): Promise<void> {
    try {
      await fs.unlink(dataFile);
    } catch (error) {
      // Ignore cleanup errors
    }
  }

  /**
   * Get available templates
   */
  async getAvailableTemplates(): Promise<string[]> {
    try {
      const templates = await fs.readdir(this.templatesDir);
      return templates.filter((template: string) => {
        const configPath = path.join(this.templatesDir, template, 'config.json');
        try {
          fs.accessSync(configPath);
          return true;
        } catch {
          return false;
        }
      });
    } catch (error) {
      throw new Error(`Failed to read templates directory: ${error}`);
    }
  }

  /**
   * Get template configuration
   */
  async getTemplateConfig(templateId: string): Promise<TemplateConfig> {
    return await this.loadTemplateConfig(templateId);
  }

  /**
   * Validate template exists
   */
  async validateTemplate(templateId: string): Promise<boolean> {
    try {
      const configPath = path.join(this.templatesDir, templateId, 'config.json');
      await fs.access(configPath);
      return true;
    } catch {
      return false;
    }
  }
}

// Export the service
export default EleventyService; 