# LatSolarLab

Latitude solar radiation calculator with a live 3D globe.

## What it does
- Solar radiation: computes day-of-year, declination, daylight hours, TOA daily radiation, and net absorption; handles polar night/day.
- Modes: single point, compare locations, compare dates.
- Coordinates: decimal <-> DMS toggle, nearest-city hint, quick example presets.
- Search: local city database plus Nominatim fallback; optional Google Geocoding if an API key is provided.
- Globe: Three.js + Globe.gl renders a dot/hex style earth or a texture skin; globe focuses on the selected point and lights according to date.
- UX: bilingual (EN/zh), responsive layout, glassy cards on a dark solid background.

## Globe.gl note
The 3D earth is built with Globe.gl layered on Three.js. Two visual styles are exposed (hex dots vs. texture). Camera focus, atmosphere color, and light direction update when you select a location or change the date so the globe stays in sync with calculations.
We borrow the excellent Globe.gl project here: https://github.com/vasturiano/globe.gl

## Getting started
```bash
git clone https://github.com/yourusername/LatSolarLab.git
cd LatSolarLab
```

### Configure geocoding (optional)
- Default: OSM Nominatim, no key needed.
- Google: copy `config.example.js` to `config.js` and set `GOOGLE_API_KEY`, or generate it:
```bash
GOOGLE_API_KEY=your_key node generate-config.js
```
Do not commit real keys. `config.js` is git-ignored.

### Run locally
This is a static site. Open `index.html` directly, or serve for better asset loading:
```bash
npx http-server .
```

### Deploy
Works on any static host (Cloudflare Pages, Vercel, GitHub Pages). Example for Cloudflare Pages:
- Build Command: `node generate-config.js`
- Build Output: `.`
- Env: `GOOGLE_API_KEY` (optional; empty falls back to Nominatim)

## Notes
- DMS validation prevents bad coordinates from entering the model.
- Nearest-city display and globe focus both use parsed coordinates for consistency.
- If Globe.gl/Three.js fail to load, the rest of the page continues to work (graceful degradation).

## License
MIT. See `LICENSE`.
