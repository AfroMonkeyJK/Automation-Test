/**
 * Centralized timeout configurations for test automation.
 * All timeouts are in milliseconds.
 */
export const timeouts = {
  short: 1000,
  default: 5000,
  medium: 10000,
  long: 60000,
  extraLong: 120000,
  // This wait shouldn't be used except in exceptional cases.
  extended: 300000 // 5 minutes.
};
export default timeouts;
