import { createClient, User } from '@supabase/supabase-js';
import { Hono, Context, Next } from 'hono';


const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)


export async function authMiddleware(c: Context, next: Next){
    const authHeader = c.req.header('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json({error: 'Unauthorized'}, 401)
    }

    const token = authHeader.slice(7)
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (!user || error ) {
        return c.json({error: "Error"}, 401)
    }

    c.set('user', user)

    await next()
}


