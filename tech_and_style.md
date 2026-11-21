# Lack- & Beulendoktor Damiko – Tech Stack & Style Guide

Dieses Dokument beschreibt die technische Architektur, das Performance-/SEO-Setup und das Design-System der Webpräsenz **Lack- & Beulendoktor Damiko / Damiko Dellentechnik** (`damiko.de`).

---

## 1. Technologie-Stack & Architektur

| Bereich | Technologie | Einsatz & Besonderheiten |
| :--- | :--- | :--- |
| **Frontend & Routing** | React 19.3 + Vite 8.3 (Rolldown) + React Router 7.18 | SPA mit granularem `React.lazy()` Code-Splitting (`react-vendor`, `RegionalRoute`, `ServiceRoute`, `Galerie`, `AdminGallery`) & schlankem Nav-Index (`src/data/regionalNav.js`) |
| **SSG / SSR Prerendering** | `src/entry-server.jsx` + `scripts/prerender-meta.mjs` | Vollständiges statisches HTML-Prerendering für alle **39 Routen** (`dist/<slug>.html`), automatische `sitemap.xml`-Synchronisation (36 indexierbare URLs) & W3C-valides HTML5 (0 Errors) |
| **Critical-Path & CSS** | CSS Modules + Inline-CSS-Injektion im `<head>` | `index-*.css`, `PageLayout-*.css` und `BackButton-*.css` werden beim Build direkt inline in `<head>` eingebettet (**0 render-blockierende Stylesheets**, kein Subpage-FOUC) |
| **Core Web Vitals (99/100)** | Responsive WebP (`<picture>`) + `content-visibility: auto` | 29 responsive WebP-Varianten (`-96w`, `-320w`, `-480w`, `-640w`, `-960w`), exklusiver LCP-`imagesrcset`-Preload (`fetchpriority="high"`), `IntersectionObserver` ohne Forced Reflow |
| **Typografie (0 CLS)** | Lokale `Inter` `.woff2` (`public/fonts/`) + `Inter Fallback` | 100 % DSGVO-konform (kein Google-Fonts-CDN), konsolidierte Weights (`300 400`, `600 700`, `800`), `font-display: optional` & metrikgenauer Fallback (`size-adjust: 107.06%`) |
| **Structured Data & KI-SEO** | Schema.org JSON-LD `@graph` + `public/llms.txt` | `AutoBodyShop`, `AutoRepair`, `Service`, `OfferCatalog`, `BreadcrumbList`, `FAQPage` & `ImageGallery` in `src/data/businessSchema.js` |
| **Backend (Serverless)** | Vercel Functions (`api/contact.js`, `api/gallery.js`, `api/admin-session.js`) | HMAC-signierte Anti-Bot-Formular-Tokens (On-Focus-Abruf), Replay-Schutz, verteiltes Rate-Limiting, geschütztes Galerie-Admin-CMS (`/admin`) |
| **Datenbank & E-Mail** | Firebase Firestore (`firebase-admin`) + Resend (`resend`) | Persistente Speicherung von Anfragen (`inquiries`), dynamischen Galerie-Einträgen (`gallery`) sowie HTML-/Plain-Text-E-Mail-Versand |
| **Security & DSGVO** | Strikte HTTP-Header (`vercel.json`) + `CookieConsent.jsx` | CSP (`default-src 'self'`), HSTS (Preload), `X-Frame-Options: DENY`, `Permissions-Policy` & TDDDG/DSGVO-konformes Consent-Management |
| **Code-Qualität** | ESLint 10 (Flat Config) | Einheitliche statische Prüfung für `src/`, `api/` und `scripts/` |

---

## 2. Design-System & Style-Stack (`src/styles/variables.css`)

Das visuelle System basiert auf einem dunklen **Showroom-Luxury-Theme** (Obsidian-Indigo mit Signature Damiko-Gelb und Logo-Cyan) ohne rechenintensive `backdrop-filter`-Bremsen für flüssige 60-fps-Scroll-Performance.

### Farbpalette

| CSS-Variable | Farbwert | Verwendung |
| :--- | :--- | :--- |
| `--bg-dark` | `#0d0a1a` | Haupt-Seitenhintergrund (Obsidian-Indigo) |
| `--bg-deep` | `#090714` | Tiefer Kontrasthintergrund & Scrollbar-Track |
| `--bg-brand` | `#292045` | Damiko-Markenindigo für Sektionen & Akzentflächen |
| `--bg-card` | `#17122b` | Karten-, Box- und Formularhintergrund |
| `--bg-card-hover` | `#211a3b` | Hover-Zustand für interaktive Karten |
| `--accent-primary` | `#fef579` | Signature Damiko-Goldgelb (Kicker, Primär-Buttons, Checkmarks, aktive Links) |
| `--accent-primary-strong` | `#f2cb07` | Kräftiger Goldton für Verläufe & Hover-Highlights |
| `--accent-secondary` | `#00b4e6` | Damiko-Wappen Cyan-Blau (WhatsApp-CTAs, Badges, sekundäre Akzente) |
| `--accent-navy` | `#0d3b82` | Tiefes Wappen-Blau |
| `--text-primary` | `#ffffff` | Primärtext & Kernelemente |
| `--text-heading` | `#f7f6fb` | Sektionsüberschriften |
| `--text-secondary` | `#cfcbe0` | Fließtext & Beschreibungen |
| `--text-muted` | `#9891b3` | Meta-Labels, Breadcrumbs & Fußnoten |
| `--border-color` | `rgba(254, 245, 121, 0.2)` | Dezent goldene Rahmenlinie für Karten & Boxen |
| `--border-subtle` | `rgba(255, 255, 255, 0.09)` | Feine Trennlinien |

