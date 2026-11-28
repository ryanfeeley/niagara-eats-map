# Niagara Eats Map

A mobile-first restaurant discovery directory with search, municipality, source and specialty filters, published through GitHub Pages from the root of `main`.

## Listings

`data.json` separates sources (`creators`), venues and documented mentions using stable IDs. Each mention includes an original source URL, publication date when available, source type, sponsorship disclosure status and source review date. Undated pages use `null`; a review date is not a publication date or proof that the business is currently operating.

The latest November 2026 audit contains 153 venues and 229 mentions across all 12 Niagara municipalities. Coverage includes Eating Niagara, Tipsy Theory and Tastes of Niagara, tourism editorial and directories, plus explicitly labeled business/directory listings for Wainfleet and West Lincoln. Historical offers are not reproduced as current deals. An entry is not an endorsement; the 2021 Eating Niagara patio article includes community suggestions.

Addresses are included only when supported by a reviewed source. Current operating status remains unverified. 57 venues have sourced coordinates with `coordinateSource`, `coordinateVerifiedAt` and verification method recorded. Coordinates are venue points from business websites, venue directory records or OpenStreetMap; Google Maps viewport centres are never used as venue coordinates. Only these venues appear as markers. Google Maps search links remain available for every venue. Multi-branch businesses must be kept as separate venues by municipality and verified address when adding future records.

## Local preview and validation

Serve the repository over HTTP (for example `python -m http.server 8000`) and open `http://localhost:8000`. The page loads `data.json` relative to the site URL, including under the GitHub Pages repository path.

Run `node scripts/validate-data.mjs` before publishing. This checks unique IDs, source references, duplicate venues/mentions, municipality names, URLs and date fields, and requires coordinate provenance before plotting new markers.

## Design

