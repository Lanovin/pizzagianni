"use client";

import { useState } from "react";
import { PIZZAS, czk } from "@/lib/menu";
import { PizzaBase, Toppings, layoutToppings } from "./PizzaArt";
import { useCart } from "./Cart";

const N = PIZZAS.length;
const SPAN = 360 / N;
const START = -90 - SPAN / 2; // první dílek míří nahoru

const rad = (d: number) => (d * Math.PI) / 180;
const pt = (a: number, r: number) => `${(Math.cos(rad(a)) * r).toFixed(2)} ${(Math.sin(rad(a)) * r).toFixed(2)}`;
const sector = (a0: number, a1: number, r: number) => `M0 0 L${pt(a0, r)} A${r} ${r} 0 0 1 ${pt(a1, r)} Z`;

const SLICES = PIZZAS.map((pizza, i) => {
  const a0 = START + i * SPAN;
  const a1 = a0 + SPAN;
  const mid = rad(a0 + SPAN / 2);
  return {
    pizza,
    path: sector(a0, a1, 244),
    items: layoutToppings(pizza, a0, a1, "slice"),
    dx: +(Math.cos(mid) * 22).toFixed(2),
    dy: +(Math.sin(mid) * 22).toFixed(2),
  };
});

export default function PizzaWheel() {
  const [active, setActive] = useState(0);
  const { add, lastAdded } = useCart();
  const current = PIZZAS[active];

  return (
    <div className="picker">
      <div className="wheel-wrap">
        <svg viewBox="-290 -290 580 580" className="wheel" role="group" aria-label="Pizza rozkrojená na dílky, každý dílek je jiná pizza">
          <defs>
            {SLICES.map((s) => (
              <clipPath id={`clip-${s.pizza.id}`} key={s.pizza.id}>
                <path d={s.path} />
              </clipPath>
            ))}
          </defs>
          <circle r="270" className="board" />
          <circle r="270" className="board-ring" />
          {SLICES.map((s, i) => {
            const on = i === active;
            return (
              <g
                key={s.pizza.id}
                className={`slice${on ? " is-on" : ""}`}
                style={{ transform: on ? `translate(${s.dx}px, ${s.dy}px)` : undefined }}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    add(s.pizza.id);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`${s.pizza.name}, ${czk(s.pizza.price)}`}
              >
                <g clipPath={`url(#clip-${s.pizza.id})`}>
                  <PizzaBase pizza={s.pizza} />
                  <Toppings items={s.items} />
                </g>
                <path d={s.path} className="slice-cut" />
              </g>
            );
          })}
        </svg>
        <p className="wheel-hint">Najeď myší na dílek – každý je z jiné pizzy</p>
      </div>

      <div className="picker-menu">
        <div className="picker-detail" aria-live="polite">
          <p className="detail-kicker">
            {String(active + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
            {current.note && <span className="tag">{current.note}</span>}
          </p>
          <h3 className="detail-name">{current.name}</h3>
          <p className="detail-ingr">{current.ingredients}</p>
          <div className="detail-buy">
            <span className="detail-price">{czk(current.price)}</span>
            <span className="detail-size">{current.weight}</span>
            <button className="btn" onClick={() => add(current.id)}>
              {lastAdded === current.id ? "Přidáno ✓" : "Do košíku"}
            </button>
          </div>
        </div>

        <ul className="picker-list">
          {PIZZAS.map((p, i) => (
            <li key={p.id}>
              <button
                className={`picker-row${i === active ? " is-on" : ""}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => {
                  setActive(i);
                  add(p.id);
                }}
                aria-label={`Přidat ${p.name} do košíku, ${czk(p.price)}`}
              >
                <span className="row-name">{p.name}</span>
                <span className="row-dots" aria-hidden="true" />
                <span className="row-price">{czk(p.price)}</span>
                <span className="row-plus" aria-hidden="true">
                  {lastAdded === p.id ? "✓" : "+"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
