# Brightstream Bank — Branch Finder

A polished, fully responsive branch finder application built for the Optimizely Demo Engineer technical assessment.

**Built with:** React 18, TypeScript, Vite, Tailwind CSS, Leaflet.js, Optimizely Graph GraphQL API

---

## Prerequisites

- **Node.js** 18.x or higher
- **npm** (comes with Node.js)

---

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:

- React 18 & React DOM
- TypeScript
- Vite (build tool)
- Tailwind CSS
- Leaflet.js (maps)
- Axios (HTTP client)

### 2. Start Development Server

```bash
npm run dev
```

The application will start at `http://localhost:3000` (or the next available port like 3001).

### 3. Build for Production

```bash
npm run build
```

This creates an optimized production build in the `/dist` folder.

### 4. Preview Production Build

```bash
npm run preview
```

Preview the production build locally before deploying.

### Deployment

Deploy the `/dist` folder to any static hosting service:

- **Netlify:** Drag and drop the `/dist` folder
- **Vercel:** Connect your repository for automatic deployments
- **GitHub Pages:** Use the `gh-pages` package

---

## Features

### 🔍 Search & Filter

- **Real-time search** across branch names, cities, addresses, and postcodes
- **Multi-select filters** for cities and countries
- **Debounced search** (280ms) for optimal performance

### 🗺️ Interactive Maps

- **Leaflet.js integration** with OpenStreetMap tiles
- **Custom markers** for branch locations
- **User location** display when geolocation is enabled
- **Responsive map layout** - sticky on desktop, fullscreen on mobile

### 📍 Geolocation Support

- **"Near me" button** detects user location via browser geolocation API
- **Distance calculation** using the Haversine formula
- **Automatic sorting** by distance when geolocation is enabled

### 📱 Responsive Design

- **Mobile-first approach** with optimized layouts
- **Mobile drawer** with branch details and integrated map
- **Desktop split-view** with map and list side by side
- **Adaptive grid** based on screen size and map state

---

## Distance Calculation

The application uses the **Haversine formula** to calculate great-circle distances between the user's location and branch coordinates.

### How It Works

```typescript
/**
 * Calculate distance between two coordinates using the Haversine formula
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in kilometers
 */
function distanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
```

### Implementation Details

1. **Geolocation Detection**
   - Browser's `navigator.geolocation.getCurrentPosition()` API
   - Requires user permission
   - 10-second timeout for location requests

2. **Distance Calculation**
   - Applied to all branches with valid coordinates
   - Calculated in kilometers
   - Display format:
     - `< 1 km`: Shows meters (e.g., "450m")
     - `≥ 1 km`: Shows kilometers (e.g., "3.2km")

3. **Distance-Based Sorting**
   - "Nearest first" sort option (only available when user location is detected)
   - Updates automatically when user location changes
   - Integrated with the sort dropdown UI

### Browser Compatibility

Geolocation requires:

- HTTPS or localhost
- User permission granted
- Modern browser with Geolocation API support

---

## Project Structure

```
src/
├── api/
│   └── api.ts                    # GraphQL API client, distance calculation, filtering
├── components/
│   ├── BranchFinder.tsx          # Main layout component
│   ├── BranchCard.tsx            # Expandable branch card
│   ├── BranchDrawer.tsx          # Mobile drawer with details & map
│   ├── BranchCountHeader.tsx     # Branch count & sort dropdown
│   ├── FilterBar.tsx             # City & country filters
│   ├── MapView.tsx               # Leaflet map component
│   ├── SearchBar.tsx             # Search input with geolocation
│   ├── SearchableSelect.tsx      # Multi-select dropdown component
│   ├── SkeletonCards.tsx         # Loading skeleton UI
│   └── BranchFinder/
│       ├── EmptyState.tsx        # Empty search results
│       └── ErrorState.tsx        # Error display
├── hooks/
│   └── useAppData.ts             # Global state management hook
├── types/
│   ├── index.ts                  # TypeScript type definitions
│   └── api.ts                    # API-specific types
├── utils/
│   ├── mapHelpers.ts             # Leaflet map utilities
│   └── selectHelpers.ts          # Select component icons
├── App.tsx                       # Root component
├── main.tsx                      # Application entry point
└── index.html                    # HTML template
```

---

## Technologies Used

| Technology           | Purpose                                       |
| -------------------- | --------------------------------------------- |
| **React 18**         | UI library with hooks for state management    |
| **TypeScript**       | Type-safe development and better DX           |
| **Vite**             | Fast build tool and dev server                |
| **Tailwind CSS**     | Utility-first CSS framework for rapid styling |
| **Leaflet.js**       | Open-source map library (no API key needed)   |
| **React-Leaflet**    | React integration for Leaflet                 |
| **Axios**            | HTTP client for API requests                  |
| **Optimizely Graph** | GraphQL API for branch data                   |

---

## API Integration

### GraphQL Endpoint

```
https://cg.optimizely.com/content/v2?auth=xxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Data Flow

1. **Fetch:** Application fetches all 100 branches on load
2. **Normalize:** Raw API data is normalized to application's data model
3. **Parse:** Coordinate strings are parsed into lat/lng objects
4. **Filter:** Client-side filtering by search query, cities, and countries
5. **Calculate:** Distances are calculated when user location is available
6. **Sort:** Results are sorted by name, city, or distance

### Coordinate Parsing

The API returns coordinates as comma-separated strings (e.g., "51.5074, -0.1278"). These are parsed and validated:

```typescript
function parseCoordinates(coords: string): { lat: number; lng: number } | null {
  const parts = coords.split(",").map((c) => c.trim());
  if (parts.length !== 2) return null;

  const lat = parseFloat(parts[0]);
  const lng = parseFloat(parts[1]);

  if (isNaN(lat) || isNaN(lng)) return null;

  return { lat, lng };
}
```

---

## Design System

The application implements Brightstream's design language:

- **Colors:**
  - Midnight (#0a1628) - Primary dark
  - Gold (#d4af37) - Accent/highlight
  - Cream (#f8f6f1) - Background
  - Slate (#64748b) - Secondary text
  - Teal (#0d4d56) - Accent

- **Typography:**
  - Playfair Display - Headings
  - Jost - Body and UI text

- **Components:**
  - Pill-shaped buttons
  - Rounded cards with shadows
  - Gold accent borders
  - Smooth transitions and animations
