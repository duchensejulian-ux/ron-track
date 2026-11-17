// RON TRACK — app.
// Todo el arte (Ron, isotipo, wordmark) se importa de la carpeta de marca:
// el logo y las ilustraciones de la app son exactamente los de brand/.
import { mark, C } from '../brand/_source/ron.mjs';
import { wordmark } from '../brand/_source/wordmark.mjs';
import { POSES } from '../brand/_source/poses.mjs';
import { icon } from './icons.js';

/* =====================================================================
   Utilidades
   ===================================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3);
const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = (n) => String(n).padStart(2, '0');
const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromKey = (k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const hm = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
const minutesOf = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const nowMin = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };
const daysBetween = (a, b) => Math.round((fromKey(b) - fromKey(a)) / 864e5);
const DOW = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const DOW1 = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
const fmtDate = (k, opts = { day: 'numeric', month: 'short' }) => new Intl.DateTimeFormat('es', opts).format(fromKey(k));
const fmtNum = (n, d = 1) => new Intl.NumberFormat('es', { maximumFractionDigits: d, minimumFractionDigits: 0 }).format(n);
const relDay = (k) => {
  const n = daysBetween(dayKey(), k);
  if (n === 0) return 'Hoy'; if (n === 1) return 'Mañana'; if (n === -1) return 'Ayer';
  return n > 0 ? `En ${n} días` : `Hace ${-n} días`;
};
const dayLabel = (k) => { const n = daysBetween(dayKey(), k); return n === 0 ? 'Hoy' : n === -1 ? 'Ayer' : fmtDate(k, { weekday: 'long', day: 'numeric', month: 'short' }); };
const ageOf = (birth) => {
  if (!birth) return '—';
  const b = fromKey(birth), n = new Date();
  let m = (n.getFullYear() - b.getFullYear()) * 12 + n.getMonth() - b.getMonth() - (n.getDate() < b.getDate() ? 1 : 0);
  if (m < 0) return '—';
  if (m < 12) return `${m} ${m === 1 ? 'mes' : 'meses'}`;
  const y = Math.floor(m / 12); return `${y} ${y === 1 ? 'año' : 'años'}`;
};
const initials = (name = '') => name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?';

/* =====================================================================
   Arte de marca
   ===================================================================== */
const VB = '1.5 5 154.5 71';
const iso = (cls = '', fill = 'currentColor', tag = C.yellow) => `<svg class="${cls}" viewBox="${VB}" aria-hidden="true">${mark({ fill, tag })}</svg>`;
const wm = (cls = '', color = 'currentColor') => { const w = wordmark({ color }); return `<svg class="${cls}" viewBox="-2 -2 ${(w.width + 4).toFixed(1)} 44" role="img" aria-label="RON TRACK">${w.svg}</svg>`; };
const isDark = () => document.documentElement.dataset.theme === 'dark' || (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
function pose(name, cls = '', dark = isDark()) {
  let s = POSES[name]();
  if (dark) {
    s = s.replaceAll(C.forest, '§F').replaceAll(C.deep, '§D').replaceAll(C.cream, '§E').replaceAll(C.softSage, '§S')
      .replaceAll('§F', '#EDEAE1').replaceAll('§D', '#B9C6B3').replaceAll('§E', '#172C26').replaceAll('§S', 'rgba(168,185,161,.18)');
  }
  return `<svg class="${cls}" viewBox="-50 -30 240 112" role="img" aria-label="Ilustración de Ron">${s}</svg>`;
}

/* =====================================================================
   Estado (se guarda en este dispositivo)
   ===================================================================== */
const KEY = 'rontrack:v1';
const MEMBER_COLORS = ['#203B32', '#5E7C8A', '#8A6A3B', '#4F7A5C', '#7A5E8A', '#B5523B'];
const TYPES = {
  walk: { name: 'Paseo', icon: 'walk' },
  meal: { name: 'Comida', icon: 'bowl' },
  water: { name: 'Agua', icon: 'water' },
  potty: { name: 'Necesidades', icon: 'leaf' },
  meds: { name: 'Medicación', icon: 'pill' },
  play: { name: 'Juego', icon: 'ball' },
  bath: { name: 'Baño', icon: 'bath' },
  training: { name: 'Entrenamiento', icon: 'train' },
  note: { name: 'Nota', icon: 'note' },
};
const HEALTH = {
  vaccine: { name: 'Vacuna', icon: 'syringe' },
  deworm: { name: 'Antiparasitario', icon: 'leaf' },
  meds: { name: 'Medicación', icon: 'pill' },
  vet: { name: 'Veterinario', icon: 'vet' },
};
const REPEAT = [[0, 'No se repite'], [30, 'Cada mes'], [90, 'Cada 3 meses'], [180, 'Cada 6 meses'], [365, 'Cada año']];
const GOALS = {
  walk: 'Paseo diario',
  weight: 'Peso saludable',
  health: 'Salud al día',
  training: 'Entrenamiento',
  routine: 'Rutinas constantes',
};
const DEFAULT_ROUTINES = () => [
  { id: uid(), type: 'walk', title: 'Paseo de la mañana', time: '07:30', minutes: 20, on: true },
  { id: uid(), type: 'meal', title: 'Desayuno', time: '08:00', on: true },
  { id: uid(), type: 'walk', title: 'Paseo corto', time: '13:30', minutes: 10, on: true },
  { id: uid(), type: 'meal', title: 'Cena', time: '19:00', on: true },
  { id: uid(), type: 'walk', title: 'Paseo de la noche', time: '21:00', minutes: 20, on: true },
  { id: uid(), type: 'meds', title: 'Medicación', time: '09:00', on: false },
  { id: uid(), type: 'training', title: 'Entrenamiento', time: '18:00', minutes: 10, on: false },
].map((r) => ({ ...r, days: [0, 1, 2, 3, 4, 5, 6], assignee: null }));
const DEFAULT_TRAINING = () => ['Sentado', 'Quieto', 'Ven', 'Echado', 'Junto', 'Suelta'].map((name) => ({ id: uid(), name, level: 0 }));

const fresh = () => ({
  v: 1, onboarded: false, theme: 'system',
  ron: { name: 'Ron', breed: 'Dachshund', birth: '', sex: '', chip: '', targetKg: null },
  members: [], me: null,
  routines: DEFAULT_ROUTINES(),
  log: [], weights: [], health: [],
  goals: { walkMinutes: 30, selected: ['walk', 'health', 'routine'] },
  training: DEFAULT_TRAINING(),
  liveWalk: null,
  celebrated: {},
});

let state = load();
function load() {
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 1) return { ...fresh(), ...s }; } catch { /* sin almacenamiento */ }
  return fresh();
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* sin almacenamiento */ } }
function commit(fn, { rerender = true } = {}) { fn(state); save(); if (rerender) render(); }
const snapshot = () => JSON.stringify(state);
const restore = (snap) => { state = JSON.parse(snap); save(); render(); };

const member = (id) => state.members.find((m) => m.id === id);
const meName = () => member(state.me)?.name || 'tú';
const avatar = (id, cls = '') => { const m = member(id); return m ? `<span class="av ${cls}" style="background:${m.color}" title="${esc(m.name)}">${esc(initials(m.name))}</span>` : ''; };

/* ---------- consultas */
const today = () => dayKey();
const routinesFor = (k) => { const dow = fromKey(k).getDay(); return state.routines.filter((r) => r.on && r.days.includes(dow)).sort((a, b) => a.time.localeCompare(b.time)); };
const logsOn = (k) => state.log.filter((e) => e.day === k);
const doneEntry = (r, k = today()) => state.log.find((e) => e.routineId === r.id && e.day === k);
const walkMinutesOn = (k) => logsOn(k).filter((e) => e.type === 'walk').reduce((s, e) => s + (e.minutes || 0), 0);
const lastWeight = () => [...state.weights].sort((a, b) => a.date.localeCompare(b.date)).at(-1);
function streak() {
  const goal = state.goals.walkMinutes; let n = 0; let d = new Date();
  if (walkMinutesOn(dayKey(d)) < goal) d = addDays(d, -1);
  while (walkMinutesOn(dayKey(d)) >= goal && n < 999) { n++; d = addDays(d, -1); }
  return n;
}
const healthStatus = (h) => { if (h.done) return 'done'; const n = daysBetween(today(), h.due); return n < 0 ? 'overdue' : n <= 7 ? 'soon' : 'later'; };
const pendingHealth = () => state.health.filter((h) => !h.done).sort((a, b) => a.due.localeCompare(b.due));

/* ---------- registro de actividad */
function addLog(entry, { toastMsg, celebrateCheck = true } = {}) {
  const snap = snapshot();
  const now = new Date();
  const e = { id: uid(), day: dayKey(now), time: hm(now), by: state.me, ...entry };
  // si hay una rutina pendiente del mismo tipo cerca de esta hora, se marca como hecha
  if (!e.routineId && e.day === today() && ['walk', 'meal', 'meds', 'training'].includes(e.type)) {
    const cand = routinesFor(e.day).filter((r) => r.type === e.type && !doneEntry(r, e.day))
      .map((r) => ({ r, d: Math.abs(minutesOf(r.time) - minutesOf(e.time)) })).filter((x) => x.d <= 180).sort((a, b) => a.d - b.d)[0];
    if (cand) e.routineId = cand.r.id;
  }
  commit((s) => s.log.push(e));
  toast(toastMsg || `${TYPES[e.type]?.name || 'Registro'} guardado`, () => restore(snap));
  if (celebrateCheck) maybeCelebrate();
  return e;
}
function maybeCelebrate() {
  const k = today(), rs = routinesFor(k), c = state.celebrated[k] || {};
  if (rs.length && rs.every((r) => doneEntry(r, k)) && !c.all) {
    commit((s) => { s.celebrated[k] = { ...c, all: true }; }, { rerender: false });
    return celebrate('celebrating', 'Día completo', `Todas las rutinas de ${esc(state.ron.name)} están hechas. Buen trabajo en equipo.`);
  }
  if (state.goals.selected.includes('walk') && walkMinutesOn(k) >= state.goals.walkMinutes && !c.walk) {
    commit((s) => { s.celebrated[k] = { ...(s.celebrated[k] || {}), walk: true }; }, { rerender: false });
    celebrate('walking', 'Meta de paseo', `${esc(state.ron.name)} ya caminó ${walkMinutesOn(k)} minutos hoy.`);
  }
}

/* =====================================================================
   Router
   ===================================================================== */
const ROUTES = ['hoy', 'paseos', 'salud', 'familia', 'ron', 'informe'];
let route = null;
const currentRoute = () => { const h = location.hash.replace('#', ''); return ROUTES.includes(h) ? h : 'hoy'; };
window.addEventListener('hashchange', () => render(true));

