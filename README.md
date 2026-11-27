# Niagara Eats Map

A mobile-first restaurant discovery directory with search, municipality, source and cuisine filters, published through GitHub Pages from the root of `main`.

## Listings

`data.json` separates sources (`creators`), venues and documented mentions using stable IDs. Each mention includes an original source URL, publication date when available, source type, sponsorship disclosure status and source review date. Undated pages use `null`; a review date is not a publication date or proof that the business is currently operating.

The November 27, 2026 expansion contains 68 venues and 74 mentions across all 12 Niagara municipalities. Coverage includes Eating Niagara and Tipsy Theory, tourism editorial and directories, plus explicitly labeled business/directory listings for Wainfleet and West Lincoln. Historical offers are not reproduced as current deals. An entry is not an endorsement; the 2021 Eating Niagara patio article includes community suggestions.

Addresses are included only when supported by a reviewed source. Current operating status and coordinates remain unverified. No markers are plotted without verified coordinates. Google Maps search links remain available for every venue. Multi-branch businesses must be kept as separate venues by municipality and verified address when adding future records.

## Local preview and validation

Serve the repository over HTTP (for example `python -m http.server 8000`) and open `http://localhost:8000`. The page loads `data.json` relative to the site URL, including under the GitHub Pages repository path.

Run `node scripts/validate-data.mjs` before publishing. This checks unique IDs, source references, duplicate venues/mentions, municipality names, URLs and date fields, and requires coordinate provenance before plotting new markers.
