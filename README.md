# Reps Gym Management

Reps Gym Management is a fitness and gym management application for a bilingual 24/7 downtown club. It combines a public-facing marketing site with member self-service flows and an admin workspace for operations such as memberships, class bookings, users, and check-ins.

The product vision is a clean, dark, performance-oriented gym website that feels sharp and credible for prospective members while also functioning as an efficient internal operating surface for staff. The concept keeps the brand identity compact and direct, then extends that same visual language into the private member and admin experience instead of splitting the product into unrelated interfaces.

## Project Details

- Project title: `Reps Gym Management`
- Field of the business: `Fitness & gym management`
- Primary hex color: `#3f8755`

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Framer Motion
- next-intl
- Auth.js / `next-auth` v5 beta
- Prisma
- Sonner

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables for the database, authentication, and public app URL.

3. Start the development server:

```bash
npm run dev
```

## Available Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run typecheck`
- `npm run format`
- `npm run db:seed`
- `npm run db:migrate`

## Production Notes

- Set `NEXT_PUBLIC_APP_URL` or `NEXT_PUBLIC_SITE_URL` in production so canonical URLs, social metadata, robots, and sitemap point to the real domain instead of the localhost fallback.
- Private and auth areas are intentionally marked `noindex`.
- Metadata, robots, sitemap, manifest, Open Graph images, and Twitter images are generated with the App Router metadata APIs.
