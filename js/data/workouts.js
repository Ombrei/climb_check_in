// Flexible daily workout generator adapted for Gout Traffic Light & Low-Energy Mode

function buildDailySupplementsTask(gout) {
  return {
    id: 'daily_supplements',
    title: 'Daily Supplements — Prebiotics & Creatine',
    meta: '1 min · Take with water',
    details: [
      'Prebiotics: Take your daily serving with water or alongside a meal.',
      'Creatine (3–5g): Take daily for consistent strength saturation—timing is flexible, consistency matters most.',
      gout === 'red'
        ? 'Active flare reminder: Pair with plenty of water toward your 3.0L+ gout flush goal.'
        : 'Wash down with 250–500ml water and log it in the Hydration tracker below.'
    ]
  };
}

function buildLowEnergyTasks(gout) {
  const supplements = buildDailySupplementsTask(gout);

  if (gout === 'red') {
    return [
      {
        id: 'le_water',
        title: 'Drink 500ml water',
        meta: 'Gout flush · 1 min',
        details: ['Sip a full 500ml glass right now to dilute uric acid and keep joints hydrated.']
      },
      supplements,
      {
        id: 'le_glides',
        title: 'Seated tendon glides (1 min)',
        meta: 'Zero load · 1 min',
        details: ['2×10 slow reps: Straight → Hook fist → Full fist → Tabletop → Straight.']
      }
    ];
  }

  return [
    {
      id: 'le_doming',
      title: 'Seated Foot Doming (1×10)',
      meta: 'Arch floor · 2 min',
      details: ['Barefoot, seated. Slide ball of foot gently toward heel to lift arch without curling toes. Hold 5s each.']
    },
    {
      id: 'le_hips',
      title: '90/90 Hip Switches (2 min)',
      meta: 'Mobility floor · 2 min',
      details: ['Sit with knees bent at 90°. Smoothly rotate hips side to side to unlock turnout stiffness.']
    },
    {
      id: 'le_water',
      title: 'Drink 500ml water',
      meta: 'Hydration · 1 min',
      details: ['Hit your hydration baseline and call it a win.']
    },
    supplements
  ];
}

function buildPrimaryPlanTask(planType, gout) {
  switch (planType) {
    case 'strength_a':
      return {
        id: 'plan_strength_a',
        title: gout === 'red' ? 'Home Strength A (Seated/Safe Mod)' : 'Home Strength A — Max Hangs & Pulls',
        meta: '50–60 min · High Intensity',
        details:
          gout === 'red'
            ? [
                'Active flare: Skip standing drops off the bar/edge.',
                'Substitute with seated/kneeling core & gentle forearm tendon glides if comfortable.'
              ]
            : [
                'Warm-up (12m): Arm/wrist circles, 2×8 scap pull-ups, 4 progressive feet-on hangs.',
                '20mm Max Hangs (Half-crimp): 5×8–10s, 3 min rest. Step down gently onto chair.',
                'Heavy Pull-Ups: 4×3–5 reps (weighted backpack or L-sit/Archer), 3 min rest.',
                'Hanging Leg Raises (or Front Lever Tucks): 3×6–10 slow reps, 2 min rest.'
              ]
      };

    case 'strength_b':
      return {
        id: 'plan_strength_b',
        title: gout === 'red' ? 'Home Strength B (Floor Core Only)' : 'Home Strength B — Repeaters & Power',
        meta: '50–60 min · High Intensity',
        details:
          gout === 'red'
            ? ['Active flare: Skip standing drops. Do Hollow Body Holds (3×40s) and floor Y-T-Ws only.']
            : [
                '20mm Repeaters (7:3): 4 sets × 6 reps (7s hang / 3s rest) in Open or Half-crimp, 3m rest.',
                'Explosive Pull-Ups: 3×4–5 reps pulling fast chest-to-bar, 3m rest.',
                'Isometric 90° Lock-Offs: 3×10–15s, 2.5m rest. Step down softly.',
                'Core: 3 rounds of Copenhagen Planks (20–30s/side) + Hollow Body Holds (40s).'
              ]
      };

    case 'prehab':
      return {
        id: 'plan_prehab',
        title: 'Prehab & Antagonists Circuit',
        meta: '25–30 min · 2–3 Rounds',
        details: [
          'Push-Ups (or Pike Push-Ups): 3×10–15 (knees down if big toe is sensitive).',
          'Scapular Pull-Ups: 3×10 with straight elbows, 2s squeeze at top.',
          'Prone Floor Y-T-Ws: 3×8 each letter for rotator cuff stability.',
          'Eccentric Wrist Extensions: 3×15/arm (3–4s slow lower w/ 1–2kg weight).',
          'Finger Extensor Openers (3×20) + Tendon Glides (2×10 slow).'
        ]
      };

    case 'gym':
      if (gout === 'red') {
        return {
          id: 'plan_gym',
          title: 'SKIP GYM: Rest & elevate foot',
          meta: 'Flare Protocol · Zero Impact',
          details: [
            "Do not climb during an active flare. Elevate foot, hydrate 3L+, and follow your doctor's medication plan."
          ]
        };
      }
      if (gout === 'yellow') {
        return {
          id: 'plan_gym',
          title: 'Climbing Gym (Yellow Mod)',
          meta: 'Overhangs & hooks only · Zero jibs',
          details: [
            'Warm-up: 8–10 easy boulders focusing on silent feet & hover hands.',
            'Overhangs, large footholds, smears, and heel hooks only — skip micro-edge jibs.',
            'Downclimb EVERY boulder. Slip shoes off between every attempt.'
          ]
        };
      }
      return {
        id: 'plan_gym',
        title: 'Climbing Gym — Limit Bouldering (V5–V6)',
        meta: '90–120 min · 3–5m rests',
        details: [
          'Warm-up (20m): 8–10 easy climbs (V0–V3) with silent feet & 2s hover hands.',
          'Limit Projecting (60m): 3–4 hard problems (V5–V7), 3–5 min full rest between tries.',
          'Weakness Finisher (15m): Worst style at V3–V4.',
          'Downclimb every boulder to protect the big toe from landing impact.'
        ]
      };

    case 'rest':
    default:
      return {
        id: 'plan_rest',
        title: 'Rest & Light Recovery',
        meta: 'Hydration · Tendon Glides · Sleep',
        details: [
          'Tendon Glides: 2×10 slow reps through all 4 hand positions.',
          'Hit 1.6–2.0g/kg low-purine protein (eggs, whey/dairy, tofu, poultry).',
          gout === 'red'
            ? 'Keep foot elevated; skip walking.'
            : 'Optional easy walk + skin care (file calluses lightly, apply balm).'
        ]
      };
  }
}

