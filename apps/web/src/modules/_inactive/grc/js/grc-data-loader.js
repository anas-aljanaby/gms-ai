
/**
 * GRC Module - Step 5: Data Loader (Manual Trigger Only)
 * File: /modules/grc/js/grc-data-loader.js
 * 
 * SAFE: Only loads data when explicitly called
 * No automatic loading, no intervals
 * Each function must be manually triggered
 */

const GRC_DataLoader = {
    
    // Loading state tracking
    loadingStates: {
        dashboard: false,
        risks: false,
        policies: false,
        compliance: false
    },
    
    /**
     * Load dashboard data
     * Call this manually: GRC_DataLoader.loadDashboard()
     */
    async loadDashboard() {
        if (this.loadingStates.dashboard) {
            console.log('Dashboard already loading...');
            return;
        }
        
        this.loadingStates.dashboard = true;
        const loadingNotif = GRC_Notifications.loading('جاري تحميل بيانات لوحة التحكم...');
        
        try {
            // Load summary
            const summary = await GRC_API.getDashboardSummary();
            this.updateDashboardMetrics(summary);
            
            // Load high priority risks
            const risks = await GRC_API.getRisks({ min_score: 15, limit: 5 });
            this.updateHighPriorityRisks(risks);
            
            // Load upcoming compliance
            const compliance = await GRC_API.getComplianceRequirements({ 
                status: 'active', 
                limit: 5 
            });
            this.updateUpcomingCompliance(compliance);
            
            // Load risk matrix
            const matrix = await GRC_API.getRiskMatrix();
            this.updateRiskMatrix(matrix);
            
            GRC_Notifications.remove(loadingNotif);
            GRC_Notifications.success('تم تحميل البيانات بنجاح');
            
        } catch (error) {
            GRC_Notifications.remove(loadingNotif);
            console.error('Dashboard loading failed:', error);
        } finally {
            this.loadingStates.dashboard = false;
        }
    },
    
    /**
     * Update dashboard metric cards
     * @param {Object} summary - Summary data
     */
    updateDashboardMetrics(summary) {
        const metrics = {
            'active-policies-count': summary.active_policies || 0,
            'active-risks-count': summary.active_risks || 0,
            'high-risks-count': summary.high_risks || 0,
            'pending-decisions-count': summary.pending_decisions || 0
        };
        
        Object.entries(metrics).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
                console.log(`Updated ${id}:`, value);
            }
        });
        
        // Update compliance rate
        const rateElement = document.getElementById('compliance-rate-value');
        if (rateElement && summary.total_requirements > 0) {
            const rate = GRC_Utils.calculateComplianceRate(
                summary.compliant_count,
                summary.total_requirements
            );
            rateElement.textContent = rate + '%';
        }
    },
    
    /**
     * Update high priority risks list
     * @param {Array} risks - Array of risk objects
     */
    updateHighPriorityRisks(risks) {
        const container = document.getElementById('high-priority-risks-list');
        if (!container) {
            console.warn('High priority risks container not found');
            return;
        }
        
        if (!risks || risks.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="padding: 40px; text-align: center; color: #999;">
                    <div style="font-size: 48px; margin-bottom: 15px;">✓</div>
                    <p>لا توجد مخاطر عالية الأولوية حالياً</p>
                </div>
            `;
            return;
        }
        
        const lang = GRC_CONFIG.language.default;
        const html = risks.map(risk => {
            const title = lang === 'ar' ? risk.title_ar : risk.title_en;
            const description = lang === 'ar' ? risk.description_ar : risk.description_en;
            const riskLevel = GRC_Utils.getRiskLevel(risk.risk_score);
            const riskColor = GRC_Utils.getRiskColor(risk.risk_score);
            
            return `
                <div class="risk-item" 
                     data-risk-id="${risk.id}" 
                     style="padding: 15px; border-bottom: 1px solid #f0f0f0; cursor: pointer;"
                     onmouseover="this.style.background='#f8f9fa'"
                     onmouseout="this.style.background='white'">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                        <h4 style="margin: 0; font-size: 15px; color: #333;">${title}</h4>
                        <span style="
                            padding: 4px 10px;
                            border-radius: 12px;
                            font-size: 12px;
                            font-weight: bold;
                            color: white;
                            background: ${riskColor};
                        ">${risk.risk_score}</span>
                    </div>
                    <p style="margin: 0 0 8px 0; font-size: 13px; color: #666; line-height: 1.5;">
                        ${GRC_Utils.truncateText(description, 100)}
                    </p>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <span style="padding: 3px 8px; border-radius: 10px; font-size: 11px; background: #e3f2fd; color: #1976d2;">
                            ${GRC_Utils.translateRiskLevel(risk.likelihood, lang)}
                        </span>
                        <span style="padding: 3px 8px; border-radius: 10px; font-size: 11px; background: #fff3e0; color: #f57c00;">
                            ${GRC_Utils.translateRiskLevel(risk.impact, lang)}
                        </span>
                        <span style="padding: 3px 8px; border-radius: 10px; font-size: 11px; background: #f5f5f5; color: #666;">
                            ${GRC_Utils.formatDate(risk.identified_date, lang)}
                        </span>
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = html;
        console.log('Updated high priority risks:', risks.length);
    },
    
    /**
     * Update upcoming compliance list
     * @param {Array} requirements - Array of compliance requirements
     */
    updateUpcomingCompliance(requirements) {
        const container = document.getElementById('compliance-deadlines-list');
        if (!container) {
            console.warn('Compliance deadlines container not found');
            return;
        }
        
        if (!requirements || requirements.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="padding: 40px; text-align: center; color: #999;">
                    <div style="font-size: 48px; margin-bottom: 15px;">✓</div>
                    <p>لا توجد مواعيد امتثال قادمة</p>
                </div>
            `;
            return;
        }
        
        const lang = GRC_CONFIG.language.default;
        const html = requirements.map(req => {
            const title = lang === 'ar' ? req.title_ar : req.title_en;
            const sourceName = lang === 'ar' ? req.source_name_ar : req.source_name_en;
            const daysUntil = GRC_Utils.calculateDaysUntil(req.next_due_date);
            const urgency = GRC_Utils.getComplianceUrgency(daysUntil);
            
            const urgencyColors = {
                urgent: '#ffcdd2',
                warning: '#ffecb3',
                normal: '#e8f5e9'
            };
            
            const urgencyTextColors = {
                urgent: '#c62828',
                warning: '#f57c00',
                normal: '#2e7d32'
            };
            
            return `
                <div class="compliance-item" 
                     data-requirement-id="${req.id}"
                     style="padding: 15px; border-right: 4px solid ${urgencyTextColors[urgency]}; background: ${urgencyColors[urgency]}20; margin-bottom: 10px; border-radius: 8px; cursor: pointer;"
                     onmouseover="this.style.opacity='0.8'"
                     onmouseout="this.style.opacity='1'">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                        <h4 style="margin: 0; font-size: 15px; color: #333; flex: 1;">${title}</h4>
                        <span style="
                            padding: 4px 10px;
                            border-radius: 12px;
                            font-size: 11px;
                            font-weight: 500;
                            background: ${urgencyColors[urgency]};
                            color: ${urgencyTextColors[urgency]};
                        ">${GRC_Utils.translatePriority(req.priority, lang)}</span>
                    </div>
                    ${sourceName ? `<p style="margin: 0 0 8px 0; font-size: 13px; color: #666;">${sourceName}</p>` : ''}
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
                        <span style="color: ${urgencyTextColors[urgency]}; font-weight: 500;">
                            ${daysUntil >= 0 ? `${daysUntil} يوم متبقي` : 'متأخر'}
                        </span>
                        <span style="color: #999;">
                            ${GRC_Utils.formatDate(req.next_due_date, lang)}
                        </span>
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = html;
        console.log('Updated compliance deadlines:', requirements.length);
    },
    
    /**
     * Update risk matrix
     * @param {Array} matrixData - Risk matrix data
     */
    updateRiskMatrix(matrixData) {
        const container = document.getElementById('risk-matrix-grid');
        if (!container) {
            console.warn('Risk matrix container not found');
            return;
        }
        
        // Initialize 5x5 matrix with zeros
        const matrix = Array(5).fill().map(() => Array(5).fill(0));
        
        // Fill matrix with data
        if (matrixData && matrixData.length > 0) {
            matrixData.forEach(item => {
                const values = {
                    'very_low': 0, 'low': 1, 'medium': 2, 'high': 3, 'very_high': 4
                };
                const likelihoodIndex = values[item.likelihood] || 2;
                const impactIndex = values[item.impact] || 2;
                matrix[likelihoodIndex][impactIndex] = item.count;
            });
        }
        
        // Generate HTML (from bottom to top for proper display)
        const html = matrix.reverse().map((row, i) => 
            row.map((count, j) => {
                const score = (5 - i) * (j + 1); // Calculate actual risk score
                const color = GRC_Utils.getRiskColor(score);
                
                return `
                    <div class="risk-matrix-cell" 
                         style="
                             background: ${color};
                             color: white;
                             aspect-ratio: 1;
                             display: flex;
                             align-items: center;
                             justify-content: center;
                             font-size: 18px;
                             font-weight: bold;
                             border-radius: 8px;
                             cursor: pointer;
                             transition: transform 0.2s;
                         "
                         data-score="${score}"
                         onmouseover="this.style.transform='scale(1.1)'"
                         onmouseout="this.style.transform='scale(1)'"
                         onclick="GRC_DataLoader.filterRisksByScore(${score})">
                        ${count > 0 ? count : ''}
                    </div>
                `;
            }).join('')
        ).join('');
        
        container.innerHTML = html;
        console.log('Updated risk matrix');
    },
    
    /**
     * Filter risks by score
     * @param {number} score - Minimum risk score
     */
    filterRisksByScore(score) {
        console.log('Filtering risks with minimum score:', score);
        GRC_Notifications.info(`عرض المخاطر بدرجة ${score} فأعلى`);
        // In real implementation, navigate to risks page with filter
        // window.location.href = `/modules/grc/risks.php?min_score=${score}`;
    },
    
    /**
     * Load risks page data
     * Call manually: GRC_DataLoader.loadRisks()
     */
    async loadRisks(filters = {}) {
        if (this.loadingStates.risks) {
            console.log('Risks already loading...');
            return;
        }
        
        this.loadingStates.risks = true;
        const loadingNotif = GRC_Notifications.loading('جاري تحميل المخاطر...');
        
        try {
            const risks = await GRC_API.getRisks(filters);
            this.updateRisksList(risks);
            
            GRC_Notifications.remove(loadingNotif);
            GRC_Notifications.success('تم تحميل المخاطر بنجاح');
            
        } catch (error) {
            GRC_Notifications.remove(loadingNotif);
            console.error('Risks loading failed:', error);
        } finally {
            this.loadingStates.risks = false;
        }
    },
    
    /**
     * Update risks list table
     * @param {Array} risks - Array of risks
     */
    updateRisksList(risks) {
        const container = document.getElementById('risks-table-body');
        if (!container) {
            console.warn('Risks table body not found');
            return;
        }
        
        if (!risks || risks.length === 0) {
            container.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px; color: #999;">
                        لا توجد مخاطر مسجلة
                    </td>
                </tr>
            `;
            return;
        }
        
        const lang = GRC_CONFIG.language.default;
        const html = risks.map(risk => {
            const title = lang === 'ar' ? risk.title_ar : risk.title_en;
            const category = GRC_Utils.translateStatus(risk.category, lang);
            const status = GRC_Utils.translateStatus(risk.status, lang);
            const likelihood = GRC_Utils.translateRiskLevel(risk.likelihood, lang);
            const impact = GRC_Utils.translateRiskLevel(risk.impact, lang);
            const riskColor = GRC_Utils.getRiskColor(risk.risk_score);
            
            return `
                <tr onclick="GRC_DataLoader.viewRiskDetails(${risk.id})" 
                    style="cursor: pointer;"
                    onmouseover="this.style.background='#f8f9fa'"
                    onmouseout="this.style.background='white'">
                    <td style="padding: 12px;">${risk.risk_code}</td>
                    <td style="padding: 12px;">${title}</td>
                    <td style="padding: 12px;">${category}</td>
                    <td style="padding: 12px;">
                        <span style="padding: 4px 10px; border-radius: 12px; font-size: 12px; background: #e3f2fd; color: #1976d2;">
                            ${likelihood}
                        </span>
                    </td>
                    <td style="padding: 12px;">
                        <span style="padding: 4px 10px; border-radius: 12px; font-size: 12px; background: #fff3e0; color: #f57c00;">
                            ${impact}
                        </span>
                    </td>
                    <td style="padding: 12px;">
                        <span style="
                            display: inline-block;
                            width: 40px;
                            height: 40px;
                            border-radius: 50%;
                            background: ${riskColor};
                            color: white;
                            text-align: center;
                            line-height: 40px;
                            font-weight: bold;
                        ">${risk.risk_score}</span>
                    </td>
                    <td style="padding: 12px;">
                        <span style="padding: 4px 10px; border-radius: 12px; font-size: 12px; background: #f5f5f5; color: #666;">
                            ${status}
                        </span>
                    </td>
                </tr>
            `;
        }).join('');
        
        container.innerHTML = html;
        console.log('Updated risks list:', risks.length);
    },
    
    /**
     * Load policies page data
     * Call manually: GRC_DataLoader.loadPolicies()
     */
    async loadPolicies(filters = {}) {
        if (this.loadingStates.policies) {
            console.log('Policies already loading...');
            return;
        }
        
        this.loadingStates.policies = true;
        const loadingNotif = GRC_Notifications.loading('جاري تحميل السياسات...');
        
        try {
            const policies = await GRC_API.getPolicies(filters);
            this.updatePoliciesList(policies);
            
            GRC_Notifications.remove(loadingNotif);
            GRC_Notifications.success('تم تحميل السياسات بنجاح');
            
        } catch (error) {
            GRC_Notifications.remove(loadingNotif);
            console.error('Policies loading failed:', error);
        } finally {
            this.loadingStates.policies = false;
        }
    },
    
    /**
     * Update policies list
     * @param {Array} policies - Array of policies
     */
    updatePoliciesList(policies) {
        const container = document.getElementById('policies-list');
        if (!container) {
            console.warn('Policies list container not found');
            return;
        }
        
        if (!policies || policies.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="padding: 40px; text-align: center; color: #999;">
                    <div style="font-size: 48px; margin-bottom: 15px;">📋</div>
                    <p>لا توجد سياسات مسجلة</p>
                </div>
            `;
            return;
        }
        
        const lang = GRC_CONFIG.language.default;
        const html = policies.map(policy => {
            const title = lang === 'ar' ? policy.title_ar : policy.title_en;
            const description = lang === 'ar' ? policy.description_ar : policy.description_en;
            const category = GRC_Utils.translateStatus(policy.category, lang);
            const status = GRC_Utils.translateStatus(policy.status, lang);
            
            const statusColors = {
                'active': '#c8e6c9',
                'draft': '#fff9c4',
                'archived': '#e0e0e0'
            };
            
            return `
                <div class="policy-card" 
                     onclick="GRC_DataLoader.viewPolicyDetails(${policy.id})"
                     style="
                         padding: 20px;
                         background: white;
                         border-radius: 10px;
                         box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                         margin-bottom: 15px;
                         cursor: pointer;
                         transition: transform 0.2s, box-shadow 0.2s;
                     "
                     onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 4px 16px rgba(0,0,0,0.15)'"
                     onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)'">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                        <h3 style="margin: 0; font-size: 16px; color: #333;">${title}</h3>
                        <span style="
                            padding: 4px 10px;
                            border-radius: 12px;
                            font-size: 11px;
                            background: ${statusColors[policy.status] || '#e0e0e0'};
                            color: #333;
                        ">${status}</span>
                    </div>
                    ${description ? `<p style="margin: 0 0 10px 0; font-size: 14px; color: #666; line-height: 1.5;">${GRC_Utils.truncateText(description, 150)}</p>` : ''}
                    <div style="display: flex; gap: 8px; flex-wrap: wrap; font-size: 12px; color: #999;">
                        <span>📁 ${category}</span>
                        <span>•</span>
                        <span>📅 ${GRC_Utils.formatDate(policy.effective_date, lang)}</span>
                        <span>•</span>
                        <span>v${policy.version}</span>
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = html;
        console.log('Updated policies list:', policies.length);
    },
    
    /**
     * Load compliance page data
     * Call manually: GRC_DataLoader.loadCompliance()
     */
    async loadCompliance(filters = {}) {
        if (this.loadingStates.compliance) {
            console.log('Compliance already loading...');
            return;
        }
        
        this.loadingStates.compliance = true;
        const loadingNotif = GRC_Notifications.loading('جاري تحميل متطلبات الامتثال...');
        
        try {
            const requirements = await GRC_API.getComplianceRequirements(filters);
            this.updateComplianceList(requirements);
            
            GRC_Notifications.remove(loadingNotif);
            GRC_Notifications.success('تم تحميل متطلبات الامتثال بنجاح');
            
        } catch (error) {
            GRC_Notifications.remove(loadingNotif);
            console.error('Compliance loading failed:', error);
        } finally {
            this.loadingStates.compliance = false;
        }
    },
    
    /**
     * Update compliance requirements list
     * @param {Array} requirements - Array of compliance requirements
     */
    updateComplianceList(requirements) {
        const container = document.getElementById('compliance-table-body');
        if (!container) {
            console.warn('Compliance table body not found');
            return;
        }
        
        if (!requirements || requirements.length === 0) {
            container.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px; color: #999;">
                        لا توجد متطلبات امتثال مسجلة
                    </td>
                </tr>
            `;
            return;
        }
        
        const lang = GRC_CONFIG.language.default;
        const html = requirements.map(req => {
            const title = lang === 'ar' ? req.title_ar : req.title_en;
            const sourceName = lang === 'ar' ? req.source_name_ar : req.source_name_en;
            const source = GRC_Utils.translateStatus(req.source, lang);
            const priority = GRC_Utils.translatePriority(req.priority, lang);
            const status = GRC_Utils.translateStatus(req.status, lang);
            const daysUntil = GRC_Utils.calculateDaysUntil(req.next_due_date);
            const urgency = GRC_Utils.getComplianceUrgency(daysUntil);
            
            const urgencyColors = {
                urgent: '#ffcdd2',
                warning: '#ffecb3',
                normal: '#c8e6c9'
            };
            
            return `
                <tr onclick="GRC_DataLoader.viewComplianceDetails(${req.id})"
                    style="cursor: pointer;"
                    onmouseover="this.style.background='#f8f9fa'"
                    onmouseout="this.style.background='white'">
                    <td style="padding: 12px;">${req.requirement_code}</td>
                    <td style="padding: 12px;">${title}</td>
                    <td style="padding: 12px;">${sourceName || source}</td>
                    <td style="padding: 12px;">
                        <span style="padding: 4px 10px; border-radius: 12px; font-size: 12px; background: #e3f2fd; color: #1976d2;">
                            ${priority}
                        </span>
                    </td>
                    <td style="padding: 12px;">
                        <span style="padding: 4px 10px; border-radius: 12px; font-size: 12px; background: ${urgencyColors[urgency]}; color: #333;">
                            ${daysUntil >= 0 ? `${daysUntil} يوم` : 'متأخر'}
                        </span>
                    </td>
                    <td style="padding: 12px;">
                        <span style="padding: 4px 10px; border-radius: 12px; font-size: 12px; background: #f5f5f5; color: #666;">
                            ${status}
                        </span>
                    </td>
                </tr>
            `;
        }).join('');
        
        container.innerHTML = html;
        console.log('Updated compliance list:', requirements.length);
    },
    
    /**
     * View item details (placeholder for now)
     */
    viewRiskDetails(riskId) {
        console.log('View risk details:', riskId);
        GRC_Notifications.info(`عرض تفاصيل المخاطرة #${riskId}`);
        // In real implementation: open modal or navigate to details page
    },
    
    viewPolicyDetails(policyId) {
        console.log('View policy details:', policyId);
        GRC_Notifications.info(`عرض تفاصيل السياسة #${policyId}`);
        // In real implementation: open modal or navigate to details page
    },
    
    viewComplianceDetails(requirementId) {
        console.log('View compliance details:', requirementId);
        GRC_Notifications.info(`عرض تفاصيل متطلب الامتثال #${requirementId}`);
        // In real implementation: open modal or navigate to details page
    }
};

console.log('✅ GRC Data Loader loaded successfully');
console.log('Available methods:');
console.log('  - GRC_DataLoader.loadDashboard()');
console.log('  - GRC_DataLoader.loadRisks()');
console.log('  - GRC_DataLoader.loadPolicies()');
console.log('  - GRC_DataLoader.loadCompliance()');
    