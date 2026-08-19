# Global Disaster Monitoring Dashboard - Complete Implementation Prompt

## Project Context

You are a Senior Frontend Architect building a production-ready disaster monitoring dashboard for **ClimaSyncAI** - a global climate intelligence platform with worldwide coverage. The design features professional Glassmorphism aesthetics and location-specific disaster visualizations.

---

## 1. Technical Foundation

### Pre-Installed Dependencies
```json
{
  "next": "14.x",
  "typescript": "5.x",
  "tailwindcss": "3.x",
  "mapbox-gl": "^3.x",
  "react-map-gl": "^7.x",
  "@mapbox/search-js-react": "^1.x",
  "@turf/turf": "^6.x",
  "axios": "^1.x",
  "lucide-react": "^0.x"
}
```

### Environment Variables Required
```env
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

---

## 2. Strict Folder Structure

```
src/
├── _types/
│   └── api.ts                          # All TypeScript interfaces
├── _api/
│   └── map_api/
│       └── fetchData.ts                # Axios API functions
├── _components/
│   ├── map_components/
│   │   ├── SearchBox.tsx               # Mapbox search integration
│   │   ├── ControlPanel.tsx            # Layer toggle panel (right side)
│   │   ├── DisasterLegend.tsx          # Magnitude/intensity legend
│   │   └── LoadingOverlay.tsx          # Loading state component
│   └── map_layers/
│       ├── RainLayer.tsx               # Rain visualization layer
│       └── QuakeLayer.tsx              # Earthquake visualization layer
├── _hooks/
│   └── useDisasterData.ts              # Custom hook for data fetching
├── _utils/
│   └── geoUtils.ts                     # Geospatial utility functions
└── app/
    └── map/
        └── page.tsx                    # Main dashboard page
```

---

## 3. Design Specifications

### Layout Structure (Matching Reference Image)
```
┌─────────────────────────────────────────────────────────────┐
│  ┌─────────────────────┐                    ┌─────────────┐ │
│  │ 🔍 Search Pakistan  │                    │ View Options│ │
│  │    (Glassmorphism)  │                    │ ├─ Rain ⬤   │ │
│  └─────────────────────┘                    │ ├─ Quakes ⬤ │ │
│                                             │ └─ 3D ⬤     │ │
│                                             └─────────────┘ │
│                                                             │
│                    [MAP - Pakistan Only]                    │
│                                                             │
│                         🌧️ Rain Particles                   │
│                         ⭕ Earthquake Circles                │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ ClimaSyncAI          Last Updated: 2 min ago    Legend  ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Glassmorphism Theme
```css
/* Panel Base */
background: rgba(15, 23, 42, 0.75);
backdrop-filter: blur(16px);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 16px;
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

/* Accent Colors */
--primary: #06B6D4;      /* Cyan-500 */
--secondary: #8B5CF6;    /* Violet-500 */
--danger: #EF4444;       /* Red-500 */
--success: #10B981;      /* Emerald-500 */
```

---

## 4. Pakistan Geographic Constraints

### Bounding Box Configuration
```typescript




```

### Major Cities for Reference
```typescript
const PAKISTAN_CITIES = [
  { name: 'Karachi', coordinates: [67.0011, 24.8607] },
  { name: 'Lahore', coordinates: [74.3587, 31.5204] },
  { name: 'Islamabad', coordinates: [73.0479, 33.6844] },
  { name: 'Peshawar', coordinates: [71.5249, 34.0151] },
  { name: 'Quetta', coordinates: [67.0011, 30.1798] },
  { name: 'Multan', coordinates: [71.5249, 30.1575] },
];
```

---

## 5. API Integration Specifications

