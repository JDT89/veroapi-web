// Central place to configure the backend URL

const getApiBaseUrl = () => {
  // If there's an environment variable, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Check if we're in development (localhost)
  if (import.meta.env.DEV || window.location.hostname === 'localhost') {
    return "http://localhost:3000";
  }
  
  // Production: Use your custom domain
  return "https://api.vero-api.com";
};

export const API_BASE_URL = getApiBaseUrl();

// Log it so we can debug
console.log('[VeroAPI] Using API URL:', API_BASE_URL);
