Let me check the current state quickly before giving instructions.

Quick note: you have `supabase` installed (that's the CLI tool) but task 1.6 needs `@supabase/supabase-js` — they're different packages. Keep that in mind for step 1.

---

## Task 1.6 — Auth Middleware

### Step 1: Install `@supabase/supabase-js`

Concepts to know:
- The difference between the `supabase` CLI package and `@supabase/supabase-js` (the JS client library)
- How to install a package in `apps/api`

---

### Step 2: Create `src/middleware/auth.ts`

This file will intercept every request and check the JWT token before letting it through.

Concepts to know:
- What a JWT is — a signed token the frontend sends in the `Authorization: Bearer <token>` header
- How to extract the `Authorization` header from a Hono request (`c.req.header('authorization')`)
- How to create a Supabase client using `createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)`
- How to verify a JWT with Supabase: `supabase.auth.getUser(token)` — it returns `{ data: { user }, error }`
- How to write a Hono middleware function — it takes `(c, next)` and calls `await next()` to pass through, or returns a response early to reject

The logic flow should be:
1. Extract the token from the `Authorization` header (strip the `Bearer ` prefix)
2. If there's no token, return `401`
3. Call `supabase.auth.getUser(token)` to verify it
4. If there's an error or no user, return `401`
5. Store the user on the Hono context with `c.set('user', user)` so routes can access it
6. Call `await next()` to let the request continue

---

### Step 3: Tell Hono's type system about the `user` context variable

Concepts to know:
- Hono uses TypeScript generics to type what's stored in context via `c.set()` / `c.get()`
- You define this with a `type Variables = { user: ... }` and pass it to `new Hono<{ Variables }>()`
- The user object type comes from `@supabase/supabase-js` — it's `User` from that package

---

### Step 4: Protect a test route in `src/index.ts`

Concepts to know:
- How to apply a middleware to a single route in Hono: `app.get('/protected', authMiddleware, (c) => ...)`
- How to retrieve the stored user in a route handler: `c.get('user')`
- How to test it with curl:
  - Without a token: `curl http://localhost:3000/protected` → should get `401`
  - With a bad token: `curl -H "Authorization: Bearer fake" http://localhost:3000/protected` → should get `401`

---

Give step 1 a go and let me know when you're ready for help on step 2.