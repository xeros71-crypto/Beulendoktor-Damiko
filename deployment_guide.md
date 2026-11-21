# Deployment Guide – Vercel, Resend & Firebase Firestore

## 1. Lokale Entwicklung

```powershell
npm.cmd install
npm.cmd run dev
```

Build & Lint prüfen:

```powershell
npm.cmd run lint
npm.cmd run build
```

## 2. Umgebungsvariablen in Vercel

Für das Kontaktformular (`api/contact.js`) müssen in den Vercel Project Settings unter **Environment Variables** folgende Variablen hinterlegt werden:

| Variable | Pflicht | Beschreibung |
| :--- | :---: | :--- |
| `FIREBASE_SERVICE_ACCOUNT` | Ja | Kompletter JSON-String des Firebase Service Accounts (für Firestore-Collection `inquiries`) |
| `RESEND_API_KEY` | Ja | API-Schlüssel aus dem Resend Dashboard |
| `RESEND_FROM_EMAIL` | Empfohlen | Verifizierter Absender, z. B. `Beulendoktor Damiko <kontakt@damiko.de>` |
| `CONTACT_TO_EMAIL` | Empfohlen | Ziel-E-Mail-Adresse für eingehende Kundenanfragen, z. B. `info@damiko.de` |

## 3. GitHub & Vercel verbinden

1. Neues GitHub-Repository anlegen und lokal verbinden:
   ```powershell
   git init
   git add .
   git commit -m "Initial build: Beulendoktor Damiko"
   git branch -M main
   git remote add origin <DEINE-REPO-URL>
   git push -u origin main
   ```
2. Repository in Vercel importieren (Framework Preset: **Vite**, Build Command: `npm run build`, Output Directory: `dist`).
3. Domain `damiko.de` in Vercel zuweisen und DNS-Einträge (A/CNAME + DKIM/SPF für Resend) beim Domain-Provider setzen.
4. Vor dem Livegang im [Impressum](src/components/Impressum.jsx) und [Datenschutz](src/components/Datenschutz.jsx) Inhabername, E-Mail-Adresse und USt-IdNr. ergänzen.
