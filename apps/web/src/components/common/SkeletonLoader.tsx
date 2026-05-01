import React from 'react';

type SkeletonType = 'card' | 'chart' | 'table' | 'text' | 'generic';

interface SkeletonLoaderProps {
  type: SkeletonType;
  className?: string;
  rows?: number;
  columns?: number;
  lines?: number;
}

const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`p-6 bg-gray-200 dark:bg-slate-700 rounded-2xl animate-pulse ${className}`}>
        <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-1/3 mb-4"></div>
        <div className="h-8 bg-gray-300 dark:bg-slate-600 rounded w-1/2"></div>
    </div>
);

const ChartSkeleton: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`p-6 bg-gray-200 dark:bg-slate-700 rounded-2xl animate-pulse flex items-end gap-2 ${className}`}>
        <div className="h-1/3 w-full bg-gray-300 dark:bg-slate-600 rounded-t-md"></div>
        <div className="h-1/2 w-full bg-gray-300 dark:bg-slate-600 rounded-t-md"></div>
        <div className="h-3/4 w-full bg-gray-300 dark:bg-slate-600 rounded-t-md"></div>
        <div className="h-2/3 w-full bg-gray-300 dark:bg-slate-600 rounded-t-md"></div>
        <div className="h-full w-full bg-gray-300 dark:bg-slate-600 rounded-t-md"></div>
        <div className="h-1/2 w-full bg-gray-300 dark:bg-slate-600 rounded-t-md"></div>
    </div>
);

const TableSkeleton: React.FC<{ rows?: number; columns?: number; className?: string }> = ({ rows = 5, columns = 4, className }) => (
    <div className={`p-4 bg-gray-200 dark:bg-slate-700 rounded-2xl animate-pulse space-y-3 ${className}`}>
        {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`}}>
                 {Array.from({ length: columns }).map((_, j) => (
                    <div key={j} className="h-4 bg-gray-300 dark:bg-slate-600 rounded col-span-1"></div>
                 ))}
            </div>
        ))}
    </div>
);

const TextSkeleton: React.FC<{ lines?: number; className?: string }> = ({ lines = 3, className }) => (
    <div className={`space-y-3 animate-pulse ${className}`}>
         {Array.from({ length: lines }).map((_, i) => (
             <div key={i} className={`h-4 bg-gray-300 dark:bg-slate-600 rounded ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}></div>
         ))}
    </div>
);


const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type, className, rows, columns, lines }) => {
    switch (type) {
        case 'card':
            return <CardSkeleton className={className} />;
        case 'chart':
            return <ChartSkeleton className={className} />;
        case 'table':
            return <TableSkeleton rows={rows} columns={columns} className={className} />;
        case 'text':
            return <TextSkeleton lines={lines} className={className} />;
        default:
            return <div className={`bg-gray-200 dark:bg-slate-700 rounded-2xl animate-pulse ${className}`}></div>;
    }
};

export default SkeletonLoader;
