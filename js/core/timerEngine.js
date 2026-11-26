// Delta-accurate requestAnimationFrame timer state machine (DOM-independent)
import { TIMER_PRESETS } from '../data/timerPresets.js';
import { ensureAudioContext, triggerCue } from './audio.js';

export function formatClock(ms) {
  const totalSec = Math.ceil(Math.max(0, ms) / 1000);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function createTimerEngine({ isSoundEnabled, onChange }) {
  const state = {
    presetKey: 'hang10',
    sequence: TIMER_PRESETS.hang10.buildSequence(),
    stepIndex: 0,
    status: 'READY', // READY | RUNNING | PAUSED | DONE
    remainingMs: 10000,
    stepTotalMs: 10000,
    lastTickTime: null,
    lastBeepSecond: null,
    rafId: null
  };

  function emit() {
    if (typeof onChange === 'function') onChange(state);
  }

  function stopLoop() {
    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
      state.rafId = null;
    }
  }

  function selectPreset(key) {
    if (!TIMER_PRESETS[key]) return;
    stopLoop();
    state.presetKey = key;
    state.sequence = TIMER_PRESETS[key].buildSequence();
    state.stepIndex = 0;
    state.status = 'READY';
    state.lastBeepSecond = null;

    // Show primary work duration while READY (e.g., 00:10 for 10s Hang, 00:07 for 7:3)
    const previewStep = state.sequence.find((s) => s.phase !== 'PREP') || state.sequence[0];
    state.remainingMs = previewStep.seconds * 1000;
    state.stepTotalMs = previewStep.seconds * 1000;

    emit();
  }

  function tick(now) {
    if (state.status !== 'RUNNING') return;

    const delta = now - state.lastTickTime;
    state.lastTickTime = now;
    state.remainingMs -= delta;

    const currentStep = state.sequence[state.stepIndex];
    const secLeft = Math.ceil(state.remainingMs / 1000);

    // Prep countdown ticks (3, 2, 1)
    if (currentStep.phase === 'PREP' && secLeft > 0 && secLeft <= 3 && secLeft !== state.lastBeepSecond) {
      state.lastBeepSecond = secLeft;
      triggerCue('tick', isSoundEnabled());
    }

    if (state.remainingMs <= 0) {
      state.stepIndex += 1;
      if (state.stepIndex >= state.sequence.length) {
        state.remainingMs = 0;
        state.status = 'DONE';
        stopLoop();
        triggerCue('done', isSoundEnabled());
        emit();
        return;
      }

      const nextStep = state.sequence[state.stepIndex];
      state.remainingMs = nextStep.seconds * 1000;
      state.stepTotalMs = nextStep.seconds * 1000;
      state.lastBeepSecond = nextStep.seconds;

      if (nextStep.phase === 'HANG') triggerCue('hang', isSoundEnabled());
      else if (nextStep.phase === 'REST') triggerCue('rest', isSoundEnabled());
    }

    emit();
    state.rafId = requestAnimationFrame(tick);
  }

  function start() {
    ensureAudioContext();
    if (state.status === 'READY' || state.status === 'DONE') {
      state.sequence = TIMER_PRESETS[state.presetKey].buildSequence();
      state.stepIndex = 0;
      const first = state.sequence[0];
      state.remainingMs = first.seconds * 1000;
      state.stepTotalMs = first.seconds * 1000;
      state.lastBeepSecond = first.seconds;

      if (first.phase === 'PREP') triggerCue('tick', isSoundEnabled());
      else if (first.phase === 'HANG') triggerCue('hang', isSoundEnabled());
    }

    state.status = 'RUNNING';
    state.lastTickTime = performance.now();
    emit();
    state.rafId = requestAnimationFrame(tick);
  }

  function pause() {
    stopLoop();
    state.status = 'PAUSED';
    emit();
  }

  function toggleStartPause() {
    if (state.status === 'RUNNING') pause();
    else start();
  }

  function reset() {
    selectPreset(state.presetKey);
  }

  return {
    getState: () => state,
    selectPreset,
    start,
    pause,
    toggleStartPause,
    reset
  };
}
