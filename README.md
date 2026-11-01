# Pizza Gianni

Web pizzerie Pizza Gianni (Týnec nad Sázavou) s online objednávkou rozvozu. Next.js 16.

## Spuštění

```bash
npm install
npm run build
npm start          # http://localhost:3000
```

## Nastavení

- **Nabídka, ceny, otevírací doba, kontakty, podmínky rozvozu:** `lib/menu.ts`
- **Přehled objednávek pro pizzerii:** `/kuchyne?klic=<ADMIN_KEY>`. Klíč nastavte v `.env.local`:

  ```
  ADMIN_KEY=nejake-tajne-heslo
  ```

- Objednávky se ukládají do `data/orders.json` (není v gitu). Funguje to na běžném serveru nebo VPS.
  Na serverless hostingu (Vercel apod.) se soubor neuchová – tam je potřeba upravit `lib/orders.ts`
  (databáze nebo odeslání e-mailem).

## Fotky

- `public/img/pizzerie.jpg` – MIKI Yoshihito, [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Furano_Pizza_Factory._(37969459511).jpg), CC BY 2.0
- `public/img/pizza-stul.jpg`, `public/img/margherita.jpg` – Unsplash (Unsplash License)
