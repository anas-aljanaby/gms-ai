import React, { useMemo, useRef, useEffect, useState } from 'react';

interface SparklineProps {
    data: number[];
    width?: number;
    height?: number;
    color?: string;
    showDots?: boolean;
    animate?: boolean;
    className?: string;
}

const Sparkline: React.FC<SparklineProps> = ({ 
    data, 
    width = 120, 
    height = 40, 
    color = '#3b82f6', 
    showDots = false,
    animate = true,
    className 
}) => {
    const pathRef = useRef<SVGPathElement>(null);
    const [pathLength, setPathLength] = useState(0);

    const calculateCoordinates = (data: number[], width: number, height: number) => {
        if (!data || data.length < 2) {
            return [];
        }
        const padding = 4; // Increased padding to accommodate dots
        const svgWidth = width;
        const svgHeight = height;
        const contentWidth = svgWidth - 2 * padding;
        const contentHeight = svgHeight - 2 * padding;

        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min;

        const calculatedPoints = data.map((pointValue, index) => ({
            x: (index / (data.length - 1)) * contentWidth + padding,
            y: range === 0 ? svgHeight / 2 : contentHeight * (1 - (pointValue - min) / range) + padding,
        }));
        
        return calculatedPoints;
    };
    
    const createCurvedPath = (points: { x: number; y: number }[]): string => {
        if (points.length < 2) {
            return '';
        }

        const pathParts = [`M ${points[0].x},${points[0].y}`];
        const tension = 1 / 6; // Catmull-Rom tension factor

        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i === 0 ? 0 : i - 1];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = (i + 2 >= points.length) ? p2 : points[i + 2];

            const c1x = p1.x + (p2.x - p0.x) * tension;
            const c1y = p1.y + (p2.y - p0.y) * tension;

            const c2x = p2.x - (p3.x - p1.x) * tension;
            const c2y = p2.y - (p3.y - p1.y) * tension;

            pathParts.push(`C ${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`);
        }
        
        return pathParts.join(' ');
    };


    const { pathD, points, fillPathData } = useMemo(() => {
        const calculatedPoints = calculateCoordinates(data, width, height);

        if (calculatedPoints.length === 0) {
            return { pathD: '', points: [], fillPathData: '' };
        }
        
        const svgHeight = height;
        const pathData = createCurvedPath(calculatedPoints);
        const fillData = `${pathData} L ${calculatedPoints[calculatedPoints.length - 1].x},${svgHeight} L ${calculatedPoints[0].x},${svgHeight} Z`;
        
        return { pathD: pathData, points: calculatedPoints, fillPathData: fillData };
    }, [data, width, height]);

    useEffect(() => {
        if (animate && pathRef.current) {
            const length = pathRef.current.getTotalLength();
            setPathLength(length);
        } else {
            setPathLength(0);
        }
    }, [pathD, animate]);

    if (!data || data.length < 2) {
        return <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className}></svg>;
    }
    
    const animationStyle: React.CSSProperties = animate && pathLength > 0 ? {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
        animation: `sparkline-draw 1s ease-out forwards`,
    } : {};

    const gradientId = `sparkline-gradient-${Math.random().toString(36).substring(2)}`;

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className}>
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
            </defs>
            <path d={fillPathData} fill={`url(#${gradientId})`} />
            <path
                ref={pathRef}
                fill="none"
                stroke={color}
                strokeWidth="2"
                d={pathD}
                strokeLinejoin="round"
                strokeLinecap="round"
                style={animationStyle}
            />
            {showDots && points.map((p, i) => (
                <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r="3"
                    fill={color}
                    stroke="white"
                    strokeWidth="1"
                />
            ))}
        </svg>
    );
};

export default Sparkline;