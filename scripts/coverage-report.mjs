import { readFileSync } from 'node:fs';
const d=JSON.parse(readFileSync(new URL('../data.json',import.meta.url)));
const outlets=v=>new Set(d.mentions.filter(m=>m.venueId===v.id&&m.editorialFamily).map(m=>m.editorialFamily));
console.log('Distinct editorial outlets in selected reviewed sources; not a complete regional ranking. Counts describe venue coverage, not endorsements.\n');
for(const genre of [...new Set(d.venues.flatMap(v=>v.genres))].sort()){
 const rows=d.venues.filter(v=>v.genres.includes(genre)&&outlets(v).size).sort((a,b)=>outlets(b).size-outlets(a).size||a.name.localeCompare(b.name));
 if(!rows.length)continue;
 const cutoff=rows[2]?outlets(rows[2]).size:0;
 console.log(genre+': '+rows.filter(v=>outlets(v).size>=cutoff).map(v=>`${v.name} (${outlets(v).size})`).join('; '));
}
