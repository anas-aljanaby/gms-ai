
import type { GrcData } from '../types';

export const MOCK_GRC_DATA: GrcData = {
    policies: [
        { id: 'POL-001', title: {en: 'Data Privacy Policy', ar: 'سياسة خصوصية البيانات', tr: 'Veri Gizliliği Politikası'}, category: 'compliance', status: 'active', version: '2.1', effectiveDate: '2024-01-01', reviewDate: '2025-01-01', ownerUserId: 'user-1' },
        { id: 'POL-002', title: {en: 'Financial Control Procedures', ar: 'إجراءات الرقابة المالية', tr: 'Finansal Kontrol Prosedürleri'}, category: 'financial', status: 'active', version: '1.5', effectiveDate: '2023-06-01', reviewDate: '2024-12-01', ownerUserId: 'user-2' },
        { id: 'POL-003', title: {en: 'Volunteer Code of Conduct', ar: 'مدونة سلوك المتطوعين', tr: 'Gönüllü Davranış Kuralları'}, category: 'hr', status: 'draft', version: '0.9', effectiveDate: '2024-09-01', reviewDate: '2025-03-01', ownerUserId: 'user-3' },
    ],
    decisions: [
        { id: 'DEC-001', title: {en: 'Approval of 2025 Annual Budget', ar: 'الموافقة على ميزانية 2025 السنوية', tr: '2025 Yıllık Bütçesinin Onaylanması'}, date: '2024-06-15', status: 'implemented', impact: 'high', relatedPolicyId: 'POL-002' },
        { id: 'DEC-002', title: {en: 'Selection of New Audit Firm', ar: 'اختيار شركة تدقيق جديدة', tr: 'Yeni Denetim Firmasının Seçilmesi'}, date: '2024-07-20', status: 'pending', impact: 'medium' },
    ],
    risks: [
        { id: 'RSK-001', risk: 'Donation Shortfall', category: 'financial', probability: 3, impact: 4, score: 12, level: 'High', scope: 'Project', mitigation: ['Diversify funding sources'], status: 'mitigating' },
        { id: 'RSK-002', risk: 'Key Staff Turnover', category: 'operational', probability: 2, impact: 3, score: 6, level: 'Medium', scope: 'Organization', mitigation: ['Implement retention plan'], status: 'monitored' },
        { id: 'RSK-003', risk: 'Negative Media Coverage', category: 'reputational', probability: 2, impact: 4, score: 8, level: 'High', scope: 'Public Relations', mitigation: ['Proactive PR strategy'], status: 'identified' },
        { id: 'RSK-004', risk: 'GDPR Data Breach', category: 'compliance', probability: 2, impact: 4, score: 8, level: 'High', scope: 'IT', mitigation: ['Enhance security measures'], status: 'mitigating' },
        { id: 'RSK-005', risk: 'Data Security Breach', category: 'cyber', probability: 2, impact: 5, score: 10, level: 'High', scope: 'IT', mitigation: ['Encrypt sensitive data', 'Regular security audits'], status: 'identified' },
    ],
    requirements: [
        { id: 'REQ-001', code: 'DON-USA-01', title: {en: 'USAID Grant Reporting', ar: 'تقارير منحة USAID', tr: 'USAID Hibe Raporlaması'}, source: 'donor', sourceName: {en: 'USAID', ar: 'الوكالة الأمريكية للتنمية', tr: 'USAID'}, priority: 'high', nextDueDate: '2024-09-30', status: 'active' },
        { id: 'REQ-002', code: 'INT-FIN-01', title: {en: 'Annual Financial Audit', ar: 'التدقيق المالي السنوي', tr: 'Yıllık Finansal Denetim'}, source: 'internal', sourceName: {en: 'Internal Policy', ar: 'سياسة داخلية', tr: 'İç Politika'}, priority: 'high', nextDueDate: '2025-03-31', status: 'active' },
        { id: 'REQ-003', code: 'REG-TR-01', title: {en: 'Turkish NGO Annual Filing', ar: 'الإيداع السنوي للمنظمات غير الحكومية التركية', tr: 'Türk STK Yıllık Dosyalama'}, source: 'regulatory', sourceName: {en: 'Turkish Ministry of Interior', ar: 'وزارة الداخلية التركية', tr: 'T.C. İçişleri Bakanlığı'}, priority: 'medium', nextDueDate: '2025-04-30', status: 'active' },
    ],
    assessments: [
        { id: 'ASS-001', requirementId: 'REQ-001', date: '2024-06-30', status: 'compliant', score: 100, assessorId: 'user-2' },
        { id: 'ASS-002', requirementId: 'REQ-002', date: '2024-03-15', status: 'compliant', score: 95, assessorId: 'user-2' },
        { id: 'ASS-003', requirementId: 'REQ-003', date: '2024-04-20', status: 'partially-compliant', score: 80, assessorId: 'user-2', findings: {en: 'Some documents were submitted late.', ar: 'تم تقديم بعض المستندات في وقت متأخر.', tr: 'Bazı belgeler geç teslim edildi.'} },
    ],
    auditLog: [
        { id: 1, module: 'risk', recordType: 'Risk', recordId: 'RSK-001', action: 'create', userId: 'user-2', timestamp: '2024-01-10T10:00:00Z'},
        { id: 2, module: 'governance', recordType: 'Policy', recordId: 'POL-002', action: 'update', userId: 'user-1', timestamp: '2024-02-05T14:30:00Z'},
        { id: 3, module: 'compliance', recordType: 'Assessment', recordId: 'ASS-003', action: 'create', userId: 'user-2', timestamp: '2024-04-20T11:00:00Z'},
    ]
};
