import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const data = JSON.parse(readFileSync(new URL('../data.json', import.meta.url)));
const towns = new Set(['Fort Erie','Grimsby','Lincoln','Niagara Falls','Niagara-on-the-Lake','Pelham','Port Colborne','St. Catharines','Thorold','Wainfleet','Welland','West Lincoln']);
for (const collection of [data.creators, data.venues, data.mentions]) {
  assert.equal(new Set(collection.map(row => row.id)).size, collection.length, 'IDs must be unique');
}
const creators = new Set(data.creators.map(c => c.id));
const venues = new Set(data.venues.map(v => v.id));
const names = new Set();
for (const venue of data.venues) {
  assert(towns.has(venue.town), `Unknown municipality: ${venue.town}`);
  const key = `${venue.name.normalize('NFKD').replace(/[^a-z0-9]/gi, '').toLowerCase()}:${venue.town}`;
  assert(!names.has(key), `Duplicate venue: ${venue.name}`); names.add(key);
  assert(data.mentions.some(m => m.venueId === venue.id), `Missing source: ${venue.name}`);
  assert(venue.status && venue.name && venue.cuisine);
  assert(Array.isArray(venue.genres) && venue.genres.length && new Set(venue.genres).size === venue.genres.length, 'Venues need unique genre tags');
  // Coordinates require a recorded verification source before they can be plotted.
  if (venue.coords !== null) {
    assert(venue.coordinateSource && new URL(venue.coordinateSource).protocol === 'https:');
    assert(venue.coords.length === 2 && venue.coords.every(Number.isFinite));
    assert(venue.coords[0] > 42.8 && venue.coords[0] < 43.4 && venue.coords[1] > -79.9 && venue.coords[1] < -78.9, 'Coordinates must be within Niagara');
    assert(venue.coordinateVerifiedAt && venue.coordinateMethod && venue.address, 'Mapped venues require address and verification details');
  }
}
const mentionKeys = new Set();
for (const mention of data.mentions) {
  assert(venues.has(mention.venueId) && creators.has(mention.creatorId), 'Broken source reference');
  if(mention.editorialFamily) assert(mention.editorialFamily === mention.creatorId, 'Editorial counts must resolve to the original outlet');
  assert.equal(new URL(mention.url).protocol, 'https:');
  assert(mention.type && mention.sponsorship && /^\d{4}-\d{2}-\d{2}$/.test(mention.checkedAt));
  assert(mention.date === null || /^\d{4}-\d{2}-\d{2}$/.test(mention.date));
  const key = `${mention.venueId}:${mention.url}`;
  assert(!mentionKeys.has(key), 'Duplicate mention'); mentionKeys.add(key);
}
console.log(`Validated ${data.venues.length} venues and ${data.mentions.length} source mentions across ${new Set(data.venues.map(v=>v.town)).size} municipalities.`);
if (data.locationMethodology) {
  const audit = JSON.parse(readFileSync(new URL('../sources/nei/location-review.json', import.meta.url)));
  assert.equal(new Set(audit.reviews.map(r=>r.venueId)).size, audit.reviews.length, 'One location review per venue');
  for (const venue of data.venues.filter(v=>v.locationDatasetYear)) {
    const review = audit.reviews.find(r=>r.venueId === venue.id);
    assert.equal(review?.decision, 'accepted', `Inventory point requires manual acceptance: ${venue.name}`);
    const {attributes, geometry} = review.inventoryRecord;
    assert.equal(venue.locationDatasetYear, attributes.Year);
    assert.deepEqual(venue.coords, [geometry.y, geometry.x], 'Keep WGS84 latitude/longitude order');
    assert.equal(venue.addressSource, review.addressSource);
    assert.equal(new URL(venue.addressSource).protocol, 'https:');
    assert(review.addressExcerpts.length && venue.addressVerifiedAt, 'Accepted points require address evidence');
    assert(venue.coordinateSource.includes(`OBJECTID%3D${attributes.OBJECTID}&`));
  }
  assert(data.mentions.filter(m=>m.creatorId==='reddit-community').every(m=>!m.editorialFamily), 'Community suggestions are not critic counts');
  console.log(`Cross-checked ${data.venues.filter(v=>v.locationDatasetYear).length} accepted inventory points against the review cache.`);
}
