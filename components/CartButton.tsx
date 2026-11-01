"use client";

import { useCart } from "./Cart";

export default function CartButton() {
  const { count, setOpen } = useCart();
  return (
    <button className="topline-cart" onClick={() => setOpen(true)} aria-label={`Košík, ${count} položek`}>
      Košík{count > 0 && <span className="badge">{count}</span>}
    </button>
  );
}
