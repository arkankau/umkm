# Puppeteer Deployment Integration

This document describes the puppeteer-based deployment integration for the UMKM Go Digital platform.

## Overview

The puppeteer deployment system automates the deployment process by using a headless browser to interact with the EdgeOne Pages interface. This provides a more reliable deployment method that mimics human interaction.

## Features

### Security & Anti-Detection
- **Headless Mode**: Runs in new headless mode for better performance
- **Random User Agents**: Rotates between different browser user agents
- **Random Viewports**: Uses different viewport sizes to appear more human-like
- **Cookie Clearing**: Clears cookies and cache before each deployment
- **Enhanced Headers**: Sets realistic HTTP headers

### Error Handling
- **Domain Conflict Resolution**: Automatically handles domain name conflicts
- **Retry Logic**: Implements intelligent retry mechanisms
- **Fallback System**: Falls back to API deployment if puppeteer fails
- **Timeout Handling**: Proper timeout management for all operations

### Performance Optimizations
- **Browser Arguments**: Optimized Chrome flags for better performance
- **Resource Management**: Proper browser cleanup and resource management
- **Memory Optimization**: Disables unnecessary features to reduce memory usage

## Integration Flow

1. **Template Generation**: HTML is generated from business data and template
2. **Puppeteer Deployment**: Attempts deployment using puppeteer automation
3. **Success Check**: Verifies deployment success through multiple indicators
4. **Fallback**: If puppeteer fails, falls back to API deployment
5. **Status Update**: Updates business data with deployment results

## Usage

### Basic Usage
```javascript
import puppeteerDeploy from './src/api/puppeteer-deploy.js';

const result = await puppeteerDeploy(htmlCode, domain);
```

### Integration with Main Flow
```javascript
import { deployToEdgeOne } from './src/utils/deployment.js';

const deployment = await deployToEdgeOne(subdomain, html, businessData, env);
```

## Configuration

### Browser Settings
The puppeteer browser is launched with the following optimizations:
- Headless mode enabled
- Sandbox disabled for better compatibility
- GPU acceleration disabled
- Various security and performance flags

### User Agent Rotation
The system rotates between 5 different user agents:
- Chrome on Windows
- Chrome on macOS
- Chrome on Linux
- Firefox on Windows
- Firefox on macOS

### Viewport Rotation
Random viewport sizes are used:
- 1920x1080
- 1366x768
- 1440x900
- 1536x864
- 1280x720

## Error Handling

### Domain Conflicts
When a domain name already exists, the system:
1. Detects the conflict message
2. Appends a number to the domain
3. Retries up to 5 times
4. Uses the first available domain

### Deployment Verification
The system checks for multiple success indicators:
- "Deployment successful" text
- "Your site is live" text
- "Deployed successfully" text
- Links containing ".umkm.id"

## Testing

### Test Scripts
- `npm run test:puppeteer`: Tests puppeteer deployment in isolation
- `npm run test:full-deployment`: Tests the complete deployment flow

### Running Tests
```bash
# Test puppeteer deployment only
npm run test:puppeteer

# Test full deployment flow
npm run test:full-deployment
```

## Troubleshooting

### Common Issues

1. **Browser Launch Failures**
   - Ensure puppeteer is properly installed
   - Check system resources
   - Verify Chrome/Chromium is available

2. **Page Load Timeouts**
   - Network connectivity issues
   - EdgeOne Pages service availability
   - Increase timeout values if needed

3. **Element Selection Failures**
   - EdgeOne Pages UI changes
   - Update selectors in puppeteer-deploy.js
   - Check for page structure changes

### Debug Mode
To enable debug mode, modify the puppeteer launch options:
```javascript
browser = await puppeteer.launch({
  headless: false, // Set to false for debugging
  devtools: true   // Open DevTools
});
```

## Performance Considerations

### Memory Usage
- Each deployment creates a new browser instance
- Browser is properly closed after deployment
- Consider implementing browser pooling for high-volume deployments

### Deployment Time
- Typical deployment takes 15-30 seconds
- Includes page load, form filling, and verification
- Timeout is set to 30 seconds for page operations

### Scalability
- Puppeteer deployments are resource-intensive
- Consider rate limiting for production use
- Monitor system resources during deployment

## Security Notes

### Anti-Detection Measures
- Random delays between actions
- Human-like typing patterns
- Realistic mouse movements (if needed)
- Cookie and cache clearing

### Rate Limiting
- Implement delays between deployments
- Monitor EdgeOne Pages rate limits
- Consider implementing deployment queues

## Future Enhancements

### Planned Improvements
1. **Browser Pooling**: Reuse browser instances for better performance
2. **Screenshot Capture**: Save deployment screenshots for verification
3. **Video Recording**: Record deployment process for debugging
4. **Advanced Retry Logic**: Implement exponential backoff
5. **Deployment Queue**: Queue system for high-volume deployments

### Monitoring
1. **Deployment Metrics**: Track success rates and timing
2. **Error Logging**: Comprehensive error tracking
3. **Performance Monitoring**: Resource usage tracking
4. **Alert System**: Notifications for deployment failures 