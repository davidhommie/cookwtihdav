import { Brand } from './Icons';
import { waLink } from '../lib/utils';

// Sticky chat button. Number and message come from the admin page.
export default function WhatsAppButton({ settings }) {
  const w = settings.whatsapp;
  if (!w || !w.active) return null;
  const href = waLink(w.number || settings.contact.phone, w.message);
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp" className="fixed bottom-5 right-5 z-[55] grid h-16 w-16 place-items-center rounded-full bg-[#25D366] text-white shadow-xl transition hover:scale-110">
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40" />
      <span className="relative"><Brand name="whatsapp" size={34} /></span>
    </a>
  );
}
