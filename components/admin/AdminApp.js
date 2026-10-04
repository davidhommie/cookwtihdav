'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { SETTINGS_TABS, TABLES } from '../../lib/adminSchema';
import SettingsEditor from './SettingsEditor';
import TableEditor from './TableEditor';
import OrdersTab from './OrdersTab';
import { input } from './Fields';

const LOCK = 'cwd_lock';
const readLock = () => { try { return JSON.parse(localStorage.getItem(LOCK)) || { fails: 0, level: 0, until: 0 }; } catch (e) { return { fails: 0, level: 0, until: 0 }; } };
const GROUPS = [['Site', Object.keys(SETTINGS_TABS)], ['Content', Object.keys(TABLES)], ['Business', ['Orders', 'Account']]];

function Login({ onIn }) {
  const [e, setE] = useState(''); const [p, setP] = useState(''); const [hp, setHp] = useState('');
  const [msg, setMsg] = useState(''); const [busy, setBusy] = useState(false);
  const submit = async (ev) => {
    ev.preventDefault();
    if (hp) return;
    const lock = readLock();
    if (lock.until > Date.now()) { setMsg('Too many attempts. Try again in ' + Math.ceil((lock.until - Date.now()) / 60000) + ' minutes.'); return; }
    setBusy(true); setMsg('');
    const { error } = await supabase.auth.signInWithPassword({ email: e.trim(), password: p });
    let ok = false;
    if (!error) { const { data } = await supabase.rpc('is_admin'); ok = data === true; if (!ok) await supabase.auth.signOut(); }
    if (ok) { localStorage.removeItem(LOCK); onIn(); return; }
    const l = readLock(); l.fails += 1;
    if (l.fails >= 3) { l.level = Math.min(l.level + 1, 3); l.until = Date.now() + [15 * 60e3, 60 * 60e3, 24 * 3600e3][l.level - 1]; l.fails = 0; }
    localStorage.setItem(LOCK, JSON.stringify(l));
    setMsg('Incorrect email or password, or this account is not an admin.'); setBusy(false);
  };
  return (
    <form onSubmit={submit} className="rise w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl">
      <h1 className="text-2xl font-black">Admin login</h1>
      <p className="mb-6 text-sm text-ink/60">cookwithdavid control panel</p>
      <div className="hidden" aria-hidden="true"><input tabIndex={-1} autoComplete="off" value={hp} onChange={(x) => setHp(x.target.value)} /></div>
      <label className="mb-3 block text-sm font-bold">Email<input className={input + ' mt-1'} type="email" autoComplete="username" value={e} onChange={(x) => setE(x.target.value)} required /></label>
      <label className="mb-4 block text-sm font-bold">Password<input className={input + ' mt-1'} type="password" autoComplete="current-password" value={p} onChange={(x) => setP(x.target.value)} required /></label>
      {msg && <p role="alert" className="mb-4 rounded-lg bg-brand/10 p-3 text-sm font-bold text-brand">{msg}</p>}
      <button className="btn-red w-full" disabled={busy}>{busy ? 'Checking...' : 'Sign in'}</button>
    </form>
  );
}

function Account({ toast, out }) {
  const [a, setA] = useState(''); const [b, setB] = useState('');
  const change = async () => {
    if (a.length < 12) return toast('Use at least 12 characters.', true);
    if (a !== b) return toast('The two passwords do not match.', true);
    const { error } = await supabase.auth.updateUser({ password: a });
    toast(error ? error.message : 'Password changed.', !!error); if (!error) { setA(''); setB(''); }
  };
  return (
    <div className="max-w-md space-y-4">
      <h3 className="font-body text-lg font-black">Change password</h3>
      <input className={input} type="password" autoComplete="new-password" placeholder="New password (12+ characters)" value={a} onChange={(x) => setA(x.target.value)} />
      <input className={input} type="password" autoComplete="new-password" placeholder="Repeat new password" value={b} onChange={(x) => setB(x.target.value)} />
      <div className="flex gap-3"><button onClick={change} className="btn-red">Update password</button><button onClick={out} className="btn border-2 border-ink/20">Sign out</button></div>
      <p className="text-sm text-ink/50">You are signed out automatically after 15 minutes of no activity.</p>
    </div>
  );
}

