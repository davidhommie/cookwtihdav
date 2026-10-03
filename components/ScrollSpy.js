'use client';
import { useEffect, useState } from 'react';

// Right-edge dot navigator. Mark any section with id, data-spy and data-label.
export default function ScrollSpy() {
  const [sections, setSections] = useState([]);
  const [active, setActive] = useState('');
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('[data-spy]'));
    setSections(els.map((e) => ({ id: e.id, label: e.dataset.label || e.id })));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -45% 0px' }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
  return (
    <nav className="spy" aria-label="Page sections">
      {sections.map((s) => (
        <a key={s.id} href={'#' + s.id} title={s.label} aria-label={s.label} className={active === s.id ? 'on' : ''} />
      ))}
    </nav>
  );
}
