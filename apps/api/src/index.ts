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

export default app



serve({
    fetch: app.fetch,
    port: 3000
})