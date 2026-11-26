// Centralized DOM element lookups and lightweight SVG helpers

export function getDomRefs() {
  const byId = (id) => document.getElementById(id);

  return {
    // Header
    headerDayName: byId('headerDayName'),
    headerDateStr: byId('headerDateStr'),
    prevDayBtn: byId('prevDayBtn'),
    nextDayBtn: byId('nextDayBtn'),
    resetTodayBtn: byId('resetTodayBtn'),
    daysShownUpCount: byId('daysShownUpCount'),

    // Gout traffic light
    goutCard: byId('goutCard'),
    goutIndicatorDot: byId('goutIndicatorDot'),
    goutStatusBadge: byId('goutStatusBadge'),
    goutGuidanceText: byId('goutGuidanceText'),
    goutBtns: document.querySelectorAll('.gout-btn'),

    // Low-energy toggle
    lowEnergyToggle: byId('lowEnergyToggle'),
    lowEnergyThumb: byId('lowEnergyThumb'),

    // Plan switcher & tasks
    tasksSectionTitle: byId('tasksSectionTitle'),
    planOverrideBadge: byId('planOverrideBadge'),
    resetPlanAutoBtn: byId('resetPlanAutoBtn'),
    planSwitcherWrap: byId('planSwitcherWrap'),
    planAutoBtn: byId('planAutoBtn'),
    planBtns: document.querySelectorAll('.plan-btn'),
    backToBackTip: byId('backToBackTip'),
    tasksProgressBadge: byId('tasksProgressBadge'),
    tasksList: byId('tasksList'),

    // What's Next sequencing guide
    nextPlanToneBadge: byId('nextPlanToneBadge'),
    toggleCheatSheetBtn: byId('toggleCheatSheetBtn'),
    nextPlanCurrentLabel: byId('nextPlanCurrentLabel'),
    nextPlanRecommended: byId('nextPlanRecommended'),
    nextPlanGuidance: byId('nextPlanGuidance'),
    sequencingCheatSheet: byId('sequencingCheatSheet'),

    // Hydration tracker
    waterReadout: byId('waterReadout'),
    waterProgressBar: byId('waterProgressBar'),
    sub250Btn: byId('sub250Btn'),
    add250Btn: byId('add250Btn'),
    add500Btn: byId('add500Btn'),
    waterResetBtn: byId('waterResetBtn'),

    // Timer
    timerPresetTag: byId('timerPresetTag'),
    timerPhaseBadge: byId('timerPhaseBadge'),
    timerRoundText: byId('timerRoundText'),
    timerDisplay: byId('timerDisplay'),
    timerProgressBar: byId('timerProgressBar'),
    jumpToRestBtn: byId('jumpToRestBtn'),
    timerStartPauseBtn: byId('timerStartPauseBtn'),
    timerResetBtn: byId('timerResetBtn'),
    presetBtns: document.querySelectorAll('.preset-btn'),
    soundToggleBtn: byId('soundToggleBtn'),
    soundIcon: byId('soundIcon'),
    soundLabel: byId('soundLabel'),

    // Day completion
    logDayBtn: byId('logDayBtn'),
    logDayHint: byId('logDayHint'),

    // Settings, Exercise Guide & Install modal
    openHelpBtn: byId('openHelpBtn'),
    closeHelpBtn: byId('closeHelpBtn'),
    helpModal: byId('helpModal'),
    helpModalScrollArea: byId('helpModalScrollArea'),
    tabScheduleBtn: byId('tabScheduleBtn'),
    tabExercisesBtn: byId('tabExercisesBtn'),
    tabInstallBtn: byId('tabInstallBtn'),
    tabSchedulePanel: byId('tabSchedulePanel'),
    tabExercisesPanel: byId('tabExercisesPanel'),
    tabInstallPanel: byId('tabInstallPanel'),
    exerciseSearchInput: byId('exerciseSearchInput'),
    clearExerciseSearchBtn: byId('clearExerciseSearchBtn'),
    exerciseCategoryFilters: byId('exerciseCategoryFilters'),
    exerciseCountLabel: byId('exerciseCountLabel'),
    toggleAllExercisesBtn: byId('toggleAllExercisesBtn'),
    exerciseGuideList: byId('exerciseGuideList'),
    weeklyScheduleList: byId('weeklyScheduleList'),
    resetWeeklyDefaultsBtn: byId('resetWeeklyDefaultsBtn'),
    scheduleSaveFeedback: byId('scheduleSaveFeedback'),
    copyManifestBtn: byId('copyManifestBtn'),
    downloadManifestBtn: byId('downloadManifestBtn'),
    manifestFeedback: byId('manifestFeedback')
  };
}

export function createChevronSvg(isExpanded) {
  return `<svg class="w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>`;
}

export function createCheckSvg() {
  return '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>';
}
