// Import styles
import './assets/css/style.css';
import './assets/css/auris-colors.css';

// Main JavaScript entry point
console.log('Application initialized');

// Cookie Consent Manager initialization
document.addEventListener('DOMContentLoaded', function() {
  // Check if cookie elements exist
  const cookieBanner = document.getElementById('cookieConsent');
  if (!cookieBanner) return;
  
  console.log('Cookie consent manager initialized');
  
  // Continue with cookie consent logic if elements exist
  const acceptAllBtn = document.getElementById('cookieAcceptAll');
  const settingsBtn = document.getElementById('cookieSettings');
  const cookieModal = document.getElementById('cookieModal');
  const closeModalBtn = document.getElementById('closeModal');
  const saveSettingsBtn = document.getElementById('saveCookieSettings');
  
  // Cookie consent logic continues as before
  // This ensures the cookie logic is bundled with the main JS
});