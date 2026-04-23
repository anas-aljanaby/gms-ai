import { useReducer, useEffect } from 'react';
import type { GrcData } from '../types';
import { MOCK_GRC_DATA } from '../data/grcData';

type Action = { type: 'UPDATE_RISK_STATUS'; payload: { riskId: string; newStatus: any } };

const LOCAL_STORAGE_KEY = 'mss2-erp-grc-data';

const getInitialState = (): GrcData => {
    try {
        const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        return storedData ? JSON.parse(storedData) : MOCK_GRC_DATA;
    } catch (error) {
        console.error("Failed to load GRC data from localStorage:", error);
        return MOCK_GRC_DATA;
    }
};

const grcReducer = (state: GrcData, action: Action): GrcData => {
    switch (action.type) {
        // Define reducer logic for GRC actions later
        default:
            return state;
    }
};

export const useGrcData = () => {
    const [grcData, dispatchGrcAction] = useReducer(grcReducer, getInitialState());

    useEffect(() => {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(grcData));
        } catch (error) {
            console.error("Failed to save GRC data to localStorage:", error);
        }
    }, [grcData]);

    return { grcData, dispatchGrcAction };
};
