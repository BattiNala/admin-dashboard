/**
 * Validation utilities for form fields
 */

/**
 * Email validation patterns and rules
 */
export const emailValidation = {
  // RFC 5322 compliant email regex
  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

  // Preferred domains for government/educational emails
  preferredDomains: ["gov.np", "edu.np"],

  // Validate email format
  isValidFormat: (email) => {
    return emailValidation.pattern.test(email);
  },

  // Check if email uses preferred domain
  isPreferredDomain: (email) => {
    if (!email || !email.includes("@")) return false;
    const domain = email.split("@")[1];
    return emailValidation.preferredDomains.includes(domain);
  },

  // Get domain from email
  getDomain: (email) => {
    if (!email || !email.includes("@")) return "";
    return email.split("@")[1];
  },
};

/**
 * Password validation patterns and rules
 */
export const passwordValidation = {
  // Strong password: min 8 chars, uppercase, lowercase, number, special char
  strongPattern:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,

  // Minimum requirements
  minLength: 8,

  // Validate password strength
  isStrong: (password) => {
    return (
      password.length >= passwordValidation.minLength &&
      passwordValidation.strongPattern.test(password)
    );
  },

  // Check individual requirements
  hasLowercase: (password) => /[a-z]/.test(password),
  hasUppercase: (password) => /[A-Z]/.test(password),
  hasNumber: (password) => /\d/.test(password),
  hasSpecialChar: (password) => /[@$!%*?&]/.test(password),
};

/**
 * Nepali phone number validation
 */
export const phoneValidation = {
  // Nepali phone patterns: +977 984XXXXXXX or 984XXXXXXX
  patterns: [
    /^(\+977\s?)?[9][8][4-6][0-9]{7}$/, // +977 984XXXXXXX or 984XXXXXXX
  ],

  // Validate Nepali phone number
  isValid: (phone) => {
    return phoneValidation.patterns.some((pattern) =>
      pattern.test(phone.replace(/\s/g, "")),
    );
  },

  // Format phone number for display
  format: (phone) => {
    const cleaned = phone.replace(/\s/g, "");
    if (cleaned.startsWith("+977")) {
      return `+977 ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    }
    return phone;
  },
};

/**
 * Name validation
 */
export const nameValidation = {
  // Allow letters, spaces, hyphens, apostrophes
  pattern: /^[a-zA-Z\s\-']+$/,

  minLength: 2,
  maxLength: 100,

  // Validate name
  isValid: (name) => {
    return (
      name.length >= nameValidation.minLength &&
      name.length <= nameValidation.maxLength &&
      nameValidation.pattern.test(name)
    );
  },
};

/**
 * Department validation
 */
export const departmentValidation = {
  // Must be positive integer
  isValidId: (id) => {
    const num = parseInt(id, 10);
    return !isNaN(num) && num > 0;
  },

  // Check if department exists in list
  existsInList: (id, departments) => {
    return departments.some((dept) => dept.department_id === parseInt(id, 10));
  },
};

/**
 * General validation utilities
 */
export const validationUtils = {
  // Check if value is empty
  isEmpty: (value) => {
    return !value || value.trim() === "";
  },

  // Check if value meets length requirements
  isValidLength: (value, min = 0, max = Infinity) => {
    return value.length >= min && value.length <= max;
  },

  // Trim whitespace
  trim: (value) => {
    return value.trim();
  },

  // Sanitize input (basic XSS prevention)
  sanitize: (value) => {
    return value.replace(/[<>]/g, "");
  },
};
