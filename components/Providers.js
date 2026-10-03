'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const CartCtx = createContext(null);
export const useCart = () => useContext(CartCtx);

export default function Providers({ children }) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    try { const s = JSON.parse(localStorage.getItem('cwd_cart') || '[]'); if (Array.isArray(s)) setItems(s.slice(0, 20)); } catch (e) {}
  }, []);
  useEffect(() => { try { localStorage.setItem('cwd_cart', JSON.stringify(items)); } catch (e) {} }, [items]);

  const add = (p) => setItems((cur) => {
    const hit = cur.find((i) => i.id === p.id);
    if (hit) return cur.map((i) => (i.id === p.id ? { ...i, qty: Math.min(10, i.qty + 1) } : i));
    return [...cur, { id: p.id, title: p.title, price: Number(p.price), image: p.image || '', qty: 1 }].slice(0, 20);
  });
  const setQty = (id, qty) => setItems((cur) => cur.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(10, qty)) } : i)));
  const remove = (id) => setItems((cur) => cur.filter((i) => i.id !== id));
  const clear = () => setItems([]);
  const count = items.reduce((n, i) => n + i.qty, 0);
  const total = items.reduce((n, i) => n + i.qty * i.price, 0);

  return <CartCtx.Provider value={{ items, add, setQty, remove, clear, count, total }}>{children}</CartCtx.Provider>;
}
