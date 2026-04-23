
/**
 * GRC Module - Step 2: Utilities
 * File: /modules/grc/js/grc-utils.js
 * Depends on: grc-config.js
 *
 * Provides helper functions for calculations, validation, and formatting.
 */

const GRC_Utils = {
    
    /**
     * Calculates a risk score based on impact and probability.
     * @param {number} impact - Impact level (1 to N)
     * @param {number} probability - Probability level (1 to N)
     * @returns {number} The calculated risk score.
     */
    calculateRiskScore(impact, probability) {
        const maxImpact = GRC_CONFIG.risk.impactLevels;
        const maxProb = GRC_CONFIG.risk.probabilityLevels;
        
        if (impact < 1 || impact > maxImpact || probability < 1 || probability > maxProb) {
            console.error('Invalid impact or probability values provided to calculateRiskScore.');
            return 0;
        }
        
        // Example: Simple multiplication. Can be replaced with a matrix lookup.
        return impact * probability;
    },
    
    /**
     * Formats a date string or object according to the global config.
     * @param {Date|string} date - The date to format.
     * @returns {string} A formatted date string.
     */
    formatDate(date) {
        const d = new Date(date);
        if (isNaN(d.getTime())) {
            return 'Invalid Date';
        }

        const format = GRC_CONFIG.dateFormat;
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        
        return format
            .replace('DD', day)
            .replace('MM', month)
            .replace('YYYY', year);
    },

    calculateComplianceRate(compliant, total) {
        if (total === 0) return 0;
        return Math.round((compliant / total) * 100);
    },

    getRiskLevel(score) {
        if (score >= 17) return 'High';
        if (score >= 9) return 'Medium';
        return 'Low';
    },

    getRiskColor(score) {
        if (score >= 17) return GRC_CONFIG.colors.danger;
        if (score >= 9) return GRC_CONFIG.colors.warning;
        return GRC_CONFIG.colors.success;
    },

    truncateText(text, length) {
        if (!text) return '';
        if (text.length <= length) return text;
        return text.substr(0, length) + '...';
    },

    translateStatus(status, lang) {
        const map = {
            'active': { ar: 'نشط', en: 'Active' },
            'draft': { ar: 'مسودة', en: 'Draft' },
            'archived': { ar: 'مؤرشف', en: 'Archived' },
            'pending': { ar: 'معلق', en: 'Pending' },
            'implemented': { ar: 'منفذ', en: 'Implemented' },
            'approved': { ar: 'موافق عليه', en: 'Approved' },
            'rejected': { ar: 'مرفوض', en: 'Rejected' },
            'identified': { ar: 'محدد', en: 'Identified' },
            'mitigating': { ar: 'قيد التخفيف', en: 'Mitigating' },
            'monitored': { ar: 'مراقب', en: 'Monitored' },
            'closed': { ar: 'مغلق', en: 'Closed' },
            'internal': { ar: 'داخلي', en: 'Internal' },
            'regulatory': { ar: 'تنظيمي', en: 'Regulatory' },
            'donor': { ar: 'مانح', en: 'Donor' },
            'governance': { ar: 'حوكمة', en: 'Governance' },
            'financial': { ar: 'مالي', en: 'Financial' },
            'operational': { ar: 'تشغيلي', en: 'Operational' },
        };
        return (map[status] && map[status][lang]) ? map[status][lang] : status;
    },
    
    translateRiskLevel(level, lang) {
        const map = {
            'very_low': { ar: 'منخفض جداً', en: 'Very Low' },
            'low': { ar: 'منخفض', en: 'Low' },
            'medium': { ar: 'متوسط', en: 'Medium' },
            'high': { ar: 'مرتفع', en: 'High' },
            'very_high': { ar: 'مرتفع جداً', en: 'Very High' }
        };
        return (map[level] && map[level][lang]) ? map[level][lang] : level;
    },
    
    translatePriority(priority, lang) {
        const map = {
            'high': { ar: 'عالية', en: 'High' },
            'medium': { ar: 'متوسطة', en: 'Medium' },
            'low': { ar: 'منخفضة', en: 'Low' }
        };
        return (map[priority] && map[priority][lang]) ? map[priority][lang] : priority;
    },

    calculateDaysUntil(dateString) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(dateString);
        dueDate.setHours(0, 0, 0, 0);
        const diffTime = dueDate.getTime() - today.getTime();
        if (diffTime < 0) return -1; // Overdue
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },

    getComplianceUrgency(daysUntil) {
        if (daysUntil < 0) return 'urgent';
        if (daysUntil <= 30) return 'warning';
        return 'normal';
    },
    
    // ============================================
    // DATA VALIDATION STUBS
    // These functions are placeholders for the API client.
    // In a real application, they would contain actual validation logic.
    // ============================================

    /**
     * Validates policy data before an API call.
     * @param {Object} policyData - The policy data object.
     * @returns {{valid: boolean, errors: string[]}} Validation result.
     */
    validatePolicyData(policyData) {
        console.log('Validating policy data (stub):', policyData);
        // Placeholder logic: always returns valid.
        return { valid: true, errors: [] };
    },
    
    /**
     * Validates risk data before an API call.
     * @param {Object} riskData - The risk data object.
     * @returns {{valid: boolean, errors: string[]}} Validation result.
     */
    validateRiskData(riskData) {
        console.log('Validating risk data (stub):', riskData);
        // Placeholder logic: always returns valid.
        return { valid: true, errors: [] };
    },
    
    /**
     * Validates compliance data before an API call.
     * @param {Object} complianceData - The compliance data object.
     * @returns {{valid: boolean, errors: string[]}} Validation result.
     */
    validateComplianceData(complianceData) {
        console.log('Validating compliance data (stub):', complianceData);
        // Placeholder logic: always returns valid.
        return { valid: true, errors: [] };
    },
};

// Make the utility object globally accessible
window.GRC_Utils = GRC_Utils;

console.log('✅ GRC Utils loaded successfully');
    