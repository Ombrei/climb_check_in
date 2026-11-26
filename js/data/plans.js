// Default Mon–Sun schedule (0 = Sun ... 6 = Sat)
export const DEFAULT_WEEKLY_SCHEDULE = {
  0: 'rest',
  1: 'strength_a',
  2: 'prehab',
  3: 'strength_b',
  4: 'rest',
  5: 'prehab',
  6: 'gym'
};

export const ORDERED_WEEKDAYS = [
  { idx: 1, name: 'Monday' },
  { idx: 2, name: 'Tuesday' },
  { idx: 3, name: 'Wednesday' },
  { idx: 4, name: 'Thursday' },
  { idx: 5, name: 'Friday' },
  { idx: 6, name: 'Saturday' },
  { idx: 0, name: 'Sunday' }
];

export const PLAN_META = {
  gym: { short: 'Gym', label: 'Climbing Gym', highIntensity: true },
  strength_a: { short: 'Str A', label: 'Home Strength A', highIntensity: true },
  strength_b: { short: 'Str B', label: 'Home Strength B', highIntensity: true },
  prehab: { short: 'Prehab', label: 'Prehab & Antagonists', highIntensity: false },
  rest: { short: 'Rest', label: 'Rest & Mobility', highIntensity: false }
};

export const SEQUENCING_PLAN_ORDER = ['gym', 'strength_a', 'strength_b', 'prehab', 'rest'];

// Recovery & sequencing rules: what to do the day after each plan
export const NEXT_PLAN_GUIDE = {
  gym: {
    bestNext: 'Rest & Mobility (or Prehab)',
    badgeText: 'Rest Needed',
    badgeClass: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    recClass: 'text-amber-300',
    guidance:
      'Rest is essential after hard bouldering. Give finger pulleys and your big toe 24–48h before max hangs or another limit session. If you climb again tomorrow, keep it light (V2–V3 technique, zero sharp jibs) and skip home hangs.'
  },
  strength_a: {
    bestNext: 'Prehab or Rest & Mobility',
    badgeText: '48h Fingers',
    badgeClass: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    recClass: 'text-amber-300',
    guidance:
      'Avoid 20mm hangs tomorrow so tendons can adapt. Prehab or Rest is ideal. You can visit the gym tomorrow if fingers feel fresh, but expect slightly lower peak power and skip micro-crimps.'
  },
  strength_b: {
    bestNext: 'Rest & Mobility or Prehab',
    badgeText: '48h Fingers',
    badgeClass: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    recClass: 'text-amber-300',
    guidance:
      'Take at least 1 rest or prehab day before limit bouldering at the gym or doing Strength A. Repeaters and lock-offs create deep tendon fatigue even if your muscles feel fine.'
  },
  prehab: {
    bestNext: 'Climbing Gym, Strength A, or Strength B',
    badgeText: 'Green Light',
    badgeClass: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    recClass: 'text-emerald-400',
    guidance:
      'Full green light to climb or strength train tomorrow. Prehab is low-fatigue and primes your shoulders, elbows, and antagonists for high-intensity sessions.'
  },
  rest: {
    bestNext: 'Climbing Gym, Strength A, or Strength B',
    badgeText: 'Green Light',
    badgeClass: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    recClass: 'text-emerald-400',
    guidance:
      'You are fully primed for hard climbing or home strength tomorrow (as long as your big toe check-in is Green or Yellow).'
  },
  low_energy: {
    bestNext: 'Any Plan (Gym, Strength, or Prehab)',
    badgeText: 'Green Light',
    badgeClass: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    recClass: 'text-emerald-400',
    guidance:
      'A 5-Min Floor day keeps momentum without adding fatigue—you are completely good to climb or strength train tomorrow.'
  }
};

// Big Toe Gout Traffic Light configuration
export const GOUT_CONFIG = {
  green: {
    label: 'Clear',
    dotClass: 'bg-emerald-500',
    badgeClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/35',
    guidance: 'Full plan. Downclimb all gym boulders.'
  },
  yellow: {
    label: 'Stiff / Ache',
    dotClass: 'bg-amber-500',
    badgeClass: 'text-amber-400',
    borderClass: 'border-amber-500/40',
    guidance: 'Seated foot work only. Overhangs & hooks, zero jibs.'
  },
  red: {
    label: 'Active Flare',
    dotClass: 'bg-rose-500',
    badgeClass: 'text-rose-400',
    borderClass: 'border-rose-500/45',
    guidance: 'Rest & elevate foot. Skip gym and standing drops.'
  }
};

export const WATER_GOAL_ML = 3000;
