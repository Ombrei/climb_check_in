// Exercise How-To Guide Catalog (covers every movement across all plans)

export const EXERCISE_CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'strength', label: 'Strength' },
  { key: 'bodybuilding', label: 'Weights Gym' },
  { key: 'prehab', label: 'Prehab' },
  { key: 'foot', label: 'Foot Arch' },
  { key: 'mobility', label: 'Mobility' },
  { key: 'gym', label: 'Gym Drills' }
];

export const EXERCISE_GUIDE = [
  // STRENGTH & HANGS
  {
    id: 'ex_warmup_hangs',
    category: 'strength',
    name: 'Progressive Feet-On Warm-Up Hangs',
    where: 'Strength A',
    dose: '4 sets · 10s each',
    steps: [
      'Stand on the floor or a low chair beneath your 20mm edge with both hands in an open or half-crimp grip.',
      'Keep feet lightly grounded and gradually sink more bodyweight into your fingers across 4 reps (~40%, 60%, 75%, 90%).',
      'Keep shoulders gently packed down away from your ears and arms nearly straight.'
    ],
    cue: 'Stop immediately if you feel any sharp pulley tweak—warm fingers should feel recruited, not pumped.',
    goutNote: 'Keep weight balanced in your midfoot/heels on the support rather than pressing hard on the big toe.'
  },
  {
    id: 'ex_max_hangs',
    category: 'strength',
    name: '20mm Max Hangs (Half-Crimp)',
    where: 'Strength A',
    dose: '5×8–10s · 3m rest',
    steps: [
      'Place all 4 finger pads on the 20mm edge. Bend middle finger joints (PIP) to ~90° with last joints straight/slightly extended—keep your thumb relaxed beside your index (never wrapped over it).',
      'Engage shoulders ("pack" scapulae down) with a tiny micro-bend in the elbows.',
      'Lift feet smoothly off a chair, hold dead still for 8–10s, then set feet gently back onto the chair before releasing.'
    ],
    cue: 'If fingers start opening before 8s, reduce added weight or take a bit of load off with one foot on a chair.',
    goutNote: 'Always step down gently onto a chair—never drop off the hangboard onto your feet.'
  },
  {
    id: 'ex_repeaters',
    category: 'strength',
    name: '20mm Repeaters (7:3)',
    where: 'Strength B',
    dose: '4 sets × 6 reps · 3m rest',
    steps: [
      'Select the built-in 7:3×6 timer preset. Set fingers on the 20mm edge in an open-hand drag or half-crimp.',
      'Hang for 7s with engaged shoulders, then touch feet down to a chair for exactly 3s without leaving the edge.',
      'Complete 6 consecutive reps (1 set), then rest a full 3 minutes before the next set.'
    ],
    cue: 'Aim for rep 6 of set 4 to feel challenging (~8/10) without losing grip form.',
    goutNote: 'Keep a chair directly underneath so every 3s rest is a gentle touch-down, not a mini drop.'
  },
  {
    id: 'ex_heavy_pullups',
    category: 'strength',
    name: 'Heavy Pull-Ups (Weighted / L-Sit / Archer)',
    where: 'Strength A',
    dose: '4×3–5 reps · 3m rest',
    steps: [
      'Grip the bar slightly wider than shoulder-width and start from an active hang (shoulders pulled down, ribs tucked).',
      'Drive elbows down toward your hips until collarbone/chin clears the bar, then lower with a controlled 2–3s tempo.',
      'Scale intensity with a weighted backpack, legs held in an L-sit, or Archer pull-ups (pulling toward one hand while the other arm stays straight).'
    ],
    cue: 'Initiate every rep by pulling shoulder blades down—zero kipping or neck craning.',
    goutNote: 'Step down onto a chair at the end of each set instead of dropping to the floor.'
  },
  {
    id: 'ex_explosive_pullups',
    category: 'strength',
    name: 'Explosive Pull-Ups',
    where: 'Strength B',
    dose: '3×4–5 reps · 3m rest',
    steps: [
      'Start from an active hang on a pull-up bar with a shoulder-width overhand grip.',
      'Pull as fast and powerfully as possible, driving elbows down so your lower chest rises toward the bar.',
      'Lower under control and pause 1 second at the bottom so every rep starts fresh.'
    ],
    cue: 'Stop the set as soon as pulling speed noticeably drops—this trains power, not grinding.',
    goutNote: 'Step down softly onto a chair after the final rep.'
  },
  {
    id: 'ex_lockoffs',
    category: 'strength',
    name: 'Isometric 90° Lock-Offs',
    where: 'Strength B',
    dose: '3×10–15s · 2.5m rest',
    steps: [
      'Pull up until elbows are bent at ~90° (upper arms roughly parallel to the floor) and shoulders are packed down.',
      'Freeze completely still, bracing core and glutes to prevent swinging.',
      'Hold for 10–15 seconds, then lower smoothly and step down onto a chair.'
    ],
    cue: 'Keep shoulders pulled back and down rather than rolling forward toward your ears.',
    goutNote: 'Step down gently onto a chair instead of dropping.'
  },
  {
    id: 'ex_leg_raises',
    category: 'strength',
    name: 'Hanging Leg Raises / Front Lever Tucks',
    where: 'Strength A',
    dose: '3×6–10 slow · 2m rest',
    steps: [
      'Hang from a bar with active shoulders and zero body swing.',
      'Leg Raises: Tuck your tailbone under and lift straight legs (or bent knees) smoothly toward the bar; pause 1s at the top and lower slowly.',
      'Front Lever Tucks: Pull knees tightly to your chest and push down on the bar with straight arms until your back is horizontal; hold 5–10s or do slow raises.'
    ],
    cue: 'Curl your pelvis upward—if your hips only hinge, your hip flexors do the work instead of your abs.'
  },
  {
    id: 'ex_copenhagen',
    category: 'strength',
    name: 'Copenhagen Planks',
    where: 'Strength B',
    dose: '3 rounds · 20–30s/side',
    steps: [
      'Lie on your side with your bottom forearm on the floor (elbow directly under shoulder) and your top leg resting on a bench, couch, or chair.',
      'Easier: rest your top knee/shin on the support. Harder: rest only your top ankle/inner foot.',
      'Press the top leg down into the support to lift your hips into a straight side-plank line, hovering your bottom leg off the floor.'
    ],
    cue: 'Keep hips stacked vertically (no rolling backward) and squeeze your inner thigh continuously.',
    goutNote: 'Use the knee/shin variation on Yellow toe days so there is zero pressure on your foot.'
  },
  {
    id: 'ex_hollow_body',
    category: 'strength',
    name: 'Hollow Body Holds',
    where: 'Strength B · Red Mod',
    dose: '3×40s',
    steps: [
      'Lie on your back, flatten your lower back firmly into the floor (zero gap), and lift your shoulder blades off the mat.',
      'Reach arms overhead by your ears and hover straight legs a few inches off the floor in a shallow banana curve.',
      'To scale down, tuck one or both knees in or reach arms forward until your lower back stays glued down.'
    ],
    cue: 'If your lower back arches off the floor, bend your knees slightly or end the hold.',
    goutNote: '100% floor-based—safe even on Red flare days.'
  },

  // PREHAB & ANTAGONISTS
  {
    id: 'ex_pushups',
    category: 'prehab',
    name: 'Push-Ups / Pike Push-Ups',
    where: 'Prehab',
    dose: '3×10–15 reps',
    steps: [
      'Push-Ups: Hands slightly wider than shoulders, rigid plank body, elbows angled ~45° from ribs. Lower chest near the floor and press up with a slight shoulder protraction at the top.',
      'Pike Push-Ups: Start in an inverted V (downward dog), lower the top of your head forward in front of your hands (triangle), then press back up.'
    ],
    cue: 'Keep ribs tucked and glutes squeezed so your lower back never sags.',
    goutNote: 'Drop to your knees (or elevate hands) if your big toe is stiff so you avoid forcing toe extension.'
  },
  {
    id: 'ex_scap_pullups',
    category: 'prehab',
    name: 'Scapular Pull-Ups',
    where: 'Prehab · Strength A',
    dose: '3×10 · 2s squeeze',
    steps: [
      'Hang from a bar with completely straight arms, letting shoulders glide gently up toward your ears.',
      'Keeping elbows 100% locked straight, pull shoulder blades down and slightly together so your body rises a few inches.',
      'Hold the top squeeze for 2 full seconds, then lower slowly back to the start.'
    ],
    cue: 'Think "slide your shoulder blades into your back pockets" without bending your elbows.'
  },
  {
    id: 'ex_ytw',
    category: 'prehab',
    name: 'Prone Floor Y-T-Ws',
    where: 'Prehab · Red Mod',
    dose: '3×8 each letter',
    steps: [
      'Lie face down with forehead resting on a folded towel and neck relaxed.',
      'Y: Arms overhead at 45° (thumbs up), lift off the floor, pause 1s, lower. T: Arms straight out to sides (thumbs up), squeeze shoulder blades and lift.',
      'W: Bend elbows to 90° near your ribs (thumbs up), lift forearms and elbows while squeezing mid-back.'
    ],
    cue: 'Move slowly with zero momentum—keep feet and lower ribs relaxed on the floor.',
    goutNote: '100% floor-based—safe on Red flare days.'
  },
  {
    id: 'ex_wrist_ext',
    category: 'prehab',
    name: 'Eccentric Wrist Extensions',
    where: 'Prehab',
    dose: '3×15/arm · 3–4s lower',
    steps: [
      'Sit with your forearm resting flat on your thigh or a table, palm facing DOWN, wrist just past the edge.',
      'Hold a light 1–2 kg weight (or full water bottle). Use your FREE hand to assist lifting the back of the working hand all the way up.',
      'Release the helper hand and slowly lower the weight down over 3–4 seconds using only the working forearm.'
    ],
    cue: "The slow lowering builds tendon resilience against climber's and tennis elbow."
  },
  {
    id: 'ex_finger_extensors',
    category: 'prehab',
    name: 'Finger Extensor Openers',
    where: 'Prehab',
    dose: '3×20 reps',
    steps: [
      "Loop a rubber band or climber's extensor band around all 5 fingertips (or open your hand inside a bucket of rice).",
      'Spread all fingers and thumb wide open against the resistance until fully extended.',
      'Pause briefly at full spread, then close smoothly with control.'
    ],
    cue: 'Balances heavy crimping by strengthening the opposing muscles on the back of your forearm.'
  },
  {
    id: 'ex_tendon_glides',
    category: 'prehab',
    name: 'Tendon Glides',
    where: 'Prehab · Rest · Low-Energy',
    dose: '2×10 slow reps',
    steps: [
      'Hold your hand upright with wrist neutral and glide smoothly through 4 positions (~1s pause each):',
      '1. Straight hand (fingers straight & together) → 2. Hook fist (bend top two finger joints like a claw, knuckles straight).',
      '3. Full fist (curl all joints gently into palm) → 4. Tabletop (knuckles bent 90°, fingers straight) → back to Straight.'
    ],
    cue: 'Zero hard squeezing—this gently pumps synovial fluid through your finger tendon sheaths.',
    goutNote: 'Zero foot load; ideal for Rest and Red flare days.'
  },

  // FOOT ARCH BLOCK
  {
    id: 'ex_foot_doming',
    category: 'foot',
    name: 'Foot Doming (Short-Foot)',
    where: 'Daily Foot Arch · Low-Energy',
    dose: '3×10 · 5s hold',
    steps: [
      'Sit barefoot with feet flat (or stand on Green days). Keep all toes long and relaxed—do NOT curl or claw them.',
      'Gently try to slide the ball of your foot backward toward your heel without moving your foot across the floor.',
      'Feel the middle of your arch subtly lift ("dome") while keeping heel, big-toe mound, and pinky mound grounded. Hold 5s, relax.'
    ],
    cue: 'It is a small, subtle squeeze—if your toes curl, dial the effort back by half.',
    goutNote: 'Stay seated on Yellow days; skip entirely during Red flares.'
  },
  {
    id: 'ex_toe_yoga',
    category: 'foot',
    name: 'Toe Yoga',
    where: 'Daily Foot Arch',
    dose: '3×10/foot',
    steps: [
      'Sit or stand barefoot with feet flat. Press the 4 smaller toes gently down and lift ONLY your big toe.',
      'Lower the big toe, press it gently down, and lift ONLY your 4 smaller toes.',
      'Alternate slowly for 10 reps per foot without rolling your ankle inward or outward.'
    ],
    cue: "If toes won't separate at first, lightly hold the grounded toes down with your fingers to cue the pattern.",
    goutNote: 'Seated and strictly pain-free range only on Yellow days; skip on Red flares.'
  },
  {
    id: 'ex_towel_scrunches',
    category: 'foot',
    name: 'Towel Scrunches',
    where: 'Daily Foot Arch',
    dose: '2×30–45s/foot',
    steps: [
      'Sit barefoot with a flat hand towel spread out on a smooth floor in front of you.',
      'Anchor your heel firmly on the near edge of the towel.',
      'Grab and pull the towel toward you in smooth, rhythmic toe scrunches for 30–45s, then smooth it out and switch feet.'
    ],
    cue: 'Keep your heel planted on the floor so your intrinsic arch muscles do the work.',
    goutNote: 'Green days only—skip on Yellow and Red days.'
  },
  {
    id: 'ex_heel_raises',
    category: 'foot',
    name: 'Controlled Heel Raises',
    where: 'Daily Foot Arch',
    dose: '3×10–12 · 3s lower',
    steps: [
      'Stand barefoot holding a wall or chair lightly for balance, feet hip-width apart.',
      'Rise smoothly onto the balls of your feet, pressing weight evenly through toes 2–4 so your ankles stay straight.',
      'Pause 1 second at the top, then lower heels down over a slow 3-second count.'
    ],
    cue: 'Avoid dumping all weight solely into the big-toe joint—spread pressure across the whole forefoot.',
    goutNote: 'Green days only—skip on Yellow and Red days.'
  },

  // CLIMBING MOBILITY FLOW
  {
    id: 'ex_90_90',
    category: 'mobility',
    name: '90/90 Hip Switches',
    where: 'Daily Mobility · Low-Energy',
    dose: '10 slow switches',
    steps: [
      'Sit on the floor with your front leg bent 90° in front and back leg bent 90° to the side. Place hands behind you for support (or hover hands in front).',
      'Keep heels anchored on the floor and smoothly lift both knees to rotate your hips across into the mirrored 90/90 position.',
      'Sit tall for a beat on each side before rotating back.'
    ],
    cue: 'Lead each switch by opening the trailing knee first to unlock climbing hip turnout.',
    goutNote: 'Floor-only and completely safe on Yellow and Red days.'
  },
  {
    id: 'ex_frog_stretch',
    category: 'mobility',
    name: 'Frog Stretch w/ Rock-Backs',
    where: 'Daily Mobility',
    dose: '2×45–60s',
    steps: [
      'Start on hands and knees on a mat. Slide knees wide apart with ankles directly behind knees and inner edges of feet flat.',
      'Lower onto your forearms with a neutral (not overly arched) lower back.',
      'Slowly rock your hips back toward your heels for 2–3s to deepen the inner-thigh stretch, then glide gently forward. Repeat.'
    ],
    cue: 'Exhale as you rock back—never force through sharp pinching at the front of the hip.',
    goutNote: 'Keep ankles relaxed on the mat (zero big-toe pressure); safe on Red flare days.'
  },
  {
    id: 'ex_deep_squat',
    category: 'mobility',
    name: 'Deep Squat Hold',
    where: 'Daily Mobility',
    dose: '60s hold',
    steps: [
      'Stand slightly wider than shoulder-width with toes angled out 15–30°.',
      'Sink into a deep resting squat with weight anchored in your heels and midfoot (hold a doorframe or place a rolled mat under heels if needed).',
      'Gently press elbows against the inside of your knees to open your hips while keeping your chest tall.'
    ],
    cue: 'Slow nasal breaths help your hips settle deeper over the 60 seconds.',
    goutNote: 'Keep weight in heels/midfoot; skip on Red flare days.'
  },
  {
    id: 'ex_cossack',
    category: 'mobility',
    name: 'Cossack Squats',
    where: 'Daily Mobility',
    dose: '6 reps/side',
    steps: [
      'Take a wide stance (~1.5–2× shoulder width) with toes turned slightly out.',
      'Shift weight over one leg and bend that knee deeply into a side squat while the opposite leg stays straight with toes pointing up.',
      'Keep the working heel flat on the floor. Drive through heel/midfoot to rise (or stay low and shift across) to the other side.'
    ],
    cue: 'Touch fingertips to the floor or hold a doorframe for balance until hips open up.',
    goutNote: 'Keep working weight in heel/midfoot; skip on Red flare days.'
  },
  {
    id: 'ex_elephant_walks',
    category: 'mobility',
    name: 'Elephant Walks',
    where: 'Daily Mobility',
    dose: '20 reps/leg',
    steps: [
      'Stand hip-width apart, hinge at the hips, and plant both hands on the floor (or on blocks/a low stool) with knees softly bent.',
      'Slowly straighten your left knee until you feel a clear hamstring stretch while the right knee stays bent.',
      'Alternate straightening one leg at a time in place like a slow march for 20 reps per leg.'
    ],
    cue: 'Keep hands firmly planted at your chosen height—use blocks rather than bouncing.',
    goutNote: 'Keep weight in midfoot/heels; swap for Seated Hamstring Stretch on Red flare days.'
  },
  {
    id: 'ex_seated_hamstring',
    category: 'mobility',
    name: 'Seated Hamstring Stretch',
    where: 'Daily Mobility (Red Mod)',
    dose: '2×45s/side',
    steps: [
      'Sit on the floor with one leg extended straight out and the other foot tucked lightly against your inner thigh.',
      'Lengthen your spine and hinge forward from the hips (chest toward thigh, not nose rounding to knee) until you feel a steady stretch.',
      'Hold 45 seconds with slow exhales, then switch legs.'
    ],
    cue: "Keep the extended ankle relaxed—don't yank back on your toes.",
    goutNote: 'Zero-weight-bearing Red flare substitute for Elephant Walks.'
  },
  {
    id: 'ex_thread_needle',
    category: 'mobility',
    name: 'Thread the Needle',
    where: 'Daily Mobility',
    dose: '6 reps/side',
    steps: [
      'Start on hands and knees (wrists under shoulders, knees under hips).',
      'Inhale and reach your right arm up toward the ceiling, opening your chest.',
      'Exhale and slide ("thread") your right arm under your left armpit until your right shoulder and temple rest lightly on the mat. Pause 2–3s, then press back up.'
    ],
    cue: 'Keep hips stacked over knees so the rotation comes from your upper back, not lower back.',
    goutNote: 'Floor-only and completely safe on Yellow and Red days.'
  },
  {
    id: 'ex_dead_hang',
    category: 'mobility',
    name: 'Passive Dead Hang',
    where: 'Daily Mobility',
    dose: '2×30–45s',
    steps: [
      'Grip a pull-up bar shoulder-width with palms facing away.',
      'Step gently off a chair and let gravity decompress your spine and shoulders (allow shoulders to rise gently if pain-free; keep light engagement if pinchy).',
      'Take slow, deep breaths for 30–45s, then step smoothly back onto the chair.'
    ],
    cue: 'Exhale long and slow to let your lats and upper back release tension.',
    goutNote: 'Always step down softly onto a chair; skip on Red flare days.'
  },

  // GYM DRILLS
  {
    id: 'ex_silent_hover',
    category: 'gym',
    name: 'Silent Feet & Hover Hands',
    where: 'Gym Warm-Up',
    dose: '8–10 easy boulders (V0–V3)',
    steps: [
      'Silent Feet: Watch your toe all the way onto every foothold and place it with zero tapping or scraping—no micro-adjusting once placed.',
      'Hover Hands: Pause with your hand hovering 2 inches over each next handhold for a full 2 seconds before grabbing it, holding tension through your feet and core.'
    ],
    cue: 'Builds precision footwork and quiet hips before you step onto limit boulders.',
    goutNote: 'On Yellow days, use large holds, smears, and heel hooks—skip sharp micro-jibs.'
  },
  {
    id: 'ex_downclimbing',
    category: 'gym',
    name: 'Controlled Downclimbing',
    where: 'Climbing Gym Rule',
    dose: 'Every boulder',
    steps: [
      'After matching the finish hold, never jump straight down from the top of the wall.',
      'Use downclimb jugs or nearby large holds to climb back down until your feet are 1–2 feet above the mat, then step down softly.'
    ],
    cue: 'Also sneaks in extra footwork practice and aerobic recovery capacity.',
    goutNote: 'Repeated mat impacts quickly irritate the big-toe joint—downclimbing keeps you climbing consistently.'
  },

  // BODYBUILDING GYM (OPTIONAL VISITS)
  {
    id: 'ex_bb_incline_db_press',
    category: 'bodybuilding',
    name: 'Incline Dumbbell Press',
    where: 'Weights Gym · Upper Push / Full Body',
    dose: '3×8–10 · 2m rest',
    steps: [
      'Set an adjustable bench to a 30° incline (one or two notches up from flat). Sit back with shoulder blades gently pinched down and feet resting flat.',
      'Hold dumbbells just outside your upper chest with elbows angled ~45° from your ribs (not flared out to 90°).',
      'Press smoothly up until arms are straight over your upper chest, then lower with a controlled 2–3s tempo.'
    ],
    cue: 'Balances climbing pulling muscles while keeping shoulders in a joint-friendly pressing path.',
    goutNote: 'Keep feet flat and relaxed on the floor—avoid driving up onto your toes for leg drive.'
  },
  {
    id: 'ex_bb_seated_ohp',
    category: 'bodybuilding',
    name: 'Seated Dumbbell Overhead Press',
    where: 'Weights Gym · Upper Push / Full Body',
    dose: '3×8–10 · 2m rest',
    steps: [
      'Set the bench back nearly vertical (~80–85°). Sit tall with ribs stacked over hips and dumbbells resting at ear height.',
      'Angle elbows slightly forward (~30° in front of your torso rather than pinned straight out to the sides).',
      'Press smoothly overhead without arching your lower back off the pad, then lower under control back to ear level.'
    ],
    cue: 'Builds overhead stability for mantles and press-out moves without straining your lower back.',
    goutNote: 'Seated with flat feet—safe on Green, Yellow, and mild Red days.'
  },
  {
    id: 'ex_bb_face_pulls',
    category: 'bodybuilding',
    name: 'Cable Face Pulls',
    where: 'Weights Gym · Upper Push / Full Body',
    dose: '3×15 · 90s rest',
    steps: [
      'Set a rope attachment on a cable stack at upper-chest or eye height and grab it with thumbs pointing back toward you.',
      'Step back into a light tension stance and pull the rope toward your forehead/ears while pulling the handles apart.',
      'At the finish, rotate your hands back so your knuckles point behind you (double-bicep pose), pause 1s, then return slowly.'
    ],
    cue: 'Lead with your wrists and thumbs—not your elbows—to truly hit external rotators and rear delts.',
    goutNote: 'Do seated on a bench or swap to the Rear Delt Fly Machine on Red flare days.'
  },
  {
    id: 'ex_bb_dips_pushdowns',
    category: 'bodybuilding',
    name: 'Dips / Cable Tricep Pushdowns',
    where: 'Weights Gym · Upper Push',
    dose: '3×10–12 · 90s rest',
    steps: [
      'Dips (assisted or bodyweight): Support yourself on parallel bars with shoulders pushed down away from ears; lower smoothly until upper arms are roughly parallel to the floor, then press back up.',
      'Cable Pushdowns (joint-friendly option): Pin elbows gently at your sides and press the rope/bar down to full arm extension, flaring the rope slightly at the bottom.'
    ],
    cue: 'Stop dips just before shoulders roll forward—mantle strength comes from clean bottom control.',
    goutNote: 'Step down softly from dip bars (never hop down); use seated machine dips or overhead extensions on Red days.'
  },
  {
    id: 'ex_bb_lateral_raises',
    category: 'bodybuilding',
    name: 'Lateral Raises (DB or Cable)',
    where: 'Weights Gym · Upper Push',
    dose: '3×12–15 · 60s rest',
    steps: [
      'Hold light dumbbells at your sides (or a single low cable) with a tiny micro-bend in your elbows.',
      'Raise your arms out to the sides slightly forward of your torso (~20–30° scapular plane) up to shoulder height.',
      'Pause briefly at the top without shrugging your traps, then lower slowly over 2–3 seconds.'
    ],
    cue: 'Think "reach your knuckles toward the walls" rather than lifting weights straight up.',
    goutNote: 'Perform seated on a bench on Yellow or Red days.'
  },
  {
    id: 'ex_bb_pallof_press',
    category: 'bodybuilding',
    name: 'Cable Pallof Press',
    where: 'Weights Gym · Upper Push',
    dose: '3×12/side · 60s rest',
    steps: [
      'Set a single D-handle at chest height, stand sideways to the cable stack, and hold the handle centered at your sternum with both hands.',
      'Brace your abs and glutes hard, then press your hands straight out in front of your chest without letting the cable twist your torso.',
      'Hold fully extended for 1–2 seconds, pull back to your chest, and repeat all reps before switching sides.'
    ],
    cue: 'Directly trains anti-rotation tension so you stop barn-dooring on steep overhangs.',
    goutNote: 'Keep weight evenly balanced across midfoot/heels; perform half-kneeling or seated on a bench if toe is sensitive.'
  },
  {
    id: 'ex_bb_chest_supported_row',
    category: 'bodybuilding',
    name: 'Chest-Supported Row',
    where: 'Weights Gym · Full Body',
    dose: '3×10–12 · 2m rest',
    steps: [
      'Lie chest-down on a 30° incline bench with dumbbells (or use a chest-supported row machine) so your torso is fully braced.',
      'Pull your elbows back toward your hips, squeezing your shoulder blades together for 1 second at the top.',
      'Lower all the way down into a smooth stretch before starting the next rep.'
    ],
    cue: 'Use lifting straps or an open hook grip if your fingers are tired from climbing—save grip strength for the wall.',
    goutNote: 'Zero lower-body or toe impact.'
  },
  {
    id: 'ex_bb_rdl',
    category: 'bodybuilding',
    name: 'Romanian Deadlift (RDL)',
    where: 'Weights Gym · Full Body / Lower Body',
    dose: '3×8–10 · 2–3m rest',
    steps: [
      'Stand hip-width holding dumbbells or a barbell against your thighs, knees softly unlocked (~10–15° bend).',
      'Push your hips straight backward like closing a car door with your glutes, sliding weights close along your legs until you feel a strong hamstring stretch (usually mid-shin).',
      'Drive through your heels and midfoot to snap hips back upright, squeezing glutes at the top.'
    ],
    cue: 'Keep your spine neutral and weights touching your legs—stop descending the moment your hips stop moving back.',
    goutNote: 'Green days only with flat feet and heel/midfoot pressure. Swap to Seated Hamstring Curls on Yellow/Red days.'
  },
  {
    id: 'ex_bb_leg_press',
    category: 'bodybuilding',
    name: 'Leg Press (Heel-Driven)',
    where: 'Weights Gym · Full Body / Lower Body',
    dose: '3×10–12 · 2m rest',
    steps: [
      'Place feet slightly higher and wider than center on the sled with toes turned out ~15°.',
      'Lower the sled smoothly until knees reach ~90° while keeping your lower back and glutes glued to the seat pad.',
      'Drive the sled back up strictly through your heels and midfoot without locking your knees hard at the top.'
    ],
    cue: 'Higher foot placement shifts work toward glutes and hamstrings while reducing forefoot pressure.',
    goutNote: 'Green days only—swap to Leg Extension + Seated Hamstring Curl on Yellow/Red days.'
  },
  {
    id: 'ex_bb_seated_leg_machines',
    category: 'bodybuilding',
    name: 'Seated Hamstring Curl & Leg Extension',
    where: 'Weights Gym · Lower Body / Yellow Mod',
    dose: '3×12–15 · 90s rest',
    steps: [
      'Seated Hamstring Curl: Lock the lap pad snugly over your thighs, align knees with the pivot point, and pull the ankle pad back smoothly—pause 1s in full squeeze (direct heel-hook carryover!).',
      'Leg Extension: Set the shin pad just above your ankles, sit back firmly, extend legs smoothly to full contraction, and lower over 2–3s.'
    ],
    cue: 'Control the lowering (eccentric) phase for 2–3 seconds on every rep.',
    goutNote: 'Zero weight on the big-toe joint—the ideal Yellow-day lower-body choice.'
  },
  {
    id: 'ex_bb_hammer_curls',
    category: 'bodybuilding',
    name: 'Hammer Curls / Reverse Curls',
    where: 'Weights Gym · Full Body',
    dose: '2×12–15 · 60s rest',
    steps: [
      'Hold dumbbells at your sides with palms facing inward (thumbs pointing up for Hammer Curls, or palms down on an EZ-bar for Reverse Curls).',
      'Keep elbows quiet by your ribs and curl smoothly up, squeezing at the top, then lower slowly over 3 seconds.'
    ],
    cue: 'Great brachialis and forearm extensor armor against climber elbow tendinitis.',
    goutNote: 'Can be done seated on a bench anytime.'
  },
  {
    id: 'ex_bb_hip_machines',
    category: 'bodybuilding',
    name: 'Hip Abduction / Adduction Machine',
    where: 'Weights Gym · Lower Body',
    dose: '3×15 · 60s rest',
    steps: [
      'Sit tall with your back against the pad and knee pads snug against the outside (Abduction) or inside (Adduction) of your knees/thighs.',
      'Push outward or squeeze inward through a smooth, controlled full range of motion, pausing 1s at peak contraction.'
    ],
    cue: 'Strengthens glute medius and adductors for wide stems, drop knees, and knee stability on the wall.',
    goutNote: 'Seated with zero big-toe load—safe on Green and Yellow days.'
  }
];
