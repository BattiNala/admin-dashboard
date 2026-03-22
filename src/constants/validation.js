/**
 * Constants for validation rules and error messages
 */

export const VALIDATION_RULES = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s\-']+$/,
    message: {
      required: "Full name is required",
      minLength: "Name must be at least 2 characters",
      maxLength: "Name must be less than 100 characters",
      pattern:
        "Name can only contain letters, spaces, hyphens, and apostrophes",
    },
  },
  email: {
    required: true,
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    preferredDomains: ["gov.np", "edu.np"],
    message: {
      required: "Email address is required",
      pattern: "Please enter a valid email address",
      preferred:
        "Government or educational email (.gov.np, .edu.np) is preferred",
    },
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message: {
      required: "Password is required",
      minLength: "Password must be at least 8 characters",
      pattern:
        "Password must contain uppercase, lowercase, number, and special character",
    },
  },
  phone_number: {
    required: true,
    validate: (v) => {
      const raw = String(v ?? "").trim();
      if (!raw) return "Phone number is required";
      if (!/^\d+$/.test(raw)) {
        return "Phone number must contain only digits (0–9).";
      }
      if (raw.length !== 10) {
        return "Phone number must be exactly 10 digits.";
      }
      return "";
    },
  },
  department_id: {
    required: true,
    min: 1,
    message: {
      required: "Department selection is required",
      min: "Please select a valid department",
    },
  },
  department_name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\-&()]+$/,
    message: {
      required: "Department name is required",
      minLength: "Department name must be at least 2 characters",
      maxLength: "Department name must be less than 100 characters",
      pattern:
        "Department name can only contain letters, numbers, spaces, hyphens, ampersands, and parentheses",
    },
  },
};

export const API_ERROR_MESSAGES = {
  // 400 Bad Request
  EMAIL_EXISTS:
    "This email address is already registered. Please use a different email.",
  DEPARTMENT_NOT_FOUND:
    "Selected department does not exist. Please choose a valid department.",

  // 401 Unauthorized
  SESSION_EXPIRED: "Your session has expired. Please login again.",

  // 403 Forbidden
  INSUFFICIENT_PERMISSIONS:
    "You don't have permission to create department admins. Superadmin access required.",

  // 500 Internal Server Error
  ROLE_NOT_FOUND:
    "System configuration error. Please contact system administrator.",
  SERVER_ERROR:
    "Server error occurred. Please try again later or contact support.",

  // Network errors
  CONNECTION_ERROR:
    "Connection error. Please check your internet connection and try again.",
  BACKEND_UNAVAILABLE:
    "Backend service is currently unavailable. Please try again later.",
};

export const FIELD_LABELS = {
  name: "Full Name",
  email: "Email Address",
  password: "Password",
  phone_number: "Phone Number",
  department_id: "Department",
  department_name: "Department Name",
};

export const PLACEHOLDERS = {
  name: "e.g. Rajesh Hamal",
  email: "admin@municipality.gov.np",
  password: "Min. 8 chars with uppercase, lowercase, number, special",
  phone_number: "9841234567",
  department_id: "Select a department",
  department_name: "e.g. Infrastructure & Maintenance",
};
