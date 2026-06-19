# AI Model Advisor — Handover Document

**Versie 1.0 · Juni 2026 · Lukas Langhout**

Een interactieve webapp die via een AI-gestuurd discovery-gesprek het beste AI-model aanbeveelt voor jouw specifieke situatie. De tool vergelijkt 111 modellen op basis van use case, budget, privacy, latency en meer.

**Live:** https://ai-model-advisor.vercel.app  
**Architectuur & prompt:** https://ai-model-advisor.vercel.app/architectuuroverzicht  
**Repository:** https://github.com/LukasLanghout/ai-model-advisor

---

## Inhoudsopgave

1. [Wat doet de app](#1-wat-doet-de-app)
2. [Architectuur](#2-architectuur)
3. [Vereisten](#3-vereisten)
4. [API-keys instellen — stap voor stap](#4-api-keys-instellen--stap-voor-stap)
5. [Lokaal opstarten](#5-lokaal-opstarten)
6. [Deployen op Vercel](#6-deployen-op-vercel)
7. [Projectstructuur](#7-projectstructuur)
8. [Belangrijke bestanden](#8-belangrijke-bestanden)
9. [Wat je nog kunt toevoegen](#9-wat-je-nog-kunt-toevoegen)

---

## 1. Wat doet de app

De AI Model Advisor leidt gebruikers in vijf stappen naar de juiste AI-keuze:

**Stap 1 — Introscherm**  
Uitleg over de tool en een overzicht van de beschikbare functies. Gebruikers kunnen ook direct de Model Explorer openen om alle 111 modellen en HuggingFace modellen te doorzoeken.

**Stap 2 — Discovery-gesprek**  
Een chatgesprek waarbij de AI 7 gerichte vragen stelt: use case, schaal/volume, latency, budget, privacy, vereiste talen en contextvenster. De AI legt bij elke vraag in begrijpelijke taal uit wat het begrip betekent.

**Stap 3 — Analyse**  
Het scenario wordt naar `/api/recommend` gestuurd. Llama 3.3 70B (via Groq) scoort alle 111 modellen op basis van 8 selectieregels en geeft 3 tot 5 aanbevelingen terug als JSON.

**Stap 4 — Resultaten**  
De aanbevelingen worden getoond in tabbladen:
- **Aanbevelingen** — modelkaarten met score, redenering, voor- en nadelen, kosten
- **Aan de slag** — gepersonaliseerde gids per model (API-key stappen, Python-code, startprompt)
- **Beslissingspad** — visuele weergave van de beslissingsfactoren
- **Kosten** — interactieve calculator voor maandkosten op basis van tokenvolume
- **Playground** — test tekst- en beeldgeneratie direct in de browser
- **Compliance** — AVG/GDPR-vergelijkingstabel per aanbevolen model

**Stap 5 — PDF-export**  
Volledig rapport als downloadbaar PDF-bestand, gegenereerd in de browser via `@react-pdf/renderer`.

---

## 2. Architectuur

```
Gebruiker (browser)
  React + Vite + TypeScript + Tailwind CSS + Framer Motion
  Lokale data: 111 modellen, prijsdata, GDPR-data (geen server nodig)
  PDF-export via @react-pdf/renderer (volledig in browser)
  Naam opgeslagen via localStorage

          HTTPS / fetch

Vercel Serverless API routes  (/api map)
  /api/chat              Edge  25s   Discovery-gesprek
  /api/recommend         Edge  25s   Model-aanbeveling (111 modellen, 8 regels)
  /api/compare-models    Edge  25s   Vergelijking van modellen
  /api/getting-started   Edge  25s   Gepersonaliseerde gids per model
  /api/model-info        Edge  25s   Detailinfo via HuggingFace + Groq
  /api/playground        Edge  25s   Tekst-playground, 3 modellen parallel
  /api/image-gen         Node  60s   Beeldgeneratie (FLUX & SD3)
  /api/hf-models         Edge  25s   HuggingFace model-zoekindex

          REST / Bearer token of anon key

Externe diensten
  Groq Cloud        Llama 3.3 70B Versatile, ca. 300 tokens/sec
  HuggingFace       FLUX.1-schnell, Stable Diffusion 3, Model Search API
  Supabase          student_feedback tabel, anon insert-only RLS
```

**CI/CD:** Elke push naar `main` op GitHub triggert automatisch een Vercel-deploy.

---

## 3. Vereisten

| Wat | Versie / link |
|-----|--------------|
| Node.js | v18 of hoger — nodejs.org |
| npm | Meegeleverd met Node.js |
| Git | git-scm.com |
| Groq-account | Gratis — console.groq.com |
| HuggingFace-account | Gratis — huggingface.co |
| Supabase-account | Gratis tier — supabase.com |
| Vercel-account | Gratis hobby-plan — vercel.com |

---

## 4. API-keys instellen — stap voor stap

### 4.1 Groq (verplicht)

Groq levert de Llama 3.3 70B inferentie. Alle AI-functies in de app — chat, aanbevelingen, analyses, getting-started gids — lopen via Groq.

1. Ga naar **console.groq.com** en maak een gratis account aan.
2. Klik in het linkermenu op **API Keys**.
3. Klik op **Create API Key**, geef hem een naam (bijv. `ai-model-advisor`) en klik op **Submit**.
4. Kopieer de sleutel direct — hij wordt maar één keer getoond. De sleutel begint met `gsk_`.
5. Voeg hem toe als omgevingsvariabele:

```
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Limiet gratis tier:** 30 verzoeken per minuut, 6.000 tokens per minuut. Bij hoog gelijktijdig gebruik geeft Groq een 429-fout. De app vangt dit op en toont een foutmelding aan de gebruiker.

**Upgrade:** Betaalde Groq-plannen halen de ratelijmieten weg. Ga naar **console.groq.com → Billing** om te upgraden.

---

### 4.2 HuggingFace (verplicht voor beeldgeneratie)

HuggingFace levert de beeldgeneratie-modellen (FLUX.1-schnell en Stable Diffusion 3) en de Model Search API voor de Explorer.

1. Ga naar **huggingface.co** en maak een gratis account aan.
2. Klik rechtsboven op je profielfoto en ga naar **Settings**.
3. Klik in het linkermenu op **Access Tokens**.
4. Klik op **New token**, kies type **Read** en geef hem een naam.
5. Klik op **Generate a token** en kopieer de waarde. De token begint met `hf_`.
6. Voeg hem toe als omgevingsvariabele:

```
HF_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Modellicenties accepteren:**  
FLUX.1-schnell en SD3-medium vereisen dat je de licentie accepteert voordat je ze kunt gebruiken. Als je een 403-fout krijgt in de playground, ga dan naar de modelpagina en klik op **Agree and access repository**:

- FLUX.1-schnell: huggingface.co/black-forest-labs/FLUX.1-schnell
- Stable Diffusion 3 Medium: huggingface.co/stabilityai/stable-diffusion-3-medium-diffusers

---

### 4.3 Supabase (verplicht voor studentfeedback)

Supabase slaat de feedback op die gebruikers kunnen achterlaten via de FeedbackWidget.

**Database aanmaken:**

1. Ga naar **supabase.com** en maak een gratis account aan.
2. Klik op **New project** en geef het een naam. Kies **Frankfurt (eu-central-1)** als regio voor EU-gegevensbescherming.
3. Stel een databasewachtwoord in en wacht tot het project is aangemaakt (ca. 1 minuut).

**Tabel aanmaken:**

4. Ga naar **Table Editor** en klik op **New table**.
5. Noem de tabel `student_feedback` en maak de volgende kolommen aan:

| Kolom | Type | Default | Verplicht |
|-------|------|---------|-----------|
| id | uuid | gen_random_uuid() | primary key |
| created_at | timestamptz | now() | ja |
| screen | text | — | nee |
| feature | text | — | nee |
| rating | int2 | — | nee |
| comment | text | — | nee |

**Row Level Security instellen:**

6. Ga naar **Authentication → Policies**.
7. Zoek de tabel `student_feedback` en klik op **Enable RLS**.
8. Klik op **New Policy** en kies **For full customization**.
9. Vul in:
   - Policy name: `allow anon insert`
   - Command: `INSERT`
   - Target roles: `anon`
   - WITH CHECK expression: `true`
10. Sla de policy op.

Dit zorgt dat anonieme bezoekers alleen kunnen invoegen, maar niet lezen, wijzigen of verwijderen.

**API-sleutels ophalen:**

11. Ga naar **Project Settings → API**.
12. Kopieer de **Project URL** en de **anon public** key.

```
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

De `anon` key is veilig om in de frontend te plaatsen. Door de RLS-policy kan hij alleen invoegen in `student_feedback`.

---

## 5. Lokaal opstarten

**Stap 1 — Repository clonen:**
```bash
git clone https://github.com/LukasLanghout/ai-model-advisor.git
cd ai-model-advisor
```

**Stap 2 — Dependencies installeren:**
```bash
npm install
```

**Stap 3 — Omgevingsvariabelen instellen:**

Maak een bestand `.env.local` aan in de root van het project:

```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
HF_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Voeg `.env.local` nooit toe aan Git — het staat al in `.gitignore`.

**Stap 4 — Dev-server starten:**

Gebruik de Vercel dev-server om ook de `/api`-routes lokaal te draaien:
```bash
npx vercel dev
```

De app is bereikbaar op `http://localhost:3000`.

Als je alleen de frontend wilt draaien (API-routes werken dan niet):
```bash
npm run dev
```

De app is dan bereikbaar op `http://localhost:5173`.

**Stap 5 — Bouwen voor productie (optioneel, ter controle):**
```bash
npm run build
```

---

## 6. Deployen op Vercel

### Eerste keer deployen

1. Ga naar **vercel.com** en log in met je GitHub-account.
2. Klik op **Add New → Project** en importeer de repository `ai-model-advisor`.
3. Vercel detecteert Vite automatisch. Laat de standaardinstellingen staan.
4. Voeg de omgevingsvariabelen toe onder **Environment Variables** (zie tabel hieronder).
5. Klik op **Deploy**. De eerste deploy duurt ca. 1–2 minuten.

| Variabele | Beschrijving |
|-----------|-------------|
| `GROQ_API_KEY` | Groq API-key (begint met `gsk_`) |
| `HF_API_KEY` | HuggingFace access token (begint met `hf_`) |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anon public key |

### Automatische deploys

Na de eerste koppeling deployt Vercel automatisch bij elke push naar `main`. Je hoeft niets handmatig te doen.

### Omgevingsvariabelen bijwerken

Ga naar **Vercel Dashboard → jouw project → Settings → Environment Variables**. Na een wijziging moet je handmatig opnieuw deployen via **Deployments → Redeploy**.

### Aangepast domein koppelen

Ga naar **Vercel Dashboard → jouw project → Settings → Domains** en voeg je eigen domein toe. Vercel genereert automatisch een SSL-certificaat via Let's Encrypt.

---

## 7. Projectstructuur

```
ai-model-advisor/
├── api/                              Vercel serverless functies
│   ├── chat.ts                       Discovery-gesprek
│   ├── recommend.ts                  Model-aanbeveling (kern van de app)
│   ├── compare-models.ts             Vergelijking van modellen
│   ├── getting-started.ts            Gepersonaliseerde gids per model
│   ├── model-info.ts                 Detailinfo via HuggingFace + Groq
│   ├── playground.ts                 Tekst-playground
│   ├── image-gen.ts                  Beeldgeneratie (Node runtime, 60s)
│   └── hf-models.ts                  HuggingFace model-zoekindex
│
├── src/
│   ├── components/
│   │   ├── Layout/Header.tsx         Navigatiebalk
│   │   ├── Conversation/             Chat-interface voor discovery-gesprek
│   │   ├── Results/                  Resultatenview met alle tabbladen
│   │   ├── ModelExplorer/            Model Explorer (zoeken, vergelijken)
│   │   ├── ArchitectuurPage.tsx      Pagina /architectuuroverzicht
│   │   ├── IntroScreen.tsx           Startscherm
│   │   ├── LoadingScreen.tsx         Laadscherm
│   │   └── FeedbackWidget.tsx        Feedbackformulier
│   │
│   ├── data/
│   │   ├── models.ts                 111 AI-modellen met metadata
│   │   ├── pricing.ts                Prijsdata per provider
│   │   └── compliance.ts             GDPR/AVG-data per model
│   │
│   ├── lib/supabase.ts               Supabase client
│   ├── types/index.ts                TypeScript interfaces
│   ├── App.tsx                       Root-component en routing
│   └── main.tsx                      Entry point
│
├── .env.local                        Lokale omgevingsvariabelen (niet in Git)
├── vercel.json                       Vercel-configuratie (rewrites, timeouts)
├── tailwind.config.js                Tailwind (brand-kleuren: teal)
└── package.json                      Dependencies en scripts
```

---

## 8. Belangrijke bestanden

### `api/recommend.ts`

Dit is de kern van de applicatie. Het ontvangt het scenario-object (verzameld via het discovery-gesprek) en stuurt een prompt naar Groq met:

- Een database van 111 AI-modellen (id, naam, params, context, kosten, VRAM, privacy)
- 8 harde selectieregels (privacy, GDPR, budget, latency, taal, code, RAG, MoE)
- Een vereist JSON-outputformaat met score, redenering, voor/nadelen en trade-off per model

Modelinstellingen: `llama-3.3-70b-versatile`, `max_tokens: 2048`, `temperature: 0.3`, `response_format: json_object`.

De volledige prompt is zichtbaar op `/architectuuroverzicht` → tabblad **Volledige prompt**.

### `src/data/models.ts`

Bevat alle 111 modellen. Als je een nieuw model wilt toevoegen, voeg je hier een object toe aan de array én voeg je een regel toe aan de `MODELS_CONTEXT` string in `api/recommend.ts`.

### `api/getting-started.ts`

Combineert statische data (API-key stappen per provider, Ollama model-namen) met door Groq gegenereerde content (startprompt, Python-code, eerste testprompt). Statisch is betrouwbaarder voor de stapsgewijze instructies; Groq genereert de use-case-specifieke delen.

### `src/components/Results/PdfReport.tsx`

Definieert het PDF-rapport via `@react-pdf/renderer`. Het rapport wordt volledig in de browser gegenereerd — geen server of opslag nodig. Bevat: coverblad, scenario, samenvatting, alle aanbevelingen, kosten en getting-started gids.

---

## 9. Wat je nog kunt toevoegen

### Eenvoudig (minder dan 1 dag werk)

**Nieuw model toevoegen aan de database**  
Voeg een entry toe aan `src/data/models.ts` en een regel aan de `MODELS_CONTEXT` string in `api/recommend.ts`. Het model wordt direct meegenomen in aanbevelingen en de Model Explorer.

**Meer use-case templates**  
Voeg scenario's toe aan `src/components/Conversation/TemplateSelector.tsx`. Gebruikers kunnen dan sneller beginnen zonder het gesprek volledig in te typen.

**Nieuwe provider in getting-started**  
Voeg een entry toe aan `PROVIDER_API_INFO` in `api/getting-started.ts` voor een provider die nog niet ondersteund wordt.

**Dark mode**  
Tailwind heeft ingebouwde dark mode-ondersteuning. Voeg `darkMode: 'class'` toe aan `tailwind.config.js`, toggle de `dark`-class op het root-element en pas de kleuren aan.

---

### Gemiddeld (1 tot 3 dagen werk)

**Gebruikersaccounts en opgeslagen sessies**  
Voeg authenticatie toe via Supabase Auth. Sla aanbevelingssessies op in een `sessions`-tabel zodat gebruikers later kunnen terugkijken naar eerdere adviezen.

**Meertalige interface**  
De app is volledig in het Nederlands. Voeg `i18next` toe voor Engels en andere talen. De systeemprompts in de API-routes moeten dan ook worden aangepast.

**E-mailrapport**  
Stuur het gegenereerde PDF-rapport naar het e-mailadres van de gebruiker via Resend of SendGrid. Voeg een `/api/send-report` route toe die de PDF als bijlage meestuurt.

**Live benchmarkdata in de Explorer**  
De `ModelComparePanel.tsx` vergelijkt modellen op basis van statische data. Koppel de HuggingFace Open LLM Leaderboard API om live benchmarkscores te tonen.

**Playground uitbreiden**  
`api/playground.ts` stuurt nu naar drie vaste Groq-modellen. Integreer OpenRouter voor toegang tot 200+ modellen uit verschillende providers in één API-aanroep.

---

### Geavanceerd (meer dan 1 week werk)

**RAG-demo als extra tab**  
Voeg een tabblad toe in de Playground waar gebruikers een PDF kunnen uploaden en vragen kunnen stellen over de inhoud. Implementeer vector search via Supabase pgvector en gebruik LlamaIndex in een serverless functie.

**Eigen modelcatalogus als CMS**  
Vervang `src/data/models.ts` door een Supabase-tabel beheerd via een admin-interface. Nieuwe modellen hoeven dan niet meer via een code-commit te worden toegevoegd.

**A/B-testen van de aanbevelingsprompt**  
Voeg een feature-flag systeem toe via Vercel Edge Config. Test twee versies van de prompt in `api/recommend.ts` en vergelijk de gebruikerstevredenheid op basis van de feedback-data in Supabase.

**Fijnafgesteld aanbevelingsmodel**  
Gebruik de verzamelde feedback-data om een kleiner model te fijnafstemmen specifiek voor model-aanbevelingen. Dit verlaagt de latency en de afhankelijkheid van Groq.

**Bedrijfsintegraties**  
Voeg SSO-authenticatie toe (Okta, Azure AD via Supabase Auth) en exporteer aanbevelingen naar Confluence of Notion als beslisdocument voor technische teams.

---

## Stack overzicht

| Categorie | Technologie | Versie |
|-----------|------------|--------|
| Frontend framework | React | 18.3 |
| Build tool | Vite | 5.3 |
| Taal | TypeScript | 5.5 |
| Styling | Tailwind CSS | 3.4 |
| Animaties | Framer Motion | 12 |
| PDF-generatie | @react-pdf/renderer | 4.5 |
| AI-inferentie | Groq (Llama 3.3 70B) | — |
| Beeldgeneratie | HuggingFace Inference API | — |
| Database | Supabase (PostgreSQL) | — |
| Hosting | Vercel | — |
| CI/CD | GitHub + Vercel | — |

---

## Licentie en contact

Gebouwd door **Lukas Langhout** als portfolio-project.  
GitHub: github.com/LukasLanghout  
Aangedreven door Llama 3.3 70B via Groq.

Voor vragen of bijdragen: open een issue of stuur een pull request op GitHub.
