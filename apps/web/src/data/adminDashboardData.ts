import type { AdminDashboardData } from '../types';

export const MOCK_ADMIN_DATA: AdminDashboardData = {
  totalRegistrations: { value: 1256, trend: 12.5 },
  totalAttendees: { value: 980, total: 1256 },
  averageRating: { value: 4.6, count: 750 },
  budgetUtilization: { used: 35600, total: 50000 },
  attendanceOverTime: [
    { date: 'Jan', attendees: 120 },
    { date: 'Feb', attendees: 150 },
    { date: 'Mar', attendees: 210 },
    { date: 'Apr', attendees: 180 },
    { date: 'May', attendees: 250 },
    { date: 'Jun', attendees: 220 },
  ],
  registrationVsAttendance: [
    { event: 'Gala 2024', registrations: 300, attendees: 280 },
    { event: 'Workshop A', registrations: 150, attendees: 120 },
    { event: 'Webinar Q2', registrations: 500, attendees: 350 },
    { event: 'Community Day', registrations: 306, attendees: 230 },
  ],
  eventTypeDistribution: [
    { name: 'Webinar', value: 400 },
    { name: 'Workshop', value: 300 },
    { name: 'Gala', value: 200 },
    { name: 'Community', value: 356 },
  ],
  ratingDistribution: [
    { rating: 5, count: 450 },
    { rating: 4, count: 250 },
    { rating: 3, count: 40 },
    { rating: 2, count: 8 },
    { rating: 1, count: 2 },
  ],
  participants: [
    { id: 'P001', name: 'Aisha Al-Farsi', registrationDate: '2024-06-01T10:00:00Z', attendanceStatus: 'Attended', rating: 5, event: 'Webinar Q2', email: 'aisha.f@example.com' },
    { id: 'P002', name: 'John Smith', registrationDate: '2024-06-02T11:00:00Z', attendanceStatus: 'Attended', rating: 4, event: 'Webinar Q2', email: 'john.smith@example.com' },
    { id: 'P003', name: 'Fatma Yılmaz', registrationDate: '2024-06-03T12:00:00Z', attendanceStatus: 'Absent', event: 'Webinar Q2', email: 'fatma.y@example.com' },
    { id: 'P004', name: 'David Chen', registrationDate: '2024-05-15T09:00:00Z', attendanceStatus: 'Attended', rating: 5, event: 'Gala 2024', email: 'david.chen@example.com' },
    { id: 'P005', name: 'Maria Garcia', registrationDate: '2024-05-16T14:00:00Z', attendanceStatus: 'Attended', rating: 4, event: 'Gala 2024', email: 'maria.g@example.com' },
    { id: 'P006', name: 'Kenji Tanaka', registrationDate: '2024-06-10T10:00:00Z', attendanceStatus: 'Registered', event: 'Workshop B', email: 'kenji.t@example.com' },
    { id: 'P007', name: 'Omar Hassan', registrationDate: '2024-06-11T11:30:00Z', attendanceStatus: 'Registered', event: 'Workshop B', email: 'omar.h@example.com' },
    { id: 'P008', name: 'Emily White', registrationDate: '2024-06-12T13:00:00Z', attendanceStatus: 'Attended', rating: 5, event: 'Workshop A', email: 'emily.w@example.com' },
    { id: 'P009', name: 'Mehmet Öztürk', registrationDate: '2024-06-13T15:00:00Z', attendanceStatus: 'Attended', rating: 3, event: 'Workshop A', email: 'mehmet.o@example.com' },
    { id: 'P010', name: 'Abdullah Al-Jaber', registrationDate: '2024-05-20T18:00:00Z', attendanceStatus: 'Attended', rating: 5, event: 'Gala 2024', email: 'abdullah.j@example.com' },
  ],
};
