import type { HrData } from '../types';

export const MOCK_HR_DATA: HrData = {
    volunteers: [
        {
            volunteer_id: 'VOL-001', full_name: 'محمد أحمد', email: 'mohamed@email.com', phone: '+966 50 123 4567',
            date_of_birth: '1995-03-15', gender: 'male', volunteer_type: 'volunteer', join_date: '2024-01-15',
            status: 'active', preferred_language: 'ar', emergency_contact_name: 'Ali Ahmed', emergency_contact_phone: '+966 50 987 6543',
            address: '123 Main St', city: 'Riyadh', country: 'Saudi Arabia', photo_url: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=200&auto=format&fit=crop',
        },
        {
            volunteer_id: 'VOL-002', full_name: 'Fatma Ali', email: 'fatma.ali@email.com', phone: '+90 532 987 6543',
            date_of_birth: '1998-08-22', gender: 'female', volunteer_type: 'volunteer', join_date: '2023-11-20',
            status: 'active', preferred_language: 'en', emergency_contact_name: 'Hassan Ali', emergency_contact_phone: '+90 533 111 2222',
            address: '456 Oak Ave', city: 'Istanbul', country: 'Turkey', photo_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop',
        },
        {
            volunteer_id: 'STAFF-001', full_name: 'John Smith', email: 'john.smith@staff.com', phone: '+1 202 555 0191',
            date_of_birth: '1990-05-10', gender: 'male', volunteer_type: 'staff', join_date: '2022-01-01',
            status: 'active', preferred_language: 'en', emergency_contact_name: 'Jane Smith', emergency_contact_phone: '+1 202 555 0192',
            address: '789 Pine Rd', city: 'Washington D.C.', country: 'USA', photo_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop',
        }
    ],
    skills: [
        { skill_id: 'SK-1', volunteer_id: 'VOL-001', skill_name: 'Leadership', skill_category: 'leadership', proficiency_level: 'advanced', years_experience: 5, certified: true },
        { skill_id: 'SK-2', volunteer_id: 'VOL-001', skill_name: 'Public Speaking', skill_category: 'leadership', proficiency_level: 'expert', years_experience: 7, certified: true },
        { skill_id: 'SK-3', volunteer_id: 'VOL-001', skill_name: 'First Aid', skill_category: 'medical', proficiency_level: 'intermediate', years_experience: 3, certified: true },
        { skill_id: 'SK-4', volunteer_id: 'VOL-002', skill_name: 'Administrative', skill_category: 'administrative', proficiency_level: 'expert', years_experience: 6, certified: false },
        { skill_id: 'SK-5', volunteer_id: 'VOL-002', skill_name: 'Event Planning', skill_category: 'administrative', proficiency_level: 'advanced', years_experience: 4, certified: true },
        { skill_id: 'SK-6', volunteer_id: 'STAFF-001', skill_name: 'Project Management', skill_category: 'technical', proficiency_level: 'expert', years_experience: 10, certified: true },
    ],
    availability: [
        { availability_id: 'AV-1', volunteer_id: 'VOL-001', day_of_week: 'Monday', start_time: '14:00', end_time: '18:00', available: true },
        { availability_id: 'AV-2', volunteer_id: 'VOL-001', day_of_week: 'Wednesday', start_time: '15:00', end_time: '19:00', available: true },
        { availability_id: 'AV-3', volunteer_id: 'VOL-002', day_of_week: 'Tuesday', start_time: '09:00', end_time: '17:00', available: true },
        { availability_id: 'AV-4', volunteer_id: 'VOL-002', day_of_week: 'Thursday', start_time: '09:00', end_time: '17:00', available: true },
    ],
    assignments: [
        {
            assignment_id: 'AS-1', volunteer_id: 'VOL-001', program_id: 'leadership', event_name: 'Youth Leadership Camp', event_type: 'camp',
            assignment_date: new Date().toISOString().split('T')[0], start_time: '09:00', end_time: '17:00', location: 'Main Hall', role: 'Lead Trainer',
            required_skills: ['Leadership', 'Public Speaking'], status: 'confirmed', ai_match_score: 98,
        },
        {
            assignment_id: 'AS-2', volunteer_id: 'VOL-002', program_id: 'educational', event_name: 'Values Workshop', event_type: 'workshop',
            assignment_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], start_time: '10:00', end_time: '13:00', location: 'Room 101', role: 'Coordinator',
            required_skills: ['Administrative', 'Event Planning'], status: 'pending',
        }
    ],
    hoursLog: [
        { log_id: 'HL-1', volunteer_id: 'VOL-001', assignment_id: 'AS-1', date: '2024-06-20', hours: 8, activity_type: 'camp', program_id: 'leadership', verified: true },
        { log_id: 'HL-2', volunteer_id: 'VOL-002', date: '2024-06-18', hours: 4, activity_type: 'administrative', verified: true },
    ],
    performance: [
         {
            performance_id: 'PERF-1', volunteer_id: 'VOL-001', evaluation_period_start: '2024-01-01', evaluation_period_end: '2024-06-30',
            total_hours: 156, assignments_completed: 15, no_show_count: 0, average_rating: 4.9, punctuality_score: 100,
            reliability_score: 98, overall_performance_score: 99,
        }
    ],
};