export function validatePassword(password: string): { valid: boolean; message?: string } {
  // Minimum length check
  if (password.length < 8) {
    return {
      valid: false,
      message: "Password must be at least 8 characters long"
    }
  }

  // Uppercase letter check
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one uppercase letter"
    }
  }

  // Lowercase letter check
  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one lowercase letter"
    }
  }

  // Number check
  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one number"
    }
  }

  // Special character check
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one special character"
    }
  }

  return { valid: true }
}

export function validateEmail(email: string): { valid: boolean; message?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      valid: false,
      message: "Please enter a valid email address"
    }
  }
  return { valid: true }
} 