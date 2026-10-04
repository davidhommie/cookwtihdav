'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { DEFAULTS } from '../../lib/defaults';
import { SETTINGS_TABS } from '../../lib/adminSchema';
import { Field, input } from './Fields';

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
const get = (o, p) => p.split('.').reduce((a, k) => (a ? a[k] : undefined), o);
const put = (o, p, v) => { const c = structuredClone(o); const k = p.split('.'); let t = c; k.slice(0, -1).forEach((x) => { t = t[x]; }); t[k[k.length - 1]] = v; return c; };
const okLink = (s) => typeof s === 'string' && (s === '' || s.startsWith('/') || /^https:\/\//i.test(s));

export default function SettingsEditor({ tab, toast }) {
  const spec = SETTINGS_TABS[tab];
  const [cfg, setCfg] = useState(null);

  useEffect(() => {
    setCfg(null);
    supabase.from('settings').select('data').eq('id', 1).maybeSingle().then(({ data }) => {
      const saved = (data && data.data) || {}; const out = structuredClone(DEFAULTS);
      for (const k of Object.keys(saved)) out[k] = isObj(saved[k]) ? { ...out[k], ...saved[k] } : saved[k];
      setCfg(out);
    });
  }, [tab]);

  if (!cfg) return <p className="text-ink/50">Loading...</p>;

  const save = async () => {
    const pk = String(get(cfg, 'payments.paystack.public_key') || '').trim();
    if (pk && !/^pk_(test|live)_[A-Za-z0-9]+$/.test(pk)) return toast('The Paystack public key must start with pk_test_ or pk_live_. Never paste a secret (sk_) key here.', true);
    if (!okLink(get(cfg, 'brand.logo_url'))) return toast('The logo must be an https link or an upload.', true);
    if (cfg.nav.some((n) => !okLink(n.href) || !n.href)) return toast('Each menu link must start with / or https://', true);
    for (const k of ['years', 'staff', 'locations', 'customers']) cfg.stats[k] = Math.max(0, Math.round(Number(cfg.stats[k]) || 0));
    const { error } = await supabase.from('settings').upsert({ id: 1, data: cfg });
    toast(error ? 'Could not save: ' + error.message : 'Saved. The site updates within a minute.', !!error);
  };

  return (
    <div className="space-y-8">
      {spec.fields.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {spec.fields.map((f) => (
            <div key={f.p} className={f.t === 'area' || f.t === 'logo' ? 'md:col-span-2' : ''}>
              <Field label={f.l} type={f.t} value={get(cfg, f.p)} onChange={(v) => setCfg(put(cfg, f.p, v))} onError={(m) => toast(m, true)} />
            </div>
          ))}
        </div>
      )}
      {spec.lists.map((L) => {
        const rows = get(cfg, L.p) || [];
        return (
          <div key={L.p}>
            <h3 className="mb-3 font-body text-lg font-black">{L.l}</h3>
            <div className="space-y-3">
              {rows.map((r, i) => (
                <div key={i} className="rounded-xl border border-ink/10 bg-paper p-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    {L.f.map(([k, l, t]) => (
                      <div key={k} className={t === 'area' ? 'md:col-span-2' : ''}>
                        <Field label={l} type={t || 'text'} value={r[k]} onChange={(v) => setCfg(put(cfg, L.p, rows.map((x, j) => (j === i ? { ...x, [k]: v } : x))))} />
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={() => setCfg(put(cfg, L.p, rows.filter((_, j) => j !== i)))} className="mt-3 text-sm font-bold text-brand">Remove</button>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setCfg(put(cfg, L.p, [...rows, Object.fromEntries(L.f.map(([k]) => [k, '']))]))} className="mt-3 rounded-lg border border-brand px-4 py-2 text-sm font-bold text-brand hover:bg-brand hover:text-white">Add another</button>
          </div>
        );
      })}
      <button onClick={save} className="btn-red">Save changes</button>
    </div>
  );
}
