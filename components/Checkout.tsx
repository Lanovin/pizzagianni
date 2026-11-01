"use client";

import { useEffect, useRef, useState } from "react";
import { DELIVERY, SHOP, czk, findPizza } from "@/lib/menu";
import { useCart } from "./Cart";

type Done = { number: string; total: number; eta: string };

export default function Checkout() {
  const cart = useCart();
  const dialog = useRef<HTMLDialogElement>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<Done | null>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (cart.open && !d.open) d.showModal();
    if (!cart.open && d.open) d.close();
  }, [cart.open]);

  const missing = Math.max(0, DELIVERY.minOrder - cart.subtotal);
  const toFree = cart.subtotal < DELIVERY.freeFrom ? DELIVERY.freeFrom - cart.subtotal : 0;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const f = new FormData(e.currentTarget);
    setSending(true);
    try {
      const res = await fetch("/api/objednavka", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.get("name"),
          phone: f.get("phone"),
          street: f.get("street"),
          town: f.get("town"),
          note: f.get("note"),
          payment: f.get("payment"),
          items: cart.lines,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setError(data?.error ?? "Objednávku se nepodařilo odeslat. Zkuste to znovu, nebo zavolejte.");
        return;
      }
      setDone({ number: data.number, total: data.total, eta: data.eta });
      cart.clear();
    } catch {
      setError(`Nepodařilo se spojit se serverem. Objednejte prosím telefonicky na ${SHOP.phone}.`);
    } finally {
      setSending(false);
    }
  }

  function close() {
    cart.setOpen(false);
    if (done) setDone(null);
  }

  return (
    <>
      {cart.count > 0 && !cart.open && (
        <div className="cartbar">
          <div className="cartbar-inner">
            <span className="cartbar-info">
              <b>{cart.count}×</b> pizza · <b>{czk(cart.subtotal)}</b>
            </span>
            <button className="btn btn-dark" onClick={() => cart.setOpen(true)}>
              Objednat rozvoz →
            </button>
          </div>
        </div>
      )}

      <dialog ref={dialog} className="checkout" onClose={close} onCancel={close} aria-labelledby="co-title">
        <div className="co-head">
          <h2 id="co-title" className="co-title">
            {done ? "Hotovo, děkujeme" : "Tvoje objednávka"}
          </h2>
          <button className="co-x" onClick={close} aria-label="Zavřít">
            ×
          </button>
        </div>

        {done ? (
          <div className="co-done">
            <p className="co-number">č. {done.number}</p>
            <p>
              Objednávku jsme přijali. Celkem <b>{czk(done.total)}</b>, platíte při převzetí. Pizzu vezeme zhruba za{" "}
              <b>{done.eta}</b>. Kdyby něco, zavoláme vám – nebo nám volejte na{" "}
              <a href={SHOP.phoneHref}>{SHOP.phone}</a>.
            </p>
            <button className="btn" onClick={close}>
              Zavřít
            </button>
          </div>
        ) : cart.count === 0 ? (
          <div className="co-done">
            <p>Košík je prázdný. Vyber si pizzu z nabídky.</p>
            <button className="btn" onClick={close}>
              Zpět na nabídku
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="co-form">
            <ul className="co-lines">
              {cart.lines.map((l) => {
                const p = findPizza(l.id)!;
                return (
                  <li key={l.id}>
                    <span className="co-name">{p.name}</span>
                    <div className="stepper">
                      <button type="button" onClick={() => cart.setQty(l.id, l.qty - 1)} aria-label={`Ubrat ${p.name}`}>
                        −
                      </button>
                      <span>{l.qty}</span>
                      <button type="button" onClick={() => cart.add(l.id)} aria-label={`Přidat ${p.name}`}>
                        +
                      </button>
                    </div>
                    <span className="co-sum">{czk(p.price * l.qty)}</span>
                  </li>
                );
              })}
            </ul>

            <dl className="co-totals">
              <div>
                <dt>Pizza</dt>
                <dd>{czk(cart.subtotal)}</dd>
              </div>
              <div>
                <dt>Rozvoz</dt>
                <dd>{cart.fee === 0 ? "zdarma" : czk(cart.fee)}</dd>
              </div>
              <div className="co-total">
                <dt>Celkem</dt>
                <dd>{czk(cart.total)}</dd>
              </div>
            </dl>
            {toFree > 0 && missing === 0 && (
              <p className="co-hint">Ještě {czk(toFree)} a rozvoz máte zdarma.</p>
            )}

            <fieldset className="co-fields">
              <label>
                Jméno
                <input name="name" required autoComplete="name" maxLength={80} />
              </label>
              <label>
                Telefon
                <input
                  name="phone"
                  required
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="777 123 456"
                  pattern="^(\+?420)?\s?[0-9]{3}\s?[0-9]{3}\s?[0-9]{3}$"
                  title="Devítimístné číslo, třeba 777 123 456"
                />
              </label>
              <label className="wide">
                Ulice a číslo
                <input name="street" required autoComplete="address-line1" maxLength={120} />
              </label>
              <label className="wide">
                Obec
                <input name="town" required autoComplete="address-level2" defaultValue="Týnec nad Sázavou" maxLength={80} />
              </label>
              <label className="wide">
                Poznámka pro kurýra <span className="opt">(nepovinné)</span>
                <textarea name="note" rows={2} maxLength={300} placeholder="Zvonek, patro, bez cibule…" />
              </label>
              <div className="wide pay">
                <span>Platba při převzetí</span>
                <label className="radio">
                  <input type="radio" name="payment" value="hotove" defaultChecked /> hotově
                </label>
                <label className="radio">
                  <input type="radio" name="payment" value="karta" /> kartou u kurýra
                </label>
              </div>
            </fieldset>

            {error && (
              <p className="co-error" role="alert">
                {error}
              </p>
            )}

            {missing > 0 ? (
              <p className="co-hint">
                Minimální objednávka na rozvoz je {czk(DELIVERY.minOrder)} – chybí {czk(missing)}.
              </p>
            ) : null}

            <button className="btn btn-big" type="submit" disabled={sending || missing > 0}>
              {sending ? "Odesílám…" : `Závazně objednat za ${czk(cart.total)}`}
            </button>
            <p className="co-small">Rozvážíme: {SHOP.deliveryArea}.</p>
          </form>
        )}
      </dialog>
    </>
  );
}