export default function AdminApp() {
  const [state, setState] = useState('loading'); // loading | out | in
  const [tab, setTab] = useState('General');
  const [note, setNote] = useState(null);
  const idle = useRef(null);

  const toast = useCallback((m, bad) => { setNote({ m, bad }); setTimeout(() => setNote(null), 4500); }, []);
  const check = useCallback(async () => {
    if (!supabase) { setState('nosb'); return; }
    const { data } = await supabase.auth.getSession();
    if (!data.session) { setState('out'); return; }
    const { data: ok } = await supabase.rpc('is_admin');
    if (ok === true) setState('in'); else { await supabase.auth.signOut(); setState('out'); }
  }, []);
  useEffect(() => { check(); }, [check]);

  const out = useCallback(async () => { await supabase.auth.signOut(); setState('out'); }, []);
  useEffect(() => {
    if (state !== 'in') return;
    const reset = () => { clearTimeout(idle.current); idle.current = setTimeout(out, 15 * 60 * 1000); };
    const ev = ['mousemove', 'keydown', 'click', 'touchstart'];
    ev.forEach((e) => window.addEventListener(e, reset)); reset();
    return () => { ev.forEach((e) => window.removeEventListener(e, reset)); clearTimeout(idle.current); };
  }, [state, out]);

  const wrap = 'fixed inset-0 z-[90] overflow-auto bg-paper';
  if (state === 'loading') return <div className={wrap + ' grid place-items-center'}><p className="text-ink/50">Loading...</p></div>;
  if (state === 'nosb') return <div className={wrap + ' grid place-items-center p-6 text-center'}><p>Supabase is not connected. Check the two NEXT_PUBLIC_SUPABASE variables in Netlify.</p></div>;
  if (state === 'out') return <div className={wrap + ' grid place-items-center p-4'}><Login onIn={check} /></div>;

  return (
    <div className={wrap + ' md:flex'}>
      <aside className="bg-ink p-4 text-white md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:overflow-auto">
        <p className="mb-4 font-display text-xl font-bold">cookwithdavid</p>
        <nav className="flex gap-2 overflow-x-auto md:block md:space-y-5">
          {GROUPS.map(([g, items]) => (
            <div key={g} className="flex shrink-0 gap-1 md:block">
              <p className="hidden px-3 pb-1 text-xs font-bold uppercase tracking-wider text-white/40 md:block">{g}</p>
              {items.map((t) => <button key={t} onClick={() => setTab(t)} className={'block w-full whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm font-bold transition ' + (tab === t ? 'bg-brand text-white' : 'text-white/70 hover:bg-white/10')}>{t}</button>)}
            </div>
          ))}
        </nav>
        <a href="/" target="_blank" rel="noopener noreferrer" className="mt-4 hidden text-sm text-sun md:block">View site</a>
      </aside>
      <main className="flex-1 p-4 md:p-10">
        <h2 className="mb-6 text-3xl font-black">{tab}</h2>
        <div className="max-w-4xl rounded-3xl bg-white p-5 shadow md:p-8">
          {SETTINGS_TABS[tab] && <SettingsEditor key={tab} tab={tab} toast={toast} />}
          {TABLES[tab] && <TableEditor key={tab} tab={tab} toast={toast} />}
          {tab === 'Orders' && <OrdersTab toast={toast} />}
          {tab === 'Account' && <Account toast={toast} out={out} />}
        </div>
      </main>
      {note && <div role="status" className={'rise fixed bottom-6 left-1/2 z-[95] max-w-[90vw] -translate-x-1/2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-lg ' + (note.bad ? 'bg-brand' : 'bg-ink')}>{note.m}</div>}
    </div>
  );
}