function render(nav = false) {
  applyTheme();
  const app = $('#app');
  if (!state.onboarded) { app.innerHTML = onboarding(); afterRender(); return; }
  const r = currentRoute();
  const entering = nav || r !== route;
  route = r;
  const views = { hoy: viewHoy, paseos: viewPaseos, salud: viewSalud, familia: viewFamilia, ron: viewRon, informe: viewInforme };
  app.innerHTML = views[r]() + (r === 'informe' ? '' : tabbar(r));
  const scr = $('.screen', app); if (scr && entering) scr.classList.add('enter');
  if (entering) window.scrollTo(0, 0);
  afterRender();
}

function tabbar(r) {
  const t = (id, label, ico) => `<a class="tab" href="#${id}" ${r === id ? 'aria-current="page"' : ''}>${ico}<span>${label}</span></a>`;
  return `<div class="tabbar"><nav aria-label="Secciones">
    ${t('hoy', 'Hoy', icon('home'))}
    ${t('paseos', 'Paseos', icon('walk'))}
    <button class="fab" data-action="quick" aria-label="Registrar algo">${icon('plus')}</button>
    ${t('salud', 'Salud', icon('health'))}
    ${t('ron', esc(state.ron.name), iso('ron-tab'))}
  </nav></div>`;
}

/* =====================================================================
   HOY
   ===================================================================== */
function viewHoy() {
  const k = today(), rs = routinesFor(k), done = rs.filter((r) => doneEntry(r, k)).length;
  const walk = walkMinutesOn(k), goal = state.goals.walkMinutes, hour = new Date().getHours();
  const greet = hour < 12 ? 'Buenos días' : hour < 20 ? 'Buenas tardes' : 'Buenas noches';
  const pending = rs.filter((r) => !doneEntry(r, k));
  const next = pending[0];
  const meals = rs.filter((r) => r.type === 'meal');
  const pct = rs.length ? done / rs.length : 0;
  let title, art;
  if (state.liveWalk) { title = `${esc(state.ron.name)} está de paseo`; art = 'walking'; }
  else if (!rs.length) { title = 'Un día tranquilo'; art = 'resting'; }
  else if (done === rs.length) { title = 'Todo listo por hoy'; art = hour >= 20 ? 'sleeping' : 'celebrating'; }
  else if (done === 0) { title = `Empieza el día de ${esc(state.ron.name)}`; art = 'standing'; }
  else { title = 'Vamos muy bien'; art = 'resting'; }
  const C2 = 2 * Math.PI * 27;
  const health = pendingHealth().filter((h) => daysBetween(k, h.due) <= 14);

  return `<main class="screen">
    <header class="topbar">
      <div><p class="date">${esc(fmtDate(k, { weekday: 'long', day: 'numeric', month: 'long' }))}</p><h1 class="title">${greet}, ${esc(meName())}</h1></div>
      <button class="icon-btn plain" data-action="who" aria-label="Cambiar de persona">${avatar(state.me, 'lg')}</button>
    </header>

    ${liveBanner()}

    <section class="hero" aria-label="Resumen del día">
      <div class="hero-top">
        <div><h2>${title}</h2><p class="sub">${rs.length ? `${done} de ${rs.length} rutinas hechas` : 'No hay rutinas programadas hoy'}</p></div>
        <div class="ring" role="img" aria-label="${Math.round(pct * 100)} % del día completado">
          <svg viewBox="0 0 64 64"><circle class="ring-bg" cx="32" cy="32" r="27" fill="none" stroke-width="6"/><circle class="ring-fg" cx="32" cy="32" r="27" fill="none" stroke-width="6" stroke-linecap="round" stroke-dasharray="${C2}" stroke-dashoffset="${C2 * (1 - pct)}"/></svg>
          <b>${Math.round(pct * 100)}%</b>
        </div>
      </div>
      <div class="hero-art">${pose(art, '', true)}</div>
      <div class="hero-stats">
        <div class="hero-stat"><b>${walk}<small style="font-size:12px;font-weight:600;opacity:.7"> /${goal}</small></b><span>min de paseo</span></div>
        <div class="hero-stat"><b>${meals.filter((r) => doneEntry(r, k)).length}/${meals.length}</b><span>comidas</span></div>
        <div class="hero-stat"><b>${next ? next.time : '—'}</b><span>${next ? esc(next.title) : 'sin pendientes'}</span></div>
      </div>
    </section>

    <div class="quick" role="group" aria-label="Registro rápido">
      <button data-action="${state.liveWalk ? 'finish-walk' : 'start-walk'}"><span class="ico yellow">${icon(state.liveWalk ? 'stop' : 'play')}</span>${state.liveWalk ? 'Terminar' : 'Paseo'}</button>
      <button data-action="log" data-type="meal"><span class="ico">${icon('bowl')}</span>Comida</button>
      <button data-action="log" data-type="water"><span class="ico">${icon('water')}</span>Agua</button>
      <button data-action="log" data-type="potty"><span class="ico">${icon('leaf')}</span>Necesidades</button>
    </div>

    <section class="section">
      <div class="section-head"><h2>Rutinas de hoy</h2><button class="link" data-action="routines">Editar</button></div>
      ${rs.length ? `<div class="list">${rs.map((r) => routineRow(r, k, r === next)).join('')}</div>`
        : emptyState('resting', 'Sin rutinas hoy', 'Crea las rutinas de paseos y comidas para repartirlas en familia.', 'Crear rutina', 'routine-new')}
    </section>

    <section class="section">
      <div class="section-head"><h2>Próximos cuidados</h2><a class="link" href="#salud">Ver salud</a></div>
      ${health.length ? `<div class="list">${health.slice(0, 3).map(healthRow).join('')}</div>`
        : `<div class="card-flat row" style="border:0"><span class="ico">${icon('check')}</span><div class="row-main"><span class="row-title">Todo al día</span><span class="row-sub">Nada pendiente en las próximas dos semanas</span></div><button class="btn sm soft" data-action="health-new">Añadir</button></div>`}
    </section>

    <section class="section">
      <div class="section-head"><h2>Paseos de la semana</h2><a class="link" href="#paseos">Ver todo</a></div>
      <div class="card">${weekChart()}</div>
    </section>
  </main>`;
}

function routineRow(r, k, isNext) {
  const e = doneEntry(r, k);
  const late = !e && k === today() && minutesOf(r.time) + 30 < nowMin();
  const sub = e ? `Hecho por ${esc(member(e.by)?.name || '—')} · ${e.time}${e.minutes ? ` · ${e.minutes} min` : ''}`
    : `${TYPES[r.type].name}${r.minutes ? ` · ${r.minutes} min` : ''}${r.assignee ? ` · ${esc(member(r.assignee)?.name || '')}` : ''}`;
  return `<div class="row tl-item ${e ? 'done' : ''} ${isNext && !late ? 'next-up' : ''}">
    <span class="tl-time">${r.time}${late ? '<small style="color:var(--bad)">tarde</small>' : isNext ? '<small>próximo</small>' : ''}</span>
    <div class="row-main"><span class="row-title">${esc(r.title)}</span><span class="row-sub">${sub}</span></div>
    <button class="check ${e ? 'on' : ''}" data-action="toggle-routine" data-id="${r.id}" aria-pressed="${!!e}" aria-label="${e ? 'Desmarcar' : 'Marcar como hecho'}: ${esc(r.title)}">${icon('check')}</button>
  </div>`;
}

function liveBanner() {
  if (!state.liveWalk) return '';
  return `<div class="live" role="status">
    <span class="pulse" aria-hidden="true"></span>
    <div class="grow"><div class="label" style="color:#203B32;opacity:.7">Paseo en curso · ${esc(member(state.liveWalk.by)?.name || '')}</div><div class="time" data-live-time>${elapsed()}</div></div>
    <button class="btn sm" data-action="finish-walk">${icon('stop')}Terminar</button>
  </div>`;
}
const elapsed = () => { const s = Math.max(0, Math.floor((Date.now() - state.liveWalk.start) / 1000)); return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`; };

function emptyState(art, h, p, cta, action) {
  return `<div class="empty">${pose(art)}<h3>${h}</h3><p>${p}</p>${cta ? `<button class="btn sm" data-action="${action}">${cta}</button>` : ''}</div>`;
}

/* =====================================================================
   Gráficas (una serie: sin leyenda, el título la nombra)
   ===================================================================== */
const roundTopBar = (x, y, w, h, r = 4) => { r = Math.min(r, h, w / 2); return `M${x} ${y + h}V${y + r}Q${x} ${y} ${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h}Z`; };
const niceMax = (v) => { const steps = [10, 15, 20, 30, 45, 60, 90, 120, 180, 240]; return steps.find((s) => s >= v) || Math.ceil(v / 60) * 60; };

function weekChart() {
  const goal = state.goals.walkMinutes, W = 320, H = 150, L = 30, R = 6, T = 10, B = 24;
  const days = [...Array(7)].map((_, i) => { const d = addDays(new Date(), i - 6), k = dayKey(d); return { k, label: DOW[d.getDay()], v: walkMinutesOn(k), today: i === 6 }; });
  const max = niceMax(Math.max(goal * 1.2, ...days.map((d) => d.v)));
  const pw = W - L - R, ph = H - T - B, slot = pw / 7, bw = Math.min(22, slot * 0.5);
  const y = (v) => T + ph - (v / max) * ph;
  const ticks = [0, max / 2, max];
  return `<div class="chart" data-chart>
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Minutos de paseo de los últimos 7 días">
      ${ticks.map((t) => `<line class="gl" x1="${L}" x2="${W - R}" y1="${y(t)}" y2="${y(t)}"/><text class="ax" x="${L - 8}" y="${y(t) + 4}" text-anchor="end">${Math.round(t)}</text>`).join('')}
      ${days.map((d, i) => { const x = L + slot * i + (slot - bw) / 2, h = Math.max(d.v ? 3 : 0, (d.v / max) * ph);
        return `${h ? `<path class="bar ${d.v < goal ? 'under' : ''}" d="${roundTopBar(x, T + ph - h, bw, h)}"/>` : ''}
        <text class="ax ${d.today ? 'today' : ''}" x="${x + bw / 2}" y="${H - 6}" text-anchor="middle">${d.today ? 'Hoy' : d.label}</text>
        <rect class="hit" x="${L + slot * i}" y="${T}" width="${slot}" height="${ph}" data-tip="${esc(dayLabel(d.k))} · <b>${d.v} min</b>" data-tx="${x + bw / 2}" data-ty="${T + ph - h}"/>`; }).join('')}
      <line class="goal" x1="${L}" x2="${W - R}" y1="${y(goal)}" y2="${y(goal)}"/>
    </svg>
    <p class="caption" style="margin-top:6px">Línea amarilla: meta de ${goal} min al día. Barras oscuras: meta cumplida.</p>
  </div>`;
}

function weightChart() {
  const pts = [...state.weights].sort((a, b) => a.date.localeCompare(b.date)).slice(-12);
  if (pts.length < 2) return `<p class="caption">Registra al menos dos pesos para ver la evolución.</p>`;
  const W = 320, H = 140, L = 34, R = 14, T = 14, B = 24;
  const t0 = fromKey(pts[0].date).getTime(), t1 = fromKey(pts.at(-1).date).getTime() || t0 + 1;
  const vals = pts.map((p) => p.kg); let lo = Math.min(...vals), hi = Math.max(...vals);
  const padv = Math.max(0.3, (hi - lo) * 0.25); lo = Math.max(0, lo - padv); hi += padv;
  const x = (k) => L + ((fromKey(k).getTime() - t0) / Math.max(1, t1 - t0)) * (W - L - R);
  const y = (v) => T + (1 - (v - lo) / (hi - lo)) * (H - T - B);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${x(p.date).toFixed(1)} ${y(p.kg).toFixed(1)}`).join('');
  const area = `${line}L${x(pts.at(-1).date)} ${H - B}L${x(pts[0].date)} ${H - B}Z`;
  const ticks = [lo, (lo + hi) / 2, hi];
  return `<div class="chart" data-chart>
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Evolución del peso">
      ${ticks.map((t) => `<line class="gl" x1="${L}" x2="${W - R}" y1="${y(t)}" y2="${y(t)}"/><text class="ax" x="${L - 8}" y="${y(t) + 4}" text-anchor="end">${fmtNum(t)}</text>`).join('')}
      ${state.ron.targetKg ? `<line class="goal" x1="${L}" x2="${W - R}" y1="${y(Math.min(hi, Math.max(lo, state.ron.targetKg)))}" y2="${y(Math.min(hi, Math.max(lo, state.ron.targetKg)))}"/>` : ''}
      <path class="area" d="${area}"/><path class="line" d="${line}"/>
      ${pts.map((p, i) => `<circle class="pt" cx="${x(p.date)}" cy="${y(p.kg)}" r="${i === pts.length - 1 ? 5 : 4}"/>`).join('')}
      <text class="ax" x="${L}" y="${H - 6}">${esc(fmtDate(pts[0].date))}</text>
      <text class="ax" x="${W - R}" y="${H - 6}" text-anchor="end">${esc(fmtDate(pts.at(-1).date))}</text>
      ${pts.map((p, i) => { const a = i ? (x(pts[i - 1].date) + x(p.date)) / 2 : L, b = i < pts.length - 1 ? (x(p.date) + x(pts[i + 1].date)) / 2 : W - R;
        return `<rect class="hit" x="${a}" y="${T}" width="${Math.max(1, b - a)}" height="${H - T - B}" data-tip="${esc(fmtDate(p.date))} · <b>${fmtNum(p.kg)} kg</b>" data-tx="${x(p.date)}" data-ty="${y(p.kg)}"/>`; }).join('')}
    </svg>
    ${state.ron.targetKg ? `<p class="caption" style="margin-top:6px">Línea amarilla: peso objetivo de ${fmtNum(state.ron.targetKg)} kg.</p>` : ''}
  </div>`;
}

function bindCharts() {
  $$('[data-chart]').forEach((box) => {
    const svg = $('svg', box); let tip = null;
    const show = (rect) => {
      const vb = svg.viewBox.baseVal, sx = svg.clientWidth / vb.width, sy = svg.clientHeight / vb.height;
      if (!tip) { tip = document.createElement('div'); tip.className = 'tip'; box.appendChild(tip); }
      tip.innerHTML = rect.dataset.tip;
      tip.style.left = `${Math.min(Math.max(+rect.dataset.tx * sx, 50), svg.clientWidth - 50)}px`;
      tip.style.top = `${+rect.dataset.ty * sy}px`;
    };
    const hide = () => { tip?.remove(); tip = null; };
    $$('.hit', svg).forEach((r) => { r.addEventListener('pointerenter', () => show(r)); r.addEventListener('click', () => show(r)); });
    svg.addEventListener('pointerleave', hide);
  });
}

/* =====================================================================
   PASEOS
   ===================================================================== */
function viewPaseos() {
  const k = today(), walks = state.log.filter((e) => e.type === 'walk').sort((a, b) => (b.day + b.time).localeCompare(a.day + a.time));
  const week = [...Array(7)].reduce((s, _, i) => s + walkMinutesOn(dayKey(addDays(new Date(), -i))), 0);
  const kmWeek = walks.filter((e) => daysBetween(e.day, k) < 7).reduce((s, e) => s + (e.km || 0), 0);
  const groups = {}; walks.slice(0, 30).forEach((e) => (groups[e.day] ||= []).push(e));
  const st = streak();
  return `<main class="screen">
    <header class="topbar"><div><p class="date">Actividad</p><h1 class="title">Paseos</h1></div>
      <button class="icon-btn" data-action="walk-sheet" aria-label="Registrar paseo">${icon('plus')}</button></header>
    ${state.liveWalk ? liveBanner() : `<button class="btn yellow block" data-action="start-walk" style="height:56px;font-size:16px">${icon('play')}Empezar paseo</button>`}
    <div class="stats">
      <div class="stat"><b>${walkMinutesOn(k)}<small>min</small></b><span>Hoy</span></div>
      <div class="stat"><b>${week}<small>min</small></b><span>7 días${kmWeek ? ` · ${fmtNum(kmWeek)} km` : ''}</span></div>
      <div class="stat"><b>${st}<small>${st === 1 ? 'día' : 'días'}</small></b><span>Racha de meta</span></div>
    </div>
    <section class="section"><div class="section-head"><h2>Minutos por día</h2><button class="link" data-action="goal-sheet">Meta: ${state.goals.walkMinutes} min</button></div>
      <div class="card">${weekChart()}</div></section>
    <section class="section"><div class="section-head"><h2>Historial</h2></div>
      ${walks.length ? Object.entries(groups).map(([day, es]) => `<div class="section"><p class="label">${esc(dayLabel(day))} · ${es.reduce((s, e) => s + (e.minutes || 0), 0)} min</p>
        <div class="list">${es.map((e) => `<button class="row" data-action="entry" data-id="${e.id}">
          <span class="ico">${icon('route')}</span>
          <div class="row-main"><span class="row-title">${e.minutes || 0} min${e.km ? ` · ${fmtNum(e.km)} km` : ''}</span><span class="row-sub">${e.time} · ${esc(member(e.by)?.name || '—')}${e.note ? ` · ${esc(e.note)}` : ''}</span></div>
          ${avatar(e.by)}</button>`).join('')}</div></div>`).join('')
        : emptyState('walking', 'Aún no hay paseos', `Empieza un paseo con el cronómetro o registra uno que ya hiciste con ${esc(state.ron.name)}.`, 'Registrar paseo', 'walk-sheet')}
    </section>
  </main>`;
}

/* =====================================================================
   SALUD
   ===================================================================== */
function healthRow(h) {
  const st = healthStatus(h), H = HEALTH[h.kind];
  const pill = st === 'done' ? `<span class="pill good">${icon('check')}Hecho</span>` : st === 'overdue' ? `<span class="pill bad">Atrasado</span>` : st === 'soon' ? `<span class="pill warn">${esc(relDay(h.due))}</span>` : `<span class="pill">${esc(fmtDate(h.due))}</span>`;
  return `<button class="row" data-action="health" data-id="${h.id}">
    <span class="ico ${st === 'overdue' || st === 'soon' ? 'yellow' : ''}">${icon(H.icon)}</span>
    <div class="row-main"><span class="row-title">${esc(h.title)}</span><span class="row-sub">${H.name} · ${st === 'done' ? `hecho ${esc(fmtDate(h.doneAt || h.due))}` : esc(relDay(h.due))}${h.repeat ? ` · ${REPEAT.find((r) => r[0] === h.repeat)[1].toLowerCase()}` : ''}</span></div>
    ${pill}</button>`;
}

function viewSalud() {
  const w = lastWeight(), ws = [...state.weights].sort((a, b) => a.date.localeCompare(b.date));
  const prev = ws.at(-2), diff = w && prev ? w.kg - prev.kg : null;
  const pend = pendingHealth(), overdue = pend.filter((h) => healthStatus(h) === 'overdue');
  const upcoming = pend.filter((h) => healthStatus(h) !== 'overdue');
  const done = state.health.filter((h) => h.done).sort((a, b) => (b.doneAt || '').localeCompare(a.doneAt || '')).slice(0, 5);
  return `<main class="screen">
    <header class="topbar"><div><p class="date">Cuidados</p><h1 class="title">Salud</h1></div>
      <button class="icon-btn" data-action="health-new" aria-label="Añadir recordatorio">${icon('plus')}</button></header>
    <section class="card" style="display:grid;gap:14px">
      <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:12px">
        <div><p class="label">Peso</p><div class="big-num">${w ? fmtNum(w.kg) : '—'}<small>kg</small></div>
          <p class="caption">${w ? `${esc(dayLabel(w.date))}${diff !== null ? ` · <span class="trend">${diff > 0 ? '+' : ''}${fmtNum(diff)} kg</span> desde el anterior` : ''}` : 'Sin registros todavía'}</p></div>
        <button class="btn sm soft" data-action="weight-sheet">${icon('scale')}Registrar</button>
      </div>
      ${weightChart()}
    </section>
    ${overdue.length ? `<section class="section"><div class="section-head"><h2>Atrasados</h2></div><div class="list">${overdue.map(healthRow).join('')}</div></section>` : ''}
    <section class="section"><div class="section-head"><h2>Próximos</h2><button class="link" data-action="health-new">Añadir</button></div>
      ${upcoming.length ? `<div class="list">${upcoming.map(healthRow).join('')}</div>`
        : emptyState('sitting', 'Nada pendiente', 'Añade vacunas, antiparasitarios, medicación o visitas al veterinario y RON TRACK te recordará cuándo toca.', 'Añadir recordatorio', 'health-new')}
    </section>
    ${done.length ? `<section class="section"><div class="section-head"><h2>Historial</h2></div><div class="list">${done.map(healthRow).join('')}</div></section>` : ''}
  </main>`;
}

/* =====================================================================
   FAMILIA
   ===================================================================== */
