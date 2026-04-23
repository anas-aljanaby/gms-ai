import type { GamificationData } from '../types';

export const ALL_BADGES: GamificationData['allBadges'] = [
    // Attendance
    { id: 'att-1', name: { en: 'First Step', ar: 'الخطوة الأولى' }, description: { en: 'Attend your first event.', ar: 'احضر فعاليتك الأولى.' }, icon: '👟', category: 'Attendance', criteria: { en: 'Attend 1 event', ar: 'حضور فعالية واحدة' }, total: 1, points: 10 },
    { id: 'att-2', name: { en: 'Regular Attendee', ar: 'الحضور المنتظم' }, description: { en: 'Show your commitment by attending 5 events.', ar: 'أظهر التزامك بحضور 5 فعاليات.' }, icon: '📅', category: 'Attendance', criteria: { en: 'Attend 5 events', ar: 'حضور 5 فعاليات' }, total: 5, points: 50 },
    { id: 'att-3', name: { en: 'Perfect Attendance', ar: 'الحضور الكامل' }, description: { en: 'Attend all events in a single program.', ar: 'احضر جميع الفعاليات في برنامج واحد.' }, icon: '✅', category: 'Attendance', criteria: { en: 'Attend all events in a program', ar: 'حضور جميع فعاليات البرنامج' }, total: 10, points: 100 },
    // Participation
    { id: 'par-1', name: { en: 'Ice Breaker', ar: 'كاسر الجليد' }, description: { en: 'Participate in a group activity.', ar: 'شارك في نشاط جماعي.' }, icon: '🤝', category: 'Participation', criteria: { en: 'Join 1 group activity', ar: 'الانضمام لنشاط جماعي واحد' }, total: 1, points: 20 },
    { id: 'par-2', name: { en: 'Team Player', ar: 'لاعب فريق' }, description: { en: 'Successfully complete a team project.', ar: 'أكمل مشروعًا جماعيًا بنجاح.' }, icon: '🧑‍🤝‍🧑', category: 'Participation', criteria: { en: 'Complete 1 team project', ar: 'إكمال مشروع جماعي واحد' }, total: 1, points: 75 },
    { id: 'par-3', name: { en: 'Initiator', ar: 'المبادر' }, description: { en: 'Lead a community initiative.', ar: 'قد مبادرة مجتمعية.' }, icon: '🚀', category: 'Participation', criteria: { en: 'Lead 1 initiative', ar: 'قيادة مبادرة واحدة' }, total: 1, points: 150 },
    // Evaluation
    { id: 'eva-1', name: { en: 'Feedback Fan', ar: 'محب التقييم' }, description: { en: 'Submit your first event evaluation.', ar: 'أرسل أول تقييم لفعالية.' }, icon: '📝', category: 'Evaluation', criteria: { en: 'Submit 1 evaluation', ar: 'تقديم تقييم واحد' }, total: 1, points: 15 },
    { id: 'eva-2', name: { en: 'Consistent Critic', ar: 'الناقد المستمر' }, description: { en: 'Provide feedback for 5 different events.', ar: 'قدم تقييمًا لـ 5 فعاليات مختلفة.' }, icon: '🧐', category: 'Evaluation', criteria: { en: 'Submit 5 evaluations', ar: 'تقديم 5 تقييمات' }, total: 5, points: 50 },
    // Achievement
    { id: 'ach-1', name: { en: 'Rising Star', ar: 'النجم الصاعد' }, description: { en: 'Reach 100 total points.', ar: 'الوصول إلى 100 نقطة إجمالية.' }, icon: '🌟', category: 'Achievement', criteria: { en: 'Earn 100 points', ar: 'كسب 100 نقطة' }, total: 100, points: 0 },
    { id: 'ach-2', name: { en: 'Community Champion', ar: 'بطل المجتمع' }, description: { en: 'Reach 500 total points.', ar: 'الوصول إلى 500 نقطة إجمالية.' }, icon: '🏆', category: 'Achievement', criteria: { en: 'Earn 500 points', ar: 'كسب 500 نقطة' }, total: 500, points: 0 },
    { id: 'ach-3', name: { en: 'Leadership Legend', ar: 'أسطورة القيادة' }, description: { en: 'Reach 1000 total points and earn the "Initiator" badge.', ar: 'الوصول إلى 1000 نقطة والحصول على شارة "المبادر".' }, icon: '👑', category: 'Achievement', criteria: { en: 'Earn 1000 points', ar: 'كسب 1000 نقطة' }, total: 1000, points: 0 },
];

export const INITIAL_USER_ACHIEVEMENT: GamificationData['userAchievement'] = {
    userId: 'user-1',
    totalPoints: 85,
    level: 'Bronze',
    earnedBadges: [
        { badgeId: 'att-1', dateEarned: '2024-05-10T00:00:00Z' },
        { badgeId: 'par-1', dateEarned: '2024-05-22T00:00:00Z' },
        { badgeId: 'eva-1', dateEarned: '2024-05-11T00:00:00Z' },
    ],
    badgeProgress: {
        'att-2': 3, // 3 out of 5 events attended
        'eva-2': 1, // 1 out of 5 evaluations submitted
        'ach-1': 85, // 85 out of 100 points
    },
    pointsBreakdown: {
        'Attendance': 30,
        'Participation': 40,
        'Evaluation': 15,
    }
};

export const MOCK_LEADERBOARD: GamificationData['leaderboard'] = [
    { id: 'user-2', name: 'Fatma Kaya', avatar: 'https://picsum.photos/id/402/100/100', points: 1250, level: 'Platinum' },
    { id: 'user-3', name: 'John Doe', avatar: 'https://picsum.photos/id/403/100/100', points: 980, level: 'Gold' },
    { id: 'user-1', name: 'Ali Veli', avatar: 'https://picsum.photos/id/401/100/100', points: 850, level: 'Gold' },
    { id: 'user-4', name: 'Jane Smith', avatar: 'https://picsum.photos/id/404/100/100', points: 620, level: 'Silver' },
    { id: 'user-5', name: 'Ahmed Khan', avatar: 'https://picsum.photos/id/405/100/100', points: 450, level: 'Silver' },
];