// utils/validation.js

// Trim + sanitize input
export const sanitize = (text) => {
  if (!text) return "";
  return text.trim();
};

// Email validation regex
export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Password rule:
// 8 chars minimum, 1 uppercase, 1 lowercase, 1 digit, 1 special character
export const isValidPassword = (password) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
};

// Username rule:
// Letters, numbers, underscores only; 3–20 chars
export const isValidUsername = (username) => {
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
};