function viewFamilia() {
  const since = dayKey(addDays(new Date(), -6));
  const feed = [...state.log].sort((a, b) => (b.day + b.time).localeCompare(a.day + a.time)).slice(0, 15);
  return `<main class="screen">
    <header class="topbar"><div><p class="date">Equipo de ${esc(state.ron.name)}</p><h1 class="title">Familia</h1></div>
      <button class="icon-btn" data-action="member-new" aria-label="Añadir persona">${icon('plus')}</button></header>
    <div class="list">${state.members.map((m) => {
      const mine = state.log.filter((e) => e.by === m.id && e.day >= since);
      const walks = mine.filter((e) => e.type === 'walk').length, mins = mine.filter((e) => e.type === 'walk').reduce((s, e) => s + (e.minutes || 0), 0);
      return `<button class="row" data-action="member" data-id="${m.id}">${avatar(m.id, 'lg')}
        <div class="row-main"><span class="row-title">${esc(m.name)} ${m.id === state.me ? '<span class="pill yellow" style="margin-left:4px">Tú</span>' : ''}</span>
        <span class="row-sub">${esc(m.role || 'Familia')} · ${walks} ${walks === 1 ? 'paseo' : 'paseos'} (${mins} min) y ${mine.length - walks} cuidados esta semana</span></div>
        <span class="muted">${icon('chevron', 'style="width:18px;height:18px"')}</span></button>`; }).join('')}</div>
    <section class="section"><div class="section-head"><h2>Reparto de rutinas</h2><button class="link" data-action="routines">Editar</button></div>
      <div class="list">${state.routines.filter((r) => r.on).sort((a, b) => a.time.localeCompare(b.time)).map((r) => `<button class="row" data-action="assign" data-id="${r.id}">
        <span class="ico">${icon(TYPES[r.type].icon)}</span>
        <div class="row-main"><span class="row-title">${esc(r.title)}</span><span class="row-sub">${r.time} · ${r.assignee ? esc(member(r.assignee)?.name || 'Sin asignar') : 'Quien pueda'}</span></div>
        ${r.assignee ? avatar(r.assignee) : `<span class="pill">Asignar</span>`}</button>`).join('')}</div>
    </section>
    <section class="section"><div class="section-head"><h2>Actividad reciente</h2></div>
      ${feed.length ? `<div class="list">${feed.map((e) => `<button class="row" data-action="entry" data-id="${e.id}">${avatar(e.by)}
        <div class="row-main"><span class="row-title">${esc(member(e.by)?.name || 'Alguien')} · ${esc(entryLabel(e))}</span><span class="row-sub">${esc(dayLabel(e.day))} · ${e.time}${e.note ? ` · ${esc(e.note)}` : ''}</span></div>
        <span class="muted">${icon(TYPES[e.type]?.icon || 'note', 'style="width:18px;height:18px"')}</span></button>`).join('')}</div>`
        : emptyState('resting', 'Todavía sin actividad', 'Cada paseo, comida o cuidado que registréis aparecerá aquí, con quién lo hizo.', null)}
    </section>
    <p class="caption" style="text-align:center">Los datos se guardan en este dispositivo. Para cambiar de persona, toca su nombre.</p>
  </main>`;
}
const entryLabel = (e) => {
  const r = e.routineId && state.routines.find((x) => x.id === e.routineId);
  if (e.type === 'walk') return `${r ? r.title : 'Paseo'} · ${e.minutes || 0} min`;
  if (e.type === 'meds' && e.note) return `Medicación: ${e.note}`;
  return r ? r.title : TYPES[e.type]?.name || 'Registro';
};

/* =====================================================================
   RON
   ===================================================================== */
function viewRon() {
  const w = lastWeight(), learned = state.training.filter((t) => t.level >= 3).length;
  const g = state.goals.selected;
  const goalCards = [
    g.includes('walk') && goalRow('walk', `${state.goals.walkMinutes} min de paseo al día`, Math.min(1, walkMinutesOn(today()) / state.goals.walkMinutes), `${walkMinutesOn(today())} de ${state.goals.walkMinutes} min hoy`),
    g.includes('routine') && (() => { const rs = routinesFor(today()); const d = rs.filter((r) => doneEntry(r)).length; return goalRow('calendar', 'Rutinas constantes', rs.length ? d / rs.length : 0, `${d} de ${rs.length} rutinas hoy`); })(),
    g.includes('health') && (() => { const o = pendingHealth().filter((h) => healthStatus(h) === 'overdue').length; return goalRow('health', 'Salud al día', o ? 0 : 1, o ? `${o} ${o === 1 ? 'cuidado atrasado' : 'cuidados atrasados'}` : 'Nada atrasado'); })(),
    g.includes('weight') && goalRow('scale', 'Peso saludable', state.ron.targetKg && w ? Math.max(0, 1 - Math.abs(w.kg - state.ron.targetKg) / state.ron.targetKg * 5) : 0, state.ron.targetKg ? `Objetivo ${fmtNum(state.ron.targetKg)} kg${w ? ` · ahora ${fmtNum(w.kg)} kg` : ''}` : 'Define un peso objetivo en el perfil'),
    g.includes('training') && goalRow('train', 'Entrenamiento', state.training.length ? learned / state.training.length : 0, `${learned} de ${state.training.length} órdenes dominadas`),
  ].filter(Boolean).join('');
  const theme = state.theme;
  return `<main class="screen">
    <header class="topbar"><div><p class="date">Perfil</p><h1 class="title-serif">${esc(state.ron.name)}</h1></div>
      <button class="icon-btn" data-action="ron-edit" aria-label="Editar perfil">${icon('edit')}</button></header>
    <section class="card ron-card">
      <div class="art">${pose('sitting')}</div>
      <div class="kv">
        <div><span>Edad</span><b>${esc(ageOf(state.ron.birth))}</b></div>
        <div><span>Peso</span><b>${w ? `${fmtNum(w.kg)} kg` : '—'}</b></div>
        <div><span>Raza</span><b>${esc(state.ron.breed || '—')}</b></div>
      </div>
    </section>
    <section class="section"><div class="section-head"><h2>Objetivos</h2><button class="link" data-action="goals-sheet">Elegir</button></div>
      ${goalCards ? `<div class="list">${goalCards}</div>` : `<div class="card-flat"><p class="muted">Elige qué objetivos quieres seguir con ${esc(state.ron.name)}.</p></div>`}
    </section>
    <section class="section"><div class="section-head"><h2>Entrenamiento</h2><button class="link" data-action="cmd-new">Añadir orden</button></div>
      <div class="list">${state.training.map((t) => `<button class="row" data-action="train" data-id="${t.id}">
        <span class="ico ${t.level >= 3 ? 'yellow' : ''}">${icon(t.level >= 3 ? 'sparkle' : 'train')}</span>
        <div class="row-main"><span class="row-title">${esc(t.name)}</span><span class="row-sub">${['Sin empezar', 'Aprendiendo', 'Casi lo tiene', 'Dominada'][t.level]}</span></div>
        <span class="lvl" aria-label="Nivel ${t.level} de 3">${[1, 2, 3].map((i) => `<i class="${t.level >= i ? (t.level >= 3 ? 'max' : 'on') : ''}"></i>`).join('')}</span></button>`).join('')}</div>
      <p class="caption">Toca una orden para subir su nivel después de practicar.</p>
    </section>
    <section class="section"><div class="section-head"><h2>Ajustes</h2></div>
      <div class="list">
        <button class="row" data-action="routines"><span class="ico">${icon('calendar')}</span><div class="row-main"><span class="row-title">Rutinas</span><span class="row-sub">${state.routines.filter((r) => r.on).length} activas</span></div><span class="muted">${icon('chevron', 'style="width:18px;height:18px"')}</span></button>
        <a class="row" href="#familia" style="text-decoration:none;color:inherit"><span class="ico">${icon('family')}</span><div class="row-main"><span class="row-title">Familia</span><span class="row-sub">${state.members.length} ${state.members.length === 1 ? 'persona' : 'personas'}</span></div><span class="muted">${icon('chevron', 'style="width:18px;height:18px"')}</span></a>
        <a class="row" href="#informe" style="text-decoration:none;color:inherit"><span class="ico">${icon('report')}</span><div class="row-main"><span class="row-title">Informe de ${esc(state.ron.name)}</span><span class="row-sub">Para imprimir o guardar en PDF</span></div><span class="muted">${icon('chevron', 'style="width:18px;height:18px"')}</span></a>
        <div class="row"><span class="ico">${icon(theme === 'dark' ? 'moon' : theme === 'light' ? 'sun' : 'auto')}</span><div class="row-main"><span class="row-title">Apariencia</span></div>
          <div class="seg" role="group" aria-label="Apariencia" style="width:190px">${[['system', 'Auto'], ['light', 'Claro'], ['dark', 'Oscuro']].map(([v, l]) => `<button data-action="theme" data-v="${v}" class="${theme === v ? 'on' : ''}">${l}</button>`).join('')}</div></div>
        <button class="row" data-action="backup"><span class="ico">${icon('download')}</span><div class="row-main"><span class="row-title">Copia de seguridad</span><span class="row-sub">Exportar o importar los datos</span></div><span class="muted">${icon('chevron', 'style="width:18px;height:18px"')}</span></button>
      </div>
    </section>
    <footer style="display:grid;justify-items:center;gap:8px;padding-top:8px;color:var(--ink)">${wm('ob-wm')}<p class="caption">Every detail of Ron's care, together.</p></footer>
  </main>`;
}
function goalRow(ic, title, pct, sub) {
  const p = Math.round(Math.max(0, Math.min(1, pct)) * 100);
  return `<div class="row"><span class="ico ${p >= 100 ? 'yellow' : ''}">${icon(ic === 'walk' ? 'walk' : ic)}</span>
    <div class="row-main"><span class="row-title">${esc(title)}</span><span class="row-sub">${esc(sub)}</span>
      <span style="display:block;height:5px;border-radius:9px;background:var(--surface-2);margin-top:6px;overflow:hidden"><i style="display:block;height:100%;width:${p}%;background:${p >= 100 ? 'var(--accent)' : 'var(--primary)'};border-radius:9px;transition:width .6s var(--ease)"></i></span></div>
    <span class="num" style="font-weight:700;color:var(--ink);font-size:13px">${p}%</span></div>`;
}

/* =====================================================================
   INFORME (documento exportado)
   ===================================================================== */
