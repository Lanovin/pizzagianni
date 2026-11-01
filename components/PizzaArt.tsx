import type { Pizza, Topping } from "@/lib/menu";

/*
 * Pizza kreslená v SVG. Souřadnice: střed 0,0, okraj (kůrka) má poloměr 240.
 * Rozložení surovin je deterministické (seed z id pizzy), takže server
 * i prohlížeč vykreslí totéž.
 */

export const R_CRUST = 240;
export const R_SAUCE = 214;

function seeded(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DENSITY: Record<Topping, number> = {
  salami: 22,
  basil: 12,
  mozzarella: 14,
  mushroom: 18,
  olive: 20,
  ham: 16,
  onion: 14,
  jalapeno: 16,
  tuna: 18,
  pineapple: 16,
  corn: 48,
  bacon: 14,
  egg: 8,
  blue: 14,
  chili: 32,
};

const SIZE: Record<Topping, number> = {
  salami: 17,
  basil: 11,
  mozzarella: 15,
  mushroom: 13,
  olive: 8,
  ham: 13,
  onion: 11,
  jalapeno: 9,
  tuna: 11,
  pineapple: 10,
  corn: 4,
  bacon: 13,
  egg: 18,
  blue: 13,
  chili: 4,
};

type Item = { kind: Topping; x: number; y: number; rot: number };

const rad = (deg: number) => (deg * Math.PI) / 180;
const r1 = (n: number) => Math.round(n * 10) / 10;

/** Rozmístí suroviny dané pizzy do výseče a0..a1 (stupně, 0 = vpravo, po směru hodin). */
export function layoutToppings(pizza: Pizza, a0 = 0, a1 = 360, salt = ""): Item[] {
  const rnd = seeded(pizza.id + salt + a0);
  const span = a1 - a0;
  const crowd = (pizza.toppings.length > 2 ? 0.7 : 1) * 1.7;
  const placed: (Item & { s: number })[] = [];
  // větší suroviny první, drobné (kukuřice, chilli) se dosypou mezi ně
  const order = [...pizza.toppings].sort((a, b) => SIZE[b] - SIZE[a]);
  for (const kind of order) {
    const want = Math.max(1, Math.round(DENSITY[kind] * crowd * (span / 360)));
    const s = SIZE[kind];
    let got = 0;
    for (let attempt = 0; attempt < want * 40 && got < want; attempt++) {
      const r = 22 + Math.sqrt(rnd()) * (R_SAUCE - 22 - s * 0.6);
      const margin = Math.min(span / 2 - 1, ((s + 3) / Math.max(r, 1)) * (180 / Math.PI));
      const ang = a0 + margin + rnd() * Math.max(0, span - 2 * margin);
      const x = Math.cos(rad(ang)) * r;
      const y = Math.sin(rad(ang)) * r;
      const ok = placed.every((p) => Math.hypot(p.x - x, p.y - y) > (p.s + s) * 0.78);
      if (!ok) continue;
      placed.push({ kind, x: r1(x), y: r1(y), rot: Math.round(rnd() * 360), s });
      got++;
    }
  }
  return placed.map(({ kind, x, y, rot }) => ({ kind, x, y, rot }));
}

function ToppingShape({ kind, x, y, rot }: Item) {
  const t = `translate(${x} ${y}) rotate(${rot})`;
  switch (kind) {
    case "salami":
      return (
        <g transform={t}>
          <circle r="17" fill="#a92a1b" />
          <circle r="14.5" fill="#c23a24" />
          <circle cx="-5" cy="-4" r="2.2" fill="#f0c4a8" />
          <circle cx="5" cy="3" r="1.8" fill="#f0c4a8" />
          <circle cx="-2" cy="7" r="1.6" fill="#f0c4a8" />
          <circle cx="7" cy="-6" r="1.4" fill="#f0c4a8" />
        </g>
      );
    case "basil":
      return (
        <g transform={t}>
          <path d="M-13 0 Q-2 -11 13 0 Q-2 11 -13 0Z" fill="#2f6b27" />
          <path d="M-11 0 L11 0" stroke="#5c9a43" strokeWidth="1.3" />
        </g>
      );
    case "mozzarella":
      return (
        <g transform={t}>
          <path
            d="M-14 -3 Q-12 -14 0 -13 Q13 -14 14 -2 Q16 10 3 13 Q-12 15 -14 -3Z"
            fill="#fff8e7"
          />
          <ellipse cx="-3" cy="-4" rx="5" ry="3" fill="#ffffff" opacity="0.8" />
        </g>
      );
    case "mushroom":
      return (
        <g transform={t}>
          <path d="M-13 3 Q-13 -12 0 -12 Q13 -12 13 3 Z" fill="#d8c3a2" stroke="#9c7b55" strokeWidth="1.6" />
          <path d="M-4 3 L-4 11 Q0 13 4 11 L4 3Z" fill="#e8d8bd" stroke="#9c7b55" strokeWidth="1.4" />
        </g>
      );
    case "olive":
      return <circle cx={x} cy={y} r="5.5" fill="none" stroke="#2a2420" strokeWidth="4.2" />;
    case "ham":
      return (
        <g transform={t}>
          <path d="M-14 -8 Q0 -12 14 -7 Q16 2 12 9 Q0 12 -13 8 Q-16 0 -14 -8Z" fill="#e79a95" />
          <path d="M-9 -3 Q0 -6 9 -2" stroke="#f6c3be" strokeWidth="2" fill="none" />
        </g>
      );
    case "onion":
      return (
        <path
          transform={t}
          d="M-11 4 A11 11 0 0 1 11 4"
          fill="none"
          stroke="#9b4f93"
          strokeWidth="3"
          strokeLinecap="round"
        />
      );
    case "jalapeno":
      return (
        <g transform={t}>
          <circle r="9" fill="#4c8a2e" />
          <circle r="5.5" fill="#cfe2a3" />
          <circle cx="-2" cy="-1" r="1.3" fill="#f6f1d0" />
          <circle cx="2" cy="1.5" r="1.3" fill="#f6f1d0" />
        </g>
      );
    case "tuna":
      return (
        <path
          transform={t}
          d="M-10 -4 Q-6 -10 2 -8 Q10 -7 10 0 Q9 8 0 8 Q-9 9 -11 2Z"
          fill="#c9b195"
          stroke="#a68c6d"
          strokeWidth="1.2"
        />
      );
    case "pineapple":
      return <path transform={t} d="M-10 -6 L10 -6 L6 7 L-6 7Z" fill="#f2c641" stroke="#d6a51e" strokeWidth="1.2" />;
    case "corn":
      return <circle cx={x} cy={y} r="4.2" fill="#f5c22b" stroke="#d69d10" strokeWidth="0.8" />;
    case "bacon":
      return (
        <g transform={t}>
          <path d="M-15 -5 Q-7 -9 0 -5 Q7 -1 15 -5 L15 4 Q7 8 0 4 Q-7 0 -15 4Z" fill="#b8473c" />
          <path d="M-14 0 Q-7 -4 0 0 Q7 4 14 0" stroke="#f1c0aa" strokeWidth="2" fill="none" />
        </g>
      );
    case "egg":
      return (
        <g transform={t}>
          <path d="M-18 0 Q-17 -15 -2 -16 Q16 -16 18 -2 Q19 15 2 16 Q-17 17 -18 0Z" fill="#fffdf6" />
          <circle cx="1" cy="0" r="7.5" fill="#f4a51c" />
        </g>
      );
    case "blue":
      return (
        <g transform={t}>
          <path d="M-12 -4 Q-9 -13 2 -12 Q13 -9 12 2 Q10 12 -1 12 Q-13 10 -12 -4Z" fill="#eef0e6" />
          <circle cx="-3" cy="-3" r="2" fill="#6f8a8f" />
          <circle cx="4" cy="2" r="1.6" fill="#6f8a8f" />
          <circle cx="-1" cy="6" r="1.3" fill="#6f8a8f" />
        </g>
      );
    case "chili":
      return <rect transform={t} x="-4" y="-1.4" width="8" height="2.8" rx="1.2" fill="#d42a12" />;
  }
}

/** Korpus: kůrka, omáčka, roztavený sýr. Vždy celé kolo – výseč se ořízne clipPathem. */
export function PizzaBase({ pizza }: { pizza: Pizza }) {
  const rnd = seeded(pizza.id + "cheese");
  const sauce = pizza.base === "tomato" ? "#c7401f" : "#f1dfb6";
  const cheese = pizza.base === "tomato" ? "#f9d77e" : "#fff6dc";
  // drobná světlejší místa, kde se sýr roztekl
  const melts = Array.from({ length: 40 }, () => {
    const r = Math.sqrt(rnd()) * 190;
    const a = rnd() * Math.PI * 2;
    return { x: r1(Math.cos(a) * r), y: r1(Math.sin(a) * r), s: r1(5 + rnd() * 9) };
  });
  return (
    <g>
      <circle r={R_CRUST} fill="#d99a4e" />
      <circle r={R_CRUST - 6} fill="#e7b066" />
      <circle r={R_SAUCE + 6} fill="#c98a3f" opacity="0.6" />
      <circle r={R_SAUCE} fill={sauce} />
      <circle r={R_SAUCE - 14} fill={cheese} opacity={pizza.base === "tomato" ? 0.22 : 0.6} />
      <g opacity="0.45">
        {melts.map((b, i) => (
          <circle key={i} cx={b.x} cy={b.y} r={b.s} fill="#fff1c9" />
        ))}
      </g>
    </g>
  );
}

export function Toppings({ items }: { items: Item[] }) {
  return (
    <g>
      {items.map((it, i) => (
        <ToppingShape key={i} {...it} />
      ))}
    </g>
  );
}

/** Celá malá pizza – pro seznam na telefonu a v košíku. */
export function MiniPizza({ pizza, size = 72 }: { pizza: Pizza; size?: number }) {
  const items = layoutToppings(pizza, 0, 360, "mini");
  return (
    <svg
      viewBox="-250 -250 500 500"
      width={size}
      height={size}
      aria-hidden="true"
      className="mini-pizza"
    >
      <PizzaBase pizza={pizza} />
      <Toppings items={items} />
    </svg>
  );
}
