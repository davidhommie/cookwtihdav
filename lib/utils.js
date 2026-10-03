// Only allow internal paths or http(s) links, so admin-entered text can never become a javascript: link.
export function safeHref(h) {
  if (typeof h !== 'string') return '/';
  return h.startsWith('/') || /^https?:\/\//i.test(h) ? h : '/';
}
export const money = (n) => 'GH₵ ' + Number(n || 0).toFixed(2);
