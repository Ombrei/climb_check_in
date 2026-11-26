// 20mm Edge & Rest Timer UI bindings
import { TIMER_PRESETS } from '../data/timerPresets.js';
import { createTimerEngine, formatClock } from '../core/timerEngine.js';
import { saveState } from '../core/storage.js';

function getPhaseStyles(timerState) {
  if (timerState.status === 'DONE') {
    return {
      phaseLabel: 'DONE',
      badgeStyle: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      barStyle: 'bg-emerald-500',
      roundLabel: ''
    };
  }

  if (timerState.status === 'RUNNING' || timerState.status === 'PAUSED') {
    const step = timerState.sequence[timerState.stepIndex];
    const roundLabel = step.roundText || '';

    if (step.phase === 'PREP') {
      return {
        phaseLabel: step.phase,
        badgeStyle: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
        barStyle: 'bg-amber-500',
        roundLabel
      };
    }
    if (step.phase === 'HANG') {
      return {
        phaseLabel: step.phase,
        badgeStyle: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
        barStyle: 'bg-emerald-500',
        roundLabel
      };
    }
    if (step.phase === 'STRETCH') {
      return {
        phaseLabel: step.phase,
        badgeStyle: 'bg-sky-500/20 text-sky-300 border border-sky-500/30',
        barStyle: 'bg-sky-400',
        roundLabel
      };
    }
    return {
      phaseLabel: step.phase,
      badgeStyle: 'bg-zinc-800 text-zinc-300 border border-zinc-700',
      barStyle: 'bg-zinc-300',
      roundLabel
    };
  }

  return {
    phaseLabel: 'READY',
    badgeStyle: 'bg-zinc-800 text-muted',
    barStyle: 'bg-zinc-200',
    roundLabel: ''
  };
}

export function createTimerView({ els, appState }) {
  function render(timerState) {
    const preset = TIMER_PRESETS[timerState.presetKey];
    els.timerPresetTag.textContent = preset.name;
    els.timerDisplay.textContent = formatClock(timerState.remainingMs);

    const { phaseLabel, badgeStyle, barStyle, roundLabel } = getPhaseStyles(timerState);
    els.timerPhaseBadge.textContent = phaseLabel;
    els.timerPhaseBadge.className = `text-[11px] font-mono font-semibold uppercase tracking-widest px-2 py-0.5 rounded ${badgeStyle}`;

    if (roundLabel) {
      els.timerRoundText.textContent = roundLabel;
      els.timerRoundText.classList.remove('hidden');
    } else {
      els.timerRoundText.classList.add('hidden');
    }

    // Show 1-tap jump to 3m Rest when 10s Hang finishes
    const showJumpRest = timerState.status === 'DONE' && timerState.presetKey === 'hang10';
    els.jumpToRestBtn.classList.toggle('hidden', !showJumpRest);

    const pct =
      timerState.status === 'DONE'
        ? 0
        : timerState.status === 'READY'
          ? 100
          : Math.max(0, Math.min(100, (timerState.remainingMs / timerState.stepTotalMs) * 100));

    els.timerProgressBar.style.width = `${pct}%`;
    els.timerProgressBar.className = `h-full transition-all duration-75 rounded-full ${barStyle}`;

    if (timerState.status === 'RUNNING') {
      els.timerStartPauseBtn.textContent = 'Pause';
    } else if (timerState.status === 'PAUSED') {
      els.timerStartPauseBtn.textContent = 'Resume';
    } else {
      els.timerStartPauseBtn.textContent = 'Start';
    }

    els.presetBtns.forEach((btn) => {
      const active = btn.getAttribute('data-preset') === timerState.presetKey;
      btn.className = active
        ? 'preset-btn min-h-[38px] rounded-lg border border-zinc-500 bg-zinc-800 text-ink text-xs font-mono font-semibold transition active:scale-[0.97]'
        : 'preset-btn min-h-[38px] rounded-lg border border-border bg-bg text-muted hover:text-ink text-xs font-mono font-medium transition active:scale-[0.97]';
    });

    els.soundIcon.textContent = appState.soundEnabled ? '🔊' : '🔇';
    els.soundLabel.textContent = appState.soundEnabled ? 'Sound ON' : 'Sound OFF';
  }

  const engine = createTimerEngine({
    isSoundEnabled: () => appState.soundEnabled,
    onChange: render
  });

  els.presetBtns.forEach((btn) => {
    btn.addEventListener('click', () => engine.selectPreset(btn.getAttribute('data-preset')));
  });

  els.timerStartPauseBtn.addEventListener('click', () => engine.toggleStartPause());
  els.timerResetBtn.addEventListener('click', () => engine.reset());

  els.jumpToRestBtn.addEventListener('click', () => {
    engine.selectPreset('rest180');
    engine.start();
  });

  els.soundToggleBtn.addEventListener('click', () => {
    appState.soundEnabled = !appState.soundEnabled;
    saveState(appState);
    render(engine.getState());
  });

  engine.selectPreset('hang10');

  return { engine, render: () => render(engine.getState()) };
}
