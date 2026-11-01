import { Suspense } from "react";
import type { Metadata } from "next";
import { readOrders } from "@/lib/orders";
import { czk } from "@/lib/menu";

export const metadata: Metadata = { title: "Objednávky – kuchyně", robots: { index: false } };

// Přehled objednávek pro pizzerii: /kuchyne?klic=<ADMIN_KEY z .env.local>
export default function KitchenPage({ searchParams }: PageProps<"/kuchyne">) {
  return (
    <main className="kitchen">
      <h1 className="kitchen-title">
        Objednávky
      </h1>
      <Suspense fallback={<p>Načítám…</p>}>
        <Orders searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function Orders({ searchParams }: { searchParams: PageProps<"/kuchyne">["searchParams"] }) {
  const { klic } = await searchParams;
  const key = process.env.ADMIN_KEY;
  if (!key) return <p>Nastavte proměnnou ADMIN_KEY v souboru .env.local a otevřete /kuchyne?klic=…</p>;
  if (klic !== key) return <p>Neplatný klíč.</p>;

  const orders = (await readOrders()).reverse();
  if (!orders.length) return <p>Zatím žádné objednávky.</p>;

  return (
    <ol className="kitchen-list">
      {orders.map((o) => (
        <li key={o.number}>
          <header>
            <b>č. {o.number}</b>
            <time>{new Date(o.createdAt).toLocaleString("cs-CZ", { timeZone: "Europe/Prague" })}</time>
          </header>
          <p>
            <b>{o.name}</b> · <a href={`tel:${o.phone}`}>{o.phone}</a>
            <br />
            {o.street}, {o.town}
          </p>
          <ul>
            {o.items.map((i) => (
              <li key={i.id}>
                {i.qty}× {i.name}
              </li>
            ))}
          </ul>
          {o.note && <p className="kitchen-note">„{o.note}“</p>}
          <p>
            Celkem <b>{czk(o.total)}</b> ({o.fee ? `vč. rozvozu ${czk(o.fee)}` : "rozvoz zdarma"}) ·{" "}
            {o.payment === "karta" ? "kartou" : "hotově"}
          </p>
        </li>
      ))}
    </ol>
  );
}
