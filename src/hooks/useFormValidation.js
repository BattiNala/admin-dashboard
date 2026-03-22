import { useState, useCallback } from "react";

/**
 * Custom hook for form validation
 * @param {Object} initialValues - Initial form values
 * @param {Object} validationRules - Validation rules for each field
 * @returns {Object} - Form state and validation methods
 */
export const useFormValidation = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validate single field
  const validateField = useCallback(
    (name, value) => {
      const rule = validationRules[name];
      if (!rule) return "";

      // Required validation
      if (rule.required && (!value || value.trim() === "")) {
        return rule.message?.required || `${name} is required`;
      }

      // Length validations
      if (value) {
        if (rule.minLength && value.length < rule.minLength) {
          return (
            rule.message?.minLength ||
            `Minimum ${rule.minLength} characters required`
          );
        }
        if (rule.maxLength && value.length > rule.maxLength) {
          return (
            rule.message?.maxLength ||
            `Maximum ${rule.maxLength} characters allowed`
          );
        }
      }

      // Pattern validation
      if (value && rule.pattern && !rule.pattern.test(value)) {
        return rule.message?.pattern || `Invalid ${name} format`;
      }

      // Custom validation function
      if (rule.validate && typeof rule.validate === "function") {
        const customError = rule.validate(value, values);
        if (customError) return customError;
      }

      return "";
    },
    [validationRules, values],
  );

  // Validate all fields listed in validationRules (pass only rules for fields that exist on the form)
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach((field) => {
      const error = validateField(field, values[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules, validateField]);

  // Handle input change
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value }));

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [errors],
  );

  // Handle input blur
  const handleBlur = useCallback(
    (e) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));

      // Validate field on blur
      const error = validateField(name, values[name]);
      if (error) {
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [values, validateField],
  );

  // Set field error manually
  const setFieldError = useCallback((field, error) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  // Clear field error
  const clearFieldError = useCallback((field) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  // Set multiple values
  const setValuesBatch = useCallback((newValues) => {
    setValues((prev) => ({ ...prev, ...newValues }));
  }, []);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateField,
    validateForm,
    setFieldError,
    clearFieldError,
    resetForm,
    setValues: setValuesBatch,
    isValid:
      Object.keys(errors).length === 0 && Object.keys(touched).length > 0,
  };
};
