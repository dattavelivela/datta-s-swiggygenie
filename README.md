# datta's-swiggygenie

A mobile-first Swiggy Meal Autopilot prototype with Next.js API routes for Swiggy MCP.

## Swiggy MCP environment

Set these in Vercel before using live MCP login:

```sh
SWIGGY_CLIENT_ID=your_swiggy_builder_client_id
SESSION_SECRET=at_least_32_random_characters
NEXT_PUBLIC_APP_URL=https://datta-s-swiggygenie.vercel.app
```

The redirect URI to whitelist in Swiggy Builder is:

```txt
https://datta-s-swiggygenie.vercel.app/api/auth/callback
```

## Local preview

```sh
npm install
npm run dev
```

Then open `http://127.0.0.1:3000/`.