function buildDailyFootTask(gout) {
  if (gout === 'green') {
    return {
      id: 'daily_foot',
      title: 'Foot Arch Block (6 min)',
      meta: 'Barefoot · Pain-free range',
      details: [
        'Foot Doming (Short-Foot): 3×10 reps, 5s hold (do not curl toes).',
        'Toe Yoga: 3×10/foot (isolate big toe vs. 4 small toes).',
        'Towel Scrunches: 2×30–45s/foot.',
        'Controlled Heel Raises: 3×10–12 pressing evenly through toes 2–4, 3s lower.'
      ]
    };
  }
  if (gout === 'yellow') {
    return {
      id: 'daily_foot',
      title: 'Foot Arch Block (Seated Only)',
      meta: 'Zero standing load · 4 min',
      details: [
        'Seated Foot Doming: 3×10 reps, 5s hold.',
        'Gentle Seated Toe Yoga: 3×10/foot within completely pain-free range.',
        'Skip Towel Scrunches & standing Heel Raises today.'
      ]
    };
  }
  return {
    id: 'daily_foot',
    title: 'Foot Rest — Elevate & Hydrate',
    meta: 'Zero foot loading',
    details: ['No foot exercises during an active flare. Elevate foot, aim for 3L+ water, and rest.']
  };
}

function buildDailyMobilityTask(gout) {
  return {
    id: 'daily_mobility',
    title: '15-Min Climbing Mobility Flow',
    meta: 'Hips · Hamstrings · Shoulders',
    details:
      gout === 'red'
        ? [
            'Floor-only modifications (no standing pressure on big toe):',
            '90/90 Hip Switches (10 slow) · Frog Stretch w/ Rock-Backs (2×45–60s).',
            'Thread the Needle (6/side) · Seated Hamstring Stretch.'
          ]
        : [
            '90/90 Hip Switches: 10 slow switches (hip turnout).',
            'Frog Stretch w/ Rock-Backs: 2×45–60s (adductors).',
            'Deep Squat Hold (60s) + Cossack Squats (6/side) — weight anchored in heels/midfoot.',
            'Elephant Walks: 20 reps/leg (hamstrings).',
            'Thread the Needle: 6/side (thoracic spine).',
            'Passive Dead Hang: 2×30–45s (shoulders; step down gently).'
          ]
  };
}

export function buildTasksForDay(planType, gout, lowEnergy) {
  if (lowEnergy) {
    return buildLowEnergyTasks(gout);
  }

  return [
    buildPrimaryPlanTask(planType, gout),
    buildDailySupplementsTask(gout),
    buildDailyFootTask(gout),
    buildDailyMobilityTask(gout)
  ];
}
