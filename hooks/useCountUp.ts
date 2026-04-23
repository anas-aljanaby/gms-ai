import { useState, useEffect, useRef } from 'react';

/**
 * useCountUp - خطاف مخصص لتحريك عداد رقمي من 0 إلى القيمة النهائية.
 * 
 * @param {number} end - القيمة النهائية للعداد.
 * @param {number} [duration=1500] - مدة التحريك بالمللي ثانية.
 * @returns {number} - القيمة الحالية للعداد أثناء التحريك.
 * 
 * @example
 * const animatedValue = useCountUp(100);
 * return <div>{animatedValue}</div>;
 */
export const useCountUp = (end: number, duration: number = 1500): number => {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    startTimeRef.current = undefined; // Reset start time on each new animation

    const animate = (timestamp: number) => {
      if (startTimeRef.current === undefined) {
        startTimeRef.current = timestamp;
      }
      const elapsedTime = timestamp - startTimeRef.current;
      const progress = Math.min(elapsedTime / duration, 1);
      
      const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
      const currentCount = Math.round(easedProgress * end);
      
      setCount(currentCount);

      if (elapsedTime < duration) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end); // Make sure it ends on the exact value
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [end, duration]);

  return count;
};