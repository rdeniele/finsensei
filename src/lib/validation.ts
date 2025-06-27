import { z } from 'zod';

// Email validation schema
export const emailSchema = z
  .string()
  .email('Invalid email address')
  .min(1, 'Email is required')
  .max(254, 'Email too long');

// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
  .max(128, 'Password too long');

// Name validation schema
export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name too long')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters');

// Amount validation schema
export const amountSchema = z
  .number()
  .positive('Amount must be positive')
  .max(999999999.99, 'Amount too large');

// Account name validation schema
export const accountNameSchema = z
  .string()
  .min(1, 'Account name is required')
  .max(50, 'Account name too long')
  .regex(/^[a-zA-Z0-9\s'-]+$/, 'Account name contains invalid characters');

// Transaction source validation schema
export const transactionSourceSchema = z
  .string()
  .min(1, 'Transaction source is required')
  .max(100, 'Transaction source too long')
  .regex(/^[a-zA-Z0-9\s'-]+$/, 'Transaction source contains invalid characters');

// Goal name validation schema
export const goalNameSchema = z
  .string()
  .min(1, 'Goal name is required')
  .max(100, 'Goal name too long')
  .regex(/^[a-zA-Z0-9\s'-]+$/, 'Goal name contains invalid characters');

// Sanitize HTML input
export function sanitizeHtml(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

// Sanitize SQL input (basic protection)
export function sanitizeSql(input: string): string {
  return input
    .replace(/['";\\]/g, '') // Remove SQL injection characters
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove SQL block comments
    .replace(/\*\//g, '') // Remove SQL block comments
    .trim();
}

// Validate and sanitize user input
export function validateAndSanitizeInput<T>(
  schema: z.ZodSchema<T>,
  input: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const result = schema.parse(input);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: 'Invalid input' };
  }
}

// Validate form data
export function validateFormData(data: Record<string, unknown>, schemas: Record<string, z.ZodSchema>) {
  const errors: Record<string, string> = {};
  const validatedData: Record<string, unknown> = {};

  for (const [field, schema] of Object.entries(schemas)) {
    const validation = validateAndSanitizeInput(schema, data[field]);
    if (validation.success) {
      validatedData[field] = validation.data;
    } else {
      errors[field] = validation.error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: validatedData
  };
} 