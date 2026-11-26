// Application entry point: wires state and UI modules together
import { loadState } from './core/storage.js';
import { getDomRefs } from './ui/dom.js';
import { createMainView } from './ui/mainView.js';
import { createTimerView } from './ui/timerView.js';
import { createSettingsModal } from './ui/settingsModal.js';

function init() {
  const appState = loadState();
  const els = getDomRefs();

  const mainView = createMainView({ els, appState });
  createTimerView({ els, appState });
  createSettingsModal({
    els,
    appState,
    onScheduleUpdated: () => mainView.render()
  });

  mainView.render();
}

init();