function viewInforme() {
  const ws = [...state.weights].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10);
  const since = dayKey(addDays(new Date(), -29));
  const walks = state.log.filter((e) => e.type === 'walk' && e.day >= since);
  const mins = walks.reduce((s, e) => s + (e.minutes || 0), 0);
  const sep = `<div class="sep">${iso('', '#A8B9A1', '#E9D69B')}</div>`;
  return `<main class="report">
    <div class="report-actions"><a class="btn soft sm" href="#ron">${icon('back')}Volver</a><button class="btn sm" data-action="print">${icon('report')}Imprimir o guardar PDF</button></div>
    <header class="report-head"><svg viewBox="0 0 330 72">${'' }<g transform="translate(0 2) scale(.44)">${mark({ fill: '#203B32', tag: '#E9D69B' })}</g><g transform="translate(78 22) scale(.62)">${wordmark({ color: '#203B32' }).svg}</g></svg>
      <div style="text-align:right"><p style="font-family:var(--f-display);font-style:italic;font-size:26px;color:#203B32">Informe de ${esc(state.ron.name)}</p><p style="font-size:12px;color:#666C64">${esc(fmtDate(today(), { day: 'numeric', month: 'long', year: 'numeric' }))}</p></div></header>
    <section><h2 style="font-size:16px;margin-bottom:8px">Perfil</h2><table><tbody>
      <tr><td>Nombre</td><td>${esc(state.ron.name)}</td></tr><tr><td>Raza</td><td>${esc(state.ron.breed || '—')}</td></tr>
      <tr><td>Nacimiento</td><td>${state.ron.birth ? `${esc(fmtDate(state.ron.birth, { day: 'numeric', month: 'long', year: 'numeric' }))} (${esc(ageOf(state.ron.birth))})` : '—'}</td></tr>
      <tr><td>Sexo</td><td>${esc(state.ron.sex || '—')}</td></tr><tr><td>Microchip</td><td>${esc(state.ron.chip || '—')}</td></tr>
      <tr><td>Cuidadores</td><td>${state.members.map((m) => esc(m.name)).join(', ') || '—'}</td></tr></tbody></table></section>
    ${sep}
    <section><h2 style="font-size:16px;margin-bottom:8px">Salud</h2><table><thead><tr><th>Cuidado</th><th>Tipo</th><th>Fecha</th><th>Estado</th></tr></thead><tbody>
      ${state.health.length ? [...state.health].sort((a, b) => a.due.localeCompare(b.due)).map((h) => `<tr><td>${esc(h.title)}</td><td>${HEALTH[h.kind].name}</td><td>${esc(fmtDate(h.done ? h.doneAt || h.due : h.due, { day: 'numeric', month: 'short', year: 'numeric' }))}</td><td>${h.done ? 'Hecho' : healthStatus(h) === 'overdue' ? 'Atrasado' : 'Pendiente'}</td></tr>`).join('') : '<tr><td colspan="4">Sin registros</td></tr>'}
    </tbody></table></section>
    ${sep}
    <section><h2 style="font-size:16px;margin-bottom:8px">Peso</h2><table><thead><tr><th>Fecha</th><th>Peso</th></tr></thead><tbody>
      ${ws.length ? ws.map((w) => `<tr><td>${esc(fmtDate(w.date, { day: 'numeric', month: 'short', year: 'numeric' }))}</td><td>${fmtNum(w.kg)} kg</td></tr>`).join('') : '<tr><td colspan="2">Sin registros</td></tr>'}
    </tbody></table></section>
    ${sep}
    <section><h2 style="font-size:16px;margin-bottom:8px">Actividad de los últimos 30 días</h2>
      <p>${walks.length} paseos · ${mins} minutos en total · ${walks.length ? Math.round(mins / 30) : 0} min de media al día</p></section>
    <footer style="font-size:11px;color:#898E87;display:flex;justify-content:space-between;border-top:1px solid #E6E1D5;padding-top:12px"><span>RON TRACK</span><span>Every detail of Ron's care, together.</span></footer>
  </main>`;
}

/* =====================================================================
   ONBOARDING
   ===================================================================== */
let ob = { step: 0, draft: null };
function obDraft() {
  if (!ob.draft) ob.draft = { ron: { ...state.ron }, weight: '', myName: '', others: [], routines: DEFAULT_ROUTINES(), goals: { ...state.goals, selected: [...state.goals.selected] } };
  return ob.draft;
}
function onboarding() {
  const d = obDraft(), s = ob.step, N = 7;
  const top = s > 0 && s < N - 1 ? `<div class="ob-top"><button class="icon-btn plain" data-action="ob-back" aria-label="Atrás">${icon('back')}</button><span class="ob-progress"><i style="width:${(s / (N - 1)) * 100}%"></i></span><span class="ob-step">${s + 1}/${N}</span></div>` : `<div class="ob-top" style="min-height:44px">${s === 0 ? wm('ob-wm') : ''}</div>`;
  const steps = [
    () => ({ art: 'standing', body: `<h1>Bienvenido a RON TRACK</h1><p>Paseos, comidas, salud y entrenamiento de ${esc(d.ron.name)} en un solo lugar, y en equipo con quienes lo cuidan.</p>`, cta: 'Empezar' }),
    () => ({ art: 'sitting', body: `<h1>Este es ${esc(d.ron.name || 'Ron')}</h1><p>Todo gira a su alrededor: cada paseo, cada comida y cada vacuna quedan en su perfil, con quién lo hizo y cuándo.</p>`, cta: 'Crear su perfil' }),
    () => ({ art: 'resting', body: `<h1>Su perfil</h1><div class="fields">
        <label class="field"><span>Nombre</span><input class="input" id="ob-name" value="${esc(d.ron.name)}" autocomplete="off"></label>
        <label class="field"><span>Raza</span><input class="input" id="ob-breed" value="${esc(d.ron.breed)}"></label>
        <div class="two"><label class="field"><span>Nacimiento</span><input class="input" type="date" id="ob-birth" value="${esc(d.ron.birth)}" max="${today()}"></label>
        <label class="field"><span>Peso (kg)</span><input class="input" id="ob-weight" inputmode="decimal" placeholder="Ej. 8,2" value="${esc(d.weight)}"></label></div>
        <div class="field"><span>Sexo</span><div class="seg" role="group">${['Macho', 'Hembra'].map((v) => `<button data-action="ob-sex" data-v="${v}" class="${d.ron.sex === v ? 'on' : ''}">${v}</button>`).join('')}</div></div>
      </div>`, cta: 'Continuar' }),
    () => ({ art: 'walking', body: `<h1>¿Quién cuida a ${esc(d.ron.name)}?</h1><div class="fields">
        <label class="field"><span>Tu nombre</span><input class="input" id="ob-me" value="${esc(d.myName)}" placeholder="Cómo te llamas" autocomplete="given-name"></label>
        <div class="field"><span>Familia y cuidadores</span>
          ${d.others.map((o, i) => `<div class="member-line"><span class="av" style="background:${MEMBER_COLORS[(i + 1) % MEMBER_COLORS.length]}">${esc(initials(o))}</span><span style="font-weight:600;color:var(--ink)">${esc(o)}</span><button class="icon-btn plain" data-action="ob-del-member" data-i="${i}" aria-label="Quitar a ${esc(o)}">${icon('x')}</button></div>`).join('')}
          <div style="display:flex;gap:8px"><input class="input" id="ob-other" placeholder="Nombre" autocomplete="off"><button class="btn soft" data-action="ob-add-member" aria-label="Añadir persona">${icon('plus')}</button></div>
        </div></div>`, cta: 'Continuar', disabled: false }),
    () => ({ art: null, body: `<h1>Sus rutinas</h1><p>Activa las que ya tenéis. Podrás cambiar horarios y repartirlas después.</p>
        <div class="list">${d.routines.map((r) => `<div class="row rt-pick"><span class="ico">${icon(TYPES[r.type].icon)}</span><span class="row-title" style="white-space:normal">${esc(r.title)}</span>
          <input class="input" type="time" data-rt-time="${r.id}" value="${r.time}" aria-label="Hora de ${esc(r.title)}">
          <button class="switch ${r.on ? 'on' : ''}" data-action="ob-rt" data-id="${r.id}" role="switch" aria-checked="${r.on}" aria-label="${esc(r.title)}"></button></div>`).join('')}</div>`, cta: 'Continuar' }),
    () => ({ art: 'celebrating', body: `<h1>Sus objetivos</h1><p>Elige lo que queréis seguir. Aparecerá en el perfil de ${esc(d.ron.name)}.</p>
        <div class="chips">${Object.entries(GOALS).map(([k, l]) => `<button class="chip ${d.goals.selected.includes(k) ? 'on' : ''}" data-action="ob-goal" data-k="${k}" aria-pressed="${d.goals.selected.includes(k)}">${d.goals.selected.includes(k) ? icon('check') : ''}${l}</button>`).join('')}</div>
        <div class="field"><span>Minutos de paseo al día</span><div class="stepper"><button data-action="ob-walk" data-d="-5" aria-label="Menos">−</button><output>${d.goals.walkMinutes}<small>min</small></output><button data-action="ob-walk" data-d="5" aria-label="Más">+</button></div></div>`, cta: 'Continuar' }),
    () => ({ art: 'celebrating', body: `<h1>Todo listo</h1><p>${esc(d.ron.name)} ya tiene su espacio. Ahora, a cuidarlo juntos.</p>`, cta: 'Ir al inicio' }),
  ];
  const st = steps[s]();
  return `<main class="ob">${top}
    <div class="ob-art">${st.art ? pose(st.art) : ''}</div>
    <div class="ob-body" ${s === 4 ? 'style="align-self:start"' : ''}>${st.body}</div>
    <div class="ob-actions"><button class="btn block" data-action="ob-next">${st.cta}</button>
      ${s === 0 ? `<button class="btn ghost block" data-action="backup">Tengo una copia de seguridad</button>` : ''}</div>
  </main>`;
}
function obCapture() {
  const d = obDraft();
  if ($('#ob-name')) { d.ron.name = $('#ob-name').value.trim() || 'Ron'; d.ron.breed = $('#ob-breed').value.trim(); d.ron.birth = $('#ob-birth').value; d.weight = $('#ob-weight').value.trim(); }
  if ($('#ob-me')) d.myName = $('#ob-me').value.trim();
  $$('[data-rt-time]').forEach((i) => { const r = d.routines.find((x) => x.id === i.dataset.rtTime); if (r && i.value) r.time = i.value; });
}
function obFinish() {
  const d = obDraft();
  const me = { id: uid(), name: d.myName || 'Yo', role: 'Familia', color: MEMBER_COLORS[0] };
  const others = d.others.map((n, i) => ({ id: uid(), name: n, role: 'Familia', color: MEMBER_COLORS[(i + 1) % MEMBER_COLORS.length] }));
  const kg = parseFloat(String(d.weight).replace(',', '.'));
  commit((s) => {
    s.ron = d.ron; s.members = [me, ...others]; s.me = me.id; s.routines = d.routines; s.goals = d.goals;
    if (kg > 0 && kg < 100) s.weights.push({ id: uid(), date: today(), kg });
    s.onboarded = true;
  });
  ob = { step: 0, draft: null };
  location.hash = 'hoy';
}

/* =====================================================================
   Hojas (bottom sheets), toast y celebración
   ===================================================================== */
let sheetCleanup = null;
function openSheet(title, body, onMount) {
  closeSheet(true);
  $('#toast-root').innerHTML = '';
  const root = $('#sheet-root');
  root.innerHTML = `<div class="scrim" data-action="close-sheet"></div>
    <div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(title)}"><span class="grabber" aria-hidden="true"></span>
      <div class="sheet-head"><h3>${title}</h3><button class="icon-btn plain" data-action="close-sheet" aria-label="Cerrar">${icon('x')}</button></div>${body}</div>`;
  const sheet = $('.sheet', root);
  const first = $('input, textarea, select', sheet);
  if (first && !first.matches('[type=date],[type=time]')) setTimeout(() => first.focus({ preventScroll: true }), 300);
  sheetCleanup = onMount?.(sheet) || null;
}
function closeSheet(instant = false) {
  const root = $('#sheet-root'); if (!root.firstChild) return;
  sheetCleanup?.(); sheetCleanup = null;
  if (instant) { root.innerHTML = ''; return; }
  $$('.sheet, .scrim', root).forEach((e) => e.classList.add('closing'));
  setTimeout(() => { root.innerHTML = ''; }, 220);
}
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeSheet(); $('.celebrate')?.remove(); } });

