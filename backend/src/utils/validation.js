// Business data validation schema
export const businessSchema = {
  businessName: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\-&.()]+$/
  },
  ownerName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/
  },
  description: {
    required: true,
    minLength: 10,
    maxLength: 500
  },
  category: {
    required: true,
    enum: ['restaurant', 'retail', 'service', 'other']
  },
  products: {
    required: true,
    validate: (value) => {
      // Allow both string format and array format
      if (typeof value === 'string') {
        // Legacy format: comma-separated list
        return value.length >= 5 && value.length <= 200;
      }
      
      if (Array.isArray(value)) {
        // New format: array of categories with items
        if (value.length === 0) return false;
        
        return value.every(category => {
          if (!category || typeof category !== 'object') return false;
          if (!category.name || typeof category.name !== 'string') return false;
          if (!Array.isArray(category.items) || category.items.length === 0) return false;
          
          return category.items.every(item => {
            if (!item || typeof item !== 'object') return false;
            if (!item.name || typeof item.name !== 'string') return false;
            if (typeof item.price !== 'number' || isNaN(item.price)) return false;
            if (item.description !== undefined && typeof item.description !== 'string') return false;
            return true;
          });
        });
      }
      
      return false;
    }
  },
  phone: {
    required: true,
    pattern: /^(\+62|62|0)8[1-9][0-9]{6,9}$/
  },
  email: {
    required: false,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  address: {
    required: true,
    minLength: 10,
    maxLength: 200
  },
  whatsapp: {
    required: false,
    pattern: /^(\+62|62|0)8[1-9][0-9]{6,9}$/
  },
  instagram: {
    required: false,
    pattern: /^[a-zA-Z0-9._]+$/
  }
};

export function validateBusinessData(data) {
  const errors = {};
  const validated = {};

  // Validate each field
  for (const [field, rules] of Object.entries(businessSchema)) {
    const value = data[field];
    
    // Check required fields
    if (rules.required && (value === undefined || value === null || 
        (typeof value === 'string' && value.trim().length === 0) ||
        (Array.isArray(value) && value.length === 0))) {
      errors[field] = `${field} is required`;
      continue;
    }

    // Skip validation for empty optional fields
    if (!rules.required && (value === undefined || value === null || 
        (typeof value === 'string' && value.trim().length === 0) ||
        (Array.isArray(value) && value.length === 0))) {
      continue;
    }

    // For string values
    if (typeof value === 'string') {
      const trimmed = value.trim();
      
      // Check minimum length
      if (rules.minLength && trimmed.length < rules.minLength) {
        errors[field] = `${field} must be at least ${rules.minLength} characters`;
        continue;
      }

      // Check maximum length
      if (rules.maxLength && trimmed.length > rules.maxLength) {
        errors[field] = `${field} must be no more than ${rules.maxLength} characters`;
        continue;
      }

      // Check pattern
      if (rules.pattern && !rules.pattern.test(trimmed)) {
        errors[field] = `${field} has invalid format`;
        continue;
      }

      validated[field] = trimmed;
    } else {
      // For non-string values (e.g., arrays, objects)
      if (rules.validate) {
        if (!rules.validate(value)) {
          errors[field] = `${field} has invalid format`;
          continue;
        }
        validated[field] = value;
      } else {
        // If no special validation needed, just copy the value
        validated[field] = value;
      }
    }

    // Check pattern
    if (rules.pattern && !rules.pattern.test(value)) {
      errors[field] = `${field} format is invalid`;
      continue;
    }

    // Check enum values
    if (rules.enum && !rules.enum.includes(value)) {
      errors[field] = `${field} must be one of: ${rules.enum.join(', ')}`;
      continue;
    }

    // Sanitize and store valid value
    validated[field] = sanitizeInput(value);
  }

  if (Object.keys(errors).length > 0) {
    throw new Error(JSON.stringify(errors));
  }

  if (Object.keys(errors).length > 0) {
    const error = new Error('Validation failed');
    error.details = errors;
    throw error;
  }

  return validated;
}

export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .trim();
}

export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function generateSubdomain(businessName) {
  return businessName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 20)
    .padEnd(3, 'x') + 
    Math.random().toString(36).substring(2, 6);
} 