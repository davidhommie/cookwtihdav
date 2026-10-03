import { Icon } from './Icons';
const ok = (s) => typeof s === 'string' && (s.startsWith('/') || /^https:\/\//i.test(s) || s.startsWith('data:image/'));
// Shows the image when there is one, otherwise a tidy placeholder.
export default function Pic({ src, alt = '', className = '' }) {
  return ok(src)
    ? <img src={src} alt={alt} loading="lazy" className={'object-cover ' + className} />
    : <div role="img" aria-label={alt} className={'grid place-items-center bg-gradient-to-br from-brand/10 to-sun/30 text-brand/60 ' + className}><Icon name="plate" size={40} /></div>;
}
