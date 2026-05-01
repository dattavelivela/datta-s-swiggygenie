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

## Food MCP flow

The backend follows Swiggy's documented Food sequence:

1. `get_addresses`
2. `search_restaurants`
3. `get_restaurant_menu` or `search_menu`
4. `update_food_cart`
5. `fetch_food_coupons` and `apply_food_coupon`
6. `get_food_cart`
7. `place_food_order`
8. `track_food_order`

Production guardrails currently implemented:

- `place_food_order` is blocked from the generic `/api/swiggy/tool` endpoint.
- `/api/swiggy/place-order` always refreshes `get_food_cart` first.
- Orders use COD because Food MCP v1 supports COD only.
- Cart total must be `<= ₹1000`.
- User confirmation is required before calling `place_food_order`.
- If order placement has a retryable 5xx/upstream failure, the route checks `get_food_orders` before retrying once.

Still required before real ordering:

- Swiggy Builder production `client_id`.
- Durable plan storage instead of the in-memory draft route.
- Scheduler/reminder service for selected delivery dates.
- Real menu-item customization mapping for variants and add-ons.
