// Date utilities and back-to-back high-intensity recovery checks
import { PLAN_META } from '../data/plans.js';
import { resolveEffectivePlan } from './storage.js';

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function getDateWithOffset(dayOffset) {
  const d = new Date();
  d.setHours(12, 0, 0, 0); // Avoid DST boundary edge cases
  d.setDate(d.getDate() + dayOffset);
  return d;
}

export function formatDateKey(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatDisplayDate(dateObj) {
  return `${MONTH_NAMES[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
}

export function wasYesterdayHighIntensity(state, activeDateObj) {
  const prevDate = new Date(activeDateObj.getTime());
  prevDate.setDate(prevDate.getDate() - 1);
  const prevKey = formatDateKey(prevDate);

  // Only trigger if yesterday was actually logged as completed
  if (!state.loggedDates.includes(prevKey)) return false;

  const prevRecord = state.days[prevKey];
  const prevPlan =
    prevRecord && prevRecord.loggedPlanType
      ? prevRecord.loggedPlanType
      : resolveEffectivePlan(state, prevDate.getDay(), prevRecord || { planOverride: 'auto' });

  return Boolean(PLAN_META[prevPlan] && PLAN_META[prevPlan].highIntensity);
}

export function shouldShowBackToBackTip(state, activeDateObj, activePlanType) {
  if (!PLAN_META[activePlanType] || !PLAN_META[activePlanType].highIntensity) return false;
  return wasYesterdayHighIntensity(state, activeDateObj);
}
