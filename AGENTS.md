# Niagara Eats Map

Build a mobile-first restaurant discovery directory and synchronized map covering all 12 Niagara municipalities.

## Next steps
1. Migrate the static prototype to React, TypeScript, Vite and Tailwind. Preserve accessible list browsing and filters.
2. Separate creators, venues and mentions into structured JSON with stable IDs. Deduplicate venues by normalized name and verified address.
3. Research public creator websites and accessible individual posts; seed only documented mentions with original URLs and dates. Do not infer endorsements from coverage. Track unknown sponsorship explicitly.
4. Verify current venue status, addresses and coordinates before plotting. Never invent coordinates. Respect geocoding provider usage limits and cache results.
5. Implement clustered map markers, selected venue synchronization, source filters, date sorting, and map/list responsive layouts.
6. Build a manual import/review workflow for Instagram post URLs. Do not bypass login, rate limits or platform restrictions.
7. Add automated data validation, responsive UI tests and build checks. Prepare Cloudflare Pages deployment; consider D1 only when editing or ingestion requires persistence.

Initial creators: Tastes of Niagara, Niagara Eats, Eating Niagara, Niagara Noms, Tipsy Theory, Restaurants of Niagara, MMAD Hungry. Verify account identity before attributing posts. Additional editorial sources must be clearly labeled.

Existing entries are historical coverage, not verified current operating businesses. The Eating Niagara patio article quotes community members rather than necessarily expressing the author's own recommendations. Do not count these as personal endorsements.
