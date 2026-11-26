// Application entry point: wires state and UI modules together
import { loadState } from './core/storage.js';
import { getDomRefs } from './ui/dom.js';
import { createMainView } from './ui/mainView.js';
import { createTimerView } from './ui/timerView.js';
import { createSettingsModal } from './ui/settingsModal.js';
import { createChatModal } from './ui/chatModal.js';

function init() {
  const appState = loadState();
  const els = getDomRefs();

  const mainView = createMainView({ els, appState });
  createTimerView({ els, appState });

  let chatModal = null;

  const settingsModal = createSettingsModal({
    els,
    appState,
    onScheduleUpdated: () => mainView.render(),
    onAiConfigUpdated: () => {
      if (chatModal) chatModal.syncConfigState();
    }
  });

  chatModal = createChatModal({
    els,
    appState,
    getActiveContext: () => mainView.getActiveContext(),
    onOpenAiSettings: () => settingsModal.open('ai')
  });

  mainView.render();
}

init();
