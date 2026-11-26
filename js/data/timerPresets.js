// 20mm Edge & Rest Timer presets

export const TIMER_PRESETS = {
  hang10: {
    name: '10s Hang',
    buildSequence: () => [
      { phase: 'PREP', seconds: 3, roundText: '' },
      { phase: 'HANG', seconds: 10, roundText: '' }
    ]
  },
  rep73: {
    name: '7:3 × 6',
    buildSequence: () => {
      const seq = [{ phase: 'PREP', seconds: 3, roundText: 'Get Ready' }];
      for (let r = 1; r <= 6; r++) {
        seq.push({ phase: 'HANG', seconds: 7, roundText: `Round ${r}/6` });
        if (r < 6) {
          seq.push({ phase: 'REST', seconds: 3, roundText: `Round ${r}/6` });
        }
      }
      return seq;
    }
  },
  rest180: {
    name: '3m Rest',
    buildSequence: () => [{ phase: 'REST', seconds: 180, roundText: '' }]
  },
  stretch60: {
    name: '60s Stretch',
    buildSequence: () => [{ phase: 'STRETCH', seconds: 60, roundText: 'Hold' }]
  }
};
