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
    minLength: 5,
    maxLength: 200
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
    const value = data[field]?.trim();
    
    // Check required fields
    if (rules.required && (!value || value.length === 0)) {
      errors[field] = `${field} is required`;
      continue;
    }

    // Skip validation for empty optional fields
    if (!rules.required && (!value || value.length === 0)) {
      continue;
    }

    // Check minimum length
    if (rules.minLength && value.length < rules.minLength) {
      errors[field] = `${field} must be at least ${rules.minLength} characters`;
      continue;
    }

    // Check maximum length
    if (rules.maxLength && value.length > rules.maxLength) {
      errors[field] = `${field} must be no more than ${rules.maxLength} characters`;
      continue;
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