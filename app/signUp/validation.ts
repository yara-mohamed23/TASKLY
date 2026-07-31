// app/sign-up/validation.ts

export const validateName = (name: string): string | null => {
  if (!name.trim()) return "Name is required.";
  if (name.length < 3 || name.length > 50) return "Name must be between 3 and 50 characters.";
  
  // Checks for numbers, common special chars, and emojis roughly by matching against allowed letters/spaces
  // \p{L} matches any letter from any language (Arabic, Accentuated, English, etc.)
  const validNameRegex = /^[\p{L}]+(?: [\p{L}]+)*$/u;
  if (!validNameRegex.test(name)) {
    return "Name can only contain letters and non-consecutive spaces.";
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  if (!email) return "Email is required.";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Invalid email format.";
  return null;
};

export const passwordCriteria = {
  minLength: (p: string) => p.length >= 8 && p.length <= 64,
  noWhitespace: (p: string) => !/\s/.test(p),
  hasUpperLowerDigit: (p: string) => /[A-Z]/.test(p) && /[a-z]/.test(p) && /[0-9]/.test(p),
  hasSpecial: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p),
};