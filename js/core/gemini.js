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

export const FALLBACK_GEMINI_MODELS = [
  { id: 'gemini-flash-latest', label: 'Gemini Flash (Auto-Latest)' },
  { id: 'gemini-pro-latest', label: 'Gemini Pro (Auto-Latest)' }
];

export const DEFAULT_GEMINI_MODEL = 'gemini-flash-latest';

let memoryConfig = {
  apiKey: '',
  model: DEFAULT_GEMINI_MODEL,
  models: [...FALLBACK_GEMINI_MODELS]
};

function sanitizeModelsList(list) {
  if (!Array.isArray(list) || list.length === 0) return [...FALLBACK_GEMINI_MODELS];
  const seen = new Set();
  const cleaned = [];
  list.forEach((m) => {
    if (m && typeof m.id === 'string' && m.id.trim() && !seen.has(m.id.trim())) {
      const id = m.id.trim();
      seen.add(id);
      cleaned.push({ id, label: typeof m.label === 'string' && m.label.trim() ? m.label.trim() : id });
    }
  });
  return cleaned.length > 0 ? cleaned : [...FALLBACK_GEMINI_MODELS];
}

export function loadGeminiConfig() {
  try {
    const raw = window.localStorage.getItem(GEMINI_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const models = sanitizeModelsList(parsed.models);
      const model =
        typeof parsed.model === 'string' && parsed.model.trim()
          ? parsed.model.trim()
          : models[0].id;
      memoryConfig = {
        apiKey: typeof parsed.apiKey === 'string' ? parsed.apiKey.trim() : '',
        model,
        models
      };
      return { ...memoryConfig, models: [...memoryConfig.models] };
    }
  } catch (err) {
    return { ...memoryConfig, models: [...memoryConfig.models] };
  }
  return { ...memoryConfig, models: [...memoryConfig.models] };
}

export function saveGeminiConfig({ apiKey, model, models }) {
  const current = loadGeminiConfig();
  const nextModels = models ? sanitizeModelsList(models) : current.models;
  const nextModel =
    typeof model === 'string' && model.trim()
      ? model.trim()
      : current.model || nextModels[0].id;

  memoryConfig = {
    apiKey: typeof apiKey === 'string' ? apiKey.trim() : current.apiKey,
    model: nextModel,
    models: nextModels
  };

  try {
    window.localStorage.setItem(GEMINI_CONFIG_KEY, JSON.stringify(memoryConfig));
  } catch (err) {
    // Gracefully keep in-memory fallback if storage is unavailable
  }
  return { ...memoryConfig, models: [...memoryConfig.models] };
}

export function clearGeminiKey() {
  return saveGeminiConfig({ apiKey: '', model: DEFAULT_GEMINI_MODEL, models: [...FALLBACK_GEMINI_MODELS] });
}

export function hasGeminiKey() {
  return Boolean(loadGeminiConfig().apiKey);
}

// Rank live Gemini models so the newest stable Flash chat model comes first
function scoreModelForChat(id) {
  const lower = id.toLowerCase();
  let score = 0;

  // Prefer rolling aliases or higher Gemini version numbers
  const verMatch = lower.match(/gemini-(\d+)(?:\.(\d+))?/);
  if (verMatch) {
    const major = parseInt(verMatch[1], 10) || 0;
    const minor = parseInt(verMatch[2] || '0', 10) || 0;
    score += major * 100 + minor * 10;
  }

  if (lower === 'gemini-flash-latest') score += 420;
  else if (lower.includes('flash-lite')) score += 45;
  else if (lower.includes('flash')) score += 60;
  else if (lower.includes('pro')) score += 35;

  // Slightly deprioritize preview/experimental/dated snapshots vs clean aliases
  if (lower.includes('exp') || lower.includes('preview')) score -= 12;
  if (/-\d{3,}$/.test(lower)) score -= 8;

  return score;
}

const EXCLUDED_MODEL_PATTERNS = [
  /embedding/i,
  /imagen/i,
  /veo/i,
  /tts/i,
  /audio/i,
  /image/i,
  /robotics/i,
  /computer-use/i,
  /deep-research/i,
  /nano-banana/i,
  /\baqa\b/i,
  /learnlm/i
];

