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

// Chami tabs
const chamiTabs = document.querySelector('[data-gallery="chami"]');
chamiTabs.addEventListener('click', e => {
  const btn = e.target.closest('button[role="tab"]');
  if (!btn) return;
  chamiTabs.querySelectorAll('button').forEach(b => {
    const on = b === btn;
    b.setAttribute('aria-selected', on);
    document.getElementById(b.getAttribute('aria-controls')).hidden = !on;
  });
});

// StudyBuddy tabs
const buddyTabs = document.querySelector('[data-gallery="buddy"]');
const shot = document.getElementById('buddy-shot');
const alts = {
  home: 'StudyBuddy home screen with tasks, deadlines, progress and a study suggestion',
  tasks: 'StudyBuddy tasks page with add task form and assignment list',
  schedule: 'StudyBuddy schedule page with add class and add study session forms',
  profile: 'StudyBuddy profile page with study statistics and settings'
};
buddyTabs.addEventListener('click', e => {
  const btn = e.target.closest('button[data-img]');
  if (!btn) return;
  buddyTabs.querySelectorAll('button').forEach(b => b.setAttribute('aria-selected', b === btn));
  shot.src = `assets/studybuddy/${btn.dataset.img}.jpg`;
  shot.alt = alts[btn.dataset.img];
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
  const targets = document.querySelectorAll('.stats li, .card, .cert, .journey li, .about-copy, .buddy-copy, .shots');
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
