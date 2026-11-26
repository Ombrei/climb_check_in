// Flexible daily workout generator adapted for Gout Traffic Light, Low-Energy Mode & Optional Bodybuilding Visits

export function recommendBodybuildingProgram({ gout, hadHighIntensityYesterday }) {
  if (gout === 'red') {
    return {
      programKey: 'upper_push',
      reason:
        'Active toe flare: stick to seated Upper Push machines only (zero standing or lower-body load) — or skip the gym and elevate your foot.'
    };
  }

  if (hadHighIntensityYesterday) {
    if (gout === 'yellow') {
      return {
        programKey: 'upper_push',
        reason:
          'Yesterday taxed your fingers and your big toe is Yellow — seated Upper Push balances climbing pull muscles while resting both pulleys and your toe.'
      };
    }
    return {
      programKey: 'lower_body',
      reason:
        'Yesterday was a high-intensity climbing/finger session — hit Lower Body & Posterior Chain today (or Upper Push) so finger pulleys get a full 48h to recover.'
    };
  }

  return {
    programKey: 'upper_push',
    reason:
      'Best default for climbers: builds chest, shoulders, and triceps to balance climbing pulling with zero finger fatigue. Pick Full Body instead if you only lift 1×/week and want legs + back too.'
  };
}

function buildBodybuildingPlanTask(programKey, gout) {
  switch (programKey) {
    case 'full_body':
      if (gout === 'red') {
        return {
          id: 'plan_bodybuilding',
          title: 'Bodybuilding Gym — Full Body (Seated Upper Mod)',
          meta: '35–45 min · Red Flare Safe',
          details: [
            'Active flare: Skip all standing lifts and lower-body loading. Seated machines only (or rest at home).',
            'Incline Dumbbell / Machine Chest Press: 3×10 (2m rest).',
            'Chest-Supported Row Machine: 3×10–12 (2m rest; light grip to save fingers).',
            'Seated Shoulder Press Machine: 3×10 (90s rest).',
            'Seated Cable Face Pulls (or Rear Delt Fly Machine): 3×15 (60s rest).'
          ]
        };
      }
      if (gout === 'yellow') {
        return {
          id: 'plan_bodybuilding',
          title: 'Bodybuilding Gym — Full Body (Yellow Toe Mod)',
          meta: '50–60 min · Seated Legs · Balanced',
          details: [
            'Incline Dumbbell Press: 3×8–10 (2m rest) — antagonist chest & shoulder stability.',
            'Chest-Supported Row: 3×10–12 (2m rest) — mid-back thickness; use open grip/straps if fingers feel fatigued.',
            'Seated Hamstring Curl + Leg Extension: 3×12 each (90s rest) — swaps out standing leg lifts to keep zero load on big toe.',
            'Seated Dumbbell Overhead Press: 3×8–10 (2m rest).',
            'Cable Face Pulls: 3×15 + Hammer Curls: 2×12–15 (elbow prehab & posture).'
          ]
        };
      }
      return {
        id: 'plan_bodybuilding',
        title: 'Bodybuilding Gym — Full-Body Climber Hypertrophy',
        meta: '55–65 min · Balanced Strength & Physique',
        details: [
          'Incline Dumbbell Press: 3×8–10 (2m rest) — balances climbing pulling.',
          'Chest-Supported Row: 3×10–12 (2m rest) — upper-back strength without frying your lower back.',
          'Romanian Deadlift (RDL) or Heel-Driven Leg Press: 3×8–10 (2–3m rest) — anchor weight in heels/midfoot (skip lunges & calf raises).',
          'Seated Dumbbell Overhead Press: 3×8–10 (2m rest) — overhead & mantle stability.',
          'Cable Face Pulls: 3×15 (90s rest) — rear delts & rotator cuff armor.',
          'Hammer Curls (or Reverse Curls): 2×12–15 (60s rest) — brachialis & elbow tendon prehab.'
        ]
      };

    case 'lower_body':
      if (gout === 'red') {
        return {
          id: 'plan_bodybuilding',
          title: 'SKIP LOWER BODY: Active Toe Flare',
          meta: 'Flare Protocol · Switch to Upper Push or Rest',
          details: [
            'Do not load your feet or legs during an active gout flare.',
            'Switch to Seated Upper Push above, or skip the gym, elevate your foot, and focus on 3.0L+ hydration.'
          ]
        };
      }
      if (gout === 'yellow') {
        return {
          id: 'plan_bodybuilding',
          title: 'Bodybuilding Gym — Lower Body (Seated Machines Only)',
          meta: '40–50 min · Zero Toe Pressure',
          details: [
            'Seated Hamstring Curl Machine: 3×12–15 (90s rest) — direct heel-hook strength with zero foot pressure.',
            'Leg Extension Machine: 3×12–15 (90s rest) — quad volume with pad on shins, zero big-toe bend.',
            'Hip Abduction & Adduction Machines: 3×15 each (60s rest) — climbing turnout & knee stability.',
            'Seated Ab Crunch Machine (or Floor Hollow Holds): 3×12–15 (60s rest).',
            'Skip RDLs, Leg Press, lunges, and calf raises until your toe is Green.'
          ]
        };
      }
      return {
        id: 'plan_bodybuilding',
        title: 'Bodybuilding Gym — Lower Body & Posterior Chain',
        meta: '45–55 min · Heel-Hook & Leg Power',
        details: [
          'Leg Press (Feet High & Wide): 3×10–12 (2m rest) — drive strictly through heels/midfoot.',
          'Seated Hamstring Curl Machine: 3×12–15 (90s rest) — builds bulletproof heel-hook power.',
          'Romanian Deadlift (DB or Barbell): 3×8–10 (2–3m rest) — flat feet, hinge at hips, zero toe push-off.',
          'Hip Abduction / Adduction Machine: 3×15 (60s rest) — hip stability for high steps & drop knees.',
          'Core: Hanging Knee Raises or Ab Crunch Machine 3×12–15 (60s rest). Avoid lunges and standing calf raises.'
        ]
      };

    case 'upper_push':
    default:
      if (gout === 'red') {
        return {
          id: 'plan_bodybuilding',
          title: 'Bodybuilding Gym — Upper Push (Seated Only Mod)',
          meta: '35–45 min · Red Flare Safe',
          details: [
            'Active flare: Stay seated on benches/machines with feet resting flat (no standing cables). Skip gym if walking hurts.',
            'Incline Dumbbell / Machine Chest Press: 3×8–10 (2m rest).',
            'Seated Dumbbell Overhead Press: 3×8–10 (2m rest).',
            'Seated Rear Delt Fly Machine (or Seated Face Pulls): 3×15 (60s rest).',
            'Seated Overhead Tricep Extension (or Machine Dip): 3×10–12 + Seated Lateral Raises: 3×12–15.'
          ]
        };
      }
      return {
        id: 'plan_bodybuilding',
        title: 'Bodybuilding Gym — Upper Push & Antagonists',
        meta: '45–55 min · Climber Recommended · Zero Finger Fatigue',
        details: [
          'Incline Dumbbell Press: 3×8–10 (2m rest) — upper chest & pushing balance for climbing.',
          'Seated Dumbbell Overhead Press: 3×8–10 (2m rest) — shoulder strength for mantles & press moves.',
          'Cable Face Pulls: 3×15 (90s rest) — rear delts & external rotation to counter climber posture.',
          'Dips (Assisted/Weighted) or Cable Tricep Pushdowns: 3×10–12 (90s rest) — lock-out & top-out power.',
          'Lateral Raises (Cable or DB): 3×12–15 (60s rest) — shoulder cap & joint armor.',
          'Core Finisher — Cable Pallof Press: 3×12/side (60s rest) — anti-rotation core tension for steep walls.'
        ]
      };
  }
}

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

function buildPrimaryPlanTask(planType, gout, bodybuildingProgram = 'upper_push') {
  switch (planType) {
    case 'bodybuilding':
      return buildBodybuildingPlanTask(bodybuildingProgram, gout);

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

export function buildTasksForDay(planType, gout, lowEnergy, bodybuildingProgram = 'upper_push') {
  if (lowEnergy) {
    return buildLowEnergyTasks(gout);
  }

  return [
    buildPrimaryPlanTask(planType, gout, bodybuildingProgram),
    buildDailySupplementsTask(gout),
    buildDailyFootTask(gout),
    buildDailyMobilityTask(gout)
  ];
}
