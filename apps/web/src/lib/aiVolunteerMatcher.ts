
import type { Volunteer, VolunteerSkill, VolunteerAvailability, VolunteerPerformance, VolunteerAssignment } from '../types';

/**
 * calculateSkillMatch - حساب تطابق المهارات بين المتطوع والمتطلبات.
 * @param {VolunteerSkill[]} volunteerSkills - مهارات المتطوع.
 * @param {string[]} requiredSkills - المهارات المطلوبة.
 * @returns {number} - نسبة التطابق من 0 إلى 100.
 */
const calculateSkillMatch = (volunteerSkills: VolunteerSkill[], requiredSkills: string[]): number => {
    if (requiredSkills.length === 0) return 100;
    const matched = requiredSkills.filter(req => volunteerSkills.some(vs => vs.skill_name === req && vs.proficiency_level !== 'beginner'));
    return (matched.length / requiredSkills.length) * 100;
};

/**
 * checkAvailability - التحقق من توفر المتطوع في تاريخ ووقت محددين.
 * @param {VolunteerAvailability[]} volunteerAvailability - جدول توفر المتطوع.
 * @param {Date} date - تاريخ المهمة.
 * @param {string} startTime - وقت بدء المهمة.
 * @param {string} endTime - وقت انتهاء المهمة.
 * @returns {boolean} - true إذا كان المتطوع متاحًا، وإلا false.
 */
const checkAvailability = (volunteerAvailability: VolunteerAvailability[], date: Date, startTime: string, endTime: string): boolean => {
    const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' }) as any;
    const relevantSlots = volunteerAvailability.filter(slot => slot.day_of_week === dayOfWeek && slot.available);
    if (relevantSlots.length === 0) return false;

    const assignmentStart = parseInt(startTime.replace(':', ''), 10);
    const assignmentEnd = parseInt(endTime.replace(':', ''), 10);

    return relevantSlots.some(slot => {
        const slotStart = parseInt(slot.start_time.replace(':', ''), 10);
        const slotEnd = parseInt(slot.end_time.replace(':', ''), 10);
        return assignmentStart >= slotStart && assignmentEnd <= slotEnd;
    });
};

/**
 * calculateWorkloadScore - حساب درجة عبء العمل للمتطوع.
 * @param {number} volunteerHours - إجمالي ساعات المتطوع.
 * @returns {number} - درجة من 0 إلى 100 (الأعلى أفضل).
 */
const calculateWorkloadScore = (volunteerHours: number): number => {
    // Higher score for lower hours (prefers less-burdened volunteers)
    if (volunteerHours > 80) return 20;
    if (volunteerHours > 40) return 60;
    return 100;
};

/**
 * calculatePreferenceScore - حساب درجة التفضيل بناءً على المشاركات السابقة في البرنامج.
 * @param {string} volunteerId - معرف المتطوع.
 * @param {string} programId - معرف البرنامج.
 * @param {VolunteerAssignment[]} pastAssignments - المهام السابقة.
 * @returns {number} - درجة من 0 إلى 100.
 */
const calculatePreferenceScore = (volunteerId: string, programId: string, pastAssignments: VolunteerAssignment[]): number => {
    // Prefers volunteers who worked on this program before
    const programAssignments = pastAssignments.filter(a => a.volunteer_id === volunteerId && a.program_id === programId);
    return programAssignments.length > 0 ? 100 : 50;
};

/**
 * calculateAIMatchScore - حساب درجة التوافق الشاملة للمتطوع مع مهمة معينة باستخدام الذكاء الاصطناعي.
 * 
 * @param {Volunteer} volunteer - كائن المتطوع.
 * @param {VolunteerSkill[]} skills - مهارات المتطوع.
 * @param {VolunteerAvailability[]} availability - جدول توفر المتطوع.
 * @param {VolunteerPerformance | undefined} performance - سجل أداء المتطوع.
 * @param {VolunteerAssignment[]} pastAssignments - سجل المهام السابقة.
 * @param {string[]} requiredSkills - المهارات المطلوبة للمهمة.
 * @param {Date} assignmentDate - تاريخ المهمة.
 * @param {string} assignmentStartTime - وقت بدء المهمة.
 * @param {string} assignmentEndTime - وقت انتهاء المهمة.
 * @param {string} programId - معرف البرنامج.
 * @returns {number} - درجة التوافق من 0 إلى 100.
 * 
 * @example
 * const score = calculateAIMatchScore(volunteer, skills, availability, performance, assignments, ['Leadership'], new Date(), '09:00', '12:00', 'PROJ-001');
 */
export function calculateAIMatchScore(
    volunteer: Volunteer,
    skills: VolunteerSkill[],
    availability: VolunteerAvailability[],
    performance: VolunteerPerformance | undefined,
    pastAssignments: VolunteerAssignment[],
    requiredSkills: string[],
    assignmentDate: Date,
    assignmentStartTime: string,
    assignmentEndTime: string,
    programId: string,
): number {
  let score = 0;
  
  // 1. Skill Match (40%)
  const skillMatch = calculateSkillMatch(skills, requiredSkills);
  score += skillMatch * 0.40;
  
  // 2. Availability (25%)
  const isAvailable = checkAvailability(availability, assignmentDate, assignmentStartTime, assignmentEndTime);
  score += (isAvailable ? 100 : 0) * 0.25;
  
  // 3. Performance (20%)
  const performanceScore = performance?.overall_performance_score || 70; // Default to 70 if no record
  score += performanceScore * 0.20;
  
  // 4. Workload (10%)
  const totalHours = performance?.total_hours || 0;
  const workloadScore = calculateWorkloadScore(totalHours);
  score += workloadScore * 0.10;
  
  // 5. Preferences & Fit (5%)
  const preferenceScore = calculatePreferenceScore(volunteer.volunteer_id, programId, pastAssignments);
  score += preferenceScore * 0.05;
  
  return Math.min(100, Math.round(score));
}
