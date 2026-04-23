
/**
 * GRC Module - Step 3: Notification System Only
 * File: /modules/grc/js/grc-notifications.js
 * 
 * SAFE: Only handles UI notifications
 * No API calls, no data manipulation
 */

const GRC_Notifications = {
    
    // Container for notifications
    container: null,
    
    /**
     * Initialize notification system
     */
    init() {
        // Create container if it doesn't exist
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'grc-notifications-container';
            this.container.style.cssText = `
                position: fixed;
                top: 20px;
                left: 20px;
                z-index: 10000;
                pointer-events: none;
            `;
            
            // Add RTL support
            if (GRC_CONFIG.language.rtl) {
                this.container.style.left = 'auto';
                this.container.style.right = '20px';
            }
            
            document.body.appendChild(this.container);
        }
        
        console.log('✅ Notification system initialized');
    },
    
    /**
     * Show notification
     * @param {string} message - Notification message
     * @param {string} type - Type: 'success', 'error', 'warning', 'info'
     * @param {number} duration - Duration in ms (0 for permanent)
     */
    show(message, type = 'info', duration = 3000) {
        if (!this.container) this.init();
        
        const notification = this._createNotification(message, type);
        this.container.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Auto remove if duration is set
        if (duration > 0) {
            setTimeout(() => {
                this.remove(notification);
            }, duration);
        }
        
        return notification;
    },
    
    /**
     * Create notification element
     * @private
     */
    _createNotification(message, type) {
        const colors = {
            success: GRC_CONFIG.colors.success,
            error: GRC_CONFIG.colors.danger,
            warning: GRC_CONFIG.colors.warning,
            info: GRC_CONFIG.colors.info
        };
        
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        
        const notification = document.createElement('div');
        notification.className = `grc-notification grc-notification-${type}`;
        notification.style.cssText = `
            background: white;
            color: #333;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 300px;
            max-width: 500px;
            opacity: 0;
            transform: translateX(${GRC_CONFIG.language.rtl ? '100px' : '-100px'});
            transition: all 0.3s ease;
            pointer-events: auto;
            border-right: 4px solid ${colors[type]};
        `;
        
        if (GRC_CONFIG.language.rtl) {
            notification.style.borderRight = 'none';
            notification.style.borderLeft = `4px solid ${colors[type]}`;
        }
        
        notification.innerHTML = `
            <div style="
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: ${colors[type]};
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                font-weight: bold;
                flex-shrink: 0;
            ">
                ${icons[type]}
            </div>
            <div style="flex: 1; font-size: 14px; line-height: 1.5;">
                ${message}
            </div>
            <button onclick="GRC_Notifications.remove(this.parentElement)" style="
                background: transparent;
                border: none;
                color: #999;
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                transition: color 0.2s;
            " onmouseover="this.style.color='#333'" onmouseout="this.style.color='#999'">
                ×
            </button>
        `;
        
        return notification;
    },
    
    /**
     * Remove notification
     * @param {HTMLElement} notification - Notification element to remove
     */
    remove(notification) {
        if (!notification) return;
        
        notification.style.opacity = '0';
        notification.style.transform = `translateX(${GRC_CONFIG.language.rtl ? '100px' : '-100px'})`;
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.parentElement.removeChild(notification);
            }
        }, 300);
    },
    
    /**
     * Clear all notifications
     */
    clearAll() {
        if (!this.container) return;
        
        const notifications = this.container.querySelectorAll('.grc-notification');
        notifications.forEach(notif => this.remove(notif));
    },
    
    /**
     * Shorthand methods
     */
    success(message, duration = 3000) {
        return this.show(message, 'success', duration);
    },
    
    error(message, duration = 5000) {
        return this.show(message, 'error', duration);
    },
    
    warning(message, duration = 4000) {
        return this.show(message, 'warning', duration);
    },
    
    info(message, duration = 3000) {
        return this.show(message, 'info', duration);
    },
    
    /**
     * Show loading notification
     * @param {string} message - Loading message
     * @returns {HTMLElement} Loading notification element
     */
    loading(message = 'جاري التحميل...') {
        if (!this.container) this.init();
        
        const notification = document.createElement('div');
        notification.className = 'grc-notification grc-notification-loading';
        notification.style.cssText = `
            background: white;
            color: #333;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 300px;
            opacity: 0;
            transform: translateX(${GRC_CONFIG.language.rtl ? '100px' : '-100px'});
            transition: all 0.3s ease;
            pointer-events: auto;
        `;
        
        notification.innerHTML = `
            <div style="
                width: 24px;
                height: 24px;
                border: 3px solid ${GRC_CONFIG.colors.primary};
                border-top-color: transparent;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
            "></div>
            <div style="flex: 1; font-size: 14px;">
                ${message}
            </div>
        `;
        
        // Add spin animation if not already added
        if (!document.getElementById('grc-spin-animation')) {
            const style = document.createElement('style');
            style.id = 'grc-spin-animation';
            style.textContent = `
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        this.container.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        return notification;
    },
    
    /**
     * Show confirmation dialog
     * @param {string} message - Confirmation message
     * @param {Function} onConfirm - Callback on confirm
     * @param {Function} onCancel - Callback on cancel
     */
    confirm(message, onConfirm, onCancel = null) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.2s ease;
        `;
        
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            max-width: 400px;
            width: 90%;
            text-align: ${GRC_CONFIG.language.rtl ? 'right' : 'left'};
            animation: scaleIn 0.2s ease;
        `;
        
        dialog.innerHTML = `
            <div style="margin-bottom: 20px; font-size: 16px; line-height: 1.5;">
                ${message}
            </div>
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button id="grc-confirm-cancel" style="
                    padding: 10px 20px;
                    border: 1px solid #ddd;
                    background: white;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.2s;
                " onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='white'">
                    إلغاء
                </button>
                <button id="grc-confirm-ok" style="
                    padding: 10px 20px;
                    border: none;
                    background: ${GRC_CONFIG.colors.primary};
                    color: white;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.2s;
                " onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
                    تأكيد
                </button>
            </div>
        `;
        
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        
        // Add animations
        if (!document.getElementById('grc-dialog-animations')) {
            const style = document.createElement('style');
            style.id = 'grc-dialog-animations';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Handle confirm
        document.getElementById('grc-confirm-ok').onclick = () => {
            document.body.removeChild(overlay);
            if (onConfirm) onConfirm();
        };
        
        // Handle cancel
        document.getElementById('grc-confirm-cancel').onclick = () => {
            document.body.removeChild(overlay);
            if (onCancel) onCancel();
        };
        
        // Handle overlay click
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
                if (onCancel) onCancel();
            }
        };
    }
};

// Auto-initialize on load
GRC_Notifications.init();
console.log('✅ GRC Notifications loaded successfully');

// Test notification (comment out in production)
// setTimeout(() => {
//     GRC_Notifications.info('نظام الإشعارات جاهز للعمل');
// }, 1000);
    