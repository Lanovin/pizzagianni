"use client";

import { PIZZAS, czk } from "@/lib/menu";
import { MiniPizza } from "./PizzaArt";
import { useCart } from "./Cart";

export default function MenuList() {
  const { add, lines, setQty, lastAdded } = useCart();
  return (
    <ul className="menu-list">
      {PIZZAS.map((p) => {
        const qty = lines.find((l) => l.id === p.id)?.qty ?? 0;
        return (
          <li key={p.id} className="menu-item">
            <MiniPizza pizza={p} size={76} />
            <div className="menu-text">
              <h3>
                {p.name}
                {p.note && <span className="tag">{p.note}</span>}
              </h3>
              <p>{p.ingredients}</p>
              <div className="menu-buy">
                <strong>{czk(p.price)}</strong>
                {qty === 0 ? (
                  <button className="btn btn-sm" onClick={() => add(p.id)}>
                    Přidat
                  </button>
                ) : (
                  <div className={`stepper${lastAdded === p.id ? " pulse" : ""}`}>
                    <button onClick={() => setQty(p.id, qty - 1)} aria-label={`Ubrat ${p.name}`}>
                      −
                    </button>
                    <span aria-live="polite">{qty}</span>
                    <button onClick={() => add(p.id)} aria-label={`Přidat ${p.name}`}>
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
