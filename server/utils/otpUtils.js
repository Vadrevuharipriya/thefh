// ── OTP Utility: Cryptographically secure 6-digit OTP generator ──
import crypto from 'crypto';

/**
 * Generates a cryptographically secure 6-digit OTP
 * Uses crypto.randomInt for secure random generation
 * @returns {string} 6-digit OTP as string (e.g., "482761")
 */
export function generateSecureOTP() {
  const otp = crypto.randomInt(100000, 999999).toString();
  return otp;
}

/**
 * Validates an OTP against stored OTP
 * @param {string} inputOtp - OTP provided for verification
 * @param {string} storedOtp - OTP stored in database
 * @returns {boolean} True if OTPs match
 */
export function validateOTP(inputOtp, storedOtp) {
  if (!inputOtp || !storedOtp) return false;
  return inputOtp === storedOtp;
}