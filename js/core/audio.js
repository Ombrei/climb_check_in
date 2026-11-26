// Web Audio API tone synthesizer with haptic vibration fallback

let audioCtx = null;

export function ensureAudioContext() {
  try {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) audioCtx = new Ctx();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  } catch (err) {
    // Ignore audio initialization failures
  }
}

function playTone(freq, durationMs, type = 'sine', volume = 0.2, soundEnabled = true) {
  if (!soundEnabled) return;
  ensureAudioContext();
  if (!audioCtx) return;

  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(volume, audioCtx.currentTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + durationMs / 1000);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + durationMs / 1000 + 0.02);
  } catch (err) {
    // Ignore playback errors
  }
}

export function triggerCue(cueType, soundEnabled = true) {
  if (cueType === 'tick') {
    playTone(540, 80, 'triangle', 0.16, soundEnabled);
    if (navigator.vibrate) navigator.vibrate(25);
  } else if (cueType === 'hang') {
    playTone(880, 260, 'sine', 0.25, soundEnabled);
    if (navigator.vibrate) navigator.vibrate(90);
  } else if (cueType === 'rest') {
    playTone(440, 180, 'sine', 0.18, soundEnabled);
    if (navigator.vibrate) navigator.vibrate(50);
  } else if (cueType === 'done') {
    playTone(660, 160, 'sine', 0.22, soundEnabled);
    setTimeout(() => playTone(880, 320, 'sine', 0.24, soundEnabled), 170);
    if (navigator.vibrate) navigator.vibrate([80, 60, 140]);
  }
}
