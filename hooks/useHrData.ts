
import { useReducer, useEffect } from 'react';
import type { HrData } from '../types';
import { MOCK_HR_DATA } from '../data/hrData';

type Action = { type: 'ADD_VOLUNTEER'; payload: any }; // Define more actions as needed

const LOCAL_STORAGE_KEY = 'mss2-erp-hr-data';

/**
 * getInitialState - تحميل الحالة الأولية لبيانات الموارد البشرية من localStorage أو استخدام البيانات الافتراضية.
 * @returns {HrData} - الحالة الأولية لبيانات الموارد البشرية.
 */
const getInitialState = (): HrData => {
  try {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    }
  } catch (error) {
    console.error("Failed to load HR data from localStorage:", error);
  }
  // If no stored data, initialize and save mock data
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(MOCK_HR_DATA));
  return MOCK_HR_DATA;
};

/**
 * hrReducer - Reducer لإدارة حالة بيانات الموارد البشرية.
 * @param {HrData} state - الحالة الحالية.
 * @param {Action} action - الإجراء المطلوب تنفيذه.
 * @returns {HrData} - الحالة الجديدة.
 */
const hrReducer = (state: HrData, action: Action): HrData => {
  switch (action.type) {
    // Add reducer logic for actions like adding, updating volunteers etc.
    default:
      return state;
  }
};

/**
 * useHrData - خطاف مخصص لإدارة بيانات الموارد البشرية (الموظفين والمتطوعين).
 * يوفر الحالة الحالية ودالة dispatch لتحديثها، مع الحفظ التلقائي في localStorage.
 * 
 * @returns {{hrData: HrData, dispatchHrAction: React.Dispatch<Action>}} - كائن يحتوي على بيانات الموارد البشرية ودالة dispatch.
 * 
 * @example
 * const { hrData, dispatchHrAction } = useHrData();
 * // dispatchHrAction({ type: 'ADD_VOLUNTEER', payload: newVolunteer });
 */
export const useHrData = () => {
  const [hrData, dispatchHrAction] = useReducer(hrReducer, getInitialState());

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(hrData));
    } catch (error) {
      console.error("Failed to save HR data to localStorage:", error);
    }
  }, [hrData]);

  return { hrData, dispatchHrAction };
};
