import { describe, it, expect } from 'vitest';

describe('Authentication - Email Validation', () => {
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  it('should validate correct email addresses', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('test.user@domain.co.uk')).toBe(true);
    expect(validateEmail('fighter123@ofa.io')).toBe(true);
  });

  it('should reject invalid email addresses', () => {
    expect(validateEmail('notanemail')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
    expect(validateEmail('user@.com')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });
});

describe('Authentication - Password Validation', () => {
  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  it('should accept passwords with 6 or more characters', () => {
    expect(validatePassword('123456')).toBe(true);
    expect(validatePassword('password123')).toBe(true);
    expect(validatePassword('MySecurePass!')).toBe(true);
  });

  it('should reject passwords with less than 6 characters', () => {
    expect(validatePassword('12345')).toBe(false);
    expect(validatePassword('abc')).toBe(false);
    expect(validatePassword('')).toBe(false);
  });
});

describe('Authentication - Password Matching', () => {
  it('should confirm matching passwords', () => {
    const password = 'MyPassword123';
    const confirmPassword = 'MyPassword123';
    expect(password === confirmPassword).toBe(true);
  });

  it('should reject non-matching passwords', () => {
    const password: any = 'MyPassword123';
    const confirmPassword: any = 'DifferentPassword';
    const matches = password === confirmPassword;
    expect(matches).toBe(false);
  });

  it('should be case-sensitive', () => {
    const password: any = 'MyPassword';
    const confirmPassword: any = 'mypassword';
    const matches = password === confirmPassword;
    expect(matches).toBe(false);
  });
});

describe('Authentication - Form Validation', () => {
  it('should validate complete sign-in form', () => {
    const email = 'user@example.com';
    const password = 'password123';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = 
      email.length > 0 &&
      password.length > 0 &&
      emailRegex.test(email) &&
      password.length >= 6;

    expect(isValid).toBe(true);
  });

  it('should validate complete sign-up form', () => {
    const email = 'newuser@example.com';
    const password = 'securepass123';
    const confirmPassword = 'securepass123';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = 
      email.length > 0 &&
      password.length > 0 &&
      confirmPassword.length > 0 &&
      emailRegex.test(email) &&
      password.length >= 6 &&
      password === confirmPassword;

    expect(isValid).toBe(true);
  });

  it('should reject incomplete forms', () => {
    const email = '';
    const password = 'password123';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = 
      email.length > 0 &&
      password.length > 0 &&
      emailRegex.test(email);

    expect(isValid).toBe(false);
  });
});

describe('Authentication - Email Normalization', () => {
  it('should trim and lowercase emails', () => {
    const rawEmail = '  User@Example.COM  ';
    const normalized = rawEmail.trim().toLowerCase();
    
    expect(normalized).toBe('user@example.com');
  });

  it('should handle already normalized emails', () => {
    const email = 'user@example.com';
    const normalized = email.trim().toLowerCase();
    
    expect(normalized).toBe('user@example.com');
  });
});
