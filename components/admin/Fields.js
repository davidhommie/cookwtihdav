'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export const input = 'w-full rounded-lg border border-ink/20 bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20';

function shrink(file, max) {
  return new Promise((res, rej) => {
    const img = new Image(); const u = URL.createObjectURL(file);
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(u);
      c.toBlob((b) => (b ? res(b) : rej(new Error('Image failed'))), 'image/jpeg', 0.85);
    };
    img.onerror = () => rej(new Error('That is not a valid image.'));
    img.src = u;
  });
}

// Photos are shrunk to 1000px JPEGs. Logos keep their original PNG/WebP so transparency survives.
export async function uploadImage(file, logo = false) {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) throw new Error('Use a JPG, PNG or WebP image.');
  if (file.size > 8 * 1024 * 1024) throw new Error('That image is over 8 MB.');
  const keep = logo && file.type !== 'image/jpeg';
  const body = keep ? file : await shrink(file, 1000);
  const ext = keep ? (file.type === 'image/png' ? 'png' : 'webp') : 'jpg';
  const name = crypto.randomUUID() + '.' + ext;
  const { error } = await supabase.storage.from('media').upload(name, body, { contentType: keep ? file.type : 'image/jpeg' });
  if (error) throw error;
  return supabase.storage.from('media').getPublicUrl(name).data.publicUrl;
}

export function Upload({ onDone, onError, logo, label = 'Upload image' }) {
  const [busy, setBusy] = useState(false);
  return (
    <label className="inline-flex cursor-pointer items-center rounded-lg border border-brand px-3 py-2 text-sm font-bold text-brand hover:bg-brand hover:text-white">
      {busy ? 'Uploading...' : label}
      <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" disabled={busy} onChange={async (e) => {
        const f = e.target.files[0]; e.target.value = ''; if (!f) return;
        setBusy(true);
        try { onDone(await uploadImage(f, logo)); } catch (x) { onError && onError(x.message || 'Upload failed'); }
        setBusy(false);
      }} />
    </label>
  );
}

// One field, any type.
export function Field({ label, type = 'text', value, onChange, onError }) {
  const v = value ?? '';
  if (type === 'bool') return <label className="flex items-center gap-3 text-sm font-bold"><input type="checkbox" className="h-5 w-5 accent-[#E10600]" checked={!!value} onChange={(e) => onChange(e.target.checked)} />{label}</label>;
  return (
    <div>
      <label className="mb-1 block text-sm font-bold">{label}</label>
      {type === 'area' && <textarea className={input} rows={3} value={v} onChange={(e) => onChange(e.target.value)} />}
      {type === 'number' && <input className={input} type="number" step="any" value={v} onChange={(e) => onChange(e.target.value)} />}
      {(type === 'text') && <input className={input} value={v} onChange={(e) => onChange(e.target.value)} />}
      {(type === 'image' || type === 'logo') && (
        <div className="flex items-center gap-3">
          {v && <img src={v} alt="" className="h-12 w-12 rounded-lg bg-brand/10 object-contain" />}
          <input className={input} placeholder="https://..." value={v} onChange={(e) => onChange(e.target.value)} />
          <Upload logo={type === 'logo'} onDone={onChange} onError={onError} />
        </div>
      )}
      {type === 'images' && (
        <div>
          <div className="mb-2 flex flex-wrap gap-2">{(value || []).map((u, i) => (
            <span key={u + i} className="relative"><img src={u} alt="" className="h-16 w-16 rounded-lg object-cover" />
              <button type="button" onClick={() => onChange(value.filter((_, k) => k !== i))} className="absolute -right-1.5 -top-1.5 h-5 w-5 rounded-full bg-brand text-xs font-bold text-white" aria-label="Remove image">x</button></span>
          ))}</div>
          <Upload label="Add image" onDone={(u) => onChange([...(value || []), u].slice(0, 8))} onError={onError} />
        </div>
      )}
    </div>
  );
}
