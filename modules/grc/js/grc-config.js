
/**
 * GRC Module - Step 1: Configuration
 * File: /modules/grc/js/grc-config.js
 *
 * Defines global configuration for the GRC module.
 */

const GRC_CONFIG = {
    // Language and localization settings
    language: {
        default: 'ar', // Default language: 'ar', 'en'
        rtl: true,     // Set to true for Right-to-Left languages like Arabic
    },
    
    // Color palette for UI elements (notifications, charts, etc.)
    colors: {
        primary: '#007bff',
        secondary: '#6c757d',
        success: '#28a745',
        danger: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8',
    },
    
    // API client configuration
    api: {
        baseUrl: '/api/grc-handler.php', // A placeholder API endpoint
        timeout: 10000,                  // Request timeout in milliseconds (10 seconds)
        retryAttempts: 3,                // Number of retry attempts on network failure
    },
    
    // Risk calculation parameters
    risk: {
        impactLevels: 5,        // Number of impact levels (e.g., 1 to 5)
        probabilityLevels: 5,   // Number of probability levels (e.g., 1 to 5)
    },
    
    // Date formatting for display
    dateFormat: 'YYYY-MM-DD', // Using ISO format for consistency
};

// Make the configuration object globally accessible
window.GRC_CONFIG = GRC_CONFIG;

console.log('✅ GRC Config loaded successfully');
    