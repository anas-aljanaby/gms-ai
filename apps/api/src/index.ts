import 'dotenv/config';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';

const app = new Hono()

app.get('/', (c) => c.text('Hono!'))

app.get('/health', (c) => {
    return c.json({
        ok: true,
        message: 'hello hono!'
    })
})

const port = Number(process.env.PORT) || 3000

serve({
    fetch: app.fetch,
    port,
})