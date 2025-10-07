# MaiSeoM

MaiSeoM est un SaaS complet d'audit SEO & IA SEO. Le projet est structuré en monorepo Turborepo avec :

- **apps/web** : front-end Next.js 14 (App Router, Tailwind, NextAuth, shadcn/ui).
- **apps/api** : API NestJS + Prisma + BullMQ.
- **workers/seo** : worker Python pour lancer les audits SEO/IA.
- **packages/** : configuration partagée (plans d'abonnement, tsconfig).

## Prérequis

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- Python 3.10+
- Docker (pour Postgres + Redis)

## Installation

```bash
pnpm install
```

Installez les dépendances Python du worker :

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r workers/seo/requirements.txt
```

## Configuration des variables d'environnement

Copiez `.env.example` vers `.env` et remplissez les valeurs :

```bash
cp .env.example .env
```

Variables clés :

- `DATABASE_URL` : connexion Postgres.
- `REDIS_URL` : instance Redis.
- `API_URL` / `WEB_URL` : URLs locales (http://localhost:4000 / http://localhost:3000).
- `WORKER_API_TOKEN` : secret partagé entre API et worker.
- Clés OAuth Google/GitHub + configuration Stripe.

## Lancement des services de base de données

```bash
docker compose up -d
```

## Migration de la base et seed

```bash
pnpm dlx prisma generate
pnpm dlx prisma migrate deploy
pnpm dlx ts-node prisma/seed.ts
```

> La commande de seed crée un compte de démonstration (`demo@maiseom.com / Demo1234!`).

## Démarrage en développement

Dans des terminaux séparés :

1. **API NestJS**
   ```bash
   cd apps/api
   pnpm start:dev
   ```

2. **Front Next.js**
   ```bash
   cd apps/web
   pnpm dev
   ```

3. **Worker Python**
   ```bash
   source .venv/bin/activate
   python workers/seo/worker.py
   ```

Les applications seront accessibles sur :

- Web : http://localhost:3000
- API : http://localhost:4000

## Commandes Turborepo

- `pnpm dev` : lance `next dev` et `nest start --watch` en parallèle.
- `pnpm build` : builds Next.js et NestJS.
- `pnpm lint` : lint des apps.

## Déploiement

- **Web (Vercel)** : déployer `apps/web` en configurant les variables d'environnement. Les routes API (auth NextAuth) utilisent Prisma + Postgres.
- **API (Railway/Render)** : déployer `apps/api` en pointant vers Postgres + Redis managés. Exposer les webhooks Stripe (`/billing/webhook`).
- **Worker** : déployer `workers/seo/worker.py` sur un service de type worker (Railway, Render) avec accès au même Redis + API.

## Stripe

- Configurer vos plans dans Stripe et reporter les `price_*` dans `.env`.
- Le webhook Stripe doit pointer vers `https://<api-domain>/billing/webhook`.
- Le portail client est accessible depuis le tableau de bord de facturation.

## Tests manuels

1. Connectez-vous avec l'utilisateur de démo.
2. Ajoutez un projet (domaine).
3. Lancez un audit depuis la page projet.
4. Le worker consomme la tâche, calcule les scores et met à jour le rapport.
5. Consulter le score mis à jour dans le dashboard / rapports.

## Structure du repo

```
apps/
  web/
    app/            # Pages Next.js (landing, dashboard, billing, légal)
    components/     # UI shadcn, formulaires
    lib/            # utilitaires (API, Prisma, Stripe)
  api/
    src/
      audits/       # Endpoints d'audit + queue BullMQ
      billing/      # Checkout + webhook Stripe
      projects/     # CRUD projets et overview
      common/       # PrismaService
packages/
  config/           # Plans d'abonnement partagés
  tsconfig/         # tsconfig de base
prisma/
  schema.prisma     # Modèle de données
  seed.ts           # Seed utilisateur de démo
workers/
  seo/worker.py     # Worker SEO/IA Python
```

## Scripts utiles

- `pnpm dlx prisma migrate dev` : créer/mettre à jour le schéma en local.
- `pnpm --filter @maiseom/api lint` : lint NestJS.
- `pnpm --filter @maiseom/web lint` : lint Next.js.

## Authentification

- NextAuth gère l'auth email (credentials) + OAuth (Google/GitHub).
- Prisma stocke les sessions et comptes OAuth.
- Les workers appellent l'API avec le header `X-Worker-Token` (valeur `WORKER_API_TOKEN`).

## Monitoring

- Le module BullMQ est prêt pour être branché au Bull Board (`/admin/queues` à ajouter si besoin).
- Les scores SEO/IA sont recalculés à chaque audit et visibles dans le dashboard.

Bon build !
