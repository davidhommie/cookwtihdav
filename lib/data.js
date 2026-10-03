import { supabase } from './supabase';
import { DEFAULTS } from './defaults';
import { DEMO_MENU, DEMO_BRANCHES, DEMO_JOURNEY, DEMO_TEAM } from './demo';

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);

// Saved settings override the defaults one level deep. Falls back to defaults if Supabase is missing or empty.
export async function getSettings() {
  if (!supabase) return DEFAULTS;
  try {
    const { data } = await supabase.from('settings').select('data').eq('id', 1).maybeSingle();
    const saved = (data && data.data) || {};
    const out = { ...DEFAULTS };
    for (const k of Object.keys(saved)) out[k] = isObj(saved[k]) ? { ...DEFAULTS[k], ...saved[k] } : saved[k];
    return out;
  } catch (e) { return DEFAULTS; }
}

async function rows(table, demo) {
  if (!supabase) return demo;
  try {
    const { data } = await supabase.from(table).select('*').order('sort', { ascending: true });
    return data && data.length ? data : demo;
  } catch (e) { return demo; }
}
export const getMenu = () => rows('menu_items', DEMO_MENU);
export const getBranches = () => rows('branches', DEMO_BRANCHES);
export const getJourney = () => rows('journey', DEMO_JOURNEY);
export const getTeam = () => rows('team_members', DEMO_TEAM);
