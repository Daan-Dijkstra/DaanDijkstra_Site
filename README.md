# daandijkstra.com

Portfolio- en contactwebsite van Daan Dijkstra, gebouwd met [Astro](https://astro.build).
Volledig gratis te hosten via Vercel.

## Projectstructuur

```
/
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro       ← header, nav, footer (één keer geschreven, overal gebruikt)
│   ├── pages/
│   │   ├── index.astro            ← homepage
│   │   ├── portfolio.astro        ← portfolio-overzicht (genereert automatisch uit content/)
│   │   ├── contact.astro          ← contactformulier (Web3Forms)
│   │   └── projecten/
│   │       └── [slug].astro       ← genereert automatisch 1 pagina per project
│   ├── content/
│   │   ├── config.ts              ← schema voor projectdata
│   │   └── projecten/
│   │       ├── bootbank.md        ← voorbeeldproject
│   │       └── restauratie.md     ← voorbeeldproject
│   └── styles/
│       └── global.css
├── public/
│   ├── images/                    ← al je foto's komen hier
│   ├── favicon.svg
│   └── robots.txt
├── astro.config.mjs
└── package.json
```

## Nieuw project toevoegen (zonder HTML te schrijven)

1. Zet je foto's in `public/images/`.
2. Maak een nieuw bestand in `src/content/projecten/`, bijvoorbeeld `mijnproject.md`:

```markdown
---
title: "Titel van het project"
thumbnail: "/images/mijnproject_thumbnail.jpg"
beschrijving: "Korte beschrijving die ook als SEO-tekst gebruikt wordt."
volgorde: 3
fotos:
  - src: "/images/mijnproject1.jpg"
    alt: "Omschrijving van de foto"
  - src: "/images/mijnproject2.jpg"
    alt: "Omschrijving van de foto"
---

Hier komt de vrije tekst/uitleg over het project.
```

3. Klaar. De pagina `/projecten/mijnproject` en de tegel op `/portfolio` en de
   homepage verschijnen automatisch — je hoeft nergens anders iets aan te passen.

## Lokaal draaien

Vereist [Node.js](https://nodejs.org) (versie 18 of hoger).

```bash
npm install
npm run dev
```

Site is dan te bekijken op `http://localhost:4321`.

## Contactformulier activeren

Het formulier op `/contact` gebruikt [Web3Forms](https://web3forms.com) (gratis, geen backend nodig):

1. Ga naar https://web3forms.com
2. Vul je e-mailadres in en krijg direct een gratis "Access Key" toegestuurd (geen account nodig)
3. Open `src/pages/contact.astro`
4. Vervang `JOUW_ACCESS_KEY_HIER` met je eigen key
5. Commit en push — berichten komen voortaan direct in je mailbox (tot 250/maand gratis)

## Deployen naar Vercel (gratis)

1. Push deze repository naar GitHub (zie hieronder).
2. Ga naar https://vercel.com en log in met je GitHub-account.
3. Klik "Add New Project" en selecteer deze repository.
4. Vercel herkent Astro automatisch — geen configuratie nodig.
5. Klik "Deploy". Klaar.

Elke volgende `git push` naar de `main`-branch deployt automatisch een update.

## Deze repo naar GitHub pushen

```bash
git init
git add .
git commit -m "Initial commit: Astro-versie van daandijkstra.com"
git branch -M main
git remote add origin https://github.com/JOUW-GEBRUIKERSNAAM/daandijkstra-site.git
git push -u origin main
```

## Nog te doen

- [ ] Web3Forms Access Key invullen in `src/pages/contact.astro`
- [ ] Eigen foto's toevoegen in `public/images/` (huidige paden zijn placeholders)
- [ ] Eventueel Nederlandse/Engelse taalversies toevoegen (Astro i18n-routing)
- [ ] Domeinnaam koppelen in Vercel-instellingen
