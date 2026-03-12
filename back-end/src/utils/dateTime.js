// src/utils/dateTime.js

/**
 * Add days to a date
 */
export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Add minutes to a date
 */
export const addMinutes = (date, minutes) => {
  return new Date(date.getTime() + minutes * 60 * 1000);
};

/**
 * Get start of day
 */
export const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Get end of day
 */
export const endOfDay = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Build a date at a specific hour and minute
 */
export const setTime = (date, hour, minute = 0) => {
  const d = new Date(date);
  d.setHours(hour, minute, 0, 0);
  return d;
};

/**
 * Check if two dates are the same calendar day
 */
export const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/**
 * Check if a date is within N minutes from now
 */
export const isWithinMinutes = (date, minutes) => {
  const now = new Date();
  const diff = (date.getTime() - now.getTime()) / (1000 * 60);
  return diff >= 0 && diff <= minutes;
};