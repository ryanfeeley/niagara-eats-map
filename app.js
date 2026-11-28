
const themeButtons=document.querySelectorAll('[data-theme-mode]');
function setTheme(mode){if(mode==='system')delete document.documentElement.dataset.theme;else document.documentElement.dataset.theme=mode;themeButtons.forEach(b=>b.setAttribute('aria-pressed',b.dataset.themeMode===mode));try{localStorage.setItem('niagara-theme',mode)}catch{}}
setTheme(document.documentElement.dataset.theme||'system');
themeButtons.forEach(b=>b.addEventListener('click',()=>setTheme(b.dataset.themeMode)));
try {
const response=await fetch('./data.json');
if(!response.ok) throw new Error('Unable to load listings');
const catalog=await response.json();
const creators=catalog.creators;
const data=catalog.venues.map(v=>({...v,mentions:catalog.mentions.filter(m=>m.venueId===v.id).map(m=>({...m,creator:creators.find(c=>c.id===m.creatorId).name}))}));
function editorialOutlets(venue){return new Set(venue.mentions.filter(m=>m.editorialFamily).map(m=>m.editorialFamily));}
const genres=[...new Set(data.flatMap(v=>v.genres||[v.cuisine]))].sort();
function specialtiesFor(venue){return [...new Set([venue.cuisine,...(venue.genres||[])].filter(Boolean))];}
const specialties=[...new Set(data.flatMap(specialtiesFor))].sort();
const towns=['Fort Erie','Grimsby','Lincoln','Niagara Falls','Niagara-on-the-Lake','Pelham','Port Colborne','St. Catharines','Thorold','Wainfleet','Welland','West Lincoln'];
const el=id=>document.getElementById(id);function options(id,values,label){el(id).replaceChildren(new Option(label,''),...values.map(v=>new Option(v,v)))}options('specialty',specialties,'All specialties');options('town',towns,'All municipalities');options('creator',creators.map(c=>c.name),'All sources');
let map,layer,userLayer,view='list',userLocation=null,selectedId=null,locationRequest=0;
function node(tag,txt){const n=document.createElement(tag);n.textContent=txt;return n}function link(txt,url){const a=node('a',txt);a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a}creators.forEach(c=>{const li=node('li','');li.append(c.url?link(c.name,c.url):node('span',c.name),node('small',' · '+c.kind));el('sources').append(li)});

function distanceKm(a,b){const rad=x=>x*Math.PI/180;const lat=rad(b[0]-a[0]),lon=rad(b[1]-a[1]);const h=Math.sin(lat/2)**2+Math.cos(rad(a[0]))*Math.cos(rad(b[0]))*Math.sin(lon/2)**2;return 6371*2*Math.atan2(Math.sqrt(h),Math.sqrt(Math.max(0,1-h)));}
function renderMap(rows){
 if(!window.L){el('map').textContent='Map unavailable. Use the list view.';el('mapNote').textContent='The map library could not load. Restaurant listings are still available.';return;}
 if(!map){map=L.map('map').setView([43.08,-79.25],10);L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);layer=L.layerGroup().addTo(map);userLayer=L.layerGroup().addTo(map);}
 layer.clearLayers();userLayer.clearLayers();const mapped=rows.filter(d=>d.coords);let selectedMarker;
 mapped.forEach(d=>{const popup=node('div','');popup.append(link(d.name,'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(d.name+' '+d.address+' '+d.town)),node('p',d.address+' · '+d.town));const button=node('button','View listing');button.type='button';button.onclick=()=>{selectedId=d.id;setView('list');document.getElementById('venue-'+d.id)?.scrollIntoView({block:'center',behavior:'instant'});};popup.append(button);const marker=L.circleMarker(d.coords,{radius:8,color:'#a34219',fillColor:'#dc713d',fillOpacity:.9,weight:2}).bindPopup(popup).addTo(layer);marker.on('click',()=>{selectedId=d.id;});if(selectedId===d.id)selectedMarker=marker;});
 if(userLocation)L.circleMarker(userLocation,{radius:9,color:'#fff',fillColor:'#2563eb',fillOpacity:1,weight:3}).bindPopup('Your current location').addTo(userLayer);
 map.invalidateSize();const points=mapped.map(d=>d.coords);if(userLocation)points.push(userLocation);
 if(selectedMarker){map.setView(selectedMarker.getLatLng(),15);selectedMarker.openPopup();}else if(points.length)map.fitBounds(L.latLngBounds(points),{padding:[28,28],maxZoom:15});else map.setView([43.08,-79.25],10);
 el('mapNote').textContent=mapped.length+' of '+rows.length+' matching places mapped. '+(rows.length-mapped.length)+' await verified coordinates and remain in the list. Orange markers: venues; blue marker: your location. Map data: OpenStreetMap.';
}
el('locateBtn').onclick=()=>{
 if(!navigator.geolocation){el('locationStatus').textContent='Location is unavailable in this browser. Places are listed alphabetically.';return;}
 const request=++locationRequest;el('locateBtn').disabled=true;el('locationStatus').textContent='Finding your location…';
 navigator.geolocation.getCurrentPosition(position=>{if(request!==locationRequest)return;userLocation=[position.coords.latitude,position.coords.longitude];selectedId=null;el('locateBtn').disabled=false;el('locateBtn').textContent='Update location';el('clearLocationBtn').hidden=false;el('locationStatus').textContent='Mapped places are sorted nearest first. Distances are straight-line estimates. Unmapped places follow. Your location stays in this browser.';render();},error=>{if(request!==locationRequest)return;el('locateBtn').disabled=false;el('locationStatus').textContent=error.code===1?'Location access is blocked. Allow location in your browser settings to sort nearest first. Places are listed alphabetically until then.':error.code===3?'Finding your location timed out. Places are listed alphabetically. Try again to sort nearest first.':'Your location could not be determined. Places are listed alphabetically. Try again to sort nearest first.';},{enableHighAccuracy:false,timeout:10000,maximumAge:60000});
};
el('clearLocationBtn').onclick=()=>{++locationRequest;userLocation=null;selectedId=null;el('locateBtn').disabled=false;el('locateBtn').textContent='Use current location';el('clearLocationBtn').hidden=true;el('locationStatus').textContent='Location cleared. Places are listed alphabetically. Use your location to sort nearest first.';render();};

for(const genre of genres){
 const candidates=data.filter(v=>(v.genres||[]).includes(genre)&&editorialOutlets(v).size>0).sort((a,b)=>editorialOutlets(b).size-editorialOutlets(a).size||a.name.localeCompare(b.name));
 if(!candidates.length)continue;
 const group=node('section','');const label=node('h3',genre);group.append(label);
 const list=node('ul','');const cutoff=candidates[2]?editorialOutlets(candidates[2]).size:0;candidates.filter(v=>editorialOutlets(v).size>=cutoff).forEach(v=>{const li=node('li','');const button=node('button',v.name+' · '+editorialOutlets(v).size+' outlet'+(editorialOutlets(v).size===1?'':'s'));button.type='button';button.onclick=()=>{el('specialty').value=genre;el('search').value='';el('town').value='';el('creator').value='';selectedId=null;setView('list');el('count').scrollIntoView({block:'center'});};li.append(button);list.append(li);});group.append(list);
 if(editorialOutlets(candidates[0]).size===1){const note=node('p','Limited evidence: one editorial outlet per place.');group.append(note);}el('genreGuide').append(group);
}
function compareByDistance(a,b){if(userLocation){const aDistance=a.coords?distanceKm(userLocation,a.coords):Infinity;const bDistance=b.coords?distanceKm(userLocation,b.coords):Infinity;if(aDistance!==bDistance)return aDistance-bDistance;}return a.name.localeCompare(b.name);}
function render(){const q=el('search').value.toLowerCase().trim();const rows=data.filter(d=>(d.name+' '+d.town+' '+(d.locality||'')+' '+d.cuisine+' '+(d.genres||[]).join(' ')+' '+((d.genres||[]).includes('Doughnuts')?'donuts doughnuts':'')).toLowerCase().includes(q)&&(!el('specialty').value||specialtiesFor(d).includes(el('specialty').value))&&(!el('town').value||d.town===el('town').value)&&(!el('creator').value||d.mentions.some(m=>m.creator===el('creator').value))).sort(compareByDistance);el('count').textContent=rows.length+' of '+data.length+' places · '+new Set(rows.map(d=>d.town)).size+' municipalities · '+(userLocation?'Nearest first':'Enable location for nearest first');el('list').replaceChildren();rows.forEach(d=>{
 const card=node('article','');card.className='item';
 const top=node('div','');top.className='item-top';
 const heading=node('div','');heading.className='maincopy';
 const title=node('h3','');const nameLink=link(d.name,'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(d.name+' '+(d.address||'')+' '+d.town+' Ontario'));nameLink.className='establishment-link';nameLink.setAttribute('aria-label',d.name+' — open in Google Maps');
 const arrow=document.createElementNS('http://www.w3.org/2000/svg','svg');arrow.setAttribute('viewBox','0 0 16 16');arrow.setAttribute('class','external-mark');arrow.setAttribute('aria-hidden','true');const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d','M4 12 12 4M5 4h7v7');arrow.append(path);nameLink.append(arrow);title.append(nameLink);heading.append(title);
 const address=node('p',d.address?d.address+' · '+d.town:(d.locality?d.locality+' · '+d.town:d.town));address.className='address';heading.append(address);
 if(userLocation&&d.coords){const distance=node('p',distanceKm(userLocation,d.coords).toFixed(1)+' km away · straight line');distance.className='distance';heading.append(distance);}
 if(d.coords){const show=node('button','Show on map');show.className='show-map';show.type='button';show.onclick=()=>{selectedId=d.id;setView('map')};heading.append(show);}
 card.id='venue-'+d.id;if(selectedId===d.id)card.classList.add('selected');
 const badge=node('span',d.cuisine);badge.className='cuisine';top.append(heading,badge);card.append(top);
 const coverage=node('div','');coverage.className='coverage';
 d.mentions.forEach(m=>{
  const row=node('div','');row.className='mention';
  const date=node('div','');date.className='datebox';
  const when=m.date?new Date(m.date+'T12:00:00Z'):null;
  const dateText=node('strong',when?when.toLocaleDateString('en-CA',{month:'short',day:'numeric',timeZone:'UTC'}):'Undated');
  date.append(dateText,node('span',when?String(when.getUTCFullYear()):'Coverage'));
  const copy=node('div','');copy.className='mention-copy';copy.append(link(m.creator,m.url));
  const type=node('p',m.type);type.className='mention-type';copy.append(type);
  const sponsor=node('p','Sponsorship: '+m.sponsorship.toLowerCase());sponsor.className='sponsorship';copy.append(sponsor);row.append(date,copy);coverage.append(row);
 });card.append(coverage);const outletCount=editorialOutlets(d).size;if(outletCount){const tally=node('p',outletCount+' editorial outlet'+(outletCount===1?'':'s')+' in reviewed sources');tally.className='outlet-count';card.append(tally);}const status=node('p',d.status);status.className='venue-status';card.append(status);el('list').append(card);
});if(!rows.length){const empty=node('p','No matching places. Try clearing a filter.');empty.className='empty';el('list').append(empty)};if(view==='map')renderMap(rows);}

function setView(v){view=v;el('list').hidden=v!=='list';el('map').hidden=v!=='map';el('mapNote').hidden=v!=='map';el('listBtn').setAttribute('aria-pressed',v==='list');el('mapBtn').setAttribute('aria-pressed',v==='map');render()}el('listBtn').onclick=()=>setView('list');el('mapBtn').onclick=()=>setView('map');['search','town','creator','specialty'].forEach(id=>el(id).addEventListener('input',render));render();
// Distance is the default: ask the browser for location once on page load.
el('locateBtn').click();
} catch(error) { document.getElementById('count').textContent='Listings could not load. Please refresh to try again.'; console.error(error); }
