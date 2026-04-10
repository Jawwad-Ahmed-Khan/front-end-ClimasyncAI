/**
 * API functions for fetching disaster data (earthquakes and rain)
 */

import axios from 'axios';
import * as turf from '@turf/turf';
import type {
    EarthquakeCollection,
    Earthquake,
    OpenMeteoResponse,
    RainData,
    WeatherGridData,
} from '@/app/_types/api';
import { getActiveDisasters } from '@/app/_lib/disasters/disasterService';

// ============================================================================
// Constants
// ============================================================================

const USGS_ENDPOINT = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';
const OPEN_METEO_ENDPOINT = 'https://api.open-meteo.com/v1/forecast';

// Pakistan Weather Grid - Focused points for performant visualizations
const PAKISTAN_WEATHER_GRID = {
    points: [
        // Major Cities
        [24.8607, 67.0011], // Karachi
        [31.5204, 74.3587], // Lahore
        [33.6844, 73.0479], // Islamabad
        [34.0151, 71.5249], // Peshawar
        [30.1798, 67.0011], // Quetta
        [30.1575, 71.5249], // Multan
        [25.3960, 68.3578], // Hyderabad
        [31.4504, 73.1350], // Faisalabad
        [32.6162, 72.3387], // Sargodha
        [32.9126, 73.0673], // Jhelum
        [34.7733, 72.3601], // Mingora
        [35.9187, 74.3072], // Gilgit
        [34.3598, 73.4716], // Muzaffarabad
        [31.1187, 71.6961], // Shorkot
        [29.3909, 71.6775], // Bahawalpur
        [28.4212, 70.2989], // Rahim Yar Khan
        [27.5589, 68.2120], // Larkana
        [26.2483, 68.4096], // Nawabshah
        [33.5651, 73.0169], // Rawalpindi
        [32.4945, 74.5229], // Sialkot
        [32.0740, 74.1764], // Gujranwala
        [31.9682, 70.9167], // D.I. Khan
        [27.8732, 66.8617], // Khuzdar
        [25.1278, 62.3276], // Gwadar
        [25.8450, 64.9333], // Ormara
        [26.0080, 63.0383], // Turbat
        [29.4891, 65.9904], // Dalbandin

        // Grid Filler Points (North)
        [35.0, 72.0], [35.0, 74.0], [36.0, 74.0], [34.0, 73.0], [33.0, 72.0],
        // Grid Filler Points (Punjab Plains)
        [31.0, 72.0], [31.0, 73.0], [30.0, 71.0], [29.0, 71.0],
        // Grid Filler Points (Sindh)
        [26.0, 69.0], [25.0, 69.0], [27.0, 69.0],
        // Grid Filler Points (Balochistan)
        [29.0, 67.0], [28.0, 66.0], [28.0, 64.0], [27.0, 65.0], [26.0, 64.0]
    ] as [number, number][],
};

// ============================================================================
// Cache Management
// ============================================================================

interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCachedData<T>(key: string): T | null {
    const entry = cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > CACHE_DURATION;
    if (isExpired) {
        cache.delete(key);
        return null;
    }

    return entry.data;
}

function setCachedData<T>(key: string, data: T): void {
    cache.set(key, { data, timestamp: Date.now() });
}

// ============================================================================
// Earthquake Data Fetching
// ============================================================================

/**
 * Fetch disaster data from Backend API and convert to GeoJSON
 */
export async function fetchEarthquakes(): Promise<Earthquake[]> {
    try {
        const cachedData = getCachedData<Earthquake[]>('earthquakes');
        if (cachedData) {
            console.log('📦 Using cached disasters data');
            return cachedData;
        }

        console.log('🌍 Fetching active disasters from ClimaSync Backend...');

        const disasters = await getActiveDisasters(100, 0);

        console.log(`✅ Fetched ${disasters.length} active disasters from Backend`);

        const allEarthquakes: Earthquake[] = disasters.map(d => {
            let mag = 3.0; // LOW mock
            if (d.severity === 'MODERATE') mag = 4.5;
            if (d.severity === 'HIGH') mag = 6.5;
            if (d.severity === 'CRITICAL') mag = 8.5;

            return {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    // Note: Depth defaulted to 10
                    coordinates: [d.longitude, d.latitude, 10]
                },
                properties: {
                    mag,
                    place: d.title,
                    time: new Date(d.start_time).getTime(),
                    updated: new Date(d.start_time).getTime(),
                    title: d.title,
                    tz: null, url: '', detail: '', felt: null, cdi: null, mmi: null, alert: null, status: d.status,
                    tsunami: 0, sig: 0, net: '', code: '', ids: '', sources: '', types: '', nst: null, dmin: null, rms: null, gap: null, magType: ''
                },
                id: d.event_id
            };
        });

        allEarthquakes.sort((a, b) => b.properties.mag - a.properties.mag);
        setCachedData('earthquakes', allEarthquakes);

        return allEarthquakes;
    } catch (error) {
        console.error('❌ Error fetching disaster data:', error);
        throw new Error('An unexpected error occurred while fetching disaster data');
    }
}

