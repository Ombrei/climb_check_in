// Client-side Gemini API integration (BYOK stored only in localStorage)
import {
  BODYBUILDING_PROGRAMS,
  GOUT_CONFIG,
  PLAN_META,
  WATER_GOAL_ML
} from '../data/plans.js';
import { buildTasksForDay, recommendBodybuildingProgram } from '../data/workouts.js';
import { DAY_NAMES, formatDateKey, formatDisplayDate, wasYesterdayHighIntensity } from './dates.js';
import { resolveEffectivePlan } from './storage.js';

const GEMINI_CONFIG_KEY = 'climb_checkin_gemini_v1';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

export const GEMINI_MODELS = [
  { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash (Recommended)' },
  { id: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash-Lite (Fastest)' },
  { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro (Most Capable)' }
];

export const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';

let memoryConfig = { apiKey: '', model: DEFAULT_GEMINI_MODEL };

export function loadGeminiConfig() {
  try {
    const raw = window.localStorage.getItem(GEMINI_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const validModel = GEMINI_MODELS.some((m) => m.id === parsed.model)
        ? parsed.model
        : DEFAULT_GEMINI_MODEL;
      memoryConfig = {
        apiKey: typeof parsed.apiKey === 'string' ? parsed.apiKey.trim() : '',
        model: validModel
      };
      return { ...memoryConfig };
    }
  } catch (err) {
    return { ...memoryConfig };
  }
  return { ...memoryConfig };
}

export function saveGeminiConfig({ apiKey, model }) {
  const validModel = GEMINI_MODELS.some((m) => m.id === model) ? model : DEFAULT_GEMINI_MODEL;
  memoryConfig = {
    apiKey: typeof apiKey === 'string' ? apiKey.trim() : '',
    model: validModel
  };
  try {
    window.localStorage.setItem(GEMINI_CONFIG_KEY, JSON.stringify(memoryConfig));
  } catch (err) {
    // Gracefully keep in-memory fallback if storage is unavailable
  }
  return { ...memoryConfig };
}

export function clearGeminiKey() {
  return saveGeminiConfig({ apiKey: '', model: memoryConfig.model });
}

export function hasGeminiKey() {
  return Boolean(loadGeminiConfig().apiKey);
}

function getYesterdaySummary(appState, activeDateObj) {
  const prevDate = new Date(activeDateObj.getTime());
  prevDate.setDate(prevDate.getDate() - 1);
  const prevKey = formatDateKey(prevDate);

  if (!appState.loggedDates.includes(prevKey)) {
    return 'Not logged';
  }

  const prevRecord = appState.days[prevKey];
  const prevPlanKey =
    prevRecord && prevRecord.loggedPlanType
      ? prevRecord.loggedPlanType
      : resolveEffectivePlan(appState, prevDate.getDay(), prevRecord || { planOverride: 'auto' });
  const prevMeta = PLAN_META[prevPlanKey];
  const prevLabel = prevMeta ? prevMeta.label : prevPlanKey;

  if (prevPlanKey === 'bodybuilding' && prevRecord && prevRecord.bodybuildingProgram) {
    const prog = BODYBUILDING_PROGRAMS[prevRecord.bodybuildingProgram];
    return prog ? `${prevLabel} (${prog.label})` : prevLabel;
  }
  return prevLabel;
}

export function buildCoachSystemPrompt(appState, ctx) {
  const { dateObj, weekday, record, effectivePlan } = ctx;
  const dayLabel = DAY_NAMES[weekday];
  const dateStr = formatDisplayDate(dateObj);
  const gCfg = GOUT_CONFIG[record.gout] || GOUT_CONFIG.green;
  const hadHighIntensityYesterday = wasYesterdayHighIntensity(appState, dateObj);
  const bbRec = recommendBodybuildingProgram({ gout: record.gout, hadHighIntensityYesterday });
  const activeBbProgram =
    record.bodybuildingProgram && BODYBUILDING_PROGRAMS[record.bodybuildingProgram]
      ? record.bodybuildingProgram
      : bbRec.programKey;

  const tasks = buildTasksForDay(effectivePlan, record.gout, record.lowEnergy, activeBbProgram);
  const taskLines = tasks
    .map((t) => {
      const status = record.completedTasks[t.id] ? 'DONE' : 'TODO';
      return `- [${status}] ${t.title} (${t.meta})`;
    })
    .join('\n');

  const planMeta = PLAN_META[effectivePlan] || PLAN_META.rest;
  const waterLiters = (record.waterMl / 1000).toFixed(2);
  const waterGoalLiters = (WATER_GOAL_ML / 1000).toFixed(2);
  const yesterdaySummary = getYesterdaySummary(appState, dateObj);

  const activeBbMeta = BODYBUILDING_PROGRAMS[activeBbProgram];
  const recBbMeta = BODYBUILDING_PROGRAMS[bbRec.programKey];

  return [
    'You are the built-in AI Climbing & Recovery Coach inside "Climb Check-In", a minimalist ADHD-friendly, gout-safe bouldering & mobility app.',
    '',
    'USER PROFILE & COACHING STYLE:',
    '- Bouldering climber (~V5-V6 level) training with a 20mm hangboard, home pull-up bar, climbing gym, and occasional optional bodybuilding gym visits.',
    '- Has a gout-sensitive big toe: always respect the Big Toe Traffic Light (Green = full plan + downclimb all boulders; Yellow = seated foot work only, overhangs/hooks, zero sharp jibs, no standing leg loads that jam the big toe; Red = active flare, rest & elevate foot, zero foot/lower-body impact, 3.0L+ hydration).',
    '- Takes daily prebiotics and creatine (3-5g) with plenty of water.',
    '- ADHD-friendly tone: concise, encouraging, practical, scannable bullet points. Zero guilt, zero streak pressure—every check-in counts.',
    '- Keep answers tight (roughly 80-180 words unless the user asks for a full breakdown).',
    '- Medical safety: give general training/exercise modification advice only; for acute gout flares, severe joint pain, or medication questions, remind the user to follow their doctor\'s guidance.',
    '',
    'LIVE APP CONTEXT FOR THE CURRENTLY VIEWED DAY:',
    `- Viewed Date: ${dayLabel}, ${dateStr}`,
    `- Big Toe Gout Status: ${record.gout.toUpperCase()} (${gCfg.label}) — Rule: ${gCfg.guidance}`,
    `- Low-Energy Mode (5-min floor): ${record.lowEnergy ? 'ON' : 'OFF'}`,
    `- Active Plan: ${planMeta.label}${effectivePlan === 'bodybuilding' && activeBbMeta ? ` — ${activeBbMeta.label}` : ''}`,
    `- Recommended Bodybuilding Program Today (if visiting weights gym): ${recBbMeta ? recBbMeta.label : 'Upper Push & Antagonists'} (${bbRec.reason})`,
    `- Yesterday's Logged Session: ${yesterdaySummary}${hadHighIntensityYesterday ? ' (High finger/tendon intensity)' : ''}`,
    `- Hydration Today: ${waterLiters} / ${waterGoalLiters} L`,
    `- Total Days Shown Up (lifetime): ${appState.loggedDates.length}`,
    '- Today\'s Checklist:',
    taskLines
  ].join('\n');
}

function parseGeminiError(status, payload) {
  const apiMsg = payload && payload.error && payload.error.message ? payload.error.message : '';
  if (status === 400 && /API key not valid/i.test(apiMsg)) {
    return 'Invalid Gemini API key. Double-check your key in Settings → AI Coach.';
  }
  if (status === 401 || status === 403) {
    return 'API key rejected (401/403). Check your key permissions in Google AI Studio.';
  }
  if (status === 404) {
    return 'Selected Gemini model was not found. Try switching the model in Settings → AI Coach.';
  }
  if (status === 429) {
    return 'Rate limit reached (429). Wait a few seconds and try again, or switch to Flash-Lite.';
  }
  return apiMsg || `Gemini request failed (HTTP ${status}).`;
}

export async function sendCoachMessage({ apiKey, model, systemPrompt, history }) {
  const key = (apiKey || '').trim();
  if (!key) {
    throw new Error('No Gemini API key configured. Add your key in Settings → AI Coach.');
  }

  const modelId = model || DEFAULT_GEMINI_MODEL;
  const url = `${GEMINI_API_BASE}/${encodeURIComponent(modelId)}:generateContent`;

  const contents = history.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.text }]
  }));

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': key
    },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: systemPrompt }]
      },
      contents,
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 650
      }
    })
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch (err) {
    // Non-JSON response
  }

  if (!response.ok) {
    throw new Error(parseGeminiError(response.status, payload));
  }

  const candidate = payload && payload.candidates && payload.candidates[0];
  const parts = candidate && candidate.content && candidate.content.parts;
  const replyText = Array.isArray(parts)
    ? parts
        .map((p) => (typeof p.text === 'string' ? p.text : ''))
        .join('')
        .trim()
    : '';

  if (!replyText) {
    throw new Error('Gemini returned an empty response. Please try rephrasing your question.');
  }

  return replyText;
}

export async function testGeminiKey({ apiKey, model }) {
  const reply = await sendCoachMessage({
    apiKey,
    model,
    systemPrompt: 'Reply with only the word OK.',
    history: [{ role: 'user', text: 'Ping' }]
  });
  return Boolean(reply);
}
