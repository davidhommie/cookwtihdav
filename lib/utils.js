// Only allow internal paths or http(s) links, so admin-entered text can never become a javascript: link.
export function safeHref(h) {
  if (typeof h !== 'string') return '/';
  return h.startsWith('/') || /^https?:\/\//i.test(h) ? h : '/';
}
export const money = (n) => 'GH₵ ' + Number(n || 0).toFixed(2);

const GMAPS = /^https:\/\/www\.google\.com\/maps\/embed/;
// A branch map: a pasted Google embed link, or one built from the address.
export const mapSrc = (b) => (GMAPS.test(b.map_embed || '') ? b.map_embed : 'https://www.google.com/maps?q=' + encodeURIComponent(b.address || b.name) + '&output=embed');
// WhatsApp link from a Ghana number like 0241234567 or +233241234567.
export function waLink(num, msg) {
  let d = String(num || '').replace(/\D/g, '');
  if (d.startsWith('0')) d = '233' + d.slice(1);
  return 'https://wa.me/' + d + (msg ? '?text=' + encodeURIComponent(msg) : '');
}
