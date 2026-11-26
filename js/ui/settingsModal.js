// Settings, Exercise How-To Guide, and iOS PWA Install modal
import { DEFAULT_WEEKLY_SCHEDULE, ORDERED_WEEKDAYS, PLAN_META } from '../data/plans.js';
import { EXERCISE_CATEGORIES, EXERCISE_GUIDE } from '../data/exercises.js';
import { saveState } from '../core/storage.js';
import { createChevronSvg } from './dom.js';

const FALLBACK_MANIFEST_JSON = JSON.stringify(
  {
    name: 'Climb Check-In',
    short_name: 'Climb',
    description: 'Minimalist ADHD-friendly, gout-safe bouldering and mobility check-in',
    start_url: './',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0b0b0c',
    theme_color: '#0b0b0c',
    icons: [
      {
        src: './icons/app-icon.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any maskable'
      }
    ]
  },
  null,
  2
);

const CATEGORY_LABEL_MAP = Object.fromEntries(EXERCISE_CATEGORIES.map((c) => [c.key, c.label]));

async function getManifestText() {
  try {
    const res = await fetch('./manifest.json');
    if (res.ok) return await res.text();
  } catch (err) {
    // Fallback below
  }
  return FALLBACK_MANIFEST_JSON;
}

export function createSettingsModal({ els, appState, onScheduleUpdated }) {
  let activeExerciseCategory = 'all';
  let exerciseSearchQuery = '';
  const expandedExerciseIds = new Set();

  function setModalTab(tabName) {
    const tabs = [
      { key: 'schedule', btn: els.tabScheduleBtn, panel: els.tabSchedulePanel },
      { key: 'exercises', btn: els.tabExercisesBtn, panel: els.tabExercisesPanel },
      { key: 'install', btn: els.tabInstallBtn, panel: els.tabInstallPanel }
    ];

    tabs.forEach(({ key, btn, panel }) => {
      const active = key === tabName;
      panel.classList.toggle('hidden', !active);
      btn.setAttribute('aria-selected', String(active));
      btn.className = active
        ? 'min-h-[36px] rounded-md text-xs font-semibold bg-zinc-800 text-ink border border-zinc-600/80 transition'
        : 'min-h-[36px] rounded-md text-xs font-medium text-muted hover:text-ink border border-transparent transition';
    });

    if (els.helpModalScrollArea) {
      els.helpModalScrollArea.scrollTop = 0;
    }
  }

  // ---- Tab 1: Default Weekly Schedule ----
  function renderWeeklyScheduleEditor() {
    els.weeklyScheduleList.innerHTML = '';

    ORDERED_WEEKDAYS.forEach(({ idx, name }) => {
      const row = document.createElement('div');
      row.className = 'flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-bg border border-border';

      const label = document.createElement('label');
      label.className = 'text-xs font-medium text-ink';
      label.textContent = name;
      label.setAttribute('for', `sched-day-${idx}`);

      const select = document.createElement('select');
      select.id = `sched-day-${idx}`;
      select.className =
        'bg-card border border-border rounded-md px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:border-zinc-500';

      Object.entries(PLAN_META)
        .filter(([, meta]) => !meta.optional)
        .forEach(([planKey, meta]) => {
          const opt = document.createElement('option');
          opt.value = planKey;
          opt.textContent = meta.label;
          if (appState.weeklySchedule[idx] === planKey) opt.selected = true;
          select.appendChild(opt);
        });

      select.addEventListener('change', (e) => {
        appState.weeklySchedule[idx] = e.target.value;
        saveState(appState);
        els.scheduleSaveFeedback.textContent = 'Saved';
        setTimeout(() => {
          if (els.scheduleSaveFeedback.textContent === 'Saved') {
            els.scheduleSaveFeedback.textContent = '';
          }
        }, 1500);
        if (typeof onScheduleUpdated === 'function') onScheduleUpdated();
      });

      row.appendChild(label);
      row.appendChild(select);
      els.weeklyScheduleList.appendChild(row);
    });
  }

  // ---- Tab 2: Exercise How-To Guide ----
  function getFilteredExercises() {
    const q = exerciseSearchQuery.trim().toLowerCase();
    return EXERCISE_GUIDE.filter((ex) => {
      if (activeExerciseCategory !== 'all' && ex.category !== activeExerciseCategory) {
        return false;
      }
      if (!q) return true;
      const haystack = [ex.name, ex.where, ex.dose, ex.cue || '', ex.goutNote || '', ...ex.steps]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }

  function renderExerciseCategoryFilters() {
    els.exerciseCategoryFilters.innerHTML = '';

    EXERCISE_CATEGORIES.forEach((cat) => {
      const active = cat.key === activeExerciseCategory;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = cat.label;
      btn.setAttribute('aria-pressed', String(active));
      btn.className = active
        ? 'px-2.5 py-1 rounded-md text-[11px] font-semibold bg-zinc-800 text-ink border border-zinc-500 transition'
        : 'px-2.5 py-1 rounded-md text-[11px] font-medium bg-bg text-muted border border-border hover:text-ink transition';
      btn.addEventListener('click', () => {
        activeExerciseCategory = cat.key;
        renderExerciseCategoryFilters();
        renderExerciseGuide();
      });
      els.exerciseCategoryFilters.appendChild(btn);
    });
  }

  function createExerciseCard(ex) {
    const isExpanded = expandedExerciseIds.has(ex.id);

    const card = document.createElement('div');
    card.className = `rounded-lg border transition-colors ${
      isExpanded ? 'bg-bg border-zinc-600/80' : 'bg-bg border-border'
    }`;

    const headerBtn = document.createElement('button');
    headerBtn.type = 'button';
    headerBtn.setAttribute('aria-expanded', String(isExpanded));
    headerBtn.className = 'w-full flex items-center justify-between gap-2.5 p-3 text-left';

    const textWrap = document.createElement('div');
    textWrap.className = 'min-w-0 flex-1';

    const titleEl = document.createElement('div');
    titleEl.className = 'text-xs font-semibold text-ink leading-snug';
    titleEl.textContent = ex.name;

    const metaRow = document.createElement('div');
    metaRow.className = 'flex flex-wrap items-center gap-1.5 mt-1';

    const catPill = document.createElement('span');
    catPill.className =
      'text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/80';
    catPill.textContent = CATEGORY_LABEL_MAP[ex.category] || ex.category;

    const metaText = document.createElement('span');
    metaText.className = 'text-[11px] text-muted';
    metaText.textContent = `${ex.where} · ${ex.dose}`;

    metaRow.appendChild(catPill);
    metaRow.appendChild(metaText);
    textWrap.appendChild(titleEl);
    textWrap.appendChild(metaRow);

    const chev = document.createElement('span');
    chev.className = 'w-6 h-6 shrink-0 flex items-center justify-center text-zinc-500';
    chev.innerHTML = createChevronSvg(isExpanded);

    headerBtn.appendChild(textWrap);
    headerBtn.appendChild(chev);
    headerBtn.addEventListener('click', () => {
      if (expandedExerciseIds.has(ex.id)) expandedExerciseIds.delete(ex.id);
      else expandedExerciseIds.add(ex.id);
      renderExerciseGuide();
    });

    card.appendChild(headerBtn);

    if (isExpanded) {
      const body = document.createElement('div');
      body.className = 'px-3 pb-3 pt-2 border-t border-border/70 space-y-2.5 text-xs leading-relaxed';

      const stepsList = document.createElement('ol');
      stepsList.className = 'space-y-1.5 text-muted';
      ex.steps.forEach((step, idx) => {
        const li = document.createElement('li');
        li.className = 'flex items-start gap-2';

        const num = document.createElement('span');
        num.className =
          'font-mono text-[10px] font-semibold text-zinc-400 bg-zinc-800/90 border border-zinc-700/70 rounded w-4 h-4 shrink-0 flex items-center justify-center mt-0.5';
        num.textContent = String(idx + 1);

        const stepText = document.createElement('span');
        stepText.textContent = step;

        li.appendChild(num);
        li.appendChild(stepText);
        stepsList.appendChild(li);
      });
      body.appendChild(stepsList);

      if (ex.cue) {
        const cueBox = document.createElement('div');
        cueBox.className =
          'rounded-md bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-2 text-[11px] text-emerald-300/95 leading-snug';
        const cueStrong = document.createElement('span');
        cueStrong.className = 'font-semibold text-emerald-300';
        cueStrong.textContent = 'Form Cue: ';
        cueBox.appendChild(cueStrong);
        cueBox.appendChild(document.createTextNode(ex.cue));
        body.appendChild(cueBox);
      }

      if (ex.goutNote) {
        const goutBox = document.createElement('div');
        goutBox.className =
          'rounded-md bg-amber-500/10 border border-amber-500/25 px-2.5 py-2 text-[11px] text-amber-300/95 leading-snug';
        const goutStrong = document.createElement('span');
        goutStrong.className = 'font-semibold text-amber-300';
        goutStrong.textContent = 'Toe / Safety: ';
        goutBox.appendChild(goutStrong);
        goutBox.appendChild(document.createTextNode(ex.goutNote));
        body.appendChild(goutBox);
      }

      card.appendChild(body);
    }

    return card;
  }

  function renderExerciseGuide() {
    const filtered = getFilteredExercises();
    const totalVisible = filtered.length;

    els.exerciseCountLabel.textContent = `${totalVisible} ${totalVisible === 1 ? 'exercise' : 'exercises'}`;
    els.clearExerciseSearchBtn.classList.toggle('hidden', exerciseSearchQuery.length === 0);

    const allExpanded = totalVisible > 0 && filtered.every((ex) => expandedExerciseIds.has(ex.id));
    els.toggleAllExercisesBtn.textContent = allExpanded ? 'Collapse All' : 'Expand All';
    els.toggleAllExercisesBtn.classList.toggle('hidden', totalVisible === 0);

    els.exerciseGuideList.innerHTML = '';

    if (totalVisible === 0) {
      const empty = document.createElement('div');
      empty.className = 'rounded-lg bg-bg border border-border p-4 text-center text-xs text-muted';
      empty.textContent = 'No exercises match your search.';
      els.exerciseGuideList.appendChild(empty);
      return;
    }

    filtered.forEach((ex) => {
      els.exerciseGuideList.appendChild(createExerciseCard(ex));
    });
  }

  // ---- Modal Open / Close & Event Listeners ----
  function open(initialTab = 'schedule') {
    els.manifestFeedback.textContent = '';
    els.scheduleSaveFeedback.textContent = '';
    renderWeeklyScheduleEditor();
    renderExerciseCategoryFilters();
    renderExerciseGuide();
    setModalTab(initialTab);
    els.helpModal.classList.remove('hidden');
    els.helpModal.classList.add('flex');
  }

  function close() {
    els.helpModal.classList.add('hidden');
    els.helpModal.classList.remove('flex');
  }

  function bindEvents() {
    els.openHelpBtn.addEventListener('click', () => open('schedule'));
    els.closeHelpBtn.addEventListener('click', close);
    els.tabScheduleBtn.addEventListener('click', () => setModalTab('schedule'));
    els.tabExercisesBtn.addEventListener('click', () => setModalTab('exercises'));
    els.tabInstallBtn.addEventListener('click', () => setModalTab('install'));

    els.helpModal.addEventListener('click', (e) => {
      if (e.target === els.helpModal) close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !els.helpModal.classList.contains('hidden')) {
        close();
      }
    });

    els.resetWeeklyDefaultsBtn.addEventListener('click', () => {
      appState.weeklySchedule = { ...DEFAULT_WEEKLY_SCHEDULE };
      saveState(appState);
      renderWeeklyScheduleEditor();
      els.scheduleSaveFeedback.textContent = 'Defaults restored';
      if (typeof onScheduleUpdated === 'function') onScheduleUpdated();
    });

    els.exerciseSearchInput.addEventListener('input', (e) => {
      exerciseSearchQuery = e.target.value;
      renderExerciseGuide();
    });

    els.clearExerciseSearchBtn.addEventListener('click', () => {
      exerciseSearchQuery = '';
      els.exerciseSearchInput.value = '';
      renderExerciseGuide();
      els.exerciseSearchInput.focus();
    });

    els.toggleAllExercisesBtn.addEventListener('click', () => {
      const filtered = getFilteredExercises();
      const allExpanded = filtered.length > 0 && filtered.every((ex) => expandedExerciseIds.has(ex.id));
      if (allExpanded) {
        filtered.forEach((ex) => expandedExerciseIds.delete(ex.id));
      } else {
        filtered.forEach((ex) => expandedExerciseIds.add(ex.id));
      }
      renderExerciseGuide();
    });

    els.copyManifestBtn.addEventListener('click', async () => {
      const manifestText = await getManifestText();
      let ok = false;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(manifestText);
          ok = true;
        }
      } catch (err) {
        ok = false;
      }

      if (!ok) {
        const textarea = document.createElement('textarea');
        textarea.value = manifestText;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
          ok = document.execCommand('copy');
        } catch (err) {
          ok = false;
        }
        document.body.removeChild(textarea);
      }

      els.manifestFeedback.textContent = ok
        ? 'Copied manifest.json to clipboard.'
        : 'Could not copy automatically — use Download .json instead.';
    });

    els.downloadManifestBtn.addEventListener('click', async () => {
      const manifestText = await getManifestText();
      try {
        const blob = new Blob([manifestText], { type: 'application/manifest+json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'manifest.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        els.manifestFeedback.textContent = 'Downloaded manifest.json.';
      } catch (err) {
        els.manifestFeedback.textContent = 'Download blocked in preview — use Copy manifest.json.';
      }
    });
  }

  bindEvents();

  return { open, close };
}
