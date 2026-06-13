
import type { GrcData } from '../types';

export const MOCK_GRC_DATA: GrcData = {
    policies: [
        { id: 'POL-001', title: {en: 'Data Privacy Policy', ar: 'سياسة خصوصية البيانات'}, category: 'compliance', status: 'active', version: '2.1', effectiveDate: '2024-01-01', reviewDate: '2025-01-01', ownerUserId: 'user-1' },
        { id: 'POL-002', title: {en: 'Financial Control Procedures', ar: 'إجراءات الرقابة المالية'}, category: 'financial', status: 'active', version: '1.5', effectiveDate: '2023-06-01', reviewDate: '2024-12-01', ownerUserId: 'user-2' },
        { id: 'POL-003', title: {en: 'Volunteer Code of Conduct', ar: 'مدونة سلوك المتطوعين'}, category: 'hr', status: 'draft', version: '0.9', effectiveDate: '2024-09-01', reviewDate: '2025-03-01', ownerUserId: 'user-3' },
    ],
    decisions: [
        { id: 'DEC-001', title: {en: 'Approval of 2025 Annual Budget', ar: 'الموافقة على ميزانية 2025 السنوية'}, date: '2024-06-15', status: 'implemented', impact: 'high', relatedPolicyId: 'POL-002' },
        { id: 'DEC-002', title: {en: 'Selection of New Audit Firm', ar: 'اختيار شركة تدقيق جديدة'}, date: '2024-07-20', status: 'pending', impact: 'medium' },
    ],
    risks: [
        { id: 'RSK-001', risk: { en: 'Donation Shortfall', ar: 'نقص التبرعات' }, category: 'financial', probability: 3, impact: 4, score: 12, level: 'High', scope: 'project', mitigation: [{ en: 'Diversify funding sources', ar: 'تنويع مصادر التمويل' }], status: 'mitigating' },
        { id: 'RSK-002', risk: { en: 'Key Staff Turnover', ar: 'دوران الموظفين الرئيسيين' }, category: 'operational', probability: 2, impact: 3, score: 6, level: 'Medium', scope: 'organization', mitigation: [{ en: 'Implement retention plan', ar: 'تنفيذ خطة الاحتفاظ بالمواهب' }], status: 'monitored' },
        { id: 'RSK-003', risk: { en: 'Negative Media Coverage', ar: 'تغطية إعلامية سلبية' }, category: 'reputational', probability: 2, impact: 4, score: 8, level: 'High', scope: 'public_relations', mitigation: [{ en: 'Proactive PR strategy', ar: 'استراتيجية علاقات عامة استباقية' }], status: 'identified' },
        { id: 'RSK-004', risk: { en: 'GDPR Data Breach', ar: 'خرق بيانات وفق GDPR' }, category: 'compliance', probability: 2, impact: 4, score: 8, level: 'High', scope: 'it', mitigation: [{ en: 'Enhance security measures', ar: 'تعزيز التدابير الأمنية' }], status: 'mitigating' },
        { id: 'RSK-005', risk: { en: 'Data Security Breach', ar: 'خرق أمن البيانات' }, category: 'cyber', probability: 2, impact: 5, score: 10, level: 'High', scope: 'it', mitigation: [{ en: 'Encrypt sensitive data', ar: 'تشفير البيانات الحساسة' }, { en: 'Regular security audits', ar: 'مراجعات أمنية دورية' }], status: 'identified' },
    ],
    requirements: [
        { id: 'REQ-001', code: 'DON-USA-01', title: {en: 'USAID Grant Reporting', ar: 'تقارير منحة USAID'}, source: 'donor', sourceName: {en: 'USAID', ar: 'الوكالة الأمريكية للتنمية'}, priority: 'high', nextDueDate: '2024-09-30', status: 'active' },
        { id: 'REQ-002', code: 'INT-FIN-01', title: {en: 'Annual Financial Audit', ar: 'التدقيق المالي السنوي'}, source: 'internal', sourceName: {en: 'Internal Policy', ar: 'سياسة داخلية'}, priority: 'high', nextDueDate: '2025-03-31', status: 'active' },
        { id: 'REQ-003', code: 'REG-01', title: {en: 'NGO Annual Filing', ar: 'الإيداع السنوي للمنظمات غير الحكومية'}, source: 'regulatory', sourceName: {en: 'Ministry of Interior', ar: 'وزارة الداخلية'}, priority: 'medium', nextDueDate: '2025-04-30', status: 'active' },
    ],
    assessments: [
        { id: 'ASS-001', requirementId: 'REQ-001', date: '2024-06-30', status: 'compliant', score: 100, assessorId: 'user-2' },
        { id: 'ASS-002', requirementId: 'REQ-002', date: '2024-03-15', status: 'compliant', score: 95, assessorId: 'user-2' },
        { id: 'ASS-003', requirementId: 'REQ-003', date: '2024-04-20', status: 'partially-compliant', score: 80, assessorId: 'user-2', findings: {en: 'Some documents were submitted late.', ar: 'تم تقديم بعض المستندات في وقت متأخر.'} },
    ],
    auditLog: [
        { id: 1, module: 'risk', recordType: 'Risk', recordId: 'RSK-001', action: 'create', userId: 'user-2', timestamp: '2024-01-10T10:00:00Z'},
        { id: 2, module: 'governance', recordType: 'Policy', recordId: 'POL-002', action: 'update', userId: 'user-1', timestamp: '2024-02-05T14:30:00Z'},
        { id: 3, module: 'compliance', recordType: 'Assessment', recordId: 'ASS-003', action: 'create', userId: 'user-2', timestamp: '2024-04-20T11:00:00Z'},
    ]
};
