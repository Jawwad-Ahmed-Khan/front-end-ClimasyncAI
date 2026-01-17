/**
 * QuakeLayer - Visualizes earthquake data with interactive markers and heatmap-style highlighting
 */

'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import type { EarthquakeCollection } from '@/app/_types/api';
import { getEarthquakeSeverity } from '@/app/_utils/geoUtils';
import { createRoot } from 'react-dom/client';
import { Activity, Clock, AlertTriangle, Waves } from 'lucide-react';
import { formatRelativeTime } from '@/app/_utils/geoUtils';

interface QuakeLayerProps {
    map: mapboxgl.Map | null;
    earthquakeData: EarthquakeCollection | null;
    visible: boolean;
    opacity?: number;
}

export default function QuakeLayer({
    map,
    earthquakeData,
    visible,
    opacity = 1,
}: QuakeLayerProps) {
    const markersRef = useRef<mapboxgl.Marker[]>([]);
    const heatmapLayerId = 'earthquake-heatmap';
    const heatmapSourceId = 'earthquake-heatmap-source';

    // Add heatmap layer for earthquake impact areas
    useEffect(() => {
        if (!map || !earthquakeData) return;

        // Create source for heatmap if it doesn't exist
        if (!map.getSource(heatmapSourceId)) {
            map.addSource(heatmapSourceId, {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: earthquakeData.features.map((quake) => ({
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [quake.geometry.coordinates[0], quake.geometry.coordinates[1]],
                        },
                        properties: {
                            mag: quake.properties.mag,
                        },
                    })),
                },
            });
        } else {
            // Update existing source
            (map.getSource(heatmapSourceId) as mapboxgl.GeoJSONSource).setData({
                type: 'FeatureCollection',
                features: earthquakeData.features.map((quake) => ({
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [quake.geometry.coordinates[0], quake.geometry.coordinates[1]],
                    },
                    properties: {
                        mag: quake.properties.mag,
                    },
                })),
            });
        }

        // Add heatmap layer for earthquake impact zones
        if (!map.getLayer(heatmapLayerId)) {
            map.addLayer({
                id: heatmapLayerId,
                type: 'heatmap',
                source: heatmapSourceId,
                paint: {
                    // Heatmap weight based on magnitude
                    'heatmap-weight': [
                        'interpolate',
                        ['linear'],
                        ['get', 'mag'],
                        0,
                        0,
                        3,
                        0.3,
                        5,
                        0.7,
                        7,
                        1,
                    ],
                    // Intensity increases with zoom
                    'heatmap-intensity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        0,
                        0.5,
                        9,
                        2,
                    ],
                    // Color gradient from cyan (low) to yellow (medium) to red (high)
                    'heatmap-color': [
                        'interpolate',
                        ['linear'],
                        ['heatmap-density'],
                        0,
                        'rgba(6, 182, 212, 0)',
                        0.2,
                        'rgba(6, 182, 212, 0.4)',
                        0.4,
                        'rgba(251, 191, 36, 0.5)',
                        0.6,
                        'rgba(245, 158, 11, 0.6)',
                        0.8,
                        'rgba(239, 68, 68, 0.7)',
                        1,
                        'rgba(220, 38, 38, 0.8)',
                    ],
                    // Radius increases with magnitude and zoom
                    'heatmap-radius': [
                        'interpolate',
                        ['exponential', 2],
                        ['zoom'],
                        0,
                        ['*', ['get', 'mag'], 5],
                        9,
                        ['*', ['get', 'mag'], 25],
                    ],
                    // Overall opacity
                    'heatmap-opacity': opacity * 0.7,
                },
            }, 'waterway-label'); // Place below labels
        }

    }, [map, earthquakeData, opacity]);

    // Handle heatmap visibility
    useEffect(() => {
        if (!map) return;

        if (map.getLayer(heatmapLayerId)) {
            map.setLayoutProperty(
                heatmapLayerId,
                'visibility',
                visible ? 'visible' : 'none'
            );
        }
    }, [map, visible]);

    // Add marker points
    useEffect(() => {
        if (!map || !earthquakeData) return;

        // Clear existing markers
        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];

        if (!visible) return;

        // Add markers for each earthquake
        earthquakeData.features.forEach((quake) => {
            const { mag: rawMag, place, time } = quake.properties;
            const mag = rawMag ?? 0; // Default to 0 if magnitude is null/undefined
            const depth = quake.geometry.coordinates[2];
            const severity = getEarthquakeSeverity(mag);
            const isRecent = Date.now() - time < 24 * 60 * 60 * 1000;
            const isMajor = mag >= 4.5;

            // Create marker element
            const el = document.createElement('div');
            el.className = 'quake-marker-container group cursor-pointer';

            // Concentric rings for major earthquakes
            const rings = isMajor ? `
                <div class="absolute inset-0 -m-8 rounded-full border opacity-30 animate-pulse-slow" style="border-color: ${severity.color}; background-color: ${severity.color}10;"></div>
                <div class="absolute inset-0 -m-16 rounded-full border opacity-20 animate-pulse-slower" style="border-color: ${severity.color}; background-color: ${severity.color}05;"></div>
                <div class="absolute inset-0 -m-24 rounded-full border opacity-10 animate-pulse-slowest" style="border-color: ${severity.color};"></div>
            ` : '';

            // Inner HTML for the marker
            el.innerHTML = `
                <div class="relative flex items-center justify-center w-full h-full">
                    ${rings}
                    ${isMajor ? `<div class="absolute inset-0 rounded-full animate-shockwave opacity-0" style="background-color: ${severity.color}; animation-duration: 3s;"></div>` : ''}
                    ${isRecent ? `<div class="absolute inset-0 rounded-full animate-pulse-ring opacity-75" style="background-color: ${severity.color}"></div>` : ''}
                    <div class="relative z-10 w-full h-full rounded-full shadow-lg border-2 border-white/80 transition-transform duration-300 group-hover:scale-125" 
                         style="background-color: ${severity.color}; box-shadow: 0 0 20px ${severity.color}90;">
                         <div class="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white/90">
                            ${mag.toFixed(1)}
                         </div>
                    </div>
                </div>
            `;

            // Size based on magnitude
            const size = Math.max(24, Math.min(65, mag * 9));
            el.style.width = `${size}px`;
            el.style.height = `${size}px`;
            el.style.opacity = opacity.toString();

            // Create Popup
            const popupNode = document.createElement('div');
            const root = createRoot(popupNode);

            root.render(
                <div className="p-1 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-700/50">
                        <div className={`p-1.5 rounded-lg bg-slate-800`}>
                            <Activity className="w-4 h-4" style={{ color: severity.color }} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-100">M {mag.toFixed(1)} Earthquake</h3>
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                                {depth}km depth
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300">
                        <div className="flex items-start gap-2">
                            <Waves className="w-3.5 h-3.5 mt-0.5 text-slate-500" />
                            <span className="font-medium text-slate-200">{place}</span>
                        </div>

                        <div className="flex items-center gap-2 text-slate-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{formatRelativeTime(time)}</span>
                        </div>

                        {isMajor && (
                            <div className="mt-2 p-2 rounded bg-red-500/10 border border-red-500/20 flex items-start gap-2">
                                <AlertTriangle className="w-3.5 h-3.5 text-red-400 mt-0.5" />
                                <span className="text-red-200 text-[10px] leading-tight">
                                    Major seismic event. Potential for aftershocks.
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            );

            const popup = new mapboxgl.Popup({
                offset: 25,
                closeButton: false,
                className: 'glass-popup',
                maxWidth: '300px',
            }).setDOMContent(popupNode);

            // Add to map
            const marker = new mapboxgl.Marker({
                element: el,
                anchor: 'center',
            })
                .setLngLat([quake.geometry.coordinates[0], quake.geometry.coordinates[1]])
                .setPopup(popup)
                .addTo(map);

            markersRef.current.push(marker);

            // Hover effects
            el.addEventListener('mouseenter', () => {
                el.style.zIndex = '50';
            });
            el.addEventListener('mouseleave', () => {
                el.style.zIndex = 'auto';
            });
        });

    }, [map, earthquakeData, visible, opacity]);

    return null;
}
