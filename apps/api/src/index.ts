import 'dotenv/config';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { User } from "@supabase/supabase-js"
import { authMiddleware } from './middleware/auth';


type Variables = {
    user: User
}

const app = new Hono<{ Variables }>()

app.get('/', (c) => c.text('Hono!'))

app.get('/health', (c) => {
    return c.json({
        ok: true,
        message: 'hello hono!'
    })
})

app.get('/protected', authMiddleware, (c) => {
    return c.json(c.get('user'))
}
)

const port = Number(process.env.PORT) || 3000

serve({
    fetch: app.fetch,
    port,
})