const P = {
  star: 'M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z',
  cart: 'M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6M9 21h.01M20 21h.01',
  pin: 'M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0zM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  clock: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2',
  phone: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z',
  mail: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6',
  x: 'M6 6l12 12M18 6L6 18',
  chev: 'M6 9l6 6 6-6',
  plate: 'M3 13h18M5 13a7 7 0 0 1 14 0M12 6V4M2 17h20',
  leaf: 'M11 20A7 7 0 0 1 4 13c0-6 7-10 16-10 0 9-4 17-9 17zM4 21c2-5 5-8 9-10',
  bolt: 'M13 2L3 14h8l-1 8 10-12h-8z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4',
  truck: 'M1 3h15v13H1zM16 8h4l3 3v5h-7zM5.5 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18.5 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  heart: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z',
  send: 'M22 2L11 13M22 2l-7 20-4-9-9-4z',
};
export function Icon({ name, size = 20, fill = false, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={P[name] || P.plate} />
    </svg>
  );
}
export function Stars({ rating = 5 }) {
  const n = Math.round(rating);
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-500" aria-label={rating + ' out of 5 stars'}>
      {[0, 1, 2, 3, 4].map((i) => <Icon key={i} name="star" size={14} fill={i < n} />)}
      <span className="ml-1 text-xs text-ink/50">({Number(rating).toFixed(1)})</span>
    </span>
  );
}
