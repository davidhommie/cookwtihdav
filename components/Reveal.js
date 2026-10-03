'use client';
import { useEffect, useRef } from 'react';
export default function Reveal({ children, className = '', delay = 0 }) {
  const r = useRef(null);
  useEffect(() => {
    const el = r.current;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('in'); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={r} className={'reveal ' + className} style={{ transitionDelay: delay + 'ms' }}>{children}</div>;
}
