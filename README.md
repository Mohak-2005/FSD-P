# FlipEarn (PERN)

FlipEarn is a full-stack social media profile marketplace built with PostgreSQL, Express, React, and Node.

## Quick Start

1. Copy env files:
   - `server/.env.example` -> `server/.env`
   - `client/.env.example` -> `client/.env`
2. Install dependencies:
   - `npm install`
   - `npm install --prefix server`
   - `npm install --prefix client`
3. Create database and apply SQL:
   - Run `database/schema.sql`
   - Run `database/seed.sql`
4. Start both apps:
   - `npm run dev`

## Project Structure

- `server`: Express REST API + JWT auth + Socket.io
- `client`: React + Vite + Tailwind frontend
- `database`: PostgreSQL schema and seed data

## API Overview

- Auth: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`
- Listings: CRUD at `/api/listings`
- Users: `/api/users/:id`, `/api/users/:id/reviews`
- Messages: `/api/messages/...`
- Saved listings: `/api/saved/...`
- Reviews: `/api/reviews/...`

## Notes

- Access token: Bearer JWT
- Refresh token: HttpOnly cookie via `/api/auth/refresh`
- Uploads are served from `/uploads`
- Demo login after running `database/seed.sql`:
  - `alice@flippearn.dev`
  - `Demo@123`
