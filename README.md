# Niagara Eats Map

A mobile-first restaurant discovery directory with search, municipality, source and cuisine filters, published through GitHub Pages from the root of `main`.

## Listings

`data.json` separates sources (`creators`), venues and documented mentions using stable IDs. Each mention includes an original source URL, publication date when available, source type, sponsorship disclosure status and source review date. Undated pages use `null`; a review date is not a publication date or proof that the business is currently operating.

The November 27, 2026 expansion contains 75 venues and 83 mentions across all 12 Niagara municipalities. Coverage includes Eating Niagara, Tipsy Theory and Tastes of Niagara, tourism editorial and directories, plus explicitly labeled business/directory listings for Wainfleet and West Lincoln. Historical offers are not reproduced as current deals. An entry is not an endorsement; the 2021 Eating Niagara patio article includes community suggestions.

Addresses are included only when supported by a reviewed source. Current operating status remains unverified. Seven venues have sourced coordinates with `coordinateSource`, `coordinateVerifiedAt` and verification method recorded. Coordinates are venue points from business websites, venue directory records or OpenStreetMap; Google Maps viewport centres are never used as venue coordinates. Only these venues appear as markers. Google Maps search links remain available for every venue. Multi-branch businesses must be kept as separate venues by municipality and verified address when adding future records.

## Local preview and validation

Serve the repository over HTTP (for example `python -m http.server 8000`) and open `http://localhost:8000`. The page loads `data.json` relative to the site URL, including under the GitHub Pages repository path.

Run `node scripts/validate-data.mjs` before publishing. This checks unique IDs, source references, duplicate venues/mentions, municipality names, URLs and date fields, and requires coordinate provenance before plotting new markers.

## Design

The interface follows the compact panels, typography, responsive card grid and theme controls of [DineSafe Nearby](https://dinesafe.ryanfeeley.com/), with a distinct burnt-orange palette and custom burger icon. `styles.css` holds the design tokens and responsive layouts; `burger.svg` is the favicon. The theme switch supports the system preference and persists an explicit light or dark selection locally.

## Location and map

Current location is requested only after pressing **Use current location**. It is held in memory, not sent to a server or saved in local storage. It sorts mapped venues by straight-line distance; venues without coordinates follow. Permission denial, unavailable location and timeouts leave list browsing usable. **Clear location** removes it from the app. The browser may remember its permission independently. Displaying the map requests OpenStreetMap tiles for the viewed area, which can include the location area.

Orange markers represent sourced venues; a blue marker represents the user's location. Filters update markers, **Show on map** opens a venue, and **View listing** returns to its highlighted card. Leaflet 1.9.4 is vendored with its license so map controls do not depend on a CDN; tiles still require network access. Venue coordinate sources are separate from editorial mentions and never imply an endorsement or current operation.

Tastes of Niagara's Facebook profile is in the source directory. Seven historical articles from its own website (which links to the supplied Facebook identity) supply documented mentions with publication dates; Facebook posts were not imported because they were unavailable for direct verification.

The Tangerine Tortoise was added from Tourism St. Catharines coverage and its business website, with a matched address point from OpenStreetMap. The single Nominatim response is cached in `sources/geocoding/tangerine-tortoise.json`; no visitor geocoding requests are made.
