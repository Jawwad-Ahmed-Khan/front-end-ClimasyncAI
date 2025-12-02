/**
 * Geospatial utility functions for Pakistan Disaster Monitoring Dashboard
 */

import * as turf from '@turf/turf';
import type { Coordinates, BoundingBox, DisasterSeverity, EarthquakeSeverity } from '@/app/_types/api';

// ============================================================================
// Constants
// ============================================================================

// Global bounds covering the entire world
export const WORLD_BOUNDS: BoundingBox = {
    sw: [-180, -85],
    ne: [180, 85],
};

// Pakistan bounds (kept for reference)
export const PAKISTAN_BOUNDS: BoundingBox = {
    sw: [60.87, 23.63],
    ne: [77.84, 37.08],
};

// Default center - can be customized
export const WORLD_CENTER: Coordinates = {
    lng: 0,
    lat: 20,
};

export const PAKISTAN_CENTER: Coordinates = {
    lng: 69.3451,
    lat: 30.3753,
};

export const MAP_CONFIG = {
    maxBounds: undefined, // No bounds restriction for global view
    minZoom: 2,
    maxZoom: 18,
    initialZoom: 3,
};

export const PAKISTAN_CITIES = [
    { name: 'Karachi', coordinates: [67.0011, 24.8607] as [number, number] },
    { name: 'Lahore', coordinates: [74.3587, 31.5204] as [number, number] },
    { name: 'Islamabad', coordinates: [73.0479, 33.6844] as [number, number] },
    { name: 'Peshawar', coordinates: [71.5249, 34.0151] as [number, number] },
    { name: 'Quetta', coordinates: [67.0011, 30.1798] as [number, number] },
    { name: 'Multan', coordinates: [71.5249, 30.1575] as [number, number] },
];

// ============================================================================
// Earthquake Severity Functions
// ============================================================================

/**
 * Get earthquake severity based on magnitude
 */
export function getEarthquakeSeverity(magnitude: number): EarthquakeSeverity {
    if (magnitude < 3.0) {
        return {
            magnitude,
            severity: 'low' as DisasterSeverity,
            color: '#06B6D4', // cyan-500
        };
    } else if (magnitude < 5.0) {
        return {
            magnitude,
            severity: 'medium' as DisasterSeverity,
            color: '#FBBF24', // amber-400
        };
    } else if (magnitude < 7.0) {
        return {
            magnitude,
            severity: 'high' as DisasterSeverity,
            color: '#EF4444', // red-500
        };
    } else {
        return {
            magnitude,
            severity: 'critical' as DisasterSeverity,
            color: '#DC2626', // red-600
        };
    }
}

/**
 * Calculate earthquake circle radius based on magnitude
 */
export function calculateQuakeRadius(magnitude: number, zoom: number = 5): number {
    // Exponential scaling: radius = base * (scale ^ magnitude)
    const baseRadius = 8;
    const scale = 1.5;
    const zoomFactor = zoom / 10;

    return baseRadius * Math.pow(scale, magnitude) * zoomFactor;
}

// ============================================================================
// Distance and Geographic Functions
// ============================================================================

/**
 * Calculate distance between two coordinates in kilometers
 */
export function calculateDistance(
    from: Coordinates,
    to: Coordinates
): number {
    const point1 = turf.point([from.lng, from.lat]);
    const point2 = turf.point([to.lng, to.lat]);

    return turf.distance(point1, point2, { units: 'kilometers' });
}

/**
 * Check if coordinates are within world bounds (always true for valid coordinates)
 */
export function isWithinWorld(lng: number, lat: number): boolean {
    return (
        lng >= -180 &&
        lng <= 180 &&
        lat >= -90 &&
        lat <= 90
    );
}

/**
 * Check if coordinates are within Pakistan bounds
 */
export function isWithinPakistan(lng: number, lat: number): boolean {
    return (
        lng >= PAKISTAN_BOUNDS.sw[0] &&
        lng <= PAKISTAN_BOUNDS.ne[0] &&
        lat >= PAKISTAN_BOUNDS.sw[1] &&
        lat <= PAKISTAN_BOUNDS.ne[1]
    );
}

/**
 * Get the nearest city to given coordinates
 */
export function getNearestCity(lng: number, lat: number): string {
    const point = { lng, lat };
    let nearestCity = PAKISTAN_CITIES[0];
    let minDistance = calculateDistance(point, {
        lng: nearestCity.coordinates[0],
        lat: nearestCity.coordinates[1],
    });

    for (const city of PAKISTAN_CITIES.slice(1)) {
        const distance = calculateDistance(point, {
            lng: city.coordinates[0],
            lat: city.coordinates[1],
        });

        if (distance < minDistance) {
            minDistance = distance;
            nearestCity = city;
        }
    }

    return `${Math.round(minDistance)} km from ${nearestCity.name}`;
}

// ============================================================================
// Rain Intensity Functions
// ============================================================================

/**
 * Get rain intensity classification
 */
export function getRainIntensity(rainMm: number): {
    level: string;
    color: string;
    description: string;
} {
    if (rainMm === 0) {
        return { level: 'none', color: '#94a3b8', description: 'No Rain' };
    } else if (rainMm < 2.5) {
        return { level: 'light', color: '#06B6D4', description: 'Light Rain' };
    } else if (rainMm < 10) {
        return { level: 'moderate', color: '#3B82F6', description: 'Moderate Rain' };
    } else if (rainMm < 50) {
        return { level: 'heavy', color: '#8B5CF6', description: 'Heavy Rain' };
    } else {
        return { level: 'extreme', color: '#EF4444', description: 'Extreme Rain' };
    }
}

// ============================================================================
// Time Formatting
// ============================================================================

/**
 * Format timestamp to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
}

/**
 * Check if earthquake is recent (within 1 hour)
 */
export function isRecentQuake(timestamp: number): boolean {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    return timestamp > oneHourAgo;
}
