'use client';
import { useState } from 'react';
import { Icon } from './Icons';

const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const PHONE = /^\+?[0-9 ]{9,15}$/;

export default function ContactForm({ email }) {
  const [f, setF] = useState({ name: '', email: '', phone: '', subject: '', message: '', hp: '' });
  const [err, setErr] = useState({});
  const [done, setDone] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (f.hp) { setDone(true); return; } // honeypot: bots fill this hidden field
    const x = {};
    if (f.name.trim().length < 2) x.name = 'Enter your name.';
    if (!EMAIL.test(f.email)) x.email = 'Enter a valid email, like name@example.com.';
    if (f.phone && !PHONE.test(f.phone)) x.phone = 'Use digits only, like +233 24 000 0000.';
    if (f.message.trim().length < 5) x.message = 'Write a short message.';
    setErr(x);
    if (Object.keys(x).length) return;
    // Phase 3 sends this through Resend. For now it opens the visitor's email app.
    const body = encodeURIComponent(f.message + '\n\n' + f.name + '\n' + f.email + '\n' + f.phone);
    window.location.href = 'mailto:' + email + '?subject=' + encodeURIComponent(f.subject || 'Website message') + '&body=' + body;
    setDone(true);
  };

  if (done) return <div className="rise rounded-3xl bg-white p-10 text-center shadow"><h2 className="text-2xl font-bold">Thank you</h2><p className="mt-2 text-ink/70">We will get back to you within 24 hours.</p></div>;
  const Err = ({ k }) => (err[k] ? <p className="mt-1 text-sm text-brand">{err[k]}</p> : null);
  return (
    <form onSubmit={submit} noValidate className="rounded-3xl bg-white p-6 shadow md:p-8">
      <h2 className="text-2xl font-bold">Send us a message</h2>
      <p className="mb-6 text-ink/60">We reply within 24 hours.</p>
      <div className="hidden" aria-hidden="true"><input tabIndex={-1} autoComplete="off" value={f.hp} onChange={set('hp')} name="website" /></div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-bold">Your name *<input className="field mt-1 font-normal" placeholder="Kwame Mensah" maxLength={80} value={f.name} onChange={set('name')} /><Err k="name" /></label>
        <label className="block text-sm font-bold">Email address *<input className="field mt-1 font-normal" type="email" placeholder="name@example.com" maxLength={120} value={f.email} onChange={set('email')} /><Err k="email" /></label>
        <label className="block text-sm font-bold">Phone number<input className="field mt-1 font-normal" type="tel" placeholder="+233 24 000 0000" maxLength={20} value={f.phone} onChange={set('phone')} /><Err k="phone" /></label>
        <label className="block text-sm font-bold">Subject<input className="field mt-1 font-normal" placeholder="Event catering" maxLength={100} value={f.subject} onChange={set('subject')} /></label>
      </div>
      <label className="mt-4 block text-sm font-bold">Your message *<textarea className="field mt-1 font-normal" rows={5} maxLength={1500} placeholder="How can we help you?" value={f.message} onChange={set('message')} /><Err k="message" /></label>
      <button className="btn-red mt-6 w-full" type="submit"><Icon name="send" size={18} /> Send message</button>
    </form>
  );
}
