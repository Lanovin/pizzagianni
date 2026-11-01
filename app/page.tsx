import Image from "next/image";
import { CartProvider } from "@/components/Cart";
import PizzaWheel from "@/components/PizzaWheel";
import MenuList from "@/components/MenuList";
import Checkout from "@/components/Checkout";
import CartButton from "@/components/CartButton";
import { DELIVERY, SHOP, czk } from "@/lib/menu";
import pizzerie from "@/public/img/pizzerie.jpg";
import pizzaStul from "@/public/img/pizza-stul.jpg";
import margherita from "@/public/img/margherita.jpg";

const NAV = [
  { href: "#cenik", label: "Ceník" },
  { href: "#o-nas", label: "O nás" },
  { href: "#kontakt", label: "Kontakt" },
];

export default function Home() {
  return (
    <CartProvider>
      <header className="nav">
        <a href="#" className="nav-brand">
          {SHOP.name}
        </a>
        <nav aria-label="Hlavní menu">
          <ul className="nav-links">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href}>{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <a className="nav-phone" href={SHOP.phoneHref}>
          {SHOP.phone}
        </a>
        <CartButton />
      </header>

      <section className="hero">
        <Image
          src={pizzerie}
          alt="Pec na pizzu v pizzerii"
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          className="hero-photo"
        />
        <div className="hero-text">
          <h1 className="title">Pizza Gianni</h1>
          <p className="hero-sub">
            {SHOP.tagline} · rozvážíme po Týnci a okolí · <a href={SHOP.phoneHref}>{SHOP.phone}</a>
          </p>
          <a href="#cenik" className="btn hero-cta">
            Objednat pizzu
          </a>
        </div>
      </section>

      <section id="cenik" className="menu-section">
        <h2 className="h2">Ceník</h2>
        <div className="only-desktop">
          <PizzaWheel />
        </div>
        <div className="only-mobile">
          <MenuList />
        </div>
      </section>

      <section id="o-nas" className="about">
        <div className="about-photos">
          <Image
            src={pizzaStul}
            alt="Upečená pizza na stole"
            sizes="(max-width: 900px) 100vw, 40vw"
            placeholder="blur"
            className="about-photo one"
          />
          <Image
            src={margherita}
            alt="Margherita s bazalkou"
            sizes="(max-width: 900px) 60vw, 25vw"
            placeholder="blur"
            className="about-photo two"
          />
        </div>
        <div className="about-text">
          <h2 className="h2">O nás</h2>
          <p>
            Naší prioritou je vaše spokojenost. Proto na výrobu pizzy používáme výhradně čerstvé a kvalitní suroviny.
            Těsto necháváme pořádně vykynout, omáčku děláme z rajčat a pečeme na kameni.
          </p>
          <p>
            Nechce se vám klikat? Zavolejte na <a href={SHOP.phoneHref}>{SHOP.phone}</a> nebo se zastavte v provozovně{" "}
            {SHOP.street}.
          </p>
        </div>
      </section>

      <section id="kontakt" className="contact">
        <h2 className="h2">Kontakt</h2>
        <div className="contact-grid">
          <div>
            <h3>Adresa</h3>
            <p>
              {SHOP.street}
              <br />
              {SHOP.city}
              <br />
              <a
                href={`https://mapy.cz/zakladni?q=${encodeURIComponent(`${SHOP.street}, Týnec nad Sázavou`)}`}
                target="_blank"
                rel="noreferrer"
              >
                Ukázat na mapě ↗
              </a>
            </p>
          </div>
          <div>
            <h3>Otevřeno</h3>
            <dl className="hours">
              {SHOP.hours.map(([d, h]) => (
                <div key={d}>
                  <dt>{d}</dt>
                  <dd>{h}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h3>Telefon a e-mail</h3>
            <p>
              <a href={SHOP.phoneHref} className="contact-phone">
                {SHOP.phone}
              </a>
              <br />
              <a href={`mailto:${SHOP.email}`}>{SHOP.email}</a>
              <br />
              Facebook: Gianni Pizza
            </p>
          </div>
          <div>
            <h3>Rozvoz</h3>
            <p>
              {SHOP.deliveryArea}
              <br />
              {czk(DELIVERY.fee)}, od {czk(DELIVERY.freeFrom)} zdarma
              <br />
              minimální objednávka {czk(DELIVERY.minOrder)}
            </p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>
          © {SHOP.name} · {SHOP.street}, Týnec nad Sázavou ·{" "}
          <a href={SHOP.phoneHref}>{SHOP.phone}</a>
        </p>
        <p className="footer-credit">
          Foto v úvodu:{" "}
          <a href="https://commons.wikimedia.org/wiki/File:Furano_Pizza_Factory._(37969459511).jpg" target="_blank" rel="noreferrer">
            MIKI Yoshihito
          </a>
          , CC BY 2.0
        </p>
      </footer>

      <Checkout />
    </CartProvider>
  );
}
