'use client';

import { useState, useCallback, useMemo } from 'react';
import { isValidEmail, validatePassword } from '@/lib/utils';

/**
 * Validation rule types
 */
export type ValidationRule = 
  | 'required'
  | 'email'
  | 'password'
  | 'minLength'
  | 'maxLength'
  | 'match'
  | 'custom';

/**
 * Validation rule configuration
 */
export interface ValidationRuleConfig {
  type: ValidationRule;
  value?: any;
  message?: string;
  validator?: (value: any, formData?: Record<string, any>) => boolean | string;
}

/**
 * Field configuration
 */
export interface FieldConfig {
  rules?: ValidationRuleConfig[];
  initialValue?: any;
}

/**
 * Form validation hook
 */
export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  fieldConfigs: Partial<Record<keyof T, FieldConfig>> = {}
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  /**
   * Validate a single field
   */
  const validateField = useCallback((
    fieldName: keyof T,
    value: any,
    formData: T = values
  ): string | null => {
    const config = fieldConfigs[fieldName];
    if (!config?.rules) return null;

    for (const rule of config.rules) {
      let isValid = true;
      let errorMessage = rule.message;

      switch (rule.type) {
        case 'required':
          isValid = value !== null && value !== undefined && value !== '';
          errorMessage = errorMessage || `${String(fieldName)} is required`;
          break;

        case 'email':
          isValid = isValidEmail(value);
          errorMessage = errorMessage || 'Please enter a valid email address';
          break;

        case 'password':
          const passwordValidation = validatePassword(value);
          isValid = passwordValidation.isValid;
          errorMessage = errorMessage || passwordValidation.feedback[0] || 'Password is invalid';
          break;

        case 'minLength':
          isValid = value && value.length >= rule.value;
          errorMessage = errorMessage || `${String(fieldName)} must be at least ${rule.value} characters`;
          break;

        case 'maxLength':
          isValid = !value || value.length <= rule.value;
          errorMessage = errorMessage || `${String(fieldName)} must be no more than ${rule.value} characters`;
          break;

        case 'match':
          isValid = value === formData[rule.value as keyof T];
          errorMessage = errorMessage || `${String(fieldName)} must match ${String(rule.value)}`;
          break;

        case 'custom':
          if (rule.validator) {
            const result = rule.validator(value, formData);
            isValid = typeof result === 'boolean' ? result : true;
            errorMessage = typeof result === 'string' ? result : errorMessage || 'Invalid value';
          }
          break;
      }

      if (!isValid) {
        return errorMessage || 'Invalid value';
      }
    }

    return null;
  }, [fieldConfigs, values]);

  /**
   * Validate all fields
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(values).forEach((fieldName) => {
      const fieldKey = fieldName as keyof T;
      const error = validateField(fieldKey, values[fieldKey]);
      if (error) {
        newErrors[fieldKey] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validateField]);

  /**
   * Set field value
   */
  const setValue = useCallback((fieldName: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [fieldName]: value }));
    
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: undefined }));
    }
  }, [errors]);

  /**
   * Set field touched state
   */
  const setTouchedField = useCallback((fieldName: keyof T, isTouched: boolean = true) => {
    setTouched(prev => ({ ...prev, [fieldName]: isTouched }));
  }, []);

  /**
   * Handle field blur
   */
  const handleBlur = useCallback((fieldName: keyof T) => {
    setTouchedField(fieldName);
    const error = validateField(fieldName, values[fieldName]);
    if (error) {
      setErrors(prev => ({ ...prev, [fieldName]: error }));
    }
  }, [values, validateField, setTouchedField]);

  /**
   * Handle field change
   */
  const handleChange = useCallback((fieldName: keyof T, value: any) => {
    setValue(fieldName, value);
    
    // Validate field if it's been touched
    if (touched[fieldName]) {
      const error = validateField(fieldName, value);
      setErrors(prev => ({ ...prev, [fieldName]: error }));
    }
  }, [setValue, touched, validateField]);

  /**
   * Reset form
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  /**
   * Set form values
   */
  const setFormValues = useCallback((newValues: Partial<T>) => {
    setValues(prev => ({ ...prev, ...newValues }));
  }, []);

  /**
   * Set form errors
   */
  const setFormErrors = useCallback((newErrors: Partial<Record<keyof T, string>>) => {
    setErrors(prev => ({ ...prev, ...newErrors }));
  }, []);

  /**
   * Check if form is valid
   */
  const isFormValid = useMemo(() => {
    return Object.keys(values).every(fieldName => {
      const fieldKey = fieldName as keyof T;
      return !validateField(fieldKey, values[fieldKey]);
    });
  }, [values, validateField]);

  /**
   * Check if form has been modified
   */
  const isFormDirty = useMemo(() => {
    return Object.keys(values).some(fieldName => {
      const fieldKey = fieldName as keyof T;
      return values[fieldKey] !== initialValues[fieldKey];
    });
  }, [values, initialValues]);

  return {
    values,
    errors,
    touched,
    isFormValid,
    isFormDirty,
    setValue,
    setTouchedField,
    handleChange,
    handleBlur,
    validateField,
    validateForm,
    resetForm,
    setFormValues,
    setFormErrors,
  };
}

/**
 * Common validation rules
 */
export const validationRules = {
  required: (message?: string): ValidationRuleConfig => ({
    type: 'required',
    message: message || 'This field is required',
  }),
  
  email: (message?: string): ValidationRuleConfig => ({
    type: 'email',
    message: message || 'Please enter a valid email address',
  }),
  
  password: (message?: string): ValidationRuleConfig => ({
    type: 'password',
    message: message || 'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
  }),
  
  minLength: (length: number, message?: string): ValidationRuleConfig => ({
    type: 'minLength',
    value: length,
    message: message || `Must be at least ${length} characters`,
  }),
  
  maxLength: (length: number, message?: string): ValidationRuleConfig => ({
    type: 'maxLength',
    value: length,
    message: message || `Must be no more than ${length} characters`,
  }),
  
  match: (fieldName: string, message?: string): ValidationRuleConfig => ({
    type: 'match',
    value: fieldName,
    message: message || 'Fields must match',
  }),
  
  custom: (validator: (value: any, formData?: Record<string, any>) => boolean | string): ValidationRuleConfig => ({
    type: 'custom',
    validator,
  }),
};
