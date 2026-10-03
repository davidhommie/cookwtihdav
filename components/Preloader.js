'use client';
import { useEffect, useState } from 'react';

export default function Preloader({ brand }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1100);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className={'preloader' + (done ? ' done' : '')} aria-hidden={done}>
      <div className="text-center">
        {brand.logo_url
          ? <img src={brand.logo_url} alt="" className="logo-white mx-auto h-14 w-auto" />
          : <span className="font-display text-3xl font-bold tracking-wide">{brand.name}</span>}
        <div className="preloader-bar mx-auto"><i /></div>
      </div>
    </div>
  );
}
