import { promises as fs } from "node:fs";
import path from "node:path";

export type OrderLine = { id: string; name: string; qty: number; price: number };
export type Order = {
  number: string;
  createdAt: string;
  name: string;
  phone: string;
  street: string;
  town: string;
  note: string;
  payment: "hotove" | "karta";
  items: OrderLine[];
  subtotal: number;
  fee: number;
  total: number;
};

// Objednávky se ukládají do data/orders.json vedle aplikace.
// Na serverless hostingu (Vercel apod.) souborový systém nepřežije – tam je potřeba
// vyměnit tuhle funkci za databázi nebo odeslání e-mailu.
const FILE = path.join(process.cwd(), "data", "orders.json");

let queue: Promise<unknown> = Promise.resolve();

export async function readOrders(): Promise<Order[]> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as Order[];
  } catch {
    return [];
  }
}

export function saveOrder(order: Omit<Order, "number" | "createdAt">): Promise<Order> {
  // zápisy řadíme za sebe, aby si dvě objednávky ve stejnou chvíli nepřepsaly soubor
  const run = queue.then(async () => {
    const all = await readOrders();
    const now = new Date();
    const day = now.toISOString().slice(2, 10).replace(/-/g, "");
    const todays = all.filter((o) => o.number.startsWith(day)).length;
    const full: Order = { ...order, number: `${day}-${String(todays + 1).padStart(3, "0")}`, createdAt: now.toISOString() };
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.writeFile(FILE, JSON.stringify([...all, full], null, 2));
    return full;
  });
  queue = run.catch(() => {});
  return run;
}
