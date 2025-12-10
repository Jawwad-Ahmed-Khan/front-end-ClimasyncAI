/**
 * Pakistan Disaster Monitoring Dashboard - Main Page
 * Interactive map showing earthquakes and rainfall data across Pakistan
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { MapLayerState, EarthquakeCollection } from '@/app/_types/api';
import { useDisasterData } from '@/app/_hooks/useDisasterData';
import { WORLD_CENTER, MAP_CONFIG } from '@/app/_utils/geoUtils';
import RainLayer from '@/app/_components/map_layers/RainLayer';
import QuakeLayer from '@/app/_components/map_layers/QuakeLayer';
import ControlPanel from '@/app/_components/map_components/ControlPanel';
import SearchBox from '@/app/_components/map_components/SearchBox';
import DisasterLegend from '@/app/_components/map_components/DisasterLegend';
import LoadingOverlay from '@/app/_components/map_components/LoadingOverlay';

// Set Mapbox access token
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

if (MAPBOX_TOKEN) {
    mapboxgl.accessToken = MAPBOX_TOKEN;
}

export default function MapPage() {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

    const [map, setMap] = useState<mapboxgl.Map | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(true);
    const [showDummyData, setShowDummyData] = useState(false);

    // Layer visibility state
    const [layerState, setLayerState] = useState<MapLayerState>({
        rain: true,
        earthquakes: true,
        buildings3D: false,
        terrain: true,
    });

    // Fetch disaster data
    const { earthquakes, rainData, isLoading, error, lastUpdated, refetch } =
        useDisasterData();

    /**
     * Initialize Mapbox map
     */
    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        if (!MAPBOX_TOKEN) {
            console.error('Mapbox token is missing. Please set NEXT_PUBLIC_MAPBOX_TOKEN in .env.local');
            return;
        }

        console.log('🗺️ Initializing Mapbox map...', {
            containerExists: !!mapContainerRef.current,
            token: MAPBOX_TOKEN.substring(0, 10) + '...',
        });

        // Create map instance
        const mapInstance = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: isDarkTheme ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11',
            center: [WORLD_CENTER.lng, WORLD_CENTER.lat],
            zoom: MAP_CONFIG.initialZoom,
            minZoom: MAP_CONFIG.minZoom,
            maxZoom: MAP_CONFIG.maxZoom,
            maxBounds: MAP_CONFIG.maxBounds,
            pitch: 0,
            bearing: 0,
            antialias: true,
            projection: 'globe' as any, // Type cast if types are outdated
        });

        console.log('🗺️ Map instance created');

        // Add navigation controls
        mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Add fullscreen control
        mapInstance.addControl(new mapboxgl.FullscreenControl(), 'top-right');

        // Add scale control
        mapInstance.addControl(
            new mapboxgl.ScaleControl({
                maxWidth: 100,
                unit: 'metric',
            }),
            'bottom-right'
        );

        // Map loaded event
        mapInstance.on('load', () => {
            console.log('🗺️ Map loaded successfully!');
            setMapLoaded(true);

            // Configure map lighting for dramatic effect
            mapInstance.setConfigProperty('basemap', 'lightPreset', 'dusk');

            // Add atmospheric glow (Fog)
            mapInstance.setFog({
                'color': 'rgb(12, 22, 43)', // Lower atmosphere
                'high-color': 'rgb(12, 22, 43)', // Upper atmosphere
                'horizon-blend': 0.1, // Atmosphere thickness (default 0.2 at low zooms)
                'space-color': 'rgb(11, 11, 23)', // Background color
                'star-intensity': 0.35 // Background star brightness (default 0.35 at low zooms)
            });

            // Enable 3D terrain initially if terrain layer is active
            if (layerState.terrain) {
                mapInstance.addSource('mapbox-dem', {
                    type: 'raster-dem',
                    url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
                    tileSize: 512,
                    maxzoom: 14,
                });
                mapInstance.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
            }
        });

        // Add error handler
        mapInstance.on('error', (e) => {
            console.error('🗺️ Map error:', e);
        });

        mapRef.current = mapInstance;
        setMap(mapInstance);

        // Cleanup on unmount
        return () => {
            console.log('🗺️ Cleaning up map...');
            mapInstance.remove();
            mapRef.current = null;
        };
    }, []);

    /**
     * Handle layer toggle
     */
    const handleLayerToggle = useCallback(
        (layer: keyof MapLayerState) => {
            setLayerState((prev) => {
                const newState = { ...prev, [layer]: !prev[layer] };

                // Handle special layers
                if (map) {
                    if (layer === 'buildings3D') {
                        const visibility = newState.buildings3D ? 'visible' : 'none';

                        // Toggle building layers if they exist
                        const layers = map.getStyle().layers;
                        layers?.forEach((l) => {
                            if (l.id.includes('building') && l.type === 'fill-extrusion') {
                                map.setLayoutProperty(l.id, 'visibility', visibility);
                            }
                        });
                    }

                    if (layer === 'terrain') {
                        if (newState.terrain) {
                            // Add terrain
                            if (!map.getSource('mapbox-dem')) {
                                map.addSource('mapbox-dem', {
                                    type: 'raster-dem',
                                    url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
                                    tileSize: 512,
                                    maxzoom: 14,
                                });
                            }
                            map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
                        } else {
                            // Remove terrain
                            map.setTerrain(null);
                        }
                    }
                }

                return newState;
            });
        },
        [map]
    );

    /**
     * Keyboard shortcuts
     */
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement) return;

            switch (e.key.toLowerCase()) {
                case 'r':
                    handleLayerToggle('rain');
                    break;
                case 'e':
                    handleLayerToggle('earthquakes');
                    break;
                case 'b':
                    handleLayerToggle('buildings3D');
                    break;
                case 't':
                    handleLayerToggle('terrain');
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleLayerToggle]);

    /**
     * Handle data refresh
     */
    const handleRefresh = useCallback(async () => {
        await refetch();
    }, [refetch]);

    /**
     * Handle theme toggle
     */
    const handleThemeToggle = useCallback(() => {
        setIsDarkTheme((prev) => {
            const newTheme = !prev;
            if (map) {
                const newStyle = newTheme
                    ? 'mapbox://styles/mapbox/dark-v11'
                    : 'mapbox://styles/mapbox/light-v11';

                // Set style and wait for it to load before re-adding layers
                map.once('style.load', () => {
                    // Terrain will be re-added by the layer toggle effect
                    if (layerState.terrain) {
                        if (!map.getSource('mapbox-dem')) {
                            map.addSource('mapbox-dem', {
                                type: 'raster-dem',
                                url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
                                tileSize: 512,
                                maxzoom: 14,
                            });
                        }
                        map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
                    }
                });

                map.setStyle(newStyle);
            }
            return newTheme;
        });
    }, [map, layerState.terrain]);

    /**
     * Handle dummy data toggle
     */
    const handleDummyDataToggle = useCallback(() => {
        setShowDummyData((prev) => !prev);
    }, []);

    // Generate dummy earthquakes for Pakistan
    const dummyEarthquakes = showDummyData
        ? [
            {
                type: 'Feature' as const,
                properties: {
                    mag: 5.2,
                    place: 'Sample Earthquake - Islamabad',
                    time: Date.now() - 30 * 60 * 1000,
                    updated: Date.now(),
                    alert: null,
                    tsunami: 0,
                    sig: 432,
                    title: 'M 5.2 - Sample Earthquake - Islamabad',
                },
                geometry: {
                    type: 'Point' as const,
                    coordinates: [73.0479, 33.6844, 10] as [number, number, number],
                },
                id: 'dummy-1',
            },
            {
                type: 'Feature' as const,
                properties: {
                    mag: 4.1,
                    place: 'Sample Earthquake - Lahore',
                    time: Date.now() - 2 * 60 * 60 * 1000,
                    updated: Date.now(),
                    alert: null,
                    tsunami: 0,
                    sig: 289,
                    title: 'M 4.1 - Sample Earthquake - Lahore',
                },
                geometry: {
                    type: 'Point' as const,
                    coordinates: [74.3587, 31.5204, 15] as [number, number, number],
                },
                id: 'dummy-2',
            },
            {
                type: 'Feature' as const,
                properties: {
                    mag: 6.3,
                    place: 'Sample Earthquake - Quetta',
                    time: Date.now() - 5 * 60 * 60 * 1000,
                    updated: Date.now(),
                    alert: 'yellow',
                    tsunami: 0,
                    sig: 598,
                    title: 'M 6.3 - Sample Earthquake - Quetta',
                },
                geometry: {
                    type: 'Point' as const,
                    coordinates: [67.0011, 30.1798, 8] as [number, number, number],
                },
                id: 'dummy-3',
            },
        ]
        : [];

    // Generate dummy rain data for Pakistan
    const dummyRainData = showDummyData
        ? {
            points: [
                {
                    latitude: 31.5204,
                    longitude: 74.3587,
                    rain: 15.5,
                    precipitation: 15.5,
                    weather_code: 61,
                    time: new Date().toISOString(),
                },
                {
                    latitude: 24.8607,
                    longitude: 67.0011,
                    rain: 8.2,
                    precipitation: 8.2,
                    weather_code: 61,
                    time: new Date().toISOString(),
                },
                {
                    latitude: 33.6844,
                    longitude: 73.0479,
                    rain: 22.1,
                    precipitation: 22.1,
                    weather_code: 63,
                    time: new Date().toISOString(),
                },
            ],
            lastUpdated: Date.now(),
        }
        : null;

    // Use dummy data if enabled, otherwise use real data
    const displayEarthquakes = showDummyData ? dummyEarthquakes : earthquakes;

    const earthquakeCollection: EarthquakeCollection = {
        type: 'FeatureCollection',
        metadata: {
            generated: Date.now(),
            title: 'Earthquakes',
            count: displayEarthquakes.length
        },
        features: displayEarthquakes
    };

    const displayRainData = showDummyData ? dummyRainData : rainData;


    // Show loading if Mapbox token is missing
    if (!MAPBOX_TOKEN) {
        return (
            <div className="w-screen h-screen bg-slate-900 flex items-center justify-center">
                <div className="bg-slate-800 p-8 rounded-2xl border border-red-500/50 max-w-md">
                    <h2 className="text-xl font-bold text-red-500 mb-4">Configuration Error</h2>
                    <p className="text-slate-300 mb-4">
                        Mapbox token is missing. Please add <code className="bg-slate-700 px-2 py-1 rounded">NEXT_PUBLIC_MAPBOX_TOKEN</code> to your <code className="bg-slate-700 px-2 py-1 rounded">.env.local</code> file.
                    </p>
                    <a
                        href="https://account.mapbox.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 underline"
                    >
                        Get a Mapbox token →
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-slate-900">
            {/* Map Container */}
            <div
                ref={mapContainerRef}
                className="absolute inset-0 top-16"
                style={{ width: '100%', height: 'calc(100% - 64px)' }}
            />

            {/* Loading Overlay */}
            {isLoading && !mapLoaded && <LoadingOverlay />}

            {/* Error Message */}
            {error && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
                    <div className="bg-red-500/90 backdrop-blur-xl border border-red-400 rounded-2xl shadow-2xl p-6 max-w-md">
                        <h3 className="text-lg font-bold text-white mb-2">Error</h3>
                        <p className="text-white/90 text-sm mb-4">{error}</p>
                        <button
                            onClick={handleRefresh}
                            className="w-full px-4 py-2 bg-white text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}

            {/* Map Layers */}
            {mapLoaded && (
                <>
                    <RainLayer
                        map={map}
                        rainData={displayRainData}
                        visible={layerState.rain}
                        opacity={1}
                    />
                    <QuakeLayer
                        map={map}
                        earthquakeData={earthquakeCollection}
                        visible={layerState.earthquakes}
                        opacity={1}
                    />
                </>
            )}

            {/* UI Components */}
            {mapLoaded && (
                <>
                    <SearchBox map={map} accessToken={MAPBOX_TOKEN} />
                    <ControlPanel
                        layerState={layerState}
                        onLayerToggle={handleLayerToggle}
                        lastUpdated={lastUpdated}
                        onRefresh={handleRefresh}
                        isRefreshing={isLoading}
                        onThemeToggle={handleThemeToggle}
                        isDarkTheme={isDarkTheme}
                        onDummyDataToggle={handleDummyDataToggle}
                        showDummyData={showDummyData}
                    />
                    <DisasterLegend />
                </>
            )}

            {/* Keyboard Shortcuts Helper */}
            <div className="fixed bottom-4 right-4 bg-slate-900/75 backdrop-blur-xl border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-400 hidden md:block">
                <kbd className="px-1.5 py-0.5 bg-slate-700 rounded">R</kbd> Rain •{' '}
                <kbd className="px-1.5 py-0.5 bg-slate-700 rounded">E</kbd> Earthquakes •{' '}
                <kbd className="px-1.5 py-0.5 bg-slate-700 rounded">B</kbd> Buildings •{' '}
                <kbd className="px-1.5 py-0.5 bg-slate-700 rounded">T</kbd> Terrain
            </div>
        </div>
    );
}
