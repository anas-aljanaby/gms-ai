
import { useReducer, useEffect } from 'react';
import type { Student } from '../types';
import { MOCK_STUDENTS } from '../data/sponsorshipData';

type Action = { type: 'ADD_STUDENT'; payload: Student };

const LOCAL_STORAGE_KEY = 'mss2-erp-sponsorship-data';

/**
 * getInitialState - تحميل الحالة الأولية لبيانات الكفالات من localStorage أو استخدام البيانات الافتراضية.
 * @returns {Student[]} - الحالة الأولية لبيانات الطلاب.
 */
const getInitialState = (): Student[] => {
    try {
        const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedData) {
            return JSON.parse(storedData);
        }
    } catch (error) {
        console.error("Failed to load sponsorship data from localStorage:", error);
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(MOCK_STUDENTS));
    return MOCK_STUDENTS;
};

/**
 * sponsorshipReducer - Reducer لإدارة حالة بيانات الطلاب المكفولين.
 * @param {Student[]} state - الحالة الحالية.
 * @param {Action} action - الإجراء المطلوب تنفيذه.
 * @returns {Student[]} - الحالة الجديدة.
 */
const sponsorshipReducer = (state: Student[], action: Action): Student[] => {
  switch (action.type) {
    case 'ADD_STUDENT':
      return [...state, action.payload];
    // Add other actions like 'UPDATE_STUDENT', 'START_SPONSORSHIP' etc. later
    default:
      return state;
  }
};

/**
 * useSponsorshipData - خطاف مخصص لإدارة بيانات الكفالات والطلاب.
 * يوفر الحالة الحالية ودالة dispatch لتحديثها، مع الحفظ التلقائي في localStorage.
 * 
 * @returns {{students: Student[], dispatch: React.Dispatch<Action>}} - كائن يحتوي على بيانات الطلاب ودالة dispatch.
 * 
 * @example
 * const { students, dispatch } = useSponsorshipData();
 * dispatch({ type: 'ADD_STUDENT', payload: newStudent });
 */
export const useSponsorshipData = () => {
  const [students, dispatch] = useReducer(sponsorshipReducer, getInitialState());

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(students));
    } catch (error) {
      console.error("Failed to save sponsorship data to localStorage:", error);
    }
  }, [students]);

  return { students, dispatch };
};
