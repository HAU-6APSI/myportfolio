// Theme toggle
const root = document.documentElement;
const toggle = document.getElementById('theme-toggle');
function syncToggle() {
  const dark = root.dataset.theme === 'dark';
  toggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
}
syncToggle();
toggle.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch (e) {}
  syncToggle();
});

// Project data
const GH = 'https://github.com/Matt-CRL/fruit-ripeness-detector';
const DRIVE = 'https://drive.google.com/drive/folders/1tsg6w73jJy9ij_BaFfVcrUIMqYXucoem';
const app = f => `assets/app/${f}.png`;
const sb = f => `assets/studybuddy/${f}.jpg`;

const PROJECTS = {
  chami: {
    title: 'Chami',
    meta: 'Team thesis · Android application',
    about: 'Chami checks fruit ripeness from a photo. You upload an image or use Live Scan with the camera, and an on-device MobileNetV4 model reports unripe, ripe, or overripe with a confidence score. It works offline.',
    note: 'Thesis title: A MobileNetV4-Based Ripeness Classification Application for Carabao Mango, Lakatan Banana, and Red Lady Papaya',
    feats: [
      'Grad-CAM view shows which part of the fruit the model focused on',
      'Shelf-life and storage guidance with each result',
      'Batches and local orders to group saved scans and track deliveries',
      'Guest mode or account, with scan history saved on the device'
    ],
    tags: ['Dart', 'PL/pgSQL', 'Flutter', 'MobileNetV4', 'TensorFlow Lite', 'Drift / SQLite', 'Supabase'],
    links: [['GitHub', GH], ['Download the app', DRIVE]],
    groups: ['Getting started', 'Scan', 'Results', 'Batches and orders'],
    images: [
      [app('splash'), 'Splash screen', 0],
      [app('welcome'), 'Welcome screen: continue as guest, sign in, or create an account', 0],
      [app('onboard1'), 'Walkthrough 1: scan or upload a fruit', 0],
      [app('onboard2'), 'Walkthrough 2: understand the assessment', 0],
      [app('onboard3'), 'Walkthrough 3: organize fruits into batches', 0],
      [app('home'), 'Home screen with the Start scan button', 0],
      [app('profile'), 'Profile screen in guest mode with a dark mode toggle', 0],
      [app('supported'), 'Supported fruits and tips for a clear photo', 1],
      [app('scan-method'), 'Choose a scan method: upload an image or Live Scan', 1],
      [app('upload'), 'Upload one fruit image', 1],
      [app('upload-preview'), 'Selected photo being assessed', 1],
      [app('live-scan'), 'Live Scan: unripe Lakatan banana at 99% confidence', 1],
      [app('result'), 'Assessment result: overripe Carabao mango', 2],
      [app('result-detail'), 'Result details with model version and shelf-life estimate', 2],
      [app('gradcam'), 'Grad-CAM heatmap showing where the model focused', 2],
      [app('not-recognized'), 'Error screen with tips when a fruit is not recognized', 2],
      [app('history'), 'History of saved scans', 2],
      [app('batches'), 'Batches list with search and order filters', 3],
      [app('create-batch'), 'Create a new batch', 3],
      [app('batch-details'), 'Batch details with ripeness summary', 3],
      [app('shelf-life'), 'Shelf-life and storage guidance', 3],
      [app('local-order'), 'Create a local order', 3],
      [app('batch-order'), 'Batch with a pending order marked as completed', 3]
    ]
  },
  studybuddy: {
    title: 'StudyBuddy',
    meta: 'Web application',
    about: 'A web app that helps students keep track of assignments and classes. Add tasks with a subject and due date, filter them by pending, late, or done, build a weekly class schedule, and plan study sessions.',
    note: '',
    feats: [
      'Task list with search and Pending, Late, Done, All filters',
      'Weekly class schedule and study session planner',
      'Home dashboard with deadlines, progress, and a study suggestion',
      'Profile with study statistics and data backup export'
    ],
    tags: ['Web app', 'Vercel'],
    links: [['Live website', 'https://studybuddy-petah2.vercel.app']],
    groups: [],
    images: [
      [sb('home'), 'Home: today\'s tasks, upcoming deadlines, progress, and a study suggestion', 0],
      [sb('tasks'), 'Tasks: add assignments and filter by pending, late, or done', 0],
      [sb('schedule'), 'Schedule: weekly classes and study sessions', 0],
      [sb('profile'), 'Profile: study statistics, settings, and data backup', 0]
    ]
  }
};

// Project dialog
const pd = document.getElementById('project-dialog');
const el = id => document.getElementById(id);
const EXT_ICON = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';
let cur = null, group = 0, idx = 0, list = [];