// ============================================================================
// Weather/Rain Data Fetching
// ============================================================================

/**
 * Fetch rain data from Open-Meteo for Pakistan Grid (Batched)
 */
export async function fetchRainData(): Promise<WeatherGridData> {
    try {
        // Check cache
        const cachedData = getCachedData<WeatherGridData>('rainData');
        if (cachedData) {
            console.log('📦 Using cached rain data');
            return cachedData;
        }

        console.log('🌧️ Fetching Pakistan weather data from Open-Meteo (Batched)...');

        const rainDataPoints: RainData[] = [];

        // Prepare coordinates for batch request
        // Open-Meteo accepts arrays of lats and longs: ?latitude=1,2,3&longitude=1,2,3
        // We chunk them to be safe (e.g., 50 at a time) though it supports more.
        const CHUNK_SIZE = 50;
        const allPoints = PAKISTAN_WEATHER_GRID.points;
        const chunks = [];

        for (let i = 0; i < allPoints.length; i += CHUNK_SIZE) {
            chunks.push(allPoints.slice(i, i + CHUNK_SIZE));
        }

        const promises = chunks.map(chunk => {
            const latitudes = chunk.map(p => p[0]).join(',');
            const longitudes = chunk.map(p => p[1]).join(',');

            return axios.get<OpenMeteoResponse | OpenMeteoResponse[]>(OPEN_METEO_ENDPOINT, {
                params: {
                    latitude: latitudes,
                    longitude: longitudes,
                    current: ['rain', 'precipitation', 'weather_code'].join(','),
                    timezone: 'auto',
                },
                timeout: 8000,
            });
        });

        const responses = await Promise.allSettled(promises);

        responses.forEach((result) => {
            if (result.status === 'fulfilled') {
                // Open-Meteo returns an ARRAY of objects if multiple coordinates are passed (Batch mode)
                const data = result.value.data;
                const dataArray = Array.isArray(data) ? data : [data];

                dataArray.forEach(locationData => {
                    rainDataPoints.push({
                        latitude: locationData.latitude,
                        longitude: locationData.longitude,
                        rain: locationData.current.rain || 0,
                        precipitation: locationData.current.precipitation || 0,
                        weather_code: locationData.current.weather_code,
                        time: locationData.current.time,
                    });
                });
            } else {
                console.error('❌ Failed to fetch a weather chunk:', result.reason);
            }
        });

        console.log(`✅ Fetched weather data for ${rainDataPoints.length} Pakistan locations`);

        const weatherGrid: WeatherGridData = {
            points: rainDataPoints,
            lastUpdated: Date.now(),
        };

        // Cache the result
        setCachedData('rainData', weatherGrid);

        return weatherGrid;
    } catch (error) {
        console.error('❌ Error fetching rain data:', error);
        throw new Error('Failed to fetch rain data');
    }
}

/**
 * Fetch detailed weather for a specific single location (Search Result)
 */
export interface LocationWeatherDetails {
    temperature: number;
    windSpeed: number;
    apparentTemperature: number;
    weatherCode: number;
}

export async function fetchLocationWeather(lat: number, lng: number): Promise<LocationWeatherDetails | null> {
    try {
        const response = await axios.get(OPEN_METEO_ENDPOINT, {
            params: {
                latitude: lat,
                longitude: lng,
                current: ['temperature_2m', 'wind_speed_10m', 'apparent_temperature', 'weather_code'].join(','),
                timezone: 'auto',
            },
            timeout: 5000,
        });

        const current = response.data.current;
        return {
            temperature: current.temperature_2m,
            windSpeed: current.wind_speed_10m,
            apparentTemperature: current.apparent_temperature,
            weatherCode: current.weather_code,
        };
    } catch (error) {
        console.error('❌ Error fetching location details:', error);
        return null;
    }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Clear all cached data
 */
export function clearCache(): void {
    cache.clear();
    console.log('🗑️ Cache cleared');
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
    return {
        size: cache.size,
        keys: Array.from(cache.keys()),
    };
}
