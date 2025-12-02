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

// ============================================================================
// Constants
// ============================================================================

const USGS_ENDPOINT = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';
const OPEN_METEO_ENDPOINT = 'https://api.open-meteo.com/v1/forecast';

// Global grid points for weather data - covering 200+ major cities and weather zones worldwide
const GLOBAL_WEATHER_GRID = {
    points: [
        // North America - 35 points
        [40.7128, -74.0060], [34.0522, -118.2437], [41.8781, -87.6298], [29.7604, -95.3698],
        [33.4484, -112.0740], [49.2827, -123.1207], [43.6532, -79.3832], [19.4326, -99.1332],
        [42.3601, -71.0589], [39.9526, -75.1652], [38.9072, -77.0369], [33.7490, -84.3880],
        [25.7617, -80.1918], [29.9511, -90.0715], [37.7749, -122.4194], [47.6062, -122.3321],
        [45.5152, -122.6784], [32.7157, -117.1611], [32.7767, -96.7970], [39.7392, -104.9903],
        [51.0447, -114.0719], [53.5461, -113.4938], [45.5017, -73.5673], [25.6866, -100.3161],
        [20.6597, -103.3496], [13.6929, -89.2182], [14.0723, -87.1921], [9.9281, -84.0907],
        [18.4655, -66.1057], [25.0343, -77.3963], [18.1096, -77.2975], [44.9778, -93.2650],
        [36.1627, -86.7816], [39.0997, -94.5786], [35.2271, -80.8431],

        // South America - 15 points
        [-23.5505, -46.6333], [-22.9068, -43.1729], [-15.8267, -47.9218], [-12.9714, -38.5014],
        [-3.7172, -38.5434], [-34.6037, -58.3816], [-31.4201, -64.1888], [-12.0464, -77.0428],
        [-16.5000, -68.1500], [-0.1807, -78.4678], [4.7110, -74.0721], [10.4806, -66.9036],
        [-33.4489, -70.6693], [-3.1190, -60.0217], [-1.4558, -48.4902],

        // Europe - 40 points
        [51.5074, -0.1278], [53.3498, -6.2603], [48.8566, 2.3522], [52.5200, 13.4050],
        [48.1351, 11.5820], [50.1109, 8.6821], [41.9028, 12.4964], [45.4642, 9.1900],
        [43.7696, 11.2558], [40.4168, -3.7038], [41.3851, 2.1734], [37.3891, -5.9845],
        [55.7558, 37.6173], [59.9343, 30.3351], [59.9139, 10.7522], [60.1695, 24.9354],
        [59.3293, 18.0686], [55.6761, 12.5683], [52.3676, 4.9041], [50.8503, 4.3517],
        [47.3769, 8.5417], [48.2082, 16.3738], [50.0755, 14.4378], [47.4979, 19.0402],
        [55.9533, -3.1883], [43.6047, 1.4442], [43.2965, -0.3707], [38.7223, 9.1393],
        [41.0082, 28.9784], [39.9334, 32.8597], [38.4192, 27.1287], [44.4268, 26.1025],
        [42.6977, 23.3219], [50.4501, 30.5234], [35.1856, 33.3823], [37.9838, 23.7275],
        [64.1466, -21.9426], [57.7089, 11.9746], [53.4808, -2.2426], [43.3614, -8.4111],

        // Asia - 70 points
        [35.6762, 139.6503], [34.6937, 135.5023], [35.0116, 135.7681], [26.2124, 127.6809],
        [39.9042, 116.4074], [31.2304, 121.4737], [22.3193, 114.1694], [23.1291, 113.2644],
        [30.5728, 104.0668], [34.3416, 108.9398], [37.5665, 126.9780], [35.1796, 129.0756],
        [25.0330, 121.5654], [24.1477, 120.6736], [13.7563, 100.5018], [18.7883, 98.9853],
        [21.0285, 105.8542], [10.8231, 106.6297], [16.0544, 108.2022], [1.3521, 103.8198],
        [3.1390, 101.6869], [5.4164, 100.3327], [-6.2088, 106.8456], [-7.2575, 112.7521],
        [-6.9175, 107.6191], [14.5995, 120.9842], [10.3157, 123.8854], [7.0731, 125.6128],
        [16.8409, 96.1735], [11.5564, 104.9282], [17.9757, 102.6331],
        [28.6139, 77.2090], [19.0760, 72.8777], [13.0827, 80.2707], [22.5726, 88.3639],
        [12.9716, 77.5946], [17.3850, 78.4867], [26.8467, 80.9462], [23.0225, 72.5714],
        [24.8607, 67.0011], [31.5204, 74.3587], [33.6844, 73.0479], [34.0151, 71.5249],
        [30.1798, 67.0011], [25.3960, 68.3578], [23.8103, 90.4125], [22.3569, 91.7832],
        [6.9271, 79.8612], [7.8731, 80.7718], [27.7172, 85.3240], [9.0579, 7.4951],
        [41.2995, 69.2401], [51.1694, 71.4491], [42.8746, 74.5698], [38.5598, 68.7738],
        [43.2220, 76.8512], [40.5283, 69.5964], [39.6270, 66.9750], [24.9056, 67.0822],
        [32.7408, 74.8577], [25.9392, 67.1036], [29.9456, 71.6836], [23.8859, 91.8667],
        [34.6937, 66.8825], [27.1751, 78.0421], [23.4241, 85.4082], [30.3165, 78.0322],
        [8.5241, 76.9366], [10.8505, 76.2711], [11.0168, 76.9558], [26.9124, 75.7873],

        // Middle East - 18 points
        [25.2048, 55.2708], [24.7136, 46.6753], [26.2285, 50.5860], [29.3759, 47.9774],
        [23.5880, 58.3829], [25.2860, 51.5348], [33.8886, 35.4955], [33.5138, 36.2765],
        [31.7683, 35.2137], [32.0853, 34.7818], [30.0444, 31.2357], [33.3152, 44.3661],
        [35.6892, 51.3890], [31.2001, 29.9187], [24.7761, 46.7383], [21.4858, 39.1925],
        [15.5527, 32.5599], [36.2765, 43.1451],

        // Africa - 22 points
        [30.0444, 31.2357], [31.2001, 29.9187], [-26.2041, 28.0473], [-33.9249, 18.4241],
        [-29.8587, 31.0218], [-1.2921, 36.8219], [-6.7924, 39.2083], [-1.9536, 30.0606],
        [-15.4167, 28.2833], [6.5244, 3.3792], [9.0579, 7.4951], [5.5600, -0.1969],
        [6.3703, 5.6037], [33.8869, -6.9074], [36.7538, 3.0588], [36.8065, 10.1815],
        [32.8872, 13.1913], [15.5007, 32.5599], [9.0320, 38.7469], [1.6522, 32.2900],
        [-4.0435, 39.6682], [30.5852, -7.6033],

        // Oceania - 12 points
        [-33.8688, 151.2093], [-37.8136, 144.9631], [-27.4698, 153.0251], [-31.9505, 115.8605],
        [-34.9285, 138.6007], [-12.4634, 130.8456], [-16.9186, 145.7781], [-41.2865, 174.7762],
        [-36.8485, 174.7633], [-43.5321, 172.6362], [-18.1416, 178.4419], [-13.8333, -171.7500],
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
 * Fetch earthquake data from USGS (globally - all earthquakes from past day)
 */
export async function fetchEarthquakes(): Promise<Earthquake[]> {
    try {
        // Check cache
        const cachedData = getCachedData<Earthquake[]>('earthquakes');
        if (cachedData) {
            console.log('📦 Using cached earthquake data');
            return cachedData;
        }

        console.log('🌍 Fetching global earthquake data from USGS...');

        // Fetch from USGS
        const response = await axios.get<EarthquakeCollection>(USGS_ENDPOINT, {
            timeout: 10000,
            headers: {
                'Accept': 'application/json',
            },
        });

        console.log(`✅ Fetched ${response.data.features.length} earthquakes from USGS`);

        // Return ALL earthquakes (global coverage)
        const allEarthquakes = response.data.features;

        // Sort by magnitude (descending)
        allEarthquakes.sort((a, b) => b.properties.mag - a.properties.mag);

        // Cache the result
        setCachedData('earthquakes', allEarthquakes);

        return allEarthquakes;
    } catch (error) {
        console.error('❌ Error fetching earthquake data:', error);
        if (axios.isAxiosError(error)) {
            throw new Error(`Failed to fetch earthquake data: ${error.message}`);
        }
        throw new Error('An unexpected error occurred while fetching earthquake data');
    }
}

// ============================================================================
// Weather/Rain Data Fetching
// ============================================================================

/**
 * Fetch rain data from Open-Meteo for global grid (200+ locations)
 */
export async function fetchRainData(): Promise<WeatherGridData> {
    try {
        // Check cache
        const cachedData = getCachedData<WeatherGridData>('rainData');
        if (cachedData) {
            console.log('📦 Using cached rain data');
            return cachedData;
        }

        console.log('🌧️ Fetching global weather data from Open-Meteo (200+ locations)...');

        const rainDataPoints: RainData[] = [];

        // Fetch data for each grid point
        const promises = GLOBAL_WEATHER_GRID.points.map(([lat, lng]) =>
            fetchWeatherPoint(lat, lng)
        );

        const results = await Promise.allSettled(promises);

        let successCount = 0;
        results.forEach((result) => {
            if (result.status === 'fulfilled' && result.value) {
                rainDataPoints.push(result.value);
                if (result.value.rain > 0) {
                    successCount++;
                }
            }
        });

        console.log(`✅ Fetched weather data for ${rainDataPoints.length} locations, ${successCount} with active rain`);

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
 * Fetch weather data for a single point
 */
async function fetchWeatherPoint(
    latitude: number,
    longitude: number
): Promise<RainData | null> {
    try {
        const params = {
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            current: ['rain', 'precipitation', 'weather_code'].join(','),
            timezone: 'auto',
        };

        const response = await axios.get<OpenMeteoResponse>(OPEN_METEO_ENDPOINT, {
            params,
            timeout: 8000,
        });

        return {
            latitude: response.data.latitude,
            longitude: response.data.longitude,
            rain: response.data.current.rain || 0,
            precipitation: response.data.current.precipitation || 0,
            weather_code: response.data.current.weather_code,
            time: response.data.current.time,
        };
    } catch (error) {
        // Silently fail for individual points
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