### USGS Earthquake API
```typescript
// Endpoint
const USGS_ENDPOINT = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';

// Response structure to type
interface USGSResponse {
  type: 'FeatureCollection';
  metadata: {
    generated: number;
    title: string;
    count: number;
  };
  features: Array<{
    type: 'Feature';
    properties: {
      mag: number;
      place: string;
      time: number;
      updated: number;
      alert: string | null;
      tsunami: number;
      sig: number;
      title: string;
    };
    geometry: {
      type: 'Point';
      coordinates: [number, number, number]; // [lng, lat, depth]
    };
    id: string;
  }>;
}

// FILTERING REQUIREMENT:
// Filter features where coordinates fall within Pakistan bounds
// Use @turf/boolean-point-in-polygon for precise filtering
```

### Open-Meteo Weather API
```typescript
// Endpoint for rain data across Pakistan grid
const OPEN_METEO_ENDPOINT = 'https://api.open-meteo.com/v1/forecast';

// Query parameters
const params = {
  latitude: [24.8, 27.5, 30.3, 33.0, 35.5],  // Grid points
  longitude: [62.0, 66.0, 70.0, 74.0, 77.0],
  current: ['rain', 'precipitation', 'weather_code'],
  hourly: ['rain', 'precipitation_probability'],
  timezone: 'Asia/Karachi',
};

// Response structure to type
interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  current: {
    time: string;
    rain: number;           // mm
    precipitation: number;  // mm
    weather_code: number;
  };
  hourly: {
    time: string[];
    rain: number[];
    precipitation_probability: number[];
  };
}
```

---

## 6. Component Specifications

### File 1: `_types/api.ts`
Create comprehensive TypeScript interfaces for:
- `Earthquake` - Individual earthquake data
- `EarthquakeCollection` - GeoJSON collection
- `RainData` - Rain measurement at a point
- `WeatherGridData` - Grid of weather data points
- `MapLayerState` - Toggle states for layers
- `DisasterSeverity` - Enum for severity levels

### File 2: `_api/map_api/fetchData.ts`
Implement:
- `fetchEarthquakes()` - Fetches and filters USGS data to Pakistan only
- `fetchRainData()` - Fetches Open-Meteo data for Pakistan grid
- `isPointInPakistan(lng, lat)` - Utility using turf.js
- Include proper error handling and TypeScript return types
- Add request caching strategy (stale-while-revalidate pattern)

### File 3: `_components/map_layers/RainLayer.tsx`
Implement:
- Accept rain data as props
- Use Mapbox GL `addLayer` for rain particle effect
- Trigger 3D rain animation when precipitation > 0.5mm
- Create heatmap-style intensity visualization
- Include layer cleanup on unmount
- Use `useEffect` with map instance dependency

### File 4: `_components/map_layers/QuakeLayer.tsx`
Implement:
- Render earthquakes as concentric circle markers
- Color gradient: Teal (mag < 3) → Yellow (3-5) → Red (> 5)
- Size scaling based on magnitude (exponential)
- Pulsing animation for recent earthquakes (< 1 hour)
- Hover tooltip showing: magnitude, location, time, depth
- Click to zoom to earthquake location

### File 5: `_components/map_components/ControlPanel.tsx`
Implement:
- Glassmorphism styled floating panel
- Position: Top-right with 16px margin
- Toggle switches for:
  - Rain Layer (with rain icon)
  - Earthquake Layer (with activity icon)
  - 3D Buildings (with building icon)
  - Terrain (with mountain icon)
- Layer opacity sliders (hidden by default, expand on click)
- "Last Updated" timestamp
- Use Lucide icons: `CloudRain`, `Activity`, `Building2`, `Mountain`, `Layers`

### File 6: `_components/map_components/SearchBox.tsx`
Implement:
- Use `@mapbox/search-js-react` SearchBox component
- Restrict search to Pakistan using `country: 'pk'`
- Glassmorphism container styling
- Custom marker on search result
- Fly-to animation on location select
- Clear button functionality

