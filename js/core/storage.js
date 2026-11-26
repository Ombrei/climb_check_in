// Safe localStorage persistence with in-memory fallback and state helpers
import { DEFAULT_WEEKLY_SCHEDULE, PLAN_META } from '../data/plans.js';

export const STORAGE_KEY = 'climb_checkin_v1';

let memoryFallback = null;

export function createDefaultState() {
  return {
    loggedDates: [],
    days: {},
    weeklySchedule: { ...DEFAULT_WEEKLY_SCHEDULE },
    soundEnabled: true
  };
}

export function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        loggedDates: Array.isArray(parsed.loggedDates) ? parsed.loggedDates : [],
        days: parsed.days && typeof parsed.days === 'object' ? parsed.days : {},
        weeklySchedule:
          parsed.weeklySchedule && typeof parsed.weeklySchedule === 'object'
            ? { ...DEFAULT_WEEKLY_SCHEDULE, ...parsed.weeklySchedule }
            : { ...DEFAULT_WEEKLY_SCHEDULE },
        soundEnabled: typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : true
      };
    }
  } catch (err) {
    if (memoryFallback) return memoryFallback;
  }
  return createDefaultState();
}

export function saveState(state) {
  memoryFallback = state;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    // Gracefully degrade to in-memory state if storage is blocked
  }
}

export function getDayRecord(state, dateKey) {
  if (!state.days[dateKey]) {
    state.days[dateKey] = {
      gout: 'green',
      lowEnergy: false,
      planOverride: 'auto',
      loggedPlanType: null,
      completedTasks: {},
      waterMl: 0
    };
  } else {
    // Forward-compatibility with previously saved records
    if (!state.days[dateKey].planOverride) state.days[dateKey].planOverride = 'auto';
    if (typeof state.days[dateKey].loggedPlanType === 'undefined') state.days[dateKey].loggedPlanType = null;
    if (!state.days[dateKey].completedTasks) state.days[dateKey].completedTasks = {};
  }
  return state.days[dateKey];
}

export function resolveEffectivePlan(state, weekday, record) {
  if (record && record.planOverride && record.planOverride !== 'auto' && PLAN_META[record.planOverride]) {
    return record.planOverride;
  }
  return state.weeklySchedule[weekday] || DEFAULT_WEEKLY_SCHEDULE[weekday] || 'rest';
}
