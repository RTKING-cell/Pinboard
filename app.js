// Pinboard front-end logic
// Features:
// - Demo event data + local user events
// - Homepage featured events
// - Events listing with filters (q/category/location/date)
// - Event detail page (map, RSVP, share)
// - Post form with image upload (stored locally)
// - Custom glass datepicker and timepicker
// - Mobile glass menu
// - Categories page rendering

(function() {
  // ---------- Helpers ----------
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  // Footer year
  $$('#year').forEach(el => el.textContent = new Date().getFullYear());

  // ---------- Demo + Local Events ----------
  const demoEvents = [
    { id: 'e1', title: 'Sunset Terrace Concert', description: 'Live indie bands under the open sky with artisan food trucks and cozy lights.', date: '2025-09-12', time: '19:00', location: 'Mission Terrace, San Francisco', category: 'Music', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1600&auto=format&fit=crop', host: 'Terrace Live', contact: 'host@terracelive.example', coords: '37.7599,-122.4148' },
    { id: 'e2', title: 'Downtown Night Market', description: 'Street food, local makers, and ambient performances in a festive marketplace.', date: '2025-09-18', time: '18:00', location: 'Downtown, Los Angeles', category: 'Food', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1600&auto=format&fit=crop', host: 'City Markets LA', contact: 'hello@citymarkets.example', coords: '34.0522,-118.2437' },
    { id: 'e3', title: 'Riverside Art Walk', description: 'Open-air gallery with pop-up studios, live painting, and craft workshops.', date: '2025-10-05', time: '11:00', location: 'Riverside Promenade, Portland', category: 'Arts', image: 'https://images.unsplash.com/photo-1500043357865-c6b8827edf39?q=80&w=1600&auto=format&fit=crop', host: 'Portland Creatives', contact: 'contact@pdxcreatives.example', coords: '45.5152,-122.6784' },
    { id: 'e4', title: 'Community Trail Cleanup', description: 'Join neighbors to refresh local trails and enjoy a picnic after.', date: '2025-09-22', time: '09:00', location: 'Greenwood Park, Seattle', category: 'Outdoors', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop', host: 'Friends of Greenwood', contact: 'team@greenwood.example', coords: '47.6062,-122.3321' },
    { id: 'e5', title: 'Makers & Startups Showcase', description: 'Demos from hardware makers and indie apps. Network with founders and designers.', date: '2025-10-12', time: '14:00', location: 'Innovation Hub, Austin', category: 'Tech', image: 'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?q=80&w=1600&auto=format&fit=crop', host: 'ATX Innovates', contact: 'hi@atxinnovates.example', coords: '30.2672,-97.7431' }
  ];

  function loadUserEvents() {
    try { return JSON.parse(localStorage.getItem('userEvents') || '[]'); } catch { return []; }
  }
  function saveUserEvent(evt) {
    const items = loadUserEvents();
    items.push(evt);
    localStorage.setItem('userEvents', JSON.stringify(items));
  }
  function getAllEvents() { return [...demoEvents, ...loadUserEvents()]; }
  function params() { return new URLSearchParams(location.search); }
  function formatDate(iso) { try { return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); } catch { return iso; } }

  // ---------- Cards ----------
  function createEventCard(evt) {
    const card = document.createElement('article');
    card.className = 'event-card';
    card.innerHTML = `
      <img class="event-thumb" src="${evt.image}" alt="${evt.title}">
      <div class="event-content">
        <h3 class="event-title">${evt.title}</h3>
        <div class="event-meta">
          <span class="chip">${evt.category}</span>
          <span>${evt.location}</span>
          <span>•</span>
          <span>${formatDate(evt.date)} ${evt.time}</span>
        </div>
        <p class="event-desc">${evt.description}</p>
        <div class="event-actions">
          <a class="btn btn-gloss" href="./event.html?id=${encodeURIComponent(evt.id)}">See More</a>
        </div>
      </div>`;
    return card;
  }

  // ---------- Pages ----------
  function hydrateIndex() {
    const featured = document.getElementById('featured-grid');
    if (!featured) return;
    const items = getAllEvents().slice(0, 6);
    items.forEach(e => featured.appendChild(createEventCard(e)));
  }

  function hydrateListing() {
    const grid = document.getElementById('events-grid');
    if (!grid) return;
    const form = document.getElementById('filter-form');
    const url = params();
    if (url.get('q')) document.getElementById('search').value = url.get('q');
    if (url.get('category')) document.getElementById('category').value = url.get('category');

    function applyFilters(ev) {
      if (ev) ev.preventDefault();
      const q = (document.getElementById('search')?.value || '').toLowerCase();
      const category = document.getElementById('category')?.value || '';
      const location = document.getElementById('location')?.value.toLowerCase() || '';
      const date = document.getElementById('date')?.value || '';

      const filtered = getAllEvents().filter(e => {
        const matchQ = !q || [e.title, e.description, e.location].some(v => v.toLowerCase().includes(q));
        const matchCat = !category || e.category === category;
        const matchLoc = !location || e.location.toLowerCase().includes(location);
        const matchDate = !date || e.date === date;
        return matchQ && matchCat && matchLoc && matchDate;
      });
      grid.innerHTML = '';
      filtered.forEach(e => grid.appendChild(createEventCard(e)));
    }
    form?.addEventListener('submit', applyFilters);
    form?.addEventListener('reset', () => setTimeout(applyFilters, 0));
    applyFilters();
  }

  function hydrateDetail() {
    const wrap = document.getElementById('event-detail');
    if (!wrap) return;
    const id = new URLSearchParams(location.search).get('id');
    const evt = getAllEvents().find(x => x.id === id) || getAllEvents()[0];
    if (!evt) return;
    document.getElementById('event-title').textContent = evt.title;
    document.getElementById('event-image').src = evt.image;
    document.getElementById('event-description').textContent = evt.description;
    document.getElementById('event-date').textContent = formatDate(evt.date);
    document.getElementById('event-time').textContent = evt.time;
    document.getElementById('event-location').textContent = evt.location;
    document.getElementById('event-category').textContent = evt.category;
    const contact = document.getElementById('event-contact');
    contact.textContent = evt.contact; contact.href = `mailto:${evt.contact}`;
    const [lat, lng] = (evt.coords || '').split(',');
    const q = encodeURIComponent(evt.location);
    const src = lat && lng ? `https://www.google.com/maps?q=${lat},${lng}&hl=en&z=14&output=embed` : `https://www.google.com/maps?q=${q}&hl=en&z=14&output=embed`;
    document.getElementById('map-frame').src = src;

    document.getElementById('rsvp-btn')?.addEventListener('click', () => alert('Thanks for your RSVP! We\'ll notify the host.'));
    document.getElementById('share-btn')?.addEventListener('click', async () => {
      const shareData = { title: evt.title, text: evt.description, url: location.href };
      if (navigator.share) { try { await navigator.share(shareData); } catch {} }
      else { await navigator.clipboard.writeText(location.href); alert('Link copied to clipboard'); }
    });
  }

  function hydratePost() {
    const form = document.getElementById('post-form');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const file = fd.get('image');
      let imageUrl = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop';
      if (file && file instanceof File && file.size > 0) imageUrl = await fileToDataUrl(file);
      const id = 'u_' + Math.random().toString(36).slice(2, 9);
      const evt = { id, title: fd.get('title'), description: fd.get('description'), date: fd.get('date'), time: fd.get('time'), location: fd.get('location'), category: fd.get('category'), image: imageUrl, host: 'Community Host', contact: fd.get('contact'), coords: '' };
      saveUserEvent(evt);
      const btn = form.querySelector('button[type="submit"]'); btn.disabled = true; btn.textContent = 'Posting…';
      setTimeout(() => { location.href = `./event.html?id=${encodeURIComponent(id)}`; }, 600);
    });
  }

  // ---------- File helpers ----------
  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve(String(r.result)); r.onerror = reject; r.readAsDataURL(file); });
  }

  // ---------- Datepicker ----------
  function setupDatepickers() {
    const targets = Array.from(document.querySelectorAll('[data-datepicker]'));
    if (!targets.length) return;
    const overlay = document.createElement('div');
    overlay.className = 'datepicker-overlay';
    overlay.innerHTML = `
      <div class="datepicker glass">
        <div class="datepicker-header">
          <div class="datepicker-title"></div>
          <div class="datepicker-controls">
            <button class="icon-btn" data-prev>‹</button>
            <button class="icon-btn" data-next>›</button>
          </div>
        </div>
        <div class="datepicker-grid">
          ${['Su','Mo','Tu','We','Th','Fr','Sa'].map(d=>`<div class="datepicker-weekday">${d}</div>`).join('')}
        </div>
      </div>`;
    document.body.appendChild(overlay);
    let activeInput = null; let viewDate = new Date();
    function openPicker(input) { activeInput = input; const val = input.value && !isNaN(Date.parse(input.value)) ? new Date(input.value) : new Date(); viewDate = new Date(val.getFullYear(), val.getMonth(), 1); render(); overlay.classList.add('active'); }
    function closePicker() { overlay.classList.remove('active'); activeInput = null; }
    function render() {
      const title = overlay.querySelector('.datepicker-title'); const grid = overlay.querySelector('.datepicker-grid');
      const year = viewDate.getFullYear(); const month = viewDate.getMonth();
      title.textContent = viewDate.toLocaleString(undefined, { month: 'long', year: 'numeric' });
      while (grid.children.length > 7) grid.removeChild(grid.lastChild);
      const start = new Date(year, month, 1); const startDay = start.getDay(); const daysInMonth = new Date(year, month + 1, 0).getDate();
      for (let i = 0; i < startDay; i++) grid.appendChild(document.createElement('div'));
      const today = new Date(); const selectedDate = activeInput && activeInput.value && !isNaN(Date.parse(activeInput.value)) ? new Date(activeInput.value) : null;
      for (let d = 1; d <= daysInMonth; d++) { const cell = document.createElement('button'); cell.type = 'button'; cell.className = 'datepicker-day'; cell.textContent = String(d); const thisDate = new Date(year, month, d); if (sameDay(thisDate, today)) cell.classList.add('is-today'); if (selectedDate && sameDay(thisDate, selectedDate)) cell.classList.add('is-selected'); cell.addEventListener('click', () => { const iso = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`; activeInput.value = iso; activeInput.dispatchEvent(new Event('change', { bubbles: true })); closePicker(); }); grid.appendChild(cell); }
    }
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closePicker(); });
    overlay.querySelector('[data-prev]').addEventListener('click', () => { viewDate.setMonth(viewDate.getMonth()-1); render(); });
    overlay.querySelector('[data-next]').addEventListener('click', () => { viewDate.setMonth(viewDate.getMonth()+1); render(); });
    targets.forEach(input => { input.addEventListener('focus', () => openPicker(input)); input.addEventListener('click', () => openPicker(input)); });
  }

  // ---------- Timepicker ----------
  function setupTimepickers() {
    const targets = Array.from(document.querySelectorAll('[data-timepicker]'));
    if (!targets.length) return;
    const overlay = document.createElement('div');
    overlay.className = 'timepicker-overlay';
    overlay.innerHTML = `
      <div class="timepicker glass">
        <div class="timepicker-header">
          <div class="timepicker-title">Pick a time</div>
          <div class="datepicker-controls"><button class="icon-btn" data-close>✕</button></div>
        </div>
        <div class="timepicker-body">
          <div class="spinner" data-kind="hour"><div class="spinner-display" data-display>12</div><div class="spinner-controls"><button class="icon-btn" data-up>▲</button><button class="icon-btn" data-down>▼</button></div></div>
          <div class="spinner" data-kind="minute"><div class="spinner-display" data-display>00</div><div class="spinner-controls"><button class="icon-btn" data-up>▲</button><button class="icon-btn" data-down>▼</button></div></div>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    let activeInput = null; let hour = 12; let minute = 0;
    function open(input) { activeInput = input; const parts = (input.value || '').split(':'); const h = parseInt(parts[0], 10); const m = parseInt(parts[1], 10); if (!isNaN(h)) hour = Math.max(0, Math.min(23, h)); if (!isNaN(m)) minute = Math.max(0, Math.min(59, m)); render(); overlay.classList.add('active'); }
    function close() { overlay.classList.remove('active'); activeInput = null; }
    function render() { const [hourSpinner, minuteSpinner] = overlay.querySelectorAll('.spinner'); hourSpinner.querySelector('[data-display]').textContent = String(hour).padStart(2, '0'); minuteSpinner.querySelector('[data-display]').textContent = String(minute).padStart(2, '0'); }
    function commit() { if (!activeInput) return; activeInput.value = `${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}`; activeInput.dispatchEvent(new Event('change', { bubbles: true })); close(); }
    overlay.addEventListener('click', (e) => { if (e.target === overlay) commit(); }); overlay.querySelector('[data-close]').addEventListener('click', commit);
    overlay.querySelectorAll('.spinner').forEach(spinner => { const kind = spinner.getAttribute('data-kind'); spinner.querySelector('[data-up]').addEventListener('click', () => { if (kind === 'hour') hour = (hour + 1) % 24; else minute = (minute + 1) % 60; render(); }); spinner.querySelector('[data-down]').addEventListener('click', () => { if (kind === 'hour') hour = (hour + 23) % 24; else minute = (minute + 59) % 60; render(); }); });
    targets.forEach(input => { input.addEventListener('focus', () => open(input)); input.addEventListener('click', () => open(input)); });
  }

  // ---------- Mobile Menu ----------
  function setupMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const overlay = document.getElementById('menu-overlay');
    const panel = document.getElementById('menu-panel');
    if (!toggle || !overlay || !panel) return;
    function open() { overlay.classList.add('active'); panel.hidden = false; panel.setAttribute('aria-hidden', 'false'); toggle.setAttribute('aria-expanded', 'true'); }
    function close() { overlay.classList.remove('active'); panel.hidden = true; panel.setAttribute('aria-hidden', 'true'); toggle.setAttribute('aria-expanded', 'false'); }
    toggle.addEventListener('click', () => { const expanded = toggle.getAttribute('aria-expanded') === 'true'; if (expanded) close(); else open(); });
    overlay.addEventListener('click', close);
    panel.addEventListener('click', (e) => { if (e.target.matches('a')) close(); });
  }

  // ---------- Categories Page ----------
  function hydrateCategories() {
    const wrap = document.getElementById('all-categories');
    if (!wrap) return;
    const cats = ['Music','Food','Arts','Outdoors','Tech'];
    const images = {
      Music: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=400&auto=format&fit=crop',
      Food: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=400&auto=format&fit=crop',
      Arts: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=400&auto=format&fit=crop',
      Outdoors: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=400&auto=format&fit=crop',
      Tech: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop'
    };
    const accents = { Music: 'var(--pastel-pink)', Food: 'var(--pastel-orange)', Arts: 'var(--pastel-yellow)', Outdoors: 'var(--pastel-green)', Tech: 'var(--pastel-coral)' };
    cats.forEach(name => { const a = document.createElement('a'); a.className = 'category-card'; a.href = `./events.html?category=${encodeURIComponent(name)}`; a.style.setProperty('--accent', accents[name]); a.innerHTML = `<img class="category-image" src="${images[name]}" alt="${name}"><div class="category-name">${name}</div>`; wrap.appendChild(a); });
  }

  // Boot
  hydrateIndex();
  hydrateListing();
  hydrateDetail();
  hydratePost();
  setupDatepickers();
  setupTimepickers();
  setupMenu();
  hydrateCategories();
})();

// Utility: compare dates ignoring time
function sameDay(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }


