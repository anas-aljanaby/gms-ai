
import type { ComplianceEntity, ComplianceAlert, RiskLevel, AlertStatus } from '../types';

const KEYS = {
  ENTITIES: 'compliance_entities',
  ALERTS: 'compliance_alerts'
};

/**
 * saveEntity - حفظ كيان جديد في localStorage.
 * @param {Omit<ComplianceEntity, 'id' | 'createdAt'>} data - بيانات الكيان.
 * @returns {ComplianceEntity} - الكيان الجديد بعد حفظه مع المعرف وتاريخ الإنشاء.
 */
export function saveEntity(data: Omit<ComplianceEntity, 'id' | 'createdAt'>): ComplianceEntity {
  const entities: ComplianceEntity[] = getEntities();
  const newEntity = {...data, id: Date.now().toString(), createdAt: new Date().toISOString()};
  entities.unshift(newEntity);
  localStorage.setItem(KEYS.ENTITIES, JSON.stringify(entities));
  return newEntity;
}

/**
 * getEntities - جلب جميع الكيانات من localStorage.
 * @returns {ComplianceEntity[]} - مصفوفة من الكيانات مرتبة حسب تاريخ الإنشاء.
 */
export function getEntities(): ComplianceEntity[] {
  try {
    const entities = JSON.parse(localStorage.getItem(KEYS.ENTITIES) || '[]');
    return entities.sort((a: ComplianceEntity, b: ComplianceEntity) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (e) {
    return [];
  }
}

/**
 * saveAlert - حفظ تنبيه جديد في localStorage.
 * @param {Omit<ComplianceAlert, 'id' | 'status' | 'createdAt'>} data - بيانات التنبيه.
 * @returns {ComplianceAlert} - التنبيه الجديد بعد حفظه.
 */
export function saveAlert(data: Omit<ComplianceAlert, 'id' | 'status' | 'createdAt'>): ComplianceAlert {
  const alerts: ComplianceAlert[] = getAlerts();
  const newAlert = {...data, id: Date.now().toString(), status: 'open' as const, createdAt: new Date().toISOString()};
  alerts.unshift(newAlert);
  localStorage.setItem(KEYS.ALERTS, JSON.stringify(alerts));
  return newAlert;
}

/**
 * getAlerts - جلب جميع التنبيهات من localStorage.
 * @returns {ComplianceAlert[]} - مصفوفة من التنبيهات مرتبة حسب تاريخ الإنشاء.
 */
export function getAlerts(): ComplianceAlert[] {
  try {
    const alerts = JSON.parse(localStorage.getItem(KEYS.ALERTS) || '[]');
    return alerts.sort((a: ComplianceAlert, b: ComplianceAlert) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch(e) {
    return [];
  }
}

/**
 * updateAlertStatus - تحديث حالة تنبيه معين.
 * @param {string} alertId - معرف التنبيه.
 * @param {AlertStatus} status - الحالة الجديدة.
 * @returns {ComplianceAlert[]} - قائمة التنبيهات المحدثة.
 */
export function updateAlertStatus(alertId: string, status: AlertStatus): ComplianceAlert[] {
    const alerts: ComplianceAlert[] = getAlerts();
    const updatedAlerts = alerts.map(alert => 
        alert.id === alertId ? { ...alert, status } : alert
    );
    localStorage.setItem(KEYS.ALERTS, JSON.stringify(updatedAlerts));
    return updatedAlerts;
}

/**
 * getStats - جلب إحصائيات الامتثال.
 * @returns {object} - كائن يحتوي على إحصائيات.
 */
export function getStats() {
  const entities = getEntities();
  const alerts = getAlerts();
  return {
    totalEntities: entities.length,
    highRisk: entities.filter(e => e.riskLevel === 'high').length,
    mediumRisk: entities.filter(e => e.riskLevel === 'medium').length,
    lowRisk: entities.filter(e => e.riskLevel === 'low').length,
    openAlerts: alerts.filter(a => a.status === 'open').length
  };
}
