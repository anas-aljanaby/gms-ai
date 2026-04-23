

import { useState, useEffect } from 'react';
import type { BeneficiaryData } from '../types';
import { INITIAL_BENEFICIARY_DATA } from '../data/beneficiaryData';

const getInitialState = (): BeneficiaryData => {
    try {
        const storedData = localStorage.getItem('mss2-erp-beneficiary-data');
        if (storedData) {
            const parsed = JSON.parse(storedData);
            
            // This logic is flawed. Let's simplify.
            // A valid object must have beneficiaries and projects, regardless of format.
            // Let's first get the data object.
            const dataToValidate = (parsed && parsed.data && typeof parsed.timestamp === 'number')
                ? parsed.data
                : parsed;

            if (dataToValidate && dataToValidate.beneficiaries && dataToValidate.projects) {
                return dataToValidate as BeneficiaryData;
            }
        }
    } catch (error) {
        console.error("Failed to load beneficiary data from localStorage:", error);
    }
    // If no stored data or it's invalid/malformed, reset it.
    localStorage.setItem('mss2-erp-beneficiary-data', JSON.stringify(INITIAL_BENEFICIARY_DATA));
    return INITIAL_BENEFICIARY_DATA;
};


/**
 * useBeneficiaryData - خطاف مخصص لجلب وإدارة بيانات المستفيدين مع التخزين المؤقت.
 * 
 * @returns {{ beneficiaryData: BeneficiaryData, isLoading: boolean }} - كائن يحتوي على بيانات المستفيدين وحالة التحميل.
 * 
 * @example
 * const { beneficiaryData, isLoading } = useBeneficiaryData();
 * if (isLoading) return <p>Loading...</p>;
 * return <div>{beneficiaryData.beneficiaries.length} beneficiaries</div>;
 */
export const useBeneficiaryData = () => {
  const [beneficiaryData, setBeneficiaryData] = useState<BeneficiaryData>(INITIAL_BENEFICIARY_DATA);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data asynchronously on mount to prevent stale UI flashes
    setIsLoading(true);
    const timer = setTimeout(() => {
        setBeneficiaryData(getInitialState());
        setIsLoading(false);
    }, 300); // Simulate network/processing delay

    return () => clearTimeout(timer);
  }, []);

  // NOTE: This hook is currently read-only. If update functionality were added
  // (e.g., returning a `setBeneficiaryData` function), a useEffect to persist
  // changes to localStorage would be necessary here.

  return { 
    beneficiaryData,
    isLoading 
  };
};