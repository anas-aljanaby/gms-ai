
/**
 * GRC Module - Step 6: Main Initialization
 * File: /modules/grc/js/grc-init.js
 * 
 * SAFE: Only initializes on specific pages
 * Requires manual trigger with data-grc-page attribute
 */

const GRC_Init = {
    
    initialized: false,
    currentPage: null,
    
    /**
     * Initialize GRC module
     * Call this ONCE when page loads
     */
    init() {
        if (this.initialized) {
            console.warn('GRC already initialized');
            return;
        }
        
        console.log('🚀 Initializing GRC Module...');
        
        // Detect current page
        this.currentPage = this.detectCurrentPage();
        
        if (!this.currentPage) {
            console.log('Not a GRC page, skipping initialization');
            return;
        }
        
        console.log('Current GRC page:', this.currentPage);
        
        // Initialize notification system
        GRC_Notifications.init();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Setup refresh buttons
        this.setupRefreshButtons();
        
        // Setup language toggle
        this.setupLanguageToggle();
        
        this.initialized = true;
        console.log('✅ GRC Module initialized successfully');
        
        // Show welcome notification (optional - comment out if not needed)
        // GRC_Notifications.success('نظام GRC جاهز للعمل');
    },
    
    /**
     * Detect which GRC page we're on
     * @returns {string|null} Page name or null
     */
    detectCurrentPage() {
        // Method 1: Check for data-grc-page attribute
        const pageElement = document.querySelector('[data-grc-page]');
        if (pageElement) {
            return pageElement.getAttribute('data-grc-page');
        }
        
        // Method 2: Check URL path
        const path = window.location.pathname;
        if (path.includes('/grc/dashboard') || path.includes('/grc/index')) {
            return 'dashboard';
        }
        if (path.includes('/grc/risks')) {
            return 'risks';
        }
        if (path.includes('/grc/policies') || path.includes('/grc/governance')) {
            return 'policies';
        }
        if (path.includes('/grc/compliance')) {
            return 'compliance';
        }
        if (path.includes('/grc/audit')) {
            return 'audit';
        }
        
        // Method 3: Check for specific containers
        if (document.getElementById('grc-dashboard-container')) {
            return 'dashboard';
        }
        
        return null;
    },
    
    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Listen for form submissions
        this.setupFormListeners();
        
        // Listen for filter changes
        this.setupFilterListeners();
        
        // Listen for search inputs
        this.setupSearchListeners();
    },
    
    /**
     * Setup form submission listeners
     */
    setupFormListeners() {
        // Risk form
        const riskForm = document.getElementById('add-risk-form');
        if (riskForm) {
            riskForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleRiskSubmit(riskForm);
            });
            console.log('✓ Risk form listener attached');
        }
        
        // Policy form
        const policyForm = document.getElementById('add-policy-form');
        if (policyForm) {
            policyForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handlePolicySubmit(policyForm);
            });
            console.log('✓ Policy form listener attached');
        }
        
        // Compliance form
        const complianceForm = document.getElementById('add-compliance-form');
        if (complianceForm) {
            complianceForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleComplianceSubmit(complianceForm);
            });
            console.log('✓ Compliance form listener attached');
        }
    },
    
    /**
     * Handle risk form submission
     */
    async handleRiskSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        console.log('Submitting risk:', data);
        
        try {
            await GRC_API.createRisk(data);
            form.reset();
            
            // Reload data if on risks page
            if (this.currentPage === 'risks' || this.currentPage === 'dashboard') {
                await GRC_DataLoader.loadRisks();
            }
            
            // Close modal if exists
            this.closeModal('add-risk-modal');
            
        } catch (error) {
            console.error('Risk submission failed:', error);
        }
    },
    
    /**
     * Handle policy form submission
     */
    async handlePolicySubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        console.log('Submitting policy:', data);
        
        try {
            await GRC_API.createPolicy(data);
            form.reset();
            
            // Reload data if on policies page
            if (this.currentPage === 'policies' || this.currentPage === 'dashboard') {
                await GRC_DataLoader.loadPolicies();
            }
            
            // Close modal if exists
            this.closeModal('add-policy-modal');
            
        } catch (error) {
            console.error('Policy submission failed:', error);
        }
    },
    
    /**
     * Handle compliance form submission
     */
    async handleComplianceSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        console.log('Submitting compliance requirement:', data);
        
        try {
            await GRC_API.createComplianceRequirement(data);
            form.reset();
            
            // Reload data if on compliance page
            if (this.currentPage === 'compliance' || this.currentPage === 'dashboard') {
                await GRC_DataLoader.loadCompliance();
            }
            
            // Close modal if exists
            this.closeModal('add-compliance-modal');
            
        } catch (error) {
            console.error('Compliance submission failed:', error);
        }
    },
    
    /**
     * Setup filter listeners
     */
    setupFilterListeners() {
        const filters = document.querySelectorAll('[data-grc-filter]');
        filters.forEach(filter => {
            filter.addEventListener('change', () => {
                this.applyFilters();
            });
        });
        
        if (filters.length > 0) {
            console.log(`✓ ${filters.length} filter listeners attached`);
        }
    },
    
    /**
     * Setup search listeners
     */
    setupSearchListeners() {
        const searchInputs = document.querySelectorAll('[data-grc-search]');
        searchInputs.forEach(input => {
            let timeout;
            input.addEventListener('input', (e) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    this.handleSearch(e.target.value);
                }, 500); // Debounce 500ms
            });
        });
        
        if (searchInputs.length > 0) {
            console.log(`✓ ${searchInputs.length} search listeners attached`);
        }
    },
    
    /**
     * Apply current filters
     */
    applyFilters() {
        const filters = {};
        document.querySelectorAll('[data-grc-filter]').forEach(filter => {
            const name = filter.getAttribute('data-grc-filter');
            const value = filter.value;
            if (value) {
                filters[name] = value;
            }
        });
        
        console.log('Applying filters:', filters);
        
        // Reload data with filters
        switch (this.currentPage) {
            case 'risks':
                GRC_DataLoader.loadRisks(filters);
                break;
            case 'policies':
                GRC_DataLoader.loadPolicies(filters);
                break;
            case 'compliance':
                GRC_DataLoader.loadCompliance(filters);
                break;
        }
    },
    
    /**
     * Handle search input
     */
    handleSearch(query) {
        console.log('Searching for:', query);
        // In real implementation, add search parameter to filters
        this.applyFilters();
    },
    
    /**
     * Setup refresh buttons
     */
    setupRefreshButtons() {
        const refreshButtons = document.querySelectorAll('[data-grc-refresh]');
        refreshButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.refreshCurrentPage();
            });
        });
        
        if (refreshButtons.length > 0) {
            console.log(`✓ ${refreshButtons.length} refresh buttons attached`);
        }
    },
    
    /**
     * Refresh current page data
     */
    refreshCurrentPage() {
        console.log('Refreshing page:', this.currentPage);
        
        switch (this.currentPage) {
            case 'dashboard':
                GRC_DataLoader.loadDashboard();
                break;
            case 'risks':
                GRC_DataLoader.loadRisks();
                break;
            case 'policies':
                GRC_DataLoader.loadPolicies();
                break;
            case 'compliance':
                GRC_DataLoader.loadCompliance();
                break;
        }
    },
    
    /**
     * Setup language toggle
     */
    setupLanguageToggle() {
        const toggleButton = document.getElementById('grc-language-toggle');
        if (toggleButton) {
            toggleButton.addEventListener('click', () => {
                this.toggleLanguage();
            });
            console.log('✓ Language toggle attached');
        }
    },
    
    /**
     * Toggle between Arabic and English
     */
    toggleLanguage() {
        const currentLang = GRC_CONFIG.language.default;
        const newLang = currentLang === 'ar' ? 'en' : 'ar';
        
        console.log('Switching language to:', newLang);
        GRC_CONFIG.language.default = newLang;
        GRC_CONFIG.language.rtl = newLang === 'ar';
        
        // Update HTML dir attribute
        document.documentElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', newLang);
        
        // Reload current page data to reflect language change
        this.refreshCurrentPage();
        
        GRC_Notifications.success(
            newLang === 'ar' ? 'تم التبديل إلى العربية' : 'Switched to English'
        );
    },
    
    /**
     * Close modal by ID
     */
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            // Or trigger your existing modal close function
        }
    },
    
    /**
     * Load initial data based on current page
     * Call this manually AFTER page is ready
     */
    loadInitialData() {
        if (!this.initialized) {
            console.warn('GRC not initialized yet');
            return;
        }
        
        console.log('Loading initial data for:', this.currentPage);
        
        switch (this.currentPage) {
            case 'dashboard':
                GRC_DataLoader.loadDashboard();
                break;
            case 'risks':
                GRC_DataLoader.loadRisks();
                break;
            case 'policies':
                GRC_DataLoader.loadPolicies();
                break;
            case 'compliance':
                GRC_DataLoader.loadCompliance();
                break;
        }
    }
};

// Export to global scope
window.GRC_Init = GRC_Init;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        GRC_Init.init();
    });
} else {
    GRC_Init.init();
}

console.log('✅ GRC Initialization module loaded');
console.log('To manually load data, call: GRC_Init.loadInitialData()');
    