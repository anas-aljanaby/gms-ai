import { useState, useCallback } from 'react';

type HistoryState<T> = [T, (newState: T) => void, () => void, () => void, boolean, boolean];

const useHistoryState = <T>(initialState: T, maxHistory = 10): HistoryState<T> => {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const set = useCallback((newState: T, fromHistory = false) => {
    if (fromHistory) {
        // This case is handled by undo/redo directly setting the index
        return;
    }
    
    // If the new state is the same as the current one, do nothing.
    if (JSON.stringify(newState) === JSON.stringify(history[currentIndex])) {
        return;
    }

    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newState);
    
    // Trim history if it exceeds max length
    while(newHistory.length > maxHistory) {
      newHistory.shift();
    }
    
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  }, [history, currentIndex, maxHistory]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, history.length]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return [history[currentIndex], set, undo, redo, canUndo, canRedo];
};

export default useHistoryState;
