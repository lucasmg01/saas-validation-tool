# SaaS Validation Tool - Orange Bleu

Application Nuxt 4 pour valider une idee SaaS avant de coder, via 7 checkpoints actionnables en 15 minutes.

## Stack

- Nuxt 4 (SSR)
- Tailwind CSS 4
- Pinia (store + persistance locale)
- Deploy cible: Vercel

## Fonctionnalites

- Landing page avec branding Orange Bleu
- Questionnaire en 7 etapes avec barre de progression et transitions
- Sauvegarde automatique des reponses dans `localStorage`
- Scoring par checkpoint (0-100) + score global
- Verdict final colore + recommandations sur checkpoints faibles
- CTA Calendly + reset du test
- Optionnel: envoi recap par email via API (`/api/send-results`)

## Arborescence principale

- `app/pages/index.vue`: landing
- `app/pages/test.vue`: flow questionnaire
- `app/pages/results.vue`: score + verdict + CTA
- `app/components/CheckpointCard.vue`
- `app/components/ProgressBar.vue`
- `app/components/ScoreGauge.vue`
- `app/components/ResultCard.vue`
- `app/composables/useValidation.ts`: logique de scoring
- `app/stores/validation.ts`: reponses + persistance
- `server/api/send-results.post.ts`: endpoint email optionnel

## Installation locale

```bash
npm install
```

## Lancer en dev

```bash
npm run dev
```

App disponible sur `http://localhost:3000`.

## Build production

```bash
npm run build
npm run preview
```

## Variables d'environnement

- `NUXT_PUBLIC_CALENDLY_URL`: URL de prise de RDV
- `NUXT_PUBLIC_APP_URL`: URL publique (utile pour metas)
- `NUXT_RESEND_API_KEY`: active l'envoi email des resultats (optionnel)

Exemple `.env`:

```bash
NUXT_PUBLIC_CALENDLY_URL="https://calendly.com/orange-bleu"
NUXT_PUBLIC_APP_URL="https://votre-domaine.com"
NUXT_RESEND_API_KEY="re_xxx"
```

## Deploy Vercel

```bash
vercel deploy -y
```

Pour production (si necessaire):

```bash
vercel deploy --prod -y
```

## Accessibilite et perf

- Structure semantique (`header`, `section`, `fieldset`, labels)
- Contrastes sombres premium
- Focus visibles clavier
- SSR par defaut Nuxt pour le contenu principal
