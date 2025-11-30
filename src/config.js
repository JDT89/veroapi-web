// Central place to configure the backend URL
// In production on Render, use environment variable
// In development, use localhost

const getApiBaseUrl = () => {
  // Check if we're in production and have an env var
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Check if we're in development
  if (import.meta.env.DEV) {
    return "http://localhost:3000";
  }
  
  // Default to your production API
  return "https://api.vero-api.com";
};

export const API_BASE_URL = getApiBaseUrl();

// Log it so we can debug
console.log('[VeroAPI] Using API URL:', API_BASE_URL);