let toastTimer;
function toast(msg, undo) {
  const root = $('#toast-root'); clearTimeout(toastTimer);
  root.innerHTML = `<div class="toast"><span class="dot" aria-hidden="true"></span><span>${esc(msg)}</span>${undo ? '<button data-undo>Deshacer</button>' : ''}</div>`;
  if (undo) $('[data-undo]', root).onclick = () => { undo(); root.innerHTML = ''; };
  toastTimer = setTimeout(() => { const t = $('.toast', root); if (t) { t.classList.add('out'); setTimeout(() => { root.innerHTML = ''; }, 250); } }, 4200);
}

function celebrate(art, title, text) {
  const el = document.createElement('div');
  el.className = 'celebrate'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', title);
  el.innerHTML = `<div class="box"><span class="ringfx" aria-hidden="true"></span>${pose(art, 'pose')}<h2>${esc(title)}</h2><p>${text}</p><button class="btn block" data-close>Seguir</button></div>`;
  el.addEventListener('click', (e) => { if (e.target === el || e.target.closest('[data-close]')) el.remove(); });
  document.body.appendChild(el);
  navigator.vibrate?.(30);
}

/* ---------- hojas concretas */
const memberChips = (sel, attr = 'data-by') => `<div class="chips">${state.members.map((m) => `<button class="chip ${m.id === sel ? 'on' : ''}" ${attr}="${m.id}" type="button"><span class="av" style="width:22px;height:22px;font-size:9px;background:${m.color}">${esc(initials(m.name))}</span>${esc(m.name)}</button>`).join('')}</div>`;
const bindChoice = (sheet, attr, onPick) => $$(`[${attr}]`, sheet).forEach((b) => b.addEventListener('click', () => {
  $$(`[${attr}]`, sheet).forEach((x) => x.classList.toggle('on', x === b)); onPick(b.getAttribute(attr));
}));
const bindStepper = (sheet, sel, getset, step, min, max, fmt = (v) => v) => {
  const out = $(`${sel} output`, sheet);
  $$(`${sel} [data-d]`, sheet).forEach((b) => b.addEventListener('click', () => {
    const v = Math.min(max, Math.max(min, +(getset() + Number(b.dataset.d) * step).toFixed(2))); getset(v); out.firstChild.textContent = fmt(v);
  }));
};

function walkSheet({ minutes = 20, routineId = null, fromLive = false } = {}) {
  let by = fromLive ? state.liveWalk.by : state.me, mins = Math.max(1, minutes);
  openSheet(fromLive ? 'Paseo terminado' : 'Registrar paseo', `
    ${fromLive ? `<div style="display:grid;place-items:center">${pose('walking', '', isDark())}</div>` : ''}
    <div class="field"><span>Duración</span><div class="stepper" id="w-min"><button data-d="-1" aria-label="Menos">−</button><output>${mins}<small>min</small></output><button data-d="1" aria-label="Más">+</button></div></div>
    <div class="two"><label class="field"><span>Distancia (km, opcional)</span><input class="input" id="w-km" inputmode="decimal" placeholder="Ej. 1,5"></label>
      <label class="field"><span>Hora</span><input class="input" type="time" id="w-time" value="${hm(new Date(Date.now() - (fromLive ? 0 : mins * 60000)))}"></label></div>
    <div class="field"><span>¿Quién lo sacó?</span>${memberChips(by)}</div>
    <label class="field"><span>Nota</span><input class="input" id="w-note" placeholder="Ej. Se encontró con otros perros"></label>
    <button class="btn block" id="w-save">${icon('check')}Guardar paseo</button>
    ${fromLive ? `<button class="btn danger block" id="w-discard">Descartar paseo</button>` : ''}`,
  (sheet) => {
    bindStepper(sheet, '#w-min', (v) => (v === undefined ? mins : (mins = v)), 5, 1, 300);
    bindChoice(sheet, 'data-by', (v) => { by = v; });
    $('#w-save', sheet).onclick = () => {
      const km = parseFloat($('#w-km', sheet).value.replace(',', '.'));
      const time = $('#w-time', sheet).value || hm(new Date());
      if (fromLive) commit((s) => { s.liveWalk = null; }, { rerender: false });
      closeSheet();
      addLog({ type: 'walk', minutes: mins, km: km > 0 ? km : undefined, by, time, note: $('#w-note', sheet).value.trim() || undefined, ...(routineId ? { routineId } : {}) }, { toastMsg: `Paseo de ${mins} min guardado` });
    };
    $('#w-discard', sheet)?.addEventListener('click', () => { commit((s) => { s.liveWalk = null; }); closeSheet(); toast('Paseo descartado'); });
  });
}

function quickSheet() {
  const items = [['walk', 'Paseo'], ['meal', 'Comida'], ['water', 'Agua'], ['potty', 'Necesidades'], ['meds', 'Medicación'], ['play', 'Juego'], ['bath', 'Baño'], ['weight', 'Peso'], ['note', 'Nota']];
  openSheet('Registrar', `<div class="sheet-grid">${items.map(([t, l]) => `<button data-action="quick-pick" data-type="${t}"><span class="ico ${t === 'walk' ? 'yellow' : ''}">${icon(t === 'weight' ? 'scale' : TYPES[t].icon)}</span>${l}</button>`).join('')}</div>
    <p class="caption" style="text-align:center">Se registra a nombre de ${esc(meName())}, ahora mismo.</p>`);
}

function textSheet(type) {
  const isMeds = type === 'meds';
  const meds = state.health.filter((h) => h.kind === 'meds' && !h.done).map((h) => h.title);
  openSheet(isMeds ? 'Medicación' : 'Nota', `
    ${isMeds && meds.length ? `<div class="chips">${meds.map((m) => `<button class="chip" data-med="${esc(m)}" type="button">${esc(m)}</button>`).join('')}</div>` : ''}
    <label class="field"><span>${isMeds ? 'Medicamento y dosis' : `¿Qué pasó con ${esc(state.ron.name)}?`}</span>${isMeds ? '<input class="input" id="t-text" placeholder="Ej. Antiinflamatorio, media pastilla">' : '<textarea class="input" id="t-text" placeholder="Escribe una nota"></textarea>'}</label>
    <button class="btn block" id="t-save">${icon('check')}Guardar</button>`, (sheet) => {
    $$('[data-med]', sheet).forEach((b) => b.addEventListener('click', () => { $('#t-text', sheet).value = b.dataset.med; }));
    $('#t-save', sheet).onclick = () => { const v = $('#t-text', sheet).value.trim(); if (!v && !isMeds) return $('#t-text', sheet).focus(); closeSheet(); addLog({ type, note: v || undefined }); };
  });
}

function weightSheet() {
  const w = lastWeight();
  let kg = w ? w.kg : 8;
  openSheet('Registrar peso', `
    <div class="field"><span>Peso</span><div class="stepper" id="kg"><button data-d="-1" aria-label="Menos">−</button><output>${fmtNum(kg)}<small>kg</small></output><button data-d="1" aria-label="Más">+</button></div></div>
    <label class="field"><span>Fecha</span><input class="input" type="date" id="kg-date" value="${today()}" max="${today()}"></label>
    <button class="btn block" id="kg-save">${icon('check')}Guardar peso</button>`, (sheet) => {
    bindStepper(sheet, '#kg', (v) => (v === undefined ? kg : (kg = v)), 0.1, 0.5, 90, (v) => fmtNum(v));
    $('#kg-save', sheet).onclick = () => {
      const date = $('#kg-date', sheet).value || today(), snap = snapshot();
      commit((s) => { s.weights = s.weights.filter((x) => x.date !== date); s.weights.push({ id: uid(), date, kg }); });
      closeSheet(); toast(`Peso guardado: ${fmtNum(kg)} kg`, () => restore(snap));
    };
  });
}

function healthSheet(h) {
  const isNew = !h; h = h || { id: uid(), kind: 'vaccine', title: '', due: dayKey(addDays(new Date(), 7)), repeat: 365, done: false, note: '' };
  let kind = h.kind, repeat = h.repeat;
  openSheet(isNew ? 'Nuevo cuidado' : esc(h.title), `
    <div class="chips">${Object.entries(HEALTH).map(([k, v]) => `<button class="chip ${k === kind ? 'on' : ''}" data-kind="${k}" type="button">${icon(v.icon)}${v.name}</button>`).join('')}</div>
    <label class="field"><span>Nombre</span><input class="input" id="h-title" value="${esc(h.title)}" placeholder="Ej. Vacuna de la rabia"></label>
    <div class="two"><label class="field"><span>${h.done ? 'Fecha' : 'Fecha prevista'}</span><input class="input" type="date" id="h-due" value="${h.due}"></label>
      <label class="field"><span>Repetir</span><select class="input" id="h-rep">${REPEAT.map(([v, l]) => `<option value="${v}" ${v === repeat ? 'selected' : ''}>${l}</option>`).join('')}</select></label></div>
    <label class="field"><span>Notas</span><input class="input" id="h-note" value="${esc(h.note || '')}" placeholder="Clínica, dosis, lote…"></label>
    ${!isNew && !h.done ? `<button class="btn yellow block" id="h-done">${icon('check')}Marcar como hecho hoy</button>` : ''}
    <button class="btn block ${!isNew && !h.done ? 'soft' : ''}" id="h-save">${isNew ? 'Añadir' : 'Guardar cambios'}</button>
    ${!isNew ? `<button class="btn danger block" id="h-del">${icon('trash')}Eliminar</button>` : ''}`, (sheet) => {
    bindChoice(sheet, 'data-kind', (v) => { kind = v; });
    const read = () => ({ ...h, kind, title: $('#h-title', sheet).value.trim() || HEALTH[kind].name, due: $('#h-due', sheet).value || today(), repeat: Number($('#h-rep', sheet).value), note: $('#h-note', sheet).value.trim() });
    $('#h-save', sheet).onclick = () => { const v = read(); commit((s) => { s.health = s.health.filter((x) => x.id !== v.id); s.health.push(v); }); closeSheet(); toast(isNew ? 'Cuidado añadido' : 'Cambios guardados'); };
    $('#h-done', sheet)?.addEventListener('click', () => {
      const v = read(), snap = snapshot();
      commit((s) => {
        s.health = s.health.filter((x) => x.id !== v.id);
        s.health.push({ ...v, done: true, doneAt: today() });
        if (v.repeat) s.health.push({ ...v, id: uid(), done: false, doneAt: undefined, due: dayKey(addDays(new Date(), v.repeat)) });
      });
      closeSheet(); toast(v.repeat ? `Hecho. Próximo: ${fmtDate(dayKey(addDays(new Date(), v.repeat)))}` : 'Marcado como hecho', () => restore(snap));
    });
    $('#h-del', sheet)?.addEventListener('click', () => { const snap = snapshot(); commit((s) => { s.health = s.health.filter((x) => x.id !== h.id); }); closeSheet(); toast('Cuidado eliminado', () => restore(snap)); });
  });
}