### File 7: `_components/map_components/DisasterLegend.tsx`
Implement:
- Bottom-left positioned legend
- Earthquake magnitude color scale
- Rain intensity scale
- Collapsible for mobile
- ClimaSyncAI branding

### File 8: `_hooks/useDisasterData.ts`
Implement:
- Custom hook managing earthquake and rain data fetching
- Auto-refresh every 5 minutes
- Loading and error states
- Return: `{ earthquakes, rainData, isLoading, error, refetch }`

### File 9: `app/map/page.tsx`
Implement:
- Main page component with 'use client' directive
- Full-height map container
- Integrate all components
- State management for layer visibility
- Map initialization with Pakistan constraints
- Keyboard shortcuts (R: toggle rain, E: toggle earthquakes)
- Mobile responsive considerations

---

## 7. Styling Requirements

### Tailwind CSS Classes to Use
```typescript
// Glassmorphism Panel
const panelClasses = `
  bg-slate-900/75 
  backdrop-blur-xl 
  border border-white/10 
  rounded-2xl 
  shadow-2xl 
  shadow-black/20
`;

// Toggle Switch (Active)
const toggleActiveClasses = `
  bg-gradient-to-r from-cyan-500 to-blue-500
  shadow-lg shadow-cyan-500/25
`;

// Earthquake Circle Colors
const magnitudeColors = {
  low: '#06B6D4',     // cyan-500 (< 3.0)
  medium: '#FBBF24',  // amber-400 (3.0 - 5.0)
  high: '#EF4444',    // red-500 (> 5.0)
};
```

### Animation Keyframes (Add to globals.css)
```css
@keyframes pulse-ring {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(2); opacity: 0; }
}

@keyframes rain-fall {
  0% { transform: translateY(-100vh); }
  100% { transform: translateY(100vh); }
}
```

---

## 8. Map Configuration

### Mapbox Style and Features
```typescript
const mapStyle = 'mapbox://styles/mapbox/standard';

// Enable these Mapbox Standard features:
const standardFeatures = {
  showPlaceLabels: true,
  showRoadLabels: true,
  showPointOfInterestLabels: false,
  showTransitLabels: false,
  lightPreset: 'dusk',  // Creates dramatic atmosphere
  show3dObjects: true,
};
```

### Layer Z-Index Order
1. Base map (Mapbox Standard)
2. Rain heatmap layer
3. Rain particle layer (3D effect)
4. Earthquake circles
5. Search result marker
6. UI Overlays

---

## 9. Error Handling Requirements

- Network failures: Show retry button with toast notification
- Empty data: Show "No recent earthquakes in Pakistan" message
- Mapbox token invalid: Graceful error boundary with instructions
- API rate limiting: Implement exponential backoff

---

## 10. Performance Optimizations

- Use `useMemo` for filtered earthquake data
- Debounce search input (300ms)
- Lazy load layer components
- Use Mapbox's built-in clustering for > 50 earthquakes
- Implement virtual scrolling if earthquake list is shown

---

## 11. Accessibility Requirements

- Keyboard navigation for all controls
- ARIA labels for map controls
- High contrast mode for legends
- Screen reader announcements for new earthquakes
- Focus trap in modal dialogs

---

## Deliverables Checklist

Please generate complete, production-ready code for:

1. ✅ `_types/api.ts`
2. ✅ `_api/map_api/fetchData.ts`
3. ✅ `_components/map_layers/RainLayer.tsx`
4. ✅ `_components/map_layers/QuakeLayer.tsx`
5. ✅ `_components/map_components/ControlPanel.tsx`
6. ✅ `_components/map_components/SearchBox.tsx`
7. ✅ `_components/map_components/DisasterLegend.tsx`
8. ✅ `_hooks/useDisasterData.ts`
9. ✅ `app/map/page.tsx`
10. ✅ Any additional utility files needed

**Important**: All code must be fully typed with TypeScript, use modern React patterns (hooks, functional components), and follow Next.js 14 App Router conventions.

---

