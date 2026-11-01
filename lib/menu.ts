// Všechna data webu na jednom místě – ceny, nabídku a kontakty upravujte tady.

export const SHOP = {
  name: "Pizza Gianni",
  tagline: "pizza do krabice",
  street: "Pěší 191",
  city: "257 41 Týnec nad Sázavou",
  phone: "604 164 623",
  phoneHref: "tel:+420604164623",
  email: "giannipizza@seznam.cz",
  hours: [
    ["Po – Čt", "11:00 – 21:00"],
    ["Pá – So", "11:00 – 22:00"],
    ["Ne", "12:00 – 21:00"],
  ] as const,
  deliveryArea: "Týnec nad Sázavou a okolí do 10 km",
};

export const DELIVERY = {
  minOrder: 200, // Kč – minimální hodnota objednávky
  fee: 39, // Kč – cena rozvozu
  freeFrom: 500, // Kč – od této částky rozvoz zdarma
};

export type Base = "tomato" | "cream";
export type Topping =
  | "salami"
  | "basil"
  | "mozzarella"
  | "mushroom"
  | "olive"
  | "ham"
  | "onion"
  | "jalapeno"
  | "tuna"
  | "pineapple"
  | "corn"
  | "bacon"
  | "egg"
  | "blue"
  | "chili";

export type Pizza = {
  id: string;
  name: string;
  ingredients: string;
  price: number;
  weight: string;
  base: Base;
  toppings: Topping[];
  note?: string;
};

export const PIZZAS: Pizza[] = [
  {
    id: "margherita",
    name: "Margherita",
    ingredients: "rajčatový základ, mozzarella, čerstvá bazalka, olivový olej",
    price: 159,
    weight: "32 cm",
    base: "tomato",
    toppings: ["mozzarella", "basil"],
  },
  {
    id: "salami",
    name: "Salami",
    ingredients: "rajčatový základ, mozzarella, italský salám",
    price: 189,
    weight: "32 cm",
    base: "tomato",
    toppings: ["salami"],
  },
  {
    id: "funghi",
    name: "Funghi",
    ingredients: "rajčatový základ, mozzarella, žampiony, oregano",
    price: 179,
    weight: "32 cm",
    base: "tomato",
    toppings: ["mushroom"],
  },
  {
    id: "quattro",
    name: "Quattro formaggi",
    ingredients: "smetanový základ, mozzarella, gorgonzola, eidam, parmazán",
    price: 215,
    weight: "32 cm",
    base: "cream",
    toppings: ["mozzarella", "blue"],
  },
  {
    id: "hawai",
    name: "Hawai",
    ingredients: "rajčatový základ, mozzarella, šunka, ananas",
    price: 195,
    weight: "32 cm",
    base: "tomato",
    toppings: ["ham", "pineapple"],
  },
  {
    id: "diavola",
    name: "Diavola",
    ingredients: "rajčatový základ, mozzarella, pikantní salám, jalapeños, cibule, chilli",
    price: 205,
    weight: "32 cm",
    base: "tomato",
    toppings: ["salami", "jalapeno", "onion", "chili"],
    note: "pálí",
  },
  {
    id: "tonno",
    name: "Tonno",
    ingredients: "rajčatový základ, mozzarella, tuňák, červená cibule, olivy",
    price: 209,
    weight: "32 cm",
    base: "tomato",
    toppings: ["tuna", "onion", "olive"],
  },
  {
    id: "gianni",
    name: "Gianni",
    ingredients: "rajčatový základ, mozzarella, šunka, slanina, žampiony, kukuřice, vejce",
    price: 229,
    weight: "32 cm",
    base: "tomato",
    toppings: ["ham", "bacon", "mushroom", "corn", "egg"],
    note: "pizza podniku",
  },
];

export function findPizza(id: string) {
  return PIZZAS.find((p) => p.id === id);
}

export function deliveryFee(subtotal: number) {
  return subtotal >= DELIVERY.freeFrom ? 0 : DELIVERY.fee;
}

export const czk = (n: number) => `${n.toLocaleString("cs-CZ")} Kč`;
