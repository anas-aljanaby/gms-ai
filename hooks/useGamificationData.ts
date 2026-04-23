
import { useReducer, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import type { GamificationData, Badge, UserLevel, UserAchievement } from '../types';
import { ALL_BADGES, INITIAL_USER_ACHIEVEMENT, MOCK_LEADERBOARD } from '../data/gamificationData';

type State = UserAchievement;

type Action = 
  | { type: 'EARN_BADGE'; payload: { badgeId: string } };

const LOCAL_STORAGE_KEY = 'mss2-erp-gamification-data';

/**
 * getInitialState - تحميل الحالة الأولية لبيانات الإنجازات من localStorage أو استخدام البيانات الافتراضية.
 * @returns {GamificationData['userAchievement']} - الحالة الأولية لإنجازات المستخدم.
 */
const getInitialState = (): GamificationData['userAchievement'] => {
  try {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : INITIAL_USER_ACHIEVEMENT;
  } catch (error) {
    console.error("Failed to load gamification data:", error);
    return INITIAL_USER_ACHIEVEMENT;
  }
};

/**
 * getLevel - حساب مستوى المستخدم بناءً على نقاطه.
 * @param {number} points - إجمالي نقاط المستخدم.
 * @returns {UserLevel} - مستوى المستخدم.
 */
const getLevel = (points: number): UserLevel => {
    if (points >= 1000) return 'Platinum';
    if (points >= 500) return 'Gold';
    if (points >= 200) return 'Silver';
    return 'Bronze';
};

/**
 * reducer - Reducer لإدارة حالة إنجازات المستخدم.
 * @param {GamificationData['userAchievement']} state - الحالة الحالية.
 * @param {Action} action - الإجراء المطلوب تنفيذه.
 * @returns {GamificationData['userAchievement']} - الحالة الجديدة.
 */
const reducer = (state: GamificationData['userAchievement'], action: Action): GamificationData['userAchievement'] => {
  switch (action.type) {
    case 'EARN_BADGE': {
      const { badgeId } = action.payload;
      if (state.earnedBadges.some(b => b.badgeId === badgeId)) {
        return state; // Already earned
      }
      
      const badge = ALL_BADGES.find(b => b.id === badgeId);
      if (!badge) return state;

      const newPoints = state.totalPoints + badge.points;
      const newLevel = getLevel(newPoints);

      const newBadgeProgress = { ...state.badgeProgress };
      delete newBadgeProgress[badgeId]; // Remove from in-progress
      
      const newPointsBreakdown = {...state.pointsBreakdown};
      newPointsBreakdown[badge.category] = (newPointsBreakdown[badge.category] || 0) + badge.points;

      return {
          ...state,
          totalPoints: newPoints,
          level: newLevel,
          earnedBadges: [...state.earnedBadges, { badgeId, dateEarned: new Date().toISOString() }],
          badgeProgress: newBadgeProgress,
          pointsBreakdown: newPointsBreakdown,
      };
    }
    default:
      return state;
  }
};

/**
 * triggerConfetti - دالة لإطلاق قصاصات الورق الملونة (confetti).
 */
const triggerConfetti = () => {
    confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#3B82F6', '#10B981', '#F59E0B', '#A78BFA']
    });
};

/**
 * useGamificationData - خطاف مخصص لإدارة بيانات نظام الإنجازات والمكافآت.
 * 
 * @returns {{ gamificationData: GamificationData, earnBadge: (badgeId: string) => Badge | null }} - كائن يحتوي على بيانات الإنجازات ودالة لكسب شارة جديدة.
 * 
 * @example
 * const { gamificationData, earnBadge } = useGamificationData();
 * const newBadge = earnBadge('att-1');
 * if (newBadge) { console.log(`You earned ${newBadge.name.en}!`); }
 */
export const useGamificationData = () => {
  const [state, dispatch] = useReducer(reducer, getInitialState());

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save gamification data to localStorage:", error);
    }
  }, [state]);

  const earnBadge = useCallback((badgeId: string): Badge | null => {
    const badge = ALL_BADGES.find(b => b.id === badgeId);
    if (badge && !state.earnedBadges.some(b => b.badgeId === badgeId)) {
        dispatch({ type: 'EARN_BADGE', payload: { badgeId } });
        triggerConfetti();
        return badge;
    }
    return null;
  }, [state.earnedBadges]);

  const gamificationData: GamificationData = {
      allBadges: ALL_BADGES,
      userAchievement: state,
      leaderboard: MOCK_LEADERBOARD,
  };

  return { gamificationData, earnBadge };
};
