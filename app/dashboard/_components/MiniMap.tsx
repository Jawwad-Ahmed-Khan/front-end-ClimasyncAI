"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { ActiveDisaster } from "../_lib/types";
import { getSeverityColor } from "../_lib/utils";

// ============================================
// MINI MAP COMPONENT
// ============================================
// Small Mapbox map showing active disasters
// Used in: Home tab

interface MiniMapProps {
    disasters: ActiveDisaster[];
    center?: { lat: number; lng: number };
    zoom?: number;
}

// Mapbox access token (use env variable in production)
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "pk.eyJ1IjoiY2xpbWFzeW5jYWkiLCJhIjoiY200dnpxd3NjMGUzdjJqcHNqc3p0Z3BrayJ9.H2jFynpBdC6Uj8E5DTqKWQ";

export default function MiniMap({
    disasters,
    center = { lat: 28.5, lng: 68.5 },
    zoom = 5
}: MiniMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const markers = useRef<mapboxgl.Marker[]>([]);

    useEffect(() => {
        if (!mapContainer.current || map.current) return;

        mapboxgl.accessToken = MAPBOX_TOKEN;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/dark-v11",
            center: [center.lng, center.lat],
            zoom: zoom,
            interactive: true,
            attributionControl: false,
        });

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right");

        // Cleanup
        return () => {
            markers.current.forEach((marker) => marker.remove());
            map.current?.remove();
            map.current = null;
        };
    }, [center.lat, center.lng, zoom]);

    // Add/update markers when disasters change
    useEffect(() => {
        if (!map.current) return;

        // Remove old markers
        markers.current.forEach((marker) => marker.remove());
        markers.current = [];

        // Add new markers
        disasters.forEach((disaster) => {
            const colors = getSeverityColor(disaster.severity);

            // Create marker element
            const el = document.createElement("div");
            el.className = "disaster-marker";
            el.style.cssText = `
        width: 20px;
        height: 20px;
        background-color: ${colors.marker};
        border-radius: 50%;
        border: 3px solid rgba(255, 255, 255, 0.8);
        box-shadow: 0 0 10px ${colors.marker}80, 0 0 20px ${colors.marker}40;
        cursor: pointer;
        transition: transform 0.2s;
      `;

            el.addEventListener("mouseenter", () => {
                el.style.transform = "scale(1.3)";
            });
            el.addEventListener("mouseleave", () => {
                el.style.transform = "scale(1)";
            });

            // Create popup
            const popup = new mapboxgl.Popup({
                offset: 25,
                closeButton: false,
                closeOnClick: false,
                className: "disaster-popup",
            }).setHTML(`
        <div style="padding: 12px; min-width: 180px;">
          <div style="font-weight: 600; color: #f1f5f9; margin-bottom: 4px;">${disaster.title}</div>
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
            <span style="padding: 2px 8px; border-radius: 9999px; background: ${colors.marker}30; color: ${colors.marker}; font-size: 11px; font-weight: 600;">
              ${disaster.type}
            </span>
            <span style="padding: 2px 8px; border-radius: 9999px; background: ${colors.marker}30; color: ${colors.marker}; font-size: 11px; font-weight: 600;">
              ${disaster.severity}
            </span>
          </div>
          <div style="font-size: 12px; color: #94a3b8;">
            Affected: ${disaster.affectedPopulation.toLocaleString()} people
          </div>
        </div>
      `);

            // Create marker
            const marker = new mapboxgl.Marker(el)
                .setLngLat([disaster.location.lng, disaster.location.lat])
                .setPopup(popup)
                .addTo(map.current!);

            // Show popup on hover
            el.addEventListener("mouseenter", () => marker.togglePopup());
            el.addEventListener("mouseleave", () => marker.togglePopup());

            markers.current.push(marker);
        });
    }, [disasters]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full h-64 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700"
        >
            <div ref={mapContainer} className="absolute inset-0" />

            {/* Overlay Label */}
            <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-sm">
                <span className="text-xs font-medium text-white">Active Disasters</span>
            </div>

            {/* Legend */}
            <div className="absolute bottom-3 left-3 p-2 rounded-lg bg-slate-900/80 backdrop-blur-sm">
                <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <span className="text-slate-300">Critical</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                        <span className="text-slate-300">High</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <span className="text-slate-300">Medium</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
