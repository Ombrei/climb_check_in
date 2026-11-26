// Main dashboard rendering and event bindings
import {
  BODYBUILDING_PROGRAMS,
  DEFAULT_WEEKLY_SCHEDULE,
  GOUT_CONFIG,
  NEXT_PLAN_GUIDE,
  PLAN_META,
  SEQUENCING_PLAN_ORDER,
  WATER_GOAL_ML
} from '../data/plans.js';
import { buildTasksForDay, recommendBodybuildingProgram } from '../data/workouts.js';
import {
  DAY_NAMES,
  formatDateKey,
  formatDisplayDate,
  getDateWithOffset,
  shouldShowBackToBackTip,
  wasYesterdayHighIntensity
} from '../core/dates.js';
import { getDayRecord, resolveEffectivePlan, saveState } from '../core/storage.js';
import { createCheckSvg, createChevronSvg } from './dom.js';

export function createMainView({ els, appState }) {
  let dayOffset = 0; // 0 = Today, -1 = Yesterday, +1 = Tomorrow
  let cheatSheetOpen = false;
  const expandedTaskIds = new Set();

  function getActiveContext() {
    const dateObj = getDateWithOffset(dayOffset);
    const dateKey = formatDateKey(dateObj);
    const weekday = dateObj.getDay();
    const record = getDayRecord(appState, dateKey);
    const defaultPlanForWeekday =
      appState.weeklySchedule[weekday] || DEFAULT_WEEKLY_SCHEDULE[weekday] || 'rest';
    const effectivePlan = resolveEffectivePlan(appState, weekday, record);

    return { dateObj, dateKey, weekday, record, defaultPlanForWeekday, effectivePlan };
  }

  function renderHeader(dateObj, weekday) {
    const dayLabel = DAY_NAMES[weekday];
    els.headerDayName.textContent = dayOffset === 0 ? `${dayLabel} (Today)` : dayLabel;
    els.headerDateStr.textContent = formatDisplayDate(dateObj);
    els.resetTodayBtn.classList.toggle('hidden', dayOffset === 0);
    els.daysShownUpCount.textContent = String(appState.loggedDates.length);
  }

  function renderGoutCheckIn(record) {
    const gCfg = GOUT_CONFIG[record.gout] || GOUT_CONFIG.green;
    els.goutIndicatorDot.className = `w-2 h-2 rounded-full ${gCfg.dotClass}`;
    els.goutStatusBadge.textContent = gCfg.label;
    els.goutStatusBadge.className = `text-[11px] font-medium ${gCfg.badgeClass}`;
    els.goutGuidanceText.textContent = gCfg.guidance;
    els.goutCard.className = `rounded-xl bg-card border p-3.5 transition-colors ${gCfg.borderClass}`;

    els.goutBtns.forEach((btn) => {
      const active = btn.getAttribute('data-gout') === record.gout;
      btn.setAttribute('aria-checked', String(active));
      btn.className = active
        ? 'gout-btn min-h-[40px] rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 bg-zinc-800 text-ink border border-zinc-600/80 shadow-sm transition'
        : 'gout-btn min-h-[40px] rounded-md text-xs font-medium flex items-center justify-center gap-1.5 text-muted hover:text-ink border border-transparent transition';
    });
  }

  function renderLowEnergyToggle(record) {
    els.lowEnergyToggle.setAttribute('aria-checked', String(record.lowEnergy));
    if (record.lowEnergy) {
      els.lowEnergyToggle.className =
        'relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border border-emerald-500/50 bg-emerald-500/20 transition-colors focus:outline-none';
      els.lowEnergyThumb.className =
        'inline-block h-5 w-5 transform rounded-full bg-emerald-400 transition-transform translate-x-6';
    } else {
      els.lowEnergyToggle.className =
        'relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border border-border bg-bg transition-colors focus:outline-none';
      els.lowEnergyThumb.className =
        'inline-block h-5 w-5 transform rounded-full bg-zinc-400 transition-transform translate-x-1';
    }
  }

  function toggleTaskExpanded(taskId) {
    if (expandedTaskIds.has(taskId)) expandedTaskIds.delete(taskId);
    else expandedTaskIds.add(taskId);
    render();
  }

  function createTaskCard(task, record) {
    const isDone = Boolean(record.completedTasks[task.id]);
    const isExpanded = expandedTaskIds.has(task.id);

    const wrapper = document.createElement('div');
    wrapper.className = `rounded-lg border transition-colors ${
      isDone ? 'bg-bg/60 border-border/60' : 'bg-bg border-border'
    }`;

    const row = document.createElement('div');
    row.className = 'flex items-center gap-2.5 p-2.5';

    // Checkbox button
    const checkBtn = document.createElement('button');
    checkBtn.type = 'button';
    checkBtn.setAttribute('aria-label', `Mark ${task.title} complete`);
    checkBtn.className = `w-7 h-7 shrink-0 rounded-md border flex items-center justify-center transition active:scale-90 ${
      isDone ? 'bg-ink border-ink text-bg' : 'bg-card border-zinc-600 text-transparent hover:border-zinc-400'
    }`;
    checkBtn.innerHTML = createCheckSvg();
    checkBtn.addEventListener('click', () => {
      record.completedTasks[task.id] = !isDone;
      saveState(appState);
      render();
    });

    // Title & meta (clickable to expand)
    const textBtn = document.createElement('button');
    textBtn.type = 'button';
    textBtn.className = 'flex-1 text-left min-w-0 py-0.5';

    const titleEl = document.createElement('div');
    titleEl.className = `text-sm font-medium leading-snug ${isDone ? 'line-through text-zinc-500' : 'text-ink'}`;
    titleEl.textContent = task.title;

    const metaEl = document.createElement('div');
    metaEl.className = 'text-[11px] text-muted mt-0.5';
    metaEl.textContent = task.meta;

    textBtn.appendChild(titleEl);
    textBtn.appendChild(metaEl);
    textBtn.addEventListener('click', () => toggleTaskExpanded(task.id));

    // Expand chevron
    const chevBtn = document.createElement('button');
    chevBtn.type = 'button';
    chevBtn.setAttribute('aria-label', 'Toggle exercise details');
    chevBtn.className =
      'w-8 h-8 shrink-0 rounded-md flex items-center justify-center text-zinc-500 hover:text-ink transition';
    chevBtn.innerHTML = createChevronSvg(isExpanded);
    chevBtn.addEventListener('click', () => toggleTaskExpanded(task.id));

    row.appendChild(checkBtn);
    row.appendChild(textBtn);
    row.appendChild(chevBtn);
    wrapper.appendChild(row);

    if (isExpanded && task.details && task.details.length > 0) {
      const detailBox = document.createElement('div');
      detailBox.className = 'px-3 pb-3 pt-1 border-t border-border/60 text-xs text-muted space-y-1.5 leading-relaxed';
      task.details.forEach((line) => {
        const p = document.createElement('p');
        p.className = 'flex items-start gap-2';

        const bullet = document.createElement('span');
        bullet.className = 'text-zinc-600 select-none';
        bullet.textContent = '•';

        const text = document.createElement('span');
        text.textContent = line;

        p.appendChild(bullet);
        p.appendChild(text);
        detailBox.appendChild(p);
      });
      wrapper.appendChild(detailBox);
    }

    return wrapper;
  }

  function renderPlanAndTasks(ctx) {
    const { dateObj, weekday, record, defaultPlanForWeekday, effectivePlan } = ctx;
    const dayLabel = DAY_NAMES[weekday];
    const isOverridden = record.planOverride && record.planOverride !== 'auto';

    els.planAutoBtn.textContent = `Auto (${PLAN_META[defaultPlanForWeekday].short})`;
    els.planOverrideBadge.classList.toggle('hidden', !isOverridden || record.lowEnergy);
    els.resetPlanAutoBtn.classList.toggle('hidden', !isOverridden || record.lowEnergy);
    els.planSwitcherWrap.classList.toggle('hidden', record.lowEnergy);

    els.planBtns.forEach((btn) => {
      const planKey = btn.getAttribute('data-plan');
      const active = planKey === (record.planOverride || 'auto');
      btn.setAttribute('aria-checked', String(active));

      if (planKey === 'bodybuilding') {
        btn.className = active
          ? 'plan-btn mt-1.5 w-full min-h-[38px] px-3 rounded-lg border border-zinc-400 bg-zinc-800 text-ink text-[11px] font-semibold flex items-center justify-between gap-2 transition active:scale-[0.99]'
          : 'plan-btn mt-1.5 w-full min-h-[38px] px-3 rounded-lg border border-dashed border-border bg-bg text-muted hover:text-ink hover:border-zinc-600 text-[11px] font-medium flex items-center justify-between gap-2 transition active:scale-[0.99]';
      } else {
        btn.className = active
          ? 'plan-btn min-h-[36px] px-2 rounded-lg border border-zinc-500 bg-zinc-800 text-ink text-[11px] font-semibold transition active:scale-[0.98] truncate'
          : 'plan-btn min-h-[36px] px-2 rounded-lg border border-border bg-bg text-muted hover:text-ink text-[11px] font-medium transition active:scale-[0.98] truncate';
      }
    });

    const isBodybuilding = effectivePlan === 'bodybuilding';
    const hadHighIntensityYesterday = wasYesterdayHighIntensity(appState, dateObj);
    const bbRec = recommendBodybuildingProgram({ gout: record.gout, hadHighIntensityYesterday });
    const activeBbProgram =
      record.bodybuildingProgram && BODYBUILDING_PROGRAMS[record.bodybuildingProgram]
        ? record.bodybuildingProgram
        : bbRec.programKey;

    els.bodybuildingProgramBox.classList.toggle('hidden', !isBodybuilding);
    if (isBodybuilding) {
      const recMeta = BODYBUILDING_PROGRAMS[bbRec.programKey] || BODYBUILDING_PROGRAMS.upper_push;
      els.bbRecProgramName.textContent = recMeta.label;
      els.bbRecReason.textContent = bbRec.reason;

      els.bbProgramBtns.forEach((btn) => {
        const key = btn.getAttribute('data-bb-program');
        const progMeta = BODYBUILDING_PROGRAMS[key];
        const isActive = key === activeBbProgram;
        const isRecommended = key === bbRec.programKey;

        btn.setAttribute('aria-checked', String(isActive));
        btn.className = isActive
          ? 'bb-program-btn min-h-[38px] px-2 py-1.5 rounded-lg border border-zinc-400 bg-zinc-800 text-ink text-[11px] font-semibold flex flex-col items-center justify-center leading-tight transition active:scale-[0.98]'
          : 'bb-program-btn min-h-[38px] px-2 py-1.5 rounded-lg border border-border bg-card text-muted hover:text-ink hover:border-zinc-600 text-[11px] font-medium flex flex-col items-center justify-center leading-tight transition active:scale-[0.98]';

        btn.innerHTML = '';
        const nameSpan = document.createElement('span');
        nameSpan.textContent = progMeta ? progMeta.short : key;
        btn.appendChild(nameSpan);

        if (isRecommended) {
          const recSpan = document.createElement('span');
          recSpan.className = 'text-[9px] font-mono uppercase tracking-wider text-emerald-400 mt-0.5';
          recSpan.textContent = '★ Rec';
          btn.appendChild(recSpan);
        }
      });
    }

    const showB2B = !record.lowEnergy && shouldShowBackToBackTip(appState, dateObj, effectivePlan);
    els.backToBackTip.classList.toggle('hidden', !showB2B);

    const tasks = buildTasksForDay(effectivePlan, record.gout, record.lowEnergy, activeBbProgram);
    els.tasksSectionTitle.textContent = record.lowEnergy ? '5-Min Floor Tasks' : `${dayLabel}'s Plan`;

    const doneCount = tasks.reduce((count, t) => count + (record.completedTasks[t.id] ? 1 : 0), 0);
    els.tasksProgressBadge.textContent = `${doneCount}/${tasks.length}`;

    els.tasksList.innerHTML = '';
    tasks.forEach((task) => {
      els.tasksList.appendChild(createTaskCard(task, record));
    });
  }

  function renderNextPlanGuide(record, effectivePlan) {
    const guideKey = record.lowEnergy ? 'low_energy' : effectivePlan;
    const guide = NEXT_PLAN_GUIDE[guideKey] || NEXT_PLAN_GUIDE.rest;

    els.nextPlanCurrentLabel.textContent = record.lowEnergy
      ? '5-Min Floor'
      : PLAN_META[effectivePlan]
        ? PLAN_META[effectivePlan].label
        : 'Today';
    els.nextPlanRecommended.textContent = guide.bestNext;
    els.nextPlanRecommended.className = `font-semibold ${guide.recClass}`;
    els.nextPlanToneBadge.textContent = guide.badgeText;
    els.nextPlanToneBadge.className = `text-[10px] font-mono font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded shrink-0 ${guide.badgeClass}`;
    els.nextPlanGuidance.textContent = guide.guidance;

    els.toggleCheatSheetBtn.textContent = cheatSheetOpen ? 'Hide Rules' : 'All Rules';
    els.toggleCheatSheetBtn.setAttribute('aria-expanded', String(cheatSheetOpen));
    els.sequencingCheatSheet.classList.toggle('hidden', !cheatSheetOpen);

    if (!cheatSheetOpen) return;

    els.sequencingCheatSheet.innerHTML = '';
    SEQUENCING_PLAN_ORDER.forEach((planKey) => {
      const meta = PLAN_META[planKey];
      const rule = NEXT_PLAN_GUIDE[planKey];
      const isCurrent = !record.lowEnergy && planKey === effectivePlan;

      const item = document.createElement('div');
      item.className = `rounded-lg p-2.5 border text-xs space-y-1 ${
        isCurrent ? 'bg-zinc-800/70 border-zinc-600' : 'bg-bg border-border'
      }`;

      const topRow = document.createElement('div');
      topRow.className = 'flex items-center justify-between gap-2';

      const heading = document.createElement('span');
      heading.className = 'font-semibold text-ink';
      heading.textContent = `After ${meta.label}`;

      const badge = document.createElement('span');
      badge.className = `text-[10px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded shrink-0 ${rule.badgeClass}`;
      badge.textContent = rule.badgeText;

      const nextLine = document.createElement('div');
      nextLine.className = `text-[11px] font-medium ${rule.recClass}`;
      nextLine.textContent = `Next: ${rule.bestNext}`;

      const desc = document.createElement('p');
      desc.className = 'text-[11px] text-muted leading-snug';
      desc.textContent = rule.guidance;

      topRow.appendChild(heading);
      topRow.appendChild(badge);
      item.appendChild(topRow);
      item.appendChild(nextLine);
      item.appendChild(desc);
      els.sequencingCheatSheet.appendChild(item);
    });
  }

  function renderHydration(record) {
    const waterLiters = (record.waterMl / 1000).toFixed(2);
    const waterPct = Math.min(100, Math.round((record.waterMl / WATER_GOAL_ML) * 100));
    els.waterReadout.textContent = `${waterLiters} / ${(WATER_GOAL_ML / 1000).toFixed(2)} L`;
    els.waterProgressBar.style.width = `${waterPct}%`;
    els.waterProgressBar.className = `h-full transition-all duration-300 rounded-full ${
      record.waterMl >= WATER_GOAL_ML ? 'bg-emerald-500' : 'bg-zinc-200'
    }`;
  }

  function renderCompletionButton(dateKey, weekday) {
    const dayLabel = DAY_NAMES[weekday];
    const isLogged = appState.loggedDates.includes(dateKey);
    const dayText = dayOffset === 0 ? 'today' : dayLabel;

    if (isLogged) {
      els.logDayBtn.textContent = `Logged for ${dayText} ✓`;
      els.logDayBtn.className =
        'w-full min-h-[50px] rounded-xl border border-emerald-500/40 bg-emerald-500/15 text-emerald-300 font-semibold text-sm flex items-center justify-center gap-2 transition active:scale-[0.99]';
      els.logDayHint.textContent = 'Shown up and counted. Tap again if you need to undo.';
    } else {
      els.logDayBtn.textContent = dayOffset === 0 ? 'Log Today Complete' : `Log ${dayLabel} Complete`;
      els.logDayBtn.className =
        'w-full min-h-[50px] rounded-xl border border-zinc-200 bg-ink text-bg font-semibold text-sm flex items-center justify-center gap-2 hover:bg-zinc-200 transition active:scale-[0.99]';
      els.logDayHint.textContent = 'No streaks. Every day you show up counts forever.';
    }
  }

  function render() {
    const ctx = getActiveContext();
    renderHeader(ctx.dateObj, ctx.weekday);
    renderGoutCheckIn(ctx.record);
    renderLowEnergyToggle(ctx.record);
    renderPlanAndTasks(ctx);
    renderNextPlanGuide(ctx.record, ctx.effectivePlan);
    renderHydration(ctx.record);
    renderCompletionButton(ctx.dateKey, ctx.weekday);
  }

  function updatePlanOverride(planKey) {
    const { dateObj, dateKey, record } = getActiveContext();
    record.planOverride = planKey;
    if (appState.loggedDates.includes(dateKey)) {
      record.loggedPlanType = resolveEffectivePlan(appState, dateObj.getDay(), record);
    }
    saveState(appState);
    render();
  }

  function adjustWater(deltaMl) {
    const { record } = getActiveContext();
    record.waterMl = Math.max(0, record.waterMl + deltaMl);
    saveState(appState);
    render();
  }

  function bindEvents() {
    els.prevDayBtn.addEventListener('click', () => {
      dayOffset -= 1;
      render();
    });

    els.nextDayBtn.addEventListener('click', () => {
      dayOffset += 1;
      render();
    });

    els.resetTodayBtn.addEventListener('click', () => {
      dayOffset = 0;
      render();
    });

    els.goutBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const { record } = getActiveContext();
        record.gout = btn.getAttribute('data-gout');
        saveState(appState);
        render();
      });
    });

    els.lowEnergyToggle.addEventListener('click', () => {
      const { record } = getActiveContext();
      record.lowEnergy = !record.lowEnergy;
      saveState(appState);
      render();
    });

    els.planBtns.forEach((btn) => {
      btn.addEventListener('click', () => updatePlanOverride(btn.getAttribute('data-plan')));
    });

    els.bbProgramBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const { record } = getActiveContext();
        record.bodybuildingProgram = btn.getAttribute('data-bb-program');
        saveState(appState);
        render();
      });
    });

    els.resetPlanAutoBtn.addEventListener('click', () => updatePlanOverride('auto'));

    els.toggleCheatSheetBtn.addEventListener('click', () => {
      cheatSheetOpen = !cheatSheetOpen;
      render();
    });

    els.sub250Btn.addEventListener('click', () => adjustWater(-250));
    els.add250Btn.addEventListener('click', () => adjustWater(250));
    els.add500Btn.addEventListener('click', () => adjustWater(500));

    els.waterResetBtn.addEventListener('click', () => {
      const { record } = getActiveContext();
      record.waterMl = 0;
      saveState(appState);
      render();
    });

    els.logDayBtn.addEventListener('click', () => {
      const { dateObj, dateKey, record } = getActiveContext();
      const idx = appState.loggedDates.indexOf(dateKey);
      if (idx === -1) {
        appState.loggedDates.push(dateKey);
        record.loggedPlanType = resolveEffectivePlan(appState, dateObj.getDay(), record);
      } else {
        appState.loggedDates.splice(idx, 1);
        record.loggedPlanType = null;
      }
      saveState(appState);
      render();
    });
  }

  bindEvents();

  return { render, getActiveContext };
}
