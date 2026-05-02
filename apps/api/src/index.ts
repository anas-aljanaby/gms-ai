import 'dotenv/config';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { User } from '@supabase/supabase-js';
import { authMiddleware } from './middleware/auth';
import { me } from './routes/me';
import { donorsRouter } from './routes/donors';

type Variables = {
    user: User;
};

const app = new Hono<{ Variables: Variables }>();

app.use(
    cors({
        origin: process.env.WEB_ORIGIN || 'http://localhost:5173',
        credentials: true,
    })
);

app.onError((err, c) => {
    console.error(err);
    return c.json({ error: err.message || 'Internal server error' }, 500);
});

app.get('/', (c) => c.text('Hono!'));

app.get('/health', (c) => {
    return c.json({
        ok: true,
        message: 'hello hono!',
    });
});

app.get('/protected', authMiddleware, (c) => {
    return c.json(c.get('user'));
});

app.route('/me', me);
app.route('/donors', donorsRouter);

const port = Number(process.env.PORT) || 3000;

serve({
    fetch: app.fetch,
    port,
});

console.log(`API running on http://localhost:${port}`);