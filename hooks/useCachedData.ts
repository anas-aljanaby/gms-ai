import { useState, useEffect, useCallback, useRef } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export function useCachedData<T>(
    key: string,
    fetcher: () => Promise<T>,
    expiryTimeMs: number = 5 * 60 * 1000 // 5 minutes
) {
    const [data, setData] = useState<T | null>(() => {
        // Immediately load from cache on initial render to show stale data
        try {
            const item = localStorage.getItem(key);
            if (item) {
                const entry: CacheEntry<T> = JSON.parse(item);
                return entry.data;
            }
        } catch (error) {
            console.error(`Error reading initial cache for key "${key}"`, error);
        }
        return null;
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const fetcherRef = useRef(fetcher);
    fetcherRef.current = fetcher; // keep ref updated to avoid stale closures

    const performFetch = useCallback(async (isBackground = false) => {
        if (!isBackground) {
            setLoading(true);
        }
        setError(null);
        try {
            const freshData = await fetcherRef.current();
            const entry: CacheEntry<T> = { data: freshData, timestamp: Date.now() };
            localStorage.setItem(key, JSON.stringify(entry));
            setData(freshData);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [key]);

    useEffect(() => {
        let isMounted = true;
        const checkCacheAndFetch = () => {
            try {
                const item = localStorage.getItem(key);
                if (item) {
                    const entry: CacheEntry<T> = JSON.parse(item);
                    if (isMounted) setLoading(false); // We have data to show, so stop initial loading indicator
                    
                    if (Date.now() - entry.timestamp > expiryTimeMs) {
                        // Expired: refetch in background, we're already showing stale data.
                        performFetch(true);
                    }
                } else {
                    // No cache: initial fetch with loader.
                    performFetch(false);
                }
            } catch (e) {
                // Cache is corrupt or invalid, fetch fresh.
                console.error("Cache read error on mount", e);
                performFetch(false);
            }
        };

        checkCacheAndFetch();
        
        return () => { isMounted = false; };
    }, [key, expiryTimeMs, performFetch]);

    const refetch = useCallback(() => performFetch(false), [performFetch]);
    
    return { data, loading, error, refetch };
}
