# Brightstream Bank — Branch Finder

A responsive branch finder built for the Optimizely Demo Engineer technical assessment.

**Live demo:** [your-deployment-url]  
**Stack:** React 18 · TypeScript · Vite · Tailwind CSS · Leaflet.js · Optimizely Graph

---

## Setup

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build → /dist
npm run preview    # preview production build locally
```

<!-- **Deploy:** drag the `/dist` folder into [Netlify Drop](https://app.netlify.com/drop). -->

---

## Environment

Create a `.env` file in the project root:

```bash
VITE_OPTIMIZELY_AUTH_KEY=your_key_here
```

---

## Technologies

| Technology       | Purpose     | Why chosen                                                        |
| ---------------- | ----------- | ----------------------------------------------------------------- |
| React 18         | UI library  | Component model + hooks keep state and UI in sync cleanly         |
| TypeScript       | Type safety | Catches prop/type mismatches at compile time, not runtime         |
| Vite             | Build tool  | Faster dev server and HMR than CRA; simpler config                |
| Tailwind CSS     | Styling     | Rapid utility-first styling matched to Brightstream design tokens |
| Leaflet.js       | Maps        | Open-source, no API key needed, well-documented                   |
| Optimizely Graph | Data        | GraphQL endpoint for live Branch content                          |

---

## Project structure

```
src/
├── api/
│   └── api.ts                  # GraphQL client + data normalisation
├── components/
│   ├── BranchFinder/           # Layout orchestration (desktop + mobile)
│   ├── icons/
│   │   └── IconLibrary.tsx     # Single source for all SVG icons
│   ├── shared/                 # ContactInfo, DistanceBadge
│   ├── BranchCard.tsx          # Expandable branch row
│   ├── BranchDrawer.tsx        # Mobile detail drawer
│   ├── FilterBar.tsx           # City + country filters
│   ├── MapView.tsx             # Leaflet map
│   ├── SearchBar.tsx           # Debounced search + geolocation
│   ├── SearchableSelect.tsx    # Multi-select dropdown
│   └── SkeletonCards.tsx       # Loading skeletons
├── hooks/
│   └── useAppData.ts           # Centralised state hook
├── types/
│   └── index.ts                # Shared TypeScript types
└── utils/
    ├── common.ts               # formatDistance, buildMapsUrl
    └── mapHelpers.ts           # Leaflet marker utilities
```

---

## Approach

### API

Fetches all branches from Optimizely Graph in a single request and normalises the response into a consistent `Branch` type. Coordinates are returned as comma-separated strings (`"51.5074, -0.1278"`) and parsed on the client.

**One important finding during development:** GraphQL introspection shows filtering operators (`like`, `contains`, `eq`) on the Branch schema, but executing queries with `where` clauses returns `"Field not defined"` errors. After testing several filter patterns this is clearly a permission restriction on the auth token rather than a schema issue — the token has read-only access to fetch Branch items but filtering is blocked server-side. All search and filtering is therefore done client-side, which works fine for 100 branches.

### Search & filtering

- 280ms debounced text search across name, city, address and postcode
- Multi-select city and country filters
- Sort by name, city, or distance (distance only available after geolocation)
- All filtering runs in the browser via `useMemo` — no extra API calls

### Distance

Haversine formula calculates straight-line distance between the user and each branch. Displays as metres below 1km, kilometres above. Activates "Nearest first" sort automatically when the user grants location permission.

### Layout

- **Desktop:** full-height sticky map on the left, scrollable filtered list on the right — search bar spans the full width above both
- **Mobile:** scrollable branch list by default; tapping any card slides up a bottom drawer containing the full branch details (phone, email, direction button) and a map centred on that branch — closing the drawer returns the user to the list

---

## Design system

Extracted directly from the provided Brightstream mockups (`/home`, `/articles`):

| Token         | Value            |
| ------------- | ---------------- |
| `--midnight`  | `#0a1628`        |
| `--gold`      | `#d4af37`        |
| `--cream`     | `#f8f6f1`        |
| `--warmWhite` | `#fefdfb`        |
| `--slate`     | `#64748b`        |
| `--sage`      | `#8b9d83`        |
| `--deep-teal` | `#0d4d56`        |
| Display font  | Playfair Display |
| Body font     | Jost             |

---

## Key decisions

**Client-side filtering over GraphQL `where` clauses**  
After discovering the auth token blocks server-side filtering (documented in the API section above), I moved all search and filter logic into a single `useMemo` in `useAppData.ts`. For 100 branches this runs fast and avoids a round-trip on every keystroke.

**No Context API**  
All state lives in `useAppData.ts` and flows one level down to leaf components. The prop chain is shallow enough that Context would add indirection without solving a real problem. If the app grew to include a branch detail page, favourites, or auth, I'd introduce Context or Zustand at that point.

**Progressive disclosure on branch cards**  
The list shows only name, address, city, country and distance — the minimum needed to choose a branch. Phone and email are revealed on tap. This keeps the list scannable when browsing 100 results and follows the same pattern used in the Brightstream articles page (summary visible, detail on demand).

**Mobile-first layout with a bottom drawer**  
Tapping a branch card on mobile opens a bottom drawer showing the full branch details alongside a focused map centred on that branch. This keeps the list always in view behind the drawer — the user never loses their place in the results, and closing the drawer returns them exactly where they were.

---

<!-- ## What I'd add with more time

- **Marker clustering** — overlapping pins at low zoom levels
- **"Open now" indicator** — parse opening hours against current time + timezone
- **Postcode geocoding** — convert a searched postcode into coordinates for proximity search
- **URL state sync** — shareable filtered URLs (`?city=London&sort=distance`)
- **Service worker** — cache branch data for offline use -->
