# Beulendoktor Damiko – Tech Stack & Style Guide

Dieses Dokument beschreibt die technische Architektur, das Design-System und die SEO-Struktur der Webpräsenz **Beulendoktor Damiko / Damiko Dellentechnik** (`damiko.de`), aufgebaut auf dem einheitlichen Projekt-Stack.

## 1. Technologie-Stack

| Bereich | Technologie | Einsatz |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite 8 + React Router 7 | Moderne Single-Page-Application mit `React.lazy()` Code-Splitting |
| **SEO & Meta** | React Helmet Async + `scripts/prerender-meta.mjs` | Dynamische & vorgerenderte Meta-, OG-, Canonical- & JSON-LD-Daten (16 Routen) |
| **Styling** | CSS Modules + CSS Custom Properties (`variables.css`) | Wartbare Komponenten-Styles ohne Laufzeit-Overhead |
| **Typografie** | Lokale `Inter` `.woff2`-Dateien (`public/fonts/`) | 100 % DSGVO-konform ohne externe Google-Fonts-Verbindung |
| **Backend (Serverless)** | Vercel Serverless Function (`api/contact.js`) | Validierung, Honeypot, Origin-Check, Rate-Limiting |
| **Datenbank** | Firebase Firestore (`firebase-admin`) | Persistente Speicherung von Kontaktanfragen (`inquiries`) |
| **E-Mail** | Resend (`resend`) | HTML + Plain-Text Benachrichtigungen an das Betriebspostfach |
| **Code-Qualität** | ESLint 10 (Flat Config) | Einheitliche Prüfung für `src/`, `api/` und `scripts/` |

## 2. Design-System (aufgebaut auf `damiko.de` & offiziellem Wappen-Logo)

| Variable | Farbwert | Verwendung |
| :--- | :--- | :--- |
| `--bg-dark` | `#140F26` | Tiefer Midnight-Indigo-Hintergrund |
| `--bg-brand` | `#292045` | Originaler Damiko-Indigoton für Flächen & Verläufe |
| `--bg-card` | `#1E1736` | Karten- und Formularflächen |
| `--accent-primary` | `#FEF579` | Signature Damiko-Gelb (CTAs, Kicker, Aktive Links, Rahmen) |
| `--accent-secondary` | `#00B4E6` | Damiko-Logo Cyan-Blau (sekundäre Akzente & WhatsApp-CTAs) |
| `--text-primary` | `#FFFFFF` | Überschriften & Haupttext |
| `--text-secondary` | `#CFCBE0` | Fließtext & Beschreibungen |

## 3. Seiten- & Routenstruktur

- `/` – Startseite (Hero + 3 USPs, Leistungen-Grid, Über uns, 4-Schritte Leasing-Sorglos-Service, Vorher-/Nachher-Galerie, FAQ, Kontaktformular)
- `/lackierungen` – Autolackierungen & Teillackierungen
- `/ausbeulservice` – Mobiler Kfz-Ausbeulservice (Dellentechnik / PDR)
- `/smart-repair` – Smart Repair & Spot Repair
- `/leasingruecklaeufer` – Leasingrückläufer-Service inkl. Checkliste
- `/hagelschaeden` – Hagelschäden inkl. Teilkasko & Kfz-Gutachter DK
- `/fahrzeugaufbereitung` – Fahrzeugaufbereitung & Lackpolitur
- `/galerie` – Vollständige Vorher-/Nachher- & Werkstatt-Galerie mit Lightbox
- 6 regionale SEO-Seiten (`/autolackiererei-frankfurt`, `/beulendoktor-wetterau`, `/smart-repair-rhein-main`, `/autolackiererei-bad-homburg`, `/beulendoktor-offenbach`, `/beulendoktor-bad-vilbel`)
- `/impressum` & `/datenschutz` (inkl. DSGVO/TDDDG Cookie-Banner)