export async function fetchAvailableModels(apiKey) {
  const key = (apiKey || '').trim();
  if (!key) {
    throw new Error('Paste a Gemini API key first.');
  }

  const response = await fetch(`${GEMINI_API_BASE}?pageSize=100`, {
    method: 'GET',
    headers: {
      'x-goog-api-key': key
    }
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

  const rawModels = Array.isArray(payload && payload.models) ? payload.models : [];
  const chatModels = rawModels
    .filter((m) => {
      const name = typeof m.name === 'string' ? m.name : '';
      const id = name.replace(/^models\//, '');
      const methods = Array.isArray(m.supportedGenerationMethods) ? m.supportedGenerationMethods : [];
      if (!methods.includes('generateContent')) return false;
      if (!/^gemini-/i.test(id)) return false;
      if (EXCLUDED_MODEL_PATTERNS.some((re) => re.test(id))) return false;
      return true;
    })
    .map((m) => {
      const id = m.name.replace(/^models\//, '');
      const display = typeof m.displayName === 'string' && m.displayName.trim() ? m.displayName.trim() : id;
      return {
        id,
        label: display.toLowerCase() === id.toLowerCase() ? id : `${display} (${id})`
      };
    })
    .sort((a, b) => scoreModelForChat(b.id) - scoreModelForChat(a.id));

  if (chatModels.length === 0) {
    throw new Error('No generateContent Gemini models were returned for this API key.');
  }

  return chatModels;
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
    return apiMsg
      ? `Model not found (404): ${apiMsg}`
      : 'Selected Gemini model was not found. Tap "Refresh" in Settings → AI Coach to load live models.';
  }
  if (status === 429) {
    return 'Rate limit reached (429). Wait a few seconds and try again, or pick a Flash/Lite model.';
  }
  return apiMsg || `Gemini request failed (HTTP ${status}).`;
}

async function postGenerateContent({ apiKey, modelId, systemPrompt, contents }) {
  const url = `${GEMINI_API_BASE}/${encodeURIComponent(modelId)}:generateContent`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey
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

  return { response, payload };
}

function extractReplyText(payload) {
  const candidate = payload && payload.candidates && payload.candidates[0];
  const parts = candidate && candidate.content && candidate.content.parts;
  return Array.isArray(parts)
    ? parts
        .map((p) => (typeof p.text === 'string' ? p.text : ''))
        .join('')
        .trim()
    : '';
}

export async function sendCoachMessage({ apiKey, model, systemPrompt, history }) {
  const key = (apiKey || '').trim();
  if (!key) {
    throw new Error('No Gemini API key configured. Add your key in Settings → AI Coach.');
  }

  let modelId = (model || DEFAULT_GEMINI_MODEL).trim();
  const contents = history.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.text }]
  }));

  let { response, payload } = await postGenerateContent({ apiKey: key, modelId, systemPrompt, contents });

  // Self-heal on 404 (deprecated/unavailable model): discover live models and retry once
  if (response.status === 404) {
    const liveModels = await fetchAvailableModels(key);
    const fallbackModel = liveModels.find((m) => m.id !== modelId) || liveModels[0];
    modelId = fallbackModel.id;
    saveGeminiConfig({ apiKey: key, model: modelId, models: liveModels });

    ({ response, payload } = await postGenerateContent({ apiKey: key, modelId, systemPrompt, contents }));
  }

  if (!response.ok) {
    throw new Error(parseGeminiError(response.status, payload));
  }

  const replyText = extractReplyText(payload);
  if (!replyText) {
    throw new Error('Gemini returned an empty response. Please try rephrasing your question.');
  }

  return replyText;
}

export async function testGeminiKey({ apiKey, model }) {
  const key = (apiKey || '').trim();
  if (!key) {
    throw new Error('Paste a Gemini API key first.');
  }

  // Always load live models available for this key first
  const liveModels = await fetchAvailableModels(key);
  const requested = (model || '').trim();
  const hasRequested = liveModels.some((m) => m.id === requested);
  const chosenModel = hasRequested ? requested : liveModels[0].id;
  const autoSwitched = Boolean(requested && !hasRequested);

  saveGeminiConfig({ apiKey: key, model: chosenModel, models: liveModels });

  await sendCoachMessage({
    apiKey: key,
    model: chosenModel,
    systemPrompt: 'Reply with only the word OK.',
    history: [{ role: 'user', text: 'Ping' }]
  });

  const finalConfig = loadGeminiConfig();
  return {
    modelUsed: finalConfig.model,
    models: finalConfig.models,
    autoSwitched: autoSwitched || finalConfig.model !== requested
  };
}
