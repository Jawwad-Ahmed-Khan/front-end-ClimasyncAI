/**
 * SearchBox - Location search with autocomplete
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Search, X, MapPin, Loader2, Navigation } from 'lucide-react';
import { useDebounce } from '@/app/_hooks/useDisasterData';
import { fetchLocationWeather } from '@/app/_api/map_api/fetchData';

interface SearchBoxProps {
    map: mapboxgl.Map | null;
    accessToken: string;
}

interface SearchResult {
    id: string;
    place_name: string;
    center: [number, number];
    text: string;
}

export default function SearchBox({ map, accessToken }: SearchBoxProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const debouncedQuery = useDebounce(query, 300);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const markerRef = useRef<mapboxgl.Marker | null>(null);
    const popupRef = useRef<mapboxgl.Popup | null>(null);

    // Click outside to close
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Search API call
    useEffect(() => {
        if (!debouncedQuery || debouncedQuery.length < 3) {
            setResults([]);
            return;
        }

        const searchLocation = async () => {
            setIsLoading(true);
            try {
                // Limit search to Pakistan bounding box for relevance
                const bbox = '60.872,23.634,77.847,37.084';
                const response = await fetch(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                        debouncedQuery
                    )}.json?access_token=${accessToken}&country=pk&bbox=${bbox}&types=place,locality,neighborhood,address&limit=5`
                );
                const data = await response.json();
                setResults(data.features || []);
                setIsOpen(true);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        searchLocation();
    }, [debouncedQuery, accessToken]);

    const handleSelect = async (result: SearchResult) => { // Made async
        if (!map) return;

        // Clear previous marker and popup
        if (markerRef.current) markerRef.current.remove();
        if (popupRef.current) popupRef.current.remove();

        // Fly to location
        map.flyTo({
            center: result.center,
            zoom: 12,
            essential: true,
        });

        // Add marker
        const el = document.createElement('div');
        el.className = 'animate-bounce-custom';
        el.innerHTML = `
            <div class="relative">
                <div class="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50 border-2 border-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                </div>
                <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-1 bg-black/30 rounded-full blur-[2px]"></div>
            </div>
        `;

        markerRef.current = new mapboxgl.Marker({
            element: el,
            anchor: 'bottom',
        })
            .setLngLat(result.center)
            .addTo(map);

        // 2. Create Popup instance and attach it to the Marker
        const popup = new mapboxgl.Popup({
            offset: 35, // Adjust offset to be above the marker
            closeButton: false,
            closeOnClick: false,
            className: 'custom-mapbox-popup' // Custom class for styling
        })
            .setLngLat(result.center)
            .setHTML(`
                <div class="p-3 bg-slate-900/90 backdrop-blur-md rounded-xl border border-white/20 text-white shadow-xl font-sans min-w-[180px]">
                    <div class="flex items-center space-x-2">
                        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-500"></div>
                        <span class="text-xs font-semibold text-slate-300">Loading weather...</span>
                    </div>
                </div>
            `) // b. Set initial "Loading..." HTML
            .addTo(map);

        markerRef.current.setPopup(popup);
        popup.addTo(map); // Ensure popup is added to map
        popupRef.current = popup; // Store popup reference

        // c. Call fetchLocationWeather and d. Update the popup content
        try {
            const [lng, lat] = result.center;
            const weather = await fetchLocationWeather(lat, lng);

            if (weather) {
                const { temperature, windSpeed, apparentTemperature, weatherCode } = weather;
                popup.setHTML(`
                    <div class="min-w-[200px] p-3 bg-slate-900/90 backdrop-blur-md rounded-xl border border-white/20 text-white shadow-xl font-sans">
                        <h4 class="text-sm font-bold text-cyan-200 mb-2 border-b border-white/10 pb-1">${result.text}</h4>
                        
                        <div class="grid grid-cols-2 gap-2 text-xs">
                            <div class="flex flex-col">
                                <span class="text-slate-400">Temp</span>
                                <span class="text-lg font-bold text-white">${temperature}°C</span>
                            </div>
                            <div class="flex flex-col">
                                <span class="text-slate-400">Feels Like</span>
                                <span class="font-semibold text-white">${apparentTemperature}°C</span>
                            </div>
                            <div class="flex flex-col col-span-2">
                                <span class="text-slate-400">Wind</span>
                                <span class="font-semibold text-white">${windSpeed} km/h</span>
                            </div>
                            <!-- Add more weather details if needed, e.g., weatherCode -->
                        </div>
                    </div>
                `); // 3. Styled popup content
            } else {
                popup.setHTML(`
                    <div class="p-3 bg-slate-900/90 backdrop-blur-md rounded-xl border border-white/20 text-white shadow-xl font-sans">
                        <p class="text-xs text-red-400">Weather data unavailable.</p>
                    </div>
                `);
            }
        } catch (e) {
            console.error("Failed to fetch weather:", e);
            popup.setHTML(`
                <div class="p-3 bg-slate-900/90 backdrop-blur-md rounded-xl border border-white/20 text-white shadow-xl font-sans">
                    <p class="text-xs text-red-400">Failed to load weather.</p>
                </div>
            `);
        }

        setQuery(result.place_name);
        setIsOpen(false);
    };

    const clearSearch = () => {
        setQuery('');
        setResults([]);
        if (markerRef.current) markerRef.current.remove();
        if (popupRef.current) popupRef.current.remove(); // Also remove popup
    };

    return (
        <div ref={wrapperRef} className="fixed top-24 left-4 z-50 w-full max-w-md animate-fade-in-up">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    {isLoading ? (
                        <Loader2 className="h-5 w-5 text-cyan-400 animate-spin" />
                    ) : (
                        <Search className="h-5 w-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                    )}
                </div>
                <input
                    type="text"
                    className="glass-input w-full pl-11 pr-10 py-3.5 rounded-2xl text-slate-200 placeholder:text-slate-500 focus:ring-0 focus:border-cyan-500/50 transition-all shadow-lg shadow-black/10"
                    placeholder="Search locations in Pakistan..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => results.length > 0 && setIsOpen(true)}
                />
                {query && (
                    <button
                        onClick={clearSearch}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                        <div className="p-1 rounded-full hover:bg-white/10 transition-colors">
                            <X className="h-4 w-4 text-slate-400 hover:text-white" />
                        </div>
                    </button>
                )}
            </div>

            {/* Results Dropdown */}
            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 glass-panel rounded-2xl overflow-hidden animate-fade-in-up">
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar py-2">
                        {results.map((result) => (
                            <button
                                key={result.id}
                                onClick={() => handleSelect(result)}
                                className="w-full px-4 py-3 flex items-start gap-3 hover:bg-white/5 transition-colors text-left group"
                            >
                                <div className="mt-0.5 p-1.5 rounded-lg bg-slate-800 group-hover:bg-cyan-500/20 transition-colors">
                                    <MapPin className="h-4 w-4 text-slate-400 group-hover:text-cyan-400" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-slate-200 group-hover:text-white">
                                        {result.text}
                                    </div>
                                    <div className="text-xs text-slate-500 truncate max-w-[280px]">
                                        {result.place_name}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                    <div className="px-4 py-2 bg-black/20 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500">
                        <span>Search results via Mapbox</span>
                        <Navigation className="w-3 h-3 opacity-50" />
                    </div>
                </div>
            )}
        </div>
    );
}
