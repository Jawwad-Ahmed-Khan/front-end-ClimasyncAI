/**
 * TypeScript interfaces for Pakistan Disaster Monitoring Dashboard API
 */

// ============================================================================
// Earthquake Data Types
// ============================================================================

export interface EarthquakeProperties {
    mag: number;
    place: string;
    time: number;
    updated: number;
    alert: string | null;
    tsunami: number;
    sig: number;
    title: string;
}

export interface EarthquakeGeometry {
    type: 'Point';
    coordinates: [number, number, number]; // [lng, lat, depth]
}

export interface Earthquake {
    type: 'Feature';
    properties: EarthquakeProperties;
    geometry: EarthquakeGeometry;
    id: string;
}

export interface EarthquakeCollection {
    type: 'FeatureCollection';
    metadata: {
        generated: number;
        title: string;
        count: number;
    };
    features: Earthquake[];
}

// ============================================================================
// Weather/Rain Data Types
// ============================================================================

export interface RainData {
    latitude: number;
    longitude: number;
    rain: number;
    precipitation: number;
    weather_code: number;
    time: string;
}

export interface OpenMeteoResponse {
    latitude: number;
    longitude: number;
    current: {
        time: string;
        rain: number;
        precipitation: number;
        weather_code: number;
    };
    hourly: {
        time: string[];
        rain: number[];
        precipitation_probability: number[];
    };
}

export interface WeatherGridData {
    points: RainData[];
    lastUpdated: number;
}

// ============================================================================
// Map Layer State Types
// ============================================================================

export interface MapLayerState {
    rain: boolean;
    earthquakes: boolean;
    buildings3D: boolean;
    terrain: boolean;
}

export interface LayerOpacity {
    rain: number;
    earthquakes: number;
}

// ============================================================================
// Disaster Severity Types
// ============================================================================

export enum DisasterSeverity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical',
}

export interface EarthquakeSeverity {
    magnitude: number;
    severity: DisasterSeverity;
    color: string;
}

// ============================================================================
// Geographic Types
// ============================================================================

export interface Coordinates {
    lng: number;
    lat: number;
}

export interface BoundingBox {
    sw: [number, number];
    ne: [number, number];
}

export interface PakistanCity {
    name: string;
    coordinates: [number, number];
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiError {
    message: string;
    code?: string;
    status?: number;
}

export interface DataFetchResult<T> {
    data: T | null;
    error: ApiError | null;
    isLoading: boolean;
    lastUpdated: number | null;
}
