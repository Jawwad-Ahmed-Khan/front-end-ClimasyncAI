/**
 * Custom hook for fetching and managing disaster data (earthquakes and rain)
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchEarthquakes, fetchRainData } from '@/app/_api/map_api/fetchData';
import type { Earthquake, WeatherGridData, DataFetchResult } from '@/app/_types/api';

interface UseDisasterDataReturn {
    earthquakes: Earthquake[];
    rainData: WeatherGridData | null;
    isLoading: boolean;
    error: string | null;
    lastUpdated: number | null;
    refetch: () => Promise<void>;
}

const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function useDisasterData(): UseDisasterDataReturn {
    const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
    const [rainData, setRainData] = useState<WeatherGridData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<number | null>(null);

    /**
     * Fetch all disaster data
     */
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Fetch both earthquake and rain data in parallel
            const [earthquakeData, weatherData] = await Promise.allSettled([
                fetchEarthquakes(),
                fetchRainData(),
            ]);

            // Handle earthquake data
            if (earthquakeData.status === 'fulfilled') {
                setEarthquakes(earthquakeData.value);
            } else {
                console.error('Failed to fetch earthquakes:', earthquakeData.reason);
            }

            // Handle rain data
            if (weatherData.status === 'fulfilled') {
                setRainData(weatherData.value);
            } else {
                console.error('Failed to fetch rain data:', weatherData.reason);
            }

            // Set error if both failed
            if (
                earthquakeData.status === 'rejected' &&
                weatherData.status === 'rejected'
            ) {
                setError('Failed to fetch disaster data. Please try again later.');
            }

            setLastUpdated(Date.now());
        } catch (err) {
            setError('An unexpected error occurred while fetching data');
            console.error('Fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Initial data fetch
     */
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    /**
     * Auto-refresh data every 5 minutes
     */
    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchData();
        }, AUTO_REFRESH_INTERVAL);

        return () => clearInterval(intervalId);
    }, [fetchData]);

    /**
     * Manual refetch function
     */
    const refetch = useCallback(async () => {
        await fetchData();
    }, [fetchData]);

    return {
        earthquakes,
        rainData,
        isLoading,
        error,
        lastUpdated,
        refetch,
    };
}

export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