The interface follows the compact panels, typography, responsive card grid and theme controls of [DineSafe Nearby](https://dinesafe.ryanfeeley.com/), with a distinct burnt-orange palette and custom burger icon. `styles.css` holds the design tokens and responsive layouts; `burger.svg` is the favicon. The theme switch supports the system preference and persists an explicit light or dark selection locally.

## Location and map

Distance is the default sort. The app requests current location once on page load, using the browser’s permission flow. **Use current location** / **Update location** can retry it. It is held in memory, not sent to a server or saved in local storage. It sorts mapped venues by straight-line distance; venues without coordinates follow. Permission denial, unavailable location and timeouts leave list browsing usable. **Clear location** removes it from the app. The browser may remember its permission independently. Displaying the map requests OpenStreetMap tiles for the viewed area, which can include the location area.

Orange markers represent sourced venues; a blue marker represents the user's location. Filters update markers, **Show on map** opens a venue, and **View listing** returns to its highlighted card. Leaflet 1.9.4 is vendored with its license so map controls do not depend on a CDN; tiles still require network access. Venue coordinate sources are separate from editorial mentions and never imply an endorsement or current operation.

Tastes of Niagara's Facebook profile is in the source directory. Seven historical articles from its own website (which links to the supplied Facebook identity) supply documented mentions with publication dates; Facebook posts were not imported because they were unavailable for direct verification.

The Tangerine Tortoise was added from Tourism St. Catharines coverage and its business website, with a matched address point from OpenStreetMap. The single Nominatim response is cached in `sources/geocoding/tangerine-tortoise.json`; no visitor geocoding requests are made.

## Editorial coverage by genre

The **Most covered by genre** panel counts distinct qualifying editorial outlets per venue. It shows the top three counts in each genre and all ties. `editorialFamily` on a mention identifies the outlet; multiple articles from the same outlet count once. Professional guides, food/travel writers and a chef-selection travel feature qualify. Business listings, tourism promotion, community-quote roundups and customer ratings do not. A count is overall establishment coverage, not a genre-specific review score or an endorsement. Historical coverage remains historical. No complete regional or all-time superlatives are asserted.

`coverageMethodology` in `data.json` records scope, inclusion rules and the 25 additional documents reviewed in this expansion. The audit added 61 previously missing establishments and more sources for existing places. Genre tags allow searching or filtering doughnuts (including the spelling “donuts”), butter tarts, ice cream/gelato, pastries and cuisines. Single-outlet categories are explicitly labeled as limited evidence. Qualification of magazine/blog editorial does not establish that visits were paid for independently; sponsorship remains unknown unless disclosed.

The **Specialty** menu combines cuisine and genre/treat tags into one alphabetized, deduplicated list. A selection matches either the venue’s cuisine or one of its genre tags, and works together with municipality, source and search. Genre comparison links select the corresponding specialty. Lists default to nearest first. Mapped venues appear in ascending straight-line distance, with equal distances and unmapped venues ordered alphabetically. While location is pending, blocked, unavailable or cleared, the list uses alphabetical order and explains how to enable distance sorting. Editorial outlet counts only order the separate genre comparison. The report can be reproduced using `node scripts/coverage-report.mjs`.

The Pelham expansion adds ten Fonthill places from Ashley Wanders' local food guide, plus Grill on Canboro (Fenwick) and Nature’s Corner Bakery and Cafe (Ridgeville), bringing Pelham from two to fourteen listings. Stoke also has Edible Toronto food coverage and a separately labeled PelhamToday business profile. That profile discloses Community Leaders Program support and is excluded from the food-editorial count. Business websites are likewise excluded. Locality tags keep Fonthill, Fenwick and Ridgeville searchable within the Pelham municipality. Stoke and Grill on Canboro have sourced map points; other new venues await verified coordinates.


## Regional location and community audit

The November 28, 2026 update adds 48 map points (9 → 57), using the 2025 Niagara Employment Inventory and a separate check of the business website's address. The latest survey year available at review was 2025; it is historical survey data, not live operating status or a guarantee of entrance-level accuracy. Distance sorting uses these approximate business points. Existing sourced points were retained.

The review queried all 13,724 records for 2025 in WGS84 (`outSR=4326`); it did not import the entire business directory. Unique normalized name/municipality matches and manual aliases produced candidates. Each accepted candidate was reviewed for business identity and street address, including units and branches when applicable. Automatic text matches alone were insufficient: Karma Kameleon's address number conflict, street-type conflicts at AG and Fork You, and a generic Niagara Parks page were held back. Hometown Ice Cream, Itty Bitty Pie Company and Thistle also remain unmapped pending resolution. An unavailable homepage does not establish closure.

The cache at [sources/nei/location-review.json](sources/nei/location-review.json) preserves reviewed inventory records, address evidence URLs, short verification excerpts and accept/hold decisions. Object IDs refer to this dated snapshot and can change in future service refreshes. To repeat the process, query the [inventory service](https://services1.arcgis.com/WxiLK82TWf8W3O3f/arcgis/rest/services/OpenData_Consolidated_NEI_Opendata/FeatureServer/45/query) with `where=Year=2025`, `outSR=4326`, `returnGeometry=true`, `orderByFields=OBJECTID`, and paginate with `resultOffset`/`resultRecordCount`. Resolve all conflicts manually before updating `data.json`; preserve the point's survey year and current address source. Validation cross-checks accepted points against this cache.

Contains information licensed under the [Open Government Licence – Niagara Region](https://niagaraopendata.ca/pages/open-government-license-2-0-niagara-region). Source: [Consolidated Niagara Employment Inventory](https://www.niagaraopendata.ca/dataset/consolidated-nei-opendata), 2025 survey, accessed November 28, 2026. Niagara Region does not endorse this directory.

Reddit suggestions led to five added places: Humble Doughnut Company, Donut Depot & Bakery, It's About Thyme, Taqueria el Cerrito and Spicy Thai. Business sites confirm their addresses. Gigi's Wood Oven Pizza was also researched, but held because a directory reports closure and the delivery listing is unavailable; historical editorial coverage alone does not establish current operation. Only It's About Thyme and Spicy Thai had an accepted inventory point. Reddit mentions have their own source filter and never contribute to editorial outlet counts. Pho Thanh Dat Viet remains a pending lead because branch addresses conflict. Directory Niagara was a useful discovery lead, but no coordinates were copied from it. No verified public Reddit spreadsheet was found in the reviewed threads.