function routinesSheet() {
  const rs = [...state.routines].sort((a, b) => a.time.localeCompare(b.time));
  openSheet('Rutinas', `<div class="list">${rs.map((r) => `<div class="row"><span class="ico">${icon(TYPES[r.type].icon)}</span>
      <button class="row-main" data-action="routine-edit" data-id="${r.id}" style="background:none;border:0;padding:0;text-align:left"><span class="row-title">${esc(r.title)}</span><span class="row-sub">${r.time} · ${r.days.length === 7 ? 'Todos los días' : r.days.map((d) => DOW[d]).join(', ')}</span></button>
      <button class="switch ${r.on ? 'on' : ''}" data-action="routine-on" data-id="${r.id}" role="switch" aria-checked="${r.on}" aria-label="${esc(r.title)}"></button></div>`).join('')}</div>
    <button class="btn block soft" data-action="routine-new">${icon('plus')}Nueva rutina</button>`);
}

function routineEditSheet(r) {
  const isNew = !r; r = r ? { ...r, days: [...r.days] } : { id: uid(), type: 'walk', title: '', time: '12:00', minutes: 15, on: true, days: [0, 1, 2, 3, 4, 5, 6], assignee: null };
  openSheet(isNew ? 'Nueva rutina' : 'Editar rutina', `
    <div class="chips">${['walk', 'meal', 'meds', 'play', 'training', 'water', 'bath'].map((t) => `<button class="chip ${t === r.type ? 'on' : ''}" data-rtype="${t}" type="button">${icon(TYPES[t].icon)}${TYPES[t].name}</button>`).join('')}</div>
    <label class="field"><span>Nombre</span><input class="input" id="r-title" value="${esc(r.title)}" placeholder="Ej. Paseo de la tarde"></label>
    <div class="two"><label class="field"><span>Hora</span><input class="input" type="time" id="r-time" value="${r.time}"></label>
      <label class="field"><span>Minutos (opcional)</span><input class="input" id="r-min" inputmode="numeric" value="${r.minutes || ''}"></label></div>
    <div class="field"><span>Días</span><div class="days">${[1, 2, 3, 4, 5, 6, 0].map((d) => `<button type="button" class="${r.days.includes(d) ? 'on' : ''}" data-day="${d}" aria-pressed="${r.days.includes(d)}" aria-label="${DOW[d]}">${DOW1[d]}</button>`).join('')}</div></div>
    <div class="field"><span>Responsable</span><div class="chips"><button class="chip ${!r.assignee ? 'on' : ''}" data-asg="" type="button">Quien pueda</button>${state.members.map((m) => `<button class="chip ${m.id === r.assignee ? 'on' : ''}" data-asg="${m.id}" type="button">${esc(m.name)}</button>`).join('')}</div></div>
    <button class="btn block" id="r-save">${isNew ? 'Crear rutina' : 'Guardar'}</button>
    ${!isNew ? `<button class="btn danger block" id="r-del">${icon('trash')}Eliminar rutina</button>` : ''}`, (sheet) => {
    bindChoice(sheet, 'data-rtype', (v) => { r.type = v; });
    bindChoice(sheet, 'data-asg', (v) => { r.assignee = v || null; });
    $$('[data-day]', sheet).forEach((b) => b.addEventListener('click', () => {
      const d = Number(b.dataset.day); r.days = r.days.includes(d) ? r.days.filter((x) => x !== d) : [...r.days, d];
      b.classList.toggle('on', r.days.includes(d)); b.setAttribute('aria-pressed', r.days.includes(d));
    }));
    $('#r-save', sheet).onclick = () => {
      r.title = $('#r-title', sheet).value.trim() || TYPES[r.type].name; r.time = $('#r-time', sheet).value || r.time;
      const m = parseInt($('#r-min', sheet).value, 10); r.minutes = m > 0 ? m : undefined;
      if (!r.days.length) r.days = [0, 1, 2, 3, 4, 5, 6];
      commit((s) => { s.routines = s.routines.filter((x) => x.id !== r.id); s.routines.push(r); });
      routinesSheet(); toast(isNew ? 'Rutina creada' : 'Rutina guardada');
    };
    $('#r-del', sheet)?.addEventListener('click', () => { const snap = snapshot(); commit((s) => { s.routines = s.routines.filter((x) => x.id !== r.id); }); routinesSheet(); toast('Rutina eliminada', () => restore(snap)); });
  });
}

function memberSheet(m) {
  const isNew = !m; m = m ? { ...m } : { id: uid(), name: '', role: 'Familia', color: MEMBER_COLORS[state.members.length % MEMBER_COLORS.length] };
  const roles = ['Familia', 'Paseador', 'Cuidador', 'Veterinario'];
  openSheet(isNew ? 'Añadir persona' : esc(m.name), `
    <label class="field"><span>Nombre</span><input class="input" id="m-name" value="${esc(m.name)}" placeholder="Nombre"></label>
    <div class="field"><span>Rol</span><div class="chips">${roles.map((r) => `<button class="chip ${r === m.role ? 'on' : ''}" data-role="${r}" type="button">${r}</button>`).join('')}</div></div>
    <div class="field"><span>Color</span><div class="chips">${MEMBER_COLORS.map((c) => `<button class="chip ${c === m.color ? 'on' : ''}" data-color="${c}" type="button" aria-label="Color ${c}" style="width:38px;padding:0;justify-content:center"><span class="av" style="width:22px;height:22px;background:${c}"></span></button>`).join('')}</div></div>
    ${!isNew && m.id !== state.me ? `<button class="btn yellow block" id="m-me">${icon('swap')}Usar la app como ${esc(m.name)}</button>` : ''}
    <button class="btn block ${!isNew && m.id !== state.me ? 'soft' : ''}" id="m-save">${isNew ? 'Añadir' : 'Guardar'}</button>
    ${!isNew && state.members.length > 1 ? `<button class="btn danger block" id="m-del">${icon('trash')}Quitar de la familia</button>` : ''}`, (sheet) => {
    bindChoice(sheet, 'data-role', (v) => { m.role = v; });
    bindChoice(sheet, 'data-color', (v) => { m.color = v; });
    $('#m-save', sheet).onclick = () => {
      m.name = $('#m-name', sheet).value.trim(); if (!m.name) return $('#m-name', sheet).focus();
      commit((s) => { const i = s.members.findIndex((x) => x.id === m.id); if (i >= 0) s.members[i] = m; else s.members.push(m); });
      closeSheet(); toast(isNew ? `${m.name} se unió al equipo de ${state.ron.name}` : 'Cambios guardados');
    };
    $('#m-me', sheet)?.addEventListener('click', () => { commit((s) => { s.me = m.id; }); closeSheet(); toast(`Ahora registras como ${m.name}`); });
    $('#m-del', sheet)?.addEventListener('click', () => {
      const snap = snapshot();
      commit((s) => { s.members = s.members.filter((x) => x.id !== m.id); if (s.me === m.id) s.me = s.members[0].id; s.routines.forEach((r) => { if (r.assignee === m.id) r.assignee = null; }); });
      closeSheet(); toast(`${m.name} ya no está en la familia`, () => restore(snap));
    });
  });
}

function whoSheet() {
  openSheet('¿Quién está usando la app?', `<div class="list">${state.members.map((m) => `<button class="row" data-action="set-me" data-id="${m.id}">${avatar(m.id, 'lg')}<div class="row-main"><span class="row-title">${esc(m.name)}</span><span class="row-sub">${esc(m.role)}</span></div>${m.id === state.me ? `<span class="pill yellow">${icon('check')}Tú</span>` : ''}</button>`).join('')}</div>
    <button class="btn soft block" data-action="member-new">${icon('plus')}Añadir persona</button>`);
}

function entrySheet(e) {
  openSheet(esc(entryLabel(e)), `<div class="card-flat" style="display:grid;gap:4px"><p><b style="color:var(--ink)">${esc(member(e.by)?.name || '—')}</b> · ${esc(dayLabel(e.day))} a las ${e.time}</p>${e.km ? `<p class="muted">${fmtNum(e.km)} km</p>` : ''}${e.note ? `<p class="muted">${esc(e.note)}</p>` : ''}</div>
    <button class="btn danger block" id="e-del">${icon('trash')}Eliminar registro</button>`, (sheet) => {
    $('#e-del', sheet).onclick = () => { const snap = snapshot(); commit((s) => { s.log = s.log.filter((x) => x.id !== e.id); }); closeSheet(); toast('Registro eliminado', () => restore(snap)); };
  });
}

function goalSheet() {
  let mins = state.goals.walkMinutes;
  openSheet('Meta de paseo', `<p class="muted">Los dachshunds adultos suelen necesitar entre 30 y 60 minutos de paseo al día, repartidos en varias salidas. Consulta con tu veterinario lo adecuado para ${esc(state.ron.name)}.</p>
    <div class="stepper" id="g-min"><button data-d="-1" aria-label="Menos">−</button><output>${mins}<small>min</small></output><button data-d="1" aria-label="Más">+</button></div>
    <button class="btn block" id="g-save">Guardar meta</button>`, (sheet) => {
    bindStepper(sheet, '#g-min', (v) => (v === undefined ? mins : (mins = v)), 5, 5, 240);
    $('#g-save', sheet).onclick = () => { commit((s) => { s.goals.walkMinutes = mins; }); closeSheet(); toast(`Meta: ${mins} min al día`); };
  });
}

function goalsSheet() {
  const sel = new Set(state.goals.selected);
  openSheet('Objetivos', `<div class="chips">${Object.entries(GOALS).map(([k, l]) => `<button class="chip ${sel.has(k) ? 'on' : ''}" data-goal="${k}" type="button">${l}</button>`).join('')}</div>
    <button class="btn block" id="gs-save">Guardar</button>`, (sheet) => {
    $$('[data-goal]', sheet).forEach((b) => b.addEventListener('click', () => { const k = b.dataset.goal; sel.has(k) ? sel.delete(k) : sel.add(k); b.classList.toggle('on', sel.has(k)); }));
    $('#gs-save', sheet).onclick = () => { commit((s) => { s.goals.selected = [...sel]; }); closeSheet(); };
  });
}

