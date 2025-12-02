/**
 * RainLayer - Visualizes rainfall data using heatmap and 3D particles
 */

'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import type { WeatherGridData } from '@/app/_types/api';
import { getRainIntensity } from '@/app/_utils/geoUtils';

interface RainLayerProps {
    map: mapboxgl.Map | null;
    rainData: WeatherGridData | null;
    visible: boolean;
    opacity?: number;
}

interface RainParticle {
    x: number;
    y: number;
    z: number;
    length: number;
    opacity: number;
}

interface CustomRainLayer extends mapboxgl.CustomLayerInterface {
    canvas?: HTMLCanvasElement;
    ctx?: CanvasRenderingContext2D | null;
    map?: mapboxgl.Map;
    particles?: RainParticle[];
    resize?: () => void;
    rainData?: WeatherGridData | null;
}

export default function RainLayer({
    map,
    rainData,
    visible,
    opacity = 0.8,
}: RainLayerProps) {
    const layerId = 'rain-heatmap';
    const particleLayerId = 'rain-particles';
    const sourceId = 'rain-source';
    const rainDataRef = useRef<WeatherGridData | null>(rainData);

    // Update ref when rainData changes
    useEffect(() => {
        rainDataRef.current = rainData;
    }, [rainData]);

    // Initialize Heatmap Layer
    useEffect(() => {
        if (!map || !rainData) return;

        // Add source if not exists
        if (!map.getSource(sourceId)) {
            map.addSource(sourceId, {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: rainData.points.map((point) => ({
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [point.longitude, point.latitude],
                        },
                        properties: {
                            rain: point.rain,
                            intensity: getRainIntensity(point.rain),
                        },
                    })),
                },
            });
        } else {
            // Update data
            (map.getSource(sourceId) as mapboxgl.GeoJSONSource).setData({
                type: 'FeatureCollection',
                features: rainData.points.map((point) => ({
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [point.longitude, point.latitude],
                    },
                    properties: {
                        rain: point.rain,
                        intensity: getRainIntensity(point.rain),
                    },
                })),
            });
        }

        // Add Heatmap Layer
        if (!map.getLayer(layerId)) {
            map.addLayer({
                id: layerId,
                type: 'heatmap',
                source: sourceId,
                paint: {
                    // Increase the heatmap weight based on frequency and property magnitude
                    'heatmap-weight': [
                        'interpolate',
                        ['linear'],
                        ['get', 'rain'],
                        0,
                        0,
                        50,
                        1,
                    ],
                    // Increase the heatmap color weight weight by zoom level
                    'heatmap-intensity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        0,
                        1,
                        9,
                        3,
                    ],
                    // Color ramp for heatmap - blue to violet gradient
                    'heatmap-color': [
                        'interpolate',
                        ['linear'],
                        ['heatmap-density'],
                        0,
                        'rgba(33,102,172,0)',
                        0.2,
                        'rgb(103,169,207)',
                        0.4,
                        'rgb(209,229,240)',
                        0.6,
                        'rgb(253,219,199)',
                        0.8,
                        'rgb(239,138,98)',
                        1,
                        'rgb(178,24,43)',
                    ],
                    // Adjust the heatmap radius by zoom level
                    'heatmap-radius': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        0,
                        2,
                        9,
                        20,
                    ],
                    // Transition from heatmap to circle layer by zoom level
                    'heatmap-opacity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7,
                        1,
                        9,
                        0,
                    ],
                },
            });
        }

        // Add Particle Layer (Custom Canvas Layer)
        if (!map.getLayer(particleLayerId)) {
            const customLayer: CustomRainLayer = {
                id: particleLayerId,
                type: 'custom',
                renderingMode: '3d',
                onAdd: function (map, gl) {
                    // We'll use a canvas overlay for rain particles
                    const canvas = document.createElement('canvas');
                    canvas.id = 'rain-canvas';
                    canvas.style.position = 'absolute';
                    canvas.style.top = '0';
                    canvas.style.left = '0';
                    canvas.style.width = '100%';
                    canvas.style.height = '100%';
                    canvas.style.pointerEvents = 'none';
                    canvas.style.zIndex = '10';
                    map.getCanvasContainer().appendChild(canvas);
                    this.canvas = canvas;
                    this.ctx = canvas.getContext('2d');
                    this.map = map;
                    this.particles = [];
                    this.rainData = rainDataRef.current;

                    // Resize handler
                    this.resize = () => {
                        if (this.canvas && this.map) {
                            this.canvas.width = this.map.getCanvas().width;
                            this.canvas.height = this.map.getCanvas().height;
                        }
                    };
                    map.on('resize', this.resize);
                    if (this.resize) this.resize();
                },
                render: function (gl, matrix) {
                    if (!this.ctx || !this.map || !visible) return;

                    // Update rain data reference
                    this.rainData = rainDataRef.current;
                    if (!this.rainData) return;

                    const ctx = this.ctx;
                    const map = this.map;
                    const width = ctx.canvas.width;
                    const height = ctx.canvas.height;
                    const zoom = map.getZoom();

                    // Clear canvas
                    ctx.clearRect(0, 0, width, height);

                    // Only show particles when zoomed in
                    if (zoom < 7) return;

                    // Get screen coordinates of rain data points
                    const rainPoints = this.rainData.points
                        .filter(p => p.rain > 0.5)
                        .map(point => {
                            const proj = map.project([point.longitude, point.latitude]);
                            return {
                                x: proj.x,
                                y: proj.y,
                                intensity: point.rain,
                            };
                        })
                        .filter(p => p.x >= -100 && p.x <= width + 100 && p.y >= -100 && p.y <= height + 100);

                    if (rainPoints.length === 0) return;

                    // Generate particles near rain points if needed
                    if (this.particles && this.particles.length < 1000) {
                        for (let i = 0; i < 50; i++) {
                            const rainPoint = rainPoints[Math.floor(Math.random() * rainPoints.length)];
                            const radius = Math.min(250, rainPoint.intensity * 25 * (zoom / 10));
                            const angle = Math.random() * 2 * Math.PI;
                            const distance = Math.random() * radius;

                            this.particles.push({
                                x: rainPoint.x + Math.cos(angle) * distance,
                                y: rainPoint.y + Math.sin(angle) * distance - Math.random() * height * 0.3,
                                z: Math.random() * 2 + 1,
                                length: Math.random() * 25 + 15,
                                opacity: Math.random() * 0.6 + 0.3,
                            });
                        }
                    }

                    // Update and draw particles
                    ctx.strokeStyle = 'rgba(173, 216, 230, 0.8)';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();

                    if (this.particles) {
                        for (let i = this.particles.length - 1; i >= 0; i--) {
                            const p = this.particles[i];

                            // Move particle
                            p.y += p.z * 7;
                            p.x -= p.z * 1.5;

                            // Check if particle is near any rain point
                            const nearRainPoint = rainPoints.some(rp => {
                                const dist = Math.sqrt(Math.pow(p.x - rp.x, 2) + Math.pow(p.y - rp.y, 2));
                                return dist < 300;
                            });

                            // Respawn or remove particles
                            if (p.y > height + 50 || p.x < -50 || p.x > width + 50 || !nearRainPoint) {
                                if (rainPoints.length > 0) {
                                    const rainPoint = rainPoints[Math.floor(Math.random() * rainPoints.length)];
                                    const radius = Math.min(250, rainPoint.intensity * 25 * (zoom / 10));
                                    const angle = Math.random() * 2 * Math.PI;
                                    const distance = Math.random() * radius;

                                    p.x = rainPoint.x + Math.cos(angle) * distance;
                                    p.y = rainPoint.y + Math.sin(angle) * distance - Math.random() * 150;
                                } else {
                                    this.particles.splice(i, 1);
                                    continue;
                                }
                            }

                            // Draw particle
                            ctx.globalAlpha = p.opacity;
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(p.x - p.z * 2, p.y + p.length);
                        }
                    }
                    ctx.stroke();
                    ctx.globalAlpha = 1.0;

                    // Request next frame
                    map.triggerRepaint();
                },
                onRemove: function () {
                    if (this.canvas) {
                        this.canvas.remove();
                    }
                    if (this.map && this.resize) {
                        this.map.off('resize', this.resize);
                    }
                }
            };

            // Add custom layer
            map.addLayer(customLayer);
        }

    }, [map, rainData]);

    // Handle visibility and zoom-based layer toggling
    useEffect(() => {
        if (!map) return;

        const handleZoom = () => {
            const zoom = map.getZoom();

            // Toggle Heatmap: Visible when zoomed OUT (< 9)
            if (map.getLayer(layerId)) {
                const shouldShowHeatmap = visible && zoom < 9;
                map.setLayoutProperty(
                    layerId,
                    'visibility',
                    shouldShowHeatmap ? 'visible' : 'none'
                );
            }

            // Toggle Particles: Visible when zoomed IN (> 7)
            const canvas = document.getElementById('rain-canvas');
            if (canvas) {
                const shouldShowParticles = visible && zoom >= 7;
                canvas.style.display = shouldShowParticles ? 'block' : 'none';
                canvas.style.opacity = Math.min(1, (zoom - 7) / 2).toString();
            }
        };

        map.on('zoom', handleZoom);
        handleZoom(); // Initial check

        return () => {
            map.off('zoom', handleZoom);
        };

    }, [map, visible]);

    // Handle opacity
    useEffect(() => {
        if (!map || !map.getLayer(layerId)) return;

        map.setPaintProperty(layerId, 'heatmap-opacity', opacity);
    }, [map, opacity]);

    return null;
}