### Verläufe, Schatten & Animation

- **`--gradient-heading`**: `linear-gradient(110deg, #ffffff 0%, #fff8c4 48%, #fef579 82%, #f2cb07 100%)` (Text-Clip für H1/Hero-Headlines)
- **`--gradient-accent`**: `linear-gradient(135deg, #fff69a 0%, #fef579 50%, #f2cb07 100%)` (Primäre CTA-Buttons)
- **`--gradient-glass`**: `linear-gradient(160deg, rgba(41, 32, 69, 0.56) 0%, rgba(16, 12, 32, 0.78) 100%)` (Showroom-Karten)
- **`--shadow-luxury`**: `0 24px 55px rgba(0, 0, 0, 0.52)`
- **`--ease-luxury`**: `cubic-bezier(0.22, 1, 0.36, 1)` (GPU-beschleunigte `translate3d`/`opacity` Scroll-Reveals)

---

## 3. Seiten- & Routenstruktur (39 vorgerenderte Routen)

### Haupt- & Leistungsseiten (8)
- `/` – Startseite (Hero + 3 USPs, Leistungen-Grid, Frankfurt-Lackiererei-Sektion, Über uns, 4-Schritte Leasing-Service, Vorher-/Nachher-Galerie, FAQ, Kontaktformular)
- `/lackierungen` – Autolackierungen, Teillackierungen & Spot Repair
- `/ausbeulservice` – Mobiler Kfz-Ausbeulservice (PDR Dellentechnik)
- `/smart-repair` – Smart Repair & Kleinschadenreparatur
- `/leasingruecklaeufer` – 4-Schritte Leasingrückläufer-Service inkl. Checkliste
- `/hagelschaeden` – Hagelschaden-Instandsetzung inkl. Kfz-Gutachter DK
- `/fahrzeugaufbereitung` – Fahrzeugaufbereitung & Hochglanzpolitur
- `/galerie` – Vorher-/Nachher-Referenzen & Werkstatt-Einblicke mit Lightbox

### Regionale Local-SEO-Landingpages im 30-km-Umkreis um Frankfurt (28)
Modular verwaltet unter `src/data/regional/` mit jeweils 100 % einzigartigen Texten, lokalen Schadenfällen, Anfahrts-/PLZ-Fakten, Ortsteil-Listen, individuellen FAQs und geografischer Nachbar-Verlinkung:
- **Frankfurt & Kerngebiet (8)** (`coreRegions.js`): `/autolackiererei-frankfurt`, `/autolackiererei-bad-homburg`, `/autolackiererei-oberursel`, `/autolackiererei-eschborn`, `/beulendoktor-bad-vilbel`, `/beulendoktor-wetterau`, `/beulendoktor-offenbach`, `/smart-repair-rhein-main`
- **Norden & Wetterau (5)** (`northWetterau.js`): `/beulendoktor-karben`, `/beulendoktor-friedrichsdorf`, `/beulendoktor-rosbach`, `/autolackiererei-friedberg`, `/beulendoktor-bad-nauheim`
- **Taunus & Westen (7)** (`westTaunus.js`): `/autolackiererei-kronberg`, `/beulendoktor-koenigstein`, `/smart-repair-schwalbach`, `/autolackiererei-bad-soden`, `/beulendoktor-kelkheim`, `/beulendoktor-hofheim`, `/smart-repair-hattersheim`
- **Süden & Kreis Offenbach (5)** (`southOffenbach.js`): `/autolackiererei-neu-isenburg`, `/beulendoktor-dreieich`, `/smart-repair-langen`, `/beulendoktor-kelsterbach`, `/beulendoktor-dietzenbach`
- **Osten & Main-Kinzig (3)** (`eastMainKinzig.js`): `/autolackiererei-maintal`, `/autolackiererei-hanau`, `/beulendoktor-muehlheim`

### Rechtliches & Verwaltung (3, `noindex`)
- `/impressum` – Anbieterkennzeichnung
- `/datenschutz` – DSGVO- & TDDDG-Datenschutzerklärung
- `/admin` – Passwortgeschütztes Galerie-Admin-Interface