function ronSheet() {
  const r = state.ron;
  openSheet(`Perfil de ${esc(r.name)}`, `<div class="fields">
    <label class="field"><span>Nombre</span><input class="input" id="p-name" value="${esc(r.name)}"></label>
    <label class="field"><span>Raza</span><input class="input" id="p-breed" value="${esc(r.breed)}"></label>
    <div class="two"><label class="field"><span>Nacimiento</span><input class="input" type="date" id="p-birth" value="${esc(r.birth)}" max="${today()}"></label>
      <label class="field"><span>Peso objetivo (kg)</span><input class="input" id="p-target" inputmode="decimal" value="${r.targetKg ? fmtNum(r.targetKg) : ''}" placeholder="Opcional"></label></div>
    <div class="field"><span>Sexo</span><div class="seg">${['Macho', 'Hembra'].map((v) => `<button type="button" data-sex="${v}" class="${r.sex === v ? 'on' : ''}">${v}</button>`).join('')}</div></div>
    <label class="field"><span>Microchip</span><input class="input" id="p-chip" value="${esc(r.chip)}" inputmode="numeric" placeholder="Opcional"></label>
    </div><button class="btn block" id="p-save">Guardar</button>`, (sheet) => {
    let sex = r.sex; bindChoice(sheet, 'data-sex', (v) => { sex = v; });
    $('#p-save', sheet).onclick = () => {
      const t = parseFloat($('#p-target', sheet).value.replace(',', '.'));
      commit((s) => { s.ron = { ...s.ron, name: $('#p-name', sheet).value.trim() || 'Ron', breed: $('#p-breed', sheet).value.trim(), birth: $('#p-birth', sheet).value, sex, chip: $('#p-chip', sheet).value.trim(), targetKg: t > 0 ? t : null }; });
      closeSheet(); toast('Perfil actualizado');
    };
  });
}

function cmdSheet() {
  openSheet('Nueva orden', `<label class="field"><span>Orden</span><input class="input" id="c-name" placeholder="Ej. Da la pata"></label><button class="btn block" id="c-save">Añadir</button>`, (sheet) => {
    $('#c-save', sheet).onclick = () => { const n = $('#c-name', sheet).value.trim(); if (!n) return $('#c-name', sheet).focus(); commit((s) => s.training.push({ id: uid(), name: n, level: 0 })); closeSheet(); };
  });
}

function backupSheet() {
  openSheet('Copia de seguridad', `<p class="muted">Los datos de RON TRACK se guardan en este dispositivo. Exporta una copia para guardarla o para pasarla a otro teléfono.</p>
    ${state.onboarded ? `<button class="btn block" id="b-exp">${icon('download')}Exportar copia (.json)</button>` : ''}
    <label class="btn soft block" style="cursor:pointer">${icon('upload')}Importar copia<input type="file" id="b-imp" accept="application/json,.json" hidden></label>
    ${state.onboarded ? `<details style="margin-top:4px"><summary class="caption" style="cursor:pointer">Borrar todos los datos</summary>
      <p class="caption" style="margin:8px 0">Se borra todo lo registrado en este dispositivo. No se puede deshacer.</p><button class="btn danger block" id="b-reset">${icon('trash')}Borrar todo y empezar de nuevo</button></details>` : ''}
    <p class="caption" id="b-msg" role="status"></p>`, (sheet) => {
    $('#b-exp', sheet)?.addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `ron-track-${today()}.json`;
      document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    });
    $('#b-imp', sheet).addEventListener('change', (ev) => {
      const f = ev.target.files[0]; if (!f) return;
      const rd = new FileReader();
      rd.onload = () => {
        try { const s = JSON.parse(rd.result); if (s.v !== 1 || !Array.isArray(s.members)) throw 0; state = { ...fresh(), ...s, onboarded: true }; save(); closeSheet(); location.hash = 'hoy'; render(true); toast('Copia importada'); }
        catch { $('#b-msg', sheet).textContent = 'Ese archivo no es una copia de RON TRACK. Elige el .json exportado desde la app.'; }
      };
      rd.readAsText(f);
    });
    $('#b-reset', sheet)?.addEventListener('click', () => { state = fresh(); save(); closeSheet(); ob = { step: 0, draft: null }; render(true); });
  });
}

/* =====================================================================
   Acciones (delegación de eventos)
   ===================================================================== */
const actions = {
  'close-sheet': () => closeSheet(),
  quick: () => quickSheet(),
  'quick-pick': (el) => {
    const t = el.dataset.type; closeSheet(true);
    if (t === 'walk') return walkSheet();
    if (t === 'weight') return weightSheet();
    if (t === 'meds' || t === 'note') return textSheet(t);
    addLog({ type: t });
  },
  log: (el) => addLog({ type: el.dataset.type }),
  'start-walk': () => { commit((s) => { s.liveWalk = { start: Date.now(), by: s.me }; }); toast(`Paseo iniciado. ¡Buen paseo, ${state.ron.name}!`); },
  'finish-walk': () => {
    const mins = Math.max(1, Math.round((Date.now() - state.liveWalk.start) / 60000));
    const k = today(); const r = routinesFor(k).filter((x) => x.type === 'walk' && !doneEntry(x, k))
      .sort((a, b) => Math.abs(minutesOf(a.time) - nowMin()) - Math.abs(minutesOf(b.time) - nowMin()))[0];
    walkSheet({ minutes: mins, routineId: r && Math.abs(minutesOf(r.time) - nowMin()) <= 180 ? r.id : null, fromLive: true });
  },
  'walk-sheet': () => walkSheet(),
  'toggle-routine': (el) => {
    const r = state.routines.find((x) => x.id === el.dataset.id), e = doneEntry(r);
    if (e) { const snap = snapshot(); commit((s) => { s.log = s.log.filter((x) => x.id !== e.id); }); toast(`${r.title}: desmarcado`, () => restore(snap)); return; }
    if (r.type === 'walk') return walkSheet({ minutes: r.minutes || 20, routineId: r.id });
    addLog({ type: r.type, routineId: r.id, minutes: r.minutes }, { toastMsg: `${r.title}: hecho` });
  },
  routines: () => routinesSheet(),
  'routine-new': () => routineEditSheet(),
  'routine-edit': (el) => routineEditSheet(state.routines.find((x) => x.id === el.dataset.id)),
  'routine-on': (el) => { commit((s) => { const r = s.routines.find((x) => x.id === el.dataset.id); r.on = !r.on; }); routinesSheet(); },
  assign: (el) => routineEditSheet(state.routines.find((x) => x.id === el.dataset.id)),
  'health-new': () => healthSheet(),
  health: (el) => healthSheet(state.health.find((x) => x.id === el.dataset.id)),
  'weight-sheet': () => weightSheet(),
  'member-new': () => memberSheet(),
  member: (el) => memberSheet(member(el.dataset.id)),
  who: () => whoSheet(),
  'set-me': (el) => { commit((s) => { s.me = el.dataset.id; }); closeSheet(); toast(`Ahora registras como ${meName()}`); },
  entry: (el) => entrySheet(state.log.find((x) => x.id === el.dataset.id)),
  'goal-sheet': () => goalSheet(),
  'goals-sheet': () => goalsSheet(),
  'ron-edit': () => ronSheet(),
  'cmd-new': () => cmdSheet(),
  train: (el) => {
    let up = null;
    commit((s) => { const t = s.training.find((x) => x.id === el.dataset.id); t.level = (t.level + 1) % 4; up = t; });
    if (up.level === 3) celebrate('celebrating', '¡Orden dominada!', `${esc(state.ron.name)} ya domina «${esc(up.name)}».`);
    else toast(up.level === 0 ? `${up.name}: reiniciada` : `${up.name}: nivel ${up.level} de 3`);
  },
  theme: (el) => commit((s) => { s.theme = el.dataset.v; }),
  backup: () => backupSheet(),
  print: () => window.print(),
  // onboarding
  'ob-next': () => {
    obCapture(); const d = obDraft();
    if (ob.step === 3 && !d.myName) { $('#ob-me').focus(); $('#ob-me').style.borderColor = 'var(--bad)'; return toast('Escribe tu nombre para continuar'); }
    if (ob.step === 6) return obFinish();
    ob.step++; render(); window.scrollTo(0, 0);
  },
  'ob-back': () => { obCapture(); ob.step = Math.max(0, ob.step - 1); render(); },
  'ob-sex': (el) => { obCapture(); obDraft().ron.sex = el.dataset.v; render(); },
  'ob-add-member': () => { obCapture(); const v = $('#ob-other').value.trim(); if (!v) return $('#ob-other').focus(); obDraft().others.push(v); render(); setTimeout(() => $('#ob-other')?.focus(), 0); },
  'ob-del-member': (el) => { obCapture(); obDraft().others.splice(Number(el.dataset.i), 1); render(); },
  'ob-rt': (el) => { obCapture(); const r = obDraft().routines.find((x) => x.id === el.dataset.id); r.on = !r.on; render(); },
  'ob-goal': (el) => { const g = obDraft().goals.selected, k = el.dataset.k; const i = g.indexOf(k); i >= 0 ? g.splice(i, 1) : g.push(k); render(); },
  'ob-walk': (el) => { const g = obDraft().goals; g.walkMinutes = Math.min(240, Math.max(5, g.walkMinutes + Number(el.dataset.d))); render(); },
};

document.addEventListener('click', (ev) => {
  const el = ev.target.closest('[data-action]'); if (!el) return;
  const fn = actions[el.dataset.action]; if (!fn) return;
  ev.preventDefault(); fn(el, ev);
});
document.addEventListener('keydown', (ev) => {
  if (ev.key === 'Enter' && ev.target.id === 'ob-other') { ev.preventDefault(); actions['ob-add-member'](); }
});

/* =====================================================================
   Tema, reloj del paseo, splash y PWA
   ===================================================================== */
function applyTheme() {
  const t = state.theme, root = document.documentElement;
  if (t === 'system') delete root.dataset.theme; else root.dataset.theme = t;
}
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (state.theme === 'system') render(); });

function afterRender() { bindCharts(); }
setInterval(() => {
  if (!state.liveWalk) return;
  $$('[data-live-time]').forEach((el) => { el.textContent = elapsed(); });
}, 1000);
// al volver a la app (otro día, otra hora) se refresca la vista
document.addEventListener('visibilitychange', () => { if (!document.hidden && state.onboarded && !$('#sheet-root').firstChild) render(); });

function splash() {
  if (sessionStorage.getItem('rt-splash')) return;
  try { sessionStorage.setItem('rt-splash', '1'); } catch { /* sin almacenamiento */ }
  const el = document.createElement('div');
  el.className = 'splash'; el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `<div class="splash-in">${iso('s-iso', '#F6F3EB', '#E9D69B')}${wm('s-wm', '#F6F3EB')}<p class="s-tag">Every detail of Ron's care, together.</p></div><span class="s-dots"><i></i><i></i><i></i></span>`;
  document.body.appendChild(el);
  setTimeout(() => { el.classList.add('gone'); setTimeout(() => el.remove(), 500); }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 300 : 1500);
}

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
  navigator.serviceWorker.register('sw.js').catch(() => { /* la app funciona igual sin modo sin conexión */ });
}

try { splash(); } catch { /* sessionStorage bloqueado */ }
render(true);
