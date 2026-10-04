const OK = (s) => typeof s === 'string' && (s.startsWith('/') || /^https:\/\//i.test(s));
// Until an official logo is uploaded in the admin, each network shows as a chip in its brand colours.
function tone(name) {
  const n = String(name).toLowerCase();
  if (n.includes('mtn')) return 'bg-[#FFCC00] text-black';
  if (n.includes('telecel')) return 'bg-[#E30613] text-white';
  if (n.includes('airtel') || n.includes('tigo')) return 'bg-[#0A4DA2] text-white';
  if (n.includes('visa')) return 'bg-white text-[#1A1F71] italic';
  return 'bg-white text-ink';
}
export default function PaymentLogos({ items = [], small = false }) {
  const h = small ? 'h-8' : 'h-10';
  return (
    <ul className="flex flex-wrap items-center gap-2">
      {items.filter((i) => i && i.name).map((i, k) => (
        <li key={k} title={i.name}>
          {OK(i.image)
            ? <img src={i.image} alt={i.name} className={h + ' w-auto rounded-md bg-white object-contain p-1'} />
            : <span className={'grid place-items-center rounded-md px-3 text-xs font-black ' + h + ' ' + tone(i.name)}>{i.name}</span>}
        </li>
      ))}
    </ul>
  );
}
