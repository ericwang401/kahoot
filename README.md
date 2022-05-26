## Production

1. Clone the repo
2. Create an environment file
**You have to create an Auth0 "SPA" application for the Auth0 Config**
**Make sure set callback url in Auth0 settings** `https://your-domain.com/api/auth/callback`
```env
POSTGRES_USER=YOUR_CUSTOM_USER
POSTGRES_PASSWORD=YOUR_CUSTOM_PASSWORD

# This was inserted by `prisma init`:
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB (Preview).
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL="postgresql://YOUR_CUSTOM_USER:YOUR_CUSTOM_PASSWORD@db:5432/YOUR_CUSTOM_USER?schema=public"

AUTH0_SECRET=

AUTH0_BASE_URL=
AUTH0_ISSUER_BASE_URL=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
```
3. Start the production Docker compose with `docker compose -f docker-compose.prod.yml up -d`
4. After everything is built, enter in bash mode inside the prod container `docker compose exec prod bash`
5. Run migrations `npx prisma migrate deploy`

## Development
1. Clone the repo
2. Create the environment file with the environment file from the production instructions
3. Start the development Docker compose with `docker compose up -d`
4. Enter bash mode `docker compose exec node bash`
5. Install dependencies `npm i`
6. Run migrations `npx prisma migrate dev`
7. Start the Next.js server `npm run dev`
