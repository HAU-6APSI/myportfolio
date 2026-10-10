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

document.getElementById('yr').textContent = new Date().getFullYear();
