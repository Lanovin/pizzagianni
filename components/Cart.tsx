"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { deliveryFee, findPizza } from "@/lib/menu";

export type CartLine = { id: string; qty: number };

type CartCtx = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  fee: number;
  total: number;
  add: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  lastAdded: string | null;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "gianni-kosik";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        setLines(parsed.filter((l) => findPizza(l.id) && l.qty > 0));
      }
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, loaded]);

  const add = useCallback((id: string) => {
    setLines((ls) => {
      const hit = ls.find((l) => l.id === id);
      if (hit) return ls.map((l) => (l.id === id ? { ...l, qty: Math.min(l.qty + 1, 20) } : l));
      return [...ls, { id, qty: 1 }];
    });
    setLastAdded(id);
  }, []);

  useEffect(() => {
    if (!lastAdded) return;
    const t = setTimeout(() => setLastAdded(null), 1400);
    return () => clearTimeout(t);
  }, [lastAdded]);

  const setQty = useCallback((id: string, qty: number) => {
    setLines((ls) =>
      qty <= 0 ? ls.filter((l) => l.id !== id) : ls.map((l) => (l.id === id ? { ...l, qty: Math.min(qty, 20) } : l)),
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(() => {
    const subtotal = lines.reduce((s, l) => s + (findPizza(l.id)?.price ?? 0) * l.qty, 0);
    const count = lines.reduce((s, l) => s + l.qty, 0);
    const fee = count ? deliveryFee(subtotal) : 0;
    return { lines, count, subtotal, fee, total: subtotal + fee, add, setQty, clear, open, setOpen, lastAdded };
  }, [lines, add, setQty, clear, open, lastAdded]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart mimo CartProvider");
  return c;
}