function visible() {
  return cur.groups.length ? cur.images.filter(i => i[2] === group) : cur.images;
}
function show(i) {
  idx = (i + list.length) % list.length;
  const [src, cap] = list[idx];
  const img = el('pd-img');
  img.src = src;
  img.alt = cap;
  el('pd-cap').textContent = `${idx + 1} of ${list.length}: ${cap}`;
  el('pd-thumbs').querySelectorAll('button').forEach((b, n) => {
    b.setAttribute('aria-current', n === idx);
    if (n === idx) b.scrollIntoView({ block: 'nearest', inline: 'center' });
  });
}
function renderThumbs() {
  list = visible();
  const box = el('pd-thumbs');
  box.textContent = '';
  list.forEach(([src, cap], n) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', cap);
    const im = document.createElement('img');
    im.src = src; im.alt = ''; im.loading = 'lazy';
    b.append(im);
    b.addEventListener('click', () => show(n));
    box.append(b);
  });
  show(0);
}
function renderTabs() {
  const tabs = el('pd-tabs');
  tabs.textContent = '';
  cur.groups.forEach((name, g) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', g === group);
    b.textContent = name;
    b.addEventListener('click', () => {
      group = g;
      tabs.querySelectorAll('button').forEach((t, n) => t.setAttribute('aria-selected', n === g));
      renderThumbs();
    });
    tabs.append(b);
  });
}
function openProject(key) {
  cur = PROJECTS[key];
  group = 0;
  el('pd-title').textContent = cur.title;
  el('pd-meta').textContent = cur.meta;
  el('pd-about').textContent = cur.about;
  const note = el('pd-note');
  note.textContent = cur.note;
  note.hidden = !cur.note;
  const feats = el('pd-feats'); feats.textContent = '';
  cur.feats.forEach(t => { const li = document.createElement('li'); li.textContent = t; feats.append(li); });
  const tags = el('pd-tags'); tags.textContent = '';
  cur.tags.forEach(t => { const li = document.createElement('li'); li.textContent = t; tags.append(li); });
  const links = el('pd-links'); links.textContent = '';
  cur.links.forEach(([label, href], n) => {
    const a = document.createElement('a');
    a.className = n === 0 ? 'btn primary' : 'btn';
    a.href = href; a.target = '_blank'; a.rel = 'noopener';
    a.innerHTML = label + ' ' + EXT_ICON;
    a.style.display = 'inline-flex'; a.style.alignItems = 'center'; a.style.gap = '.5rem';
    links.append(a);
  });
  renderTabs();
  renderThumbs();
  pd.showModal();
  pd.scrollTop = 0;
}
document.querySelectorAll('[data-project]').forEach(b => b.addEventListener('click', () => openProject(b.dataset.project)));
el('pd-close').addEventListener('click', () => pd.close());
el('pd-prev').addEventListener('click', () => show(idx - 1));
el('pd-next').addEventListener('click', () => show(idx + 1));
pd.addEventListener('click', e => { if (e.target === pd) pd.close(); });
pd.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') show(idx - 1);
  if (e.key === 'ArrowRight') show(idx + 1);
});

// Certificate viewer
const dialog = document.getElementById('cert-dialog');
const full = document.getElementById('cert-full');
document.querySelectorAll('.cert-thumb').forEach(b => {
  b.addEventListener('click', () => {
    full.src = b.dataset.full;
    full.alt = b.dataset.alt;
    dialog.showModal();
  });
});
document.getElementById('cert-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });

// Scroll reveal (only when motion is allowed)
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const targets = document.querySelectorAll('.stats li, .card, .cert, .journey li, .about-copy, .proj, .resume-bar, .resume-viewer');
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 4) * 60 + 'ms';
    io.observe(el);
  });
}

document.getElementById('yr').textContent = new Date().getFullYear();

// Left menu, views, and contact dialog
const html = document.documentElement;
const menuBtn = document.getElementById('menu-toggle');
const sideLinks = document.querySelectorAll('#side-nav a');
const wide = matchMedia('(min-width: 1100px)');
const VIEWS = { home: 'home', projects: 'home', skills: 'skills', certifications: 'certifications', resume: 'resume', about: 'about' };

function setMenu(open) {
  if (open) html.dataset.menu = 'open'; else delete html.dataset.menu;
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
menuBtn.addEventListener('click', () => setMenu(html.dataset.menu !== 'open'));
document.getElementById('scrim').addEventListener('click', () => setMenu(false));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && html.dataset.menu === 'open' && !document.querySelector('dialog[open]')) {
    setMenu(false);
    menuBtn.focus();
  }
});

function route() {
  const key = (location.hash || '#home').slice(1);
  html.dataset.view = VIEWS[key] || 'home';
  sideLinks.forEach(a => {
    if (a.dataset.key === (VIEWS[key] ? key : 'home')) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  if (key === 'projects') {
    requestAnimationFrame(() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' }));
  } else {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}
window.addEventListener('hashchange', route);
sideLinks.forEach(a => a.addEventListener('click', () => {
  if (!wide.matches) setMenu(false);
  // Re-clicking the current link should still scroll
  if (a.getAttribute('href') === (location.hash || '#home')) route();
}));
route();

const cd = document.getElementById('contact-dialog');
document.getElementById('contact-open').addEventListener('click', () => cd.showModal());
document.getElementById('cd-close').addEventListener('click', () => cd.close());
cd.addEventListener('click', e => { if (e.target === cd) cd.close(); });
