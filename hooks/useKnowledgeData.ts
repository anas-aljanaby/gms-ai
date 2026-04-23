


import { useState, useEffect } from 'react';
import type { KnowledgeData } from '../types';
import { MOCK_KNOWLEDGE_DATA } from '../data/knowledgeData';

const getInitialState = (): KnowledgeData => {
    try {
        const storedData = localStorage.getItem('mss2-erp-knowledge-data');
        return storedData ? JSON.parse(storedData) : MOCK_KNOWLEDGE_DATA;
    } catch (error) {
        console.error("Failed to load knowledge data from localStorage:", error);
        return MOCK_KNOWLEDGE_DATA;
    }
};

export const useKnowledgeData = () => {
  const [knowledgeData, setKnowledgeData] = useState<KnowledgeData>(getInitialState());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate async loading
    setIsLoading(true);
    setTimeout(() => {
        setKnowledgeData(getInitialState());
        setIsLoading(false);
    }, 300);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('mss2-erp-knowledge-data', JSON.stringify(knowledgeData));
    } catch (error) {
      console.error("Failed to save knowledge data to localStorage:", error);
    }
  }, [knowledgeData]);

  return { 
    knowledgeData,
    isLoading,
    setKnowledgeData 
  };
};