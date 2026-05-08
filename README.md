# AI Model Advisor

Een interactieve webapp die bedrijven en developers helpt bij het kiezen van het juiste AI-model voor hun specifieke use case.

Gebouwd door **Lukas Langhout** als persoonlijk portfolio-project.

## Wat doet de app?

De gebruiker doorloopt een vragenflow over:
- **Use case** – Tekst, code, data-analyse, vision, agents
- **Schaal** – Prototype t/m enterprise (requests/dag)
- **Latency** – Real-time, interactief, batch, asynchroon
- **Budget** – < €50 t/m > €5.000/maand of self-hosted
- **Privacy** – Open data t/m strikt vertrouwelijk (on-premise)
- **Integratie** – API, on-premise, edge/mobiel, hybride

Op basis van de antwoorden genereert Claude een onderbouwde aanbeveling met vergelijking van 3–5 passende AI-modellen, inclusief score, redenering, voor- en nadelen en kostenschatting.

## Stack

| Onderdeel | Technologie |
|---|---|
| Frontend | React + TypeScript + Vite |
| Styling | Tailwind CSS |
| AI | Claude API (Anthropic) via Vercel serverless function |
| Database | Supabase (optioneel – opslaan van scenario's en feedback) |
| Hosting | Vercel |

## Lokaal draaien

```bash
# 1. Installeer dependencies
npm install

# 2. Maak .env.local aan
cp .env.example .env.local
# Vul je ANTHROPIC_API_KEY in

# 3. Start de dev server
npm run dev
```

## Environment variabelen

| Variabele | Verplicht | Beschrijving |
|---|---|---|
| `ANTHROPIC_API_KEY` | Ja | Anthropic API key voor Claude |
| `VITE_SUPABASE_URL` | Nee | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Nee | Supabase anonieme sleutel |

> **Let op:** Voeg in Vercel de env vars toe via het dashboard onder **Settings → Environment Variables**.

## Supabase (optioneel)

Voer het SQL-migratiebestand uit in je Supabase SQL-editor:

```
supabase/migrations/001_initial.sql
```

Zonder Supabase werkt de app volledig — scenario's en feedback worden dan niet opgeslagen.

## Vercel deployment

Het project is geconfigureerd voor directe deployment op Vercel. De `api/recommend.ts` wordt automatisch als serverless function opgepikt.

## Leerlijn

Dit project sluit aan bij meerdere learning outcomes:

- **LUK 3 – Analysing**: Analyse van het AI-modellandschap
- **LUK 4 – Advising**: Vertalen van technische kennis naar begrijpelijke aanbevelingen
- **LUK 5 – Designing**: UX-design van de vragenflow en resultatenweergave
- **LUK 6 – Realising**: Werkende, deployable tool met error handling en documentatie
