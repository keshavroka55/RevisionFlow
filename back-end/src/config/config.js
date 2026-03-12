// src/config/config.js

// this help to show error message instead of slient undenfined error. 
const required = (key) => {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
};


export const config = {
  // Server
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",

  // JWT
  JWT_SECRET: required("JWT_SECRET"),
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || "30d",

  // Google OAuth
  GOOGLE_CLIENT_ID: required("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: required("GOOGLE_CLIENT_SECRET"),
  GOOGLE_CALLBACK_URL: required("GOOGLE_CALLBACK_URL"),

  // Email
  EMAIL_HOST: required("EMAIL_HOST"),
  EMAIL_PORT: process.env.EMAIL_PORT || 587,
  EMAIL_USER: required("EMAIL_USER"),
  EMAIL_PASSWORD: required("EMAIL_PASSWORD"),
  EMAIL_FROM: required("EMAIL_FROM"),

  // Client
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",

  // Helpers
  isDev: (process.env.NODE_ENV || "development") === "development",
  isProd: process.env.NODE_ENV === "production",

  GEMINI_API_KEY: required("GEMINI_API_KEY"),


};