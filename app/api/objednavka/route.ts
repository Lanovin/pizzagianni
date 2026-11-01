import { DELIVERY, deliveryFee, findPizza } from "@/lib/menu";
import { saveOrder, type OrderLine } from "@/lib/orders";

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Neplatná data objednávky." }, { status: 400 });
  }

  const name = str(body.name, 80);
  const phoneRaw = str(body.phone, 30);
  const phone = phoneRaw.replace(/\s+/g, "");
  const street = str(body.street, 120);
  const town = str(body.town, 80);
  const note = str(body.note, 300);
  const payment = body.payment === "karta" ? "karta" : "hotove";

  if (!name || !street || !town) {
    return Response.json({ ok: false, error: "Vyplňte prosím jméno a adresu." }, { status: 400 });
  }
  if (!/^(\+?420)?[0-9]{9}$/.test(phone)) {
    return Response.json({ ok: false, error: "Telefon musí mít 9 číslic, třeba 777 123 456." }, { status: 400 });
  }

  // ceny bereme ze serveru, ne z prohlížeče
  const items: OrderLine[] = [];
  if (Array.isArray(body.items)) {
    for (const raw of body.items.slice(0, 30)) {
      const id = typeof raw?.id === "string" ? raw.id : "";
      const qty = Number(raw?.qty);
      const p = findPizza(id);
      if (!p || !Number.isInteger(qty) || qty < 1 || qty > 20) continue;
      items.push({ id, name: p.name, qty, price: p.price });
    }
  }
  if (!items.length) {
    return Response.json({ ok: false, error: "Košík je prázdný." }, { status: 400 });
  }

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  if (subtotal < DELIVERY.minOrder) {
    return Response.json(
      { ok: false, error: `Minimální objednávka na rozvoz je ${DELIVERY.minOrder} Kč.` },
      { status: 400 },
    );
  }
  const fee = deliveryFee(subtotal);

  try {
    const order = await saveOrder({ name, phone, street, town, note, payment, items, subtotal, fee, total: subtotal + fee });
    const pizzas = items.reduce((s, i) => s + i.qty, 0);
    const eta = pizzas > 4 ? "60 minut" : "45 minut";
    return Response.json({ ok: true, number: order.number, total: order.total, eta });
  } catch (e) {
    console.error("Uložení objednávky selhalo", e);
    return Response.json({ ok: false, error: "Objednávku se nepodařilo uložit. Zavolejte nám prosím." }, { status: 500 });
  }
}
