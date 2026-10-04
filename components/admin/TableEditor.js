'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { TABLES } from '../../lib/adminSchema';
import { Field } from './Fields';

const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

export default function TableEditor({ tab, toast }) {
  const T = TABLES[tab];
  const [rows, setRows] = useState(null);
  const [edit, setEdit] = useState(null); // row being edited (id undefined = new)
  const [confirm, setConfirm] = useState(null);

  const load = async () => {
    const { data, error } = await supabase.from(T.table).select('*').order('sort', { ascending: true });
    if (error) toast(error.message, true);
    setRows(data || []);
  };
  useEffect(() => { setRows(null); setEdit(null); load(); }, [tab]);
  if (!rows) return <p className="text-ink/50">Loading...</p>;

  const save = async () => {
    const r = { ...edit }; const isNew = r.id === undefined || r.__new;
    if (!String(r[T.title] || '').trim()) return toast('Please fill in the ' + T.title + '.', true);
    const out = {};
    for (const c of T.cols) {
      let v = r[c.k];
      if (c.t === 'number') { v = v === '' || v == null ? null : Number(v); if (v !== null && !Number.isFinite(v)) return toast(c.l + ' must be a number.', true); }
      out[c.k] = v === '' ? null : v;
    }
    if (T.table === 'menu_items') {
      if (out.price == null || out.price < 0) return toast('Enter a price.', true);
      out.rating = Math.min(5, Math.max(1, out.rating || 5)); out.sort = Math.round(out.sort || 0);
    }
    if (T.table === 'branches' && out.map_embed && !/^https:\/\/www\.google\.com\/maps\/embed/.test(out.map_embed)) return toast('The map link must start with https://www.google.com/maps/embed (use Share, then Embed a map, and copy only the src link).', true);
    let error;
    if (isNew) {
      if (T.manualId) { out.id = rows.reduce((m, x) => Math.max(m, x.id), 0) + 1; out.slug = slugify(out.title) + '-' + out.id; }
      ({ error } = await supabase.from(T.table).insert(out));
    } else {
      ({ error } = await supabase.from(T.table).update(out).eq('id', r.id));
    }
    if (error) return toast('Could not save: ' + error.message, true);
    toast('Saved.'); setEdit(null); load();
  };

  const del = async (id) => {
    if (confirm !== id) { setConfirm(id); setTimeout(() => setConfirm(null), 3000); return; }
    const { error } = await supabase.from(T.table).delete().eq('id', id);
    setConfirm(null);
    toast(error ? 'Could not delete: ' + error.message : 'Deleted.', !!error); load();
  };

  if (edit) return (
    <div className="space-y-4">
      <h3 className="font-body text-lg font-black">{edit.__new ? 'Add new' : 'Edit'} {tab.toLowerCase()}</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {T.cols.map((c) => (
          <div key={c.k} className={['area', 'images', 'image'].includes(c.t) ? 'md:col-span-2' : ''}>
            <Field label={c.l} type={c.t} value={edit[c.k]} onChange={(v) => setEdit({ ...edit, [c.k]: v })} onError={(m) => toast(m, true)} />
          </div>
        ))}
      </div>
      <div className="flex gap-3"><button onClick={save} className="btn-red">Save</button><button onClick={() => setEdit(null)} className="btn border-2 border-ink/20">Cancel</button></div>
    </div>
  );

  return (
    <div>
      <button onClick={() => setEdit({ ...T.blank, __new: true })} className="btn-red mb-5">Add new</button>
      {rows.length === 0 && <p className="text-ink/50">Nothing here yet.</p>}
      <div className="divide-y divide-ink/10 rounded-xl border border-ink/10 bg-white">
        {rows.map((r) => (
          <div key={r.id} className="flex items-center gap-3 p-4">
            {(r.images?.[0] || r.image) && <img src={r.images?.[0] || r.image} alt="" className="h-12 w-12 rounded-lg object-cover" />}
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold">{r[T.title]} {r.active === false && <span className="ml-2 rounded-full bg-ink/10 px-2 py-0.5 text-xs">Hidden</span>}</p>
              <p className="truncate text-sm text-ink/50">{r.price != null ? 'GH\u20B5 ' + Number(r.price).toFixed(2) + ' - ' : ''}{r.category || r.address || r.role || r.year || ''}</p>
            </div>
            <button onClick={() => setEdit(r)} className="text-sm font-bold text-brand">Edit</button>
            <button onClick={() => del(r.id)} className={'text-sm font-bold ' + (confirm === r.id ? 'text-white bg-brand rounded px-2 py-1' : 'text-ink/50')}>{confirm === r.id ? 'Tap again to delete' : 'Delete'}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
