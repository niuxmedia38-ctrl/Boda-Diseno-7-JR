const gate = document.querySelector('#portada');
const envelope = document.querySelector('#envelope');
const poster = document.querySelector('#invitacion');
const openButtons = [document.querySelector('#openInvitation'), document.querySelector('#openCopy')];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

function openInvitation() {
  if (envelope.classList.contains('open')) return;
  envelope.classList.add('open');
  const delay = reducedMotion ? 0 : 1450;
  setTimeout(() => {
    gate.classList.add('is-gone');
    gate.setAttribute('aria-hidden', 'true');
    poster.setAttribute('aria-hidden', 'false');
    document.body.classList.remove('is-locked');
    document.querySelector('.hero .reveal')?.classList.add('is-visible');
    document.querySelector('#invitacion').focus?.({preventScroll:true});
  }, delay);
}

openButtons.forEach(button => button.addEventListener('click', openInvitation));
gate.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') openInvitation();
});

// Vista limpia para revisión local automatizada; no afecta la experiencia normal.
if (new URLSearchParams(location.search).has('preview')) {
  gate.classList.add('is-gone');
  gate.setAttribute('aria-hidden', 'true');
  poster.setAttribute('aria-hidden', 'false');
  document.body.classList.remove('is-locked');
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, {threshold: .14, rootMargin: '0px 0px -5%'});
document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

const weddingDate = new Date('2027-08-28T17:00:00-06:00');
function updateCountdown() {
  const remaining = Math.max(0, weddingDate - new Date());
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  document.querySelector('#days').textContent = String(days).padStart(3, '0');
  document.querySelector('#hours').textContent = String(hours).padStart(2, '0');
  document.querySelector('#minutes').textContent = String(minutes).padStart(2, '0');
  document.querySelector('#seconds').textContent = String(seconds).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

document.querySelector('#rsvpForm').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const message = `Hola, soy ${data.get('name')}. ${data.get('attendance')} a la boda de Eldar y Elmira.`;
  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
});

document.querySelector('#addCalendar').addEventListener('click', () => {
  const ics = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Invitacion//Boda//ES','BEGIN:VEVENT','UID:boda-eldar-elmira-20270828@example.local','DTSTAMP:20260921T120000Z','DTSTART:20270828T230000Z','DTEND:20270829T060000Z','SUMMARY:Boda de Eldar y Elmira','DESCRIPTION:Celebración de boda. Ubicación por confirmar.','LOCATION:Ubicación por confirmar','END:VEVENT','END:VCALENDAR'].join('\r\n');
  const url = URL.createObjectURL(new Blob([ics], {type:'text/calendar'}));
  const link = Object.assign(document.createElement('a'), {href:url, download:'boda-eldar-elmira.ics'});
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
