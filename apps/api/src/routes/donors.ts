import { Hono } from 'hono';
import { User } from '@supabase/supabase-js';
import { eq, and } from 'drizzle-orm';
import { db } from '../db';
import { individual_donors, donations, memberships } from '../db/schema';
import { authMiddleware } from '../middleware/auth';
import { createDonorSchema, updateDonorSchema, createDonationSchema } from '@gms/shared';

type Variables = { user: User };

const donorsRouter = new Hono<{ Variables: Variables }>();

donorsRouter.use(authMiddleware);

async function getOrgId(userId: string, requestedOrgId?: string): Promise<string | null> {
    const where = requestedOrgId
        ? and(eq(memberships.user_id, userId), eq(memberships.org_id, requestedOrgId))
        : eq(memberships.user_id, userId);

    const rows = await db.select({ org_id: memberships.org_id }).from(memberships).where(where).limit(1);
    return rows[0]?.org_id ?? null;
}

donorsRouter.get('/', async (c) => {
    const user = c.get('user');
    const orgId = await getOrgId(user.id, c.req.query('org_id'));
    if (!orgId) return c.json({ error: 'No organization found' }, 403);

    const rows = await db
        .select()
        .from(individual_donors)
        .where(eq(individual_donors.org_id, orgId));

    return c.json(rows);
});

donorsRouter.get('/:id', async (c) => {
    const user = c.get('user');
    const orgId = await getOrgId(user.id, c.req.query('org_id'));
    if (!orgId) return c.json({ error: 'No organization found' }, 403);

    const rows = await db
        .select()
        .from(individual_donors)
        .where(and(eq(individual_donors.id, c.req.param('id')), eq(individual_donors.org_id, orgId)));

    if (!rows.length) return c.json({ error: 'Not found' }, 404);
    return c.json(rows[0]);
});

donorsRouter.post('/', async (c) => {
    const user = c.get('user');
    const orgId = await getOrgId(user.id, c.req.query('org_id'));
    if (!orgId) return c.json({ error: 'No organization found' }, 403);

    const body = await c.req.json();
    const parsed = createDonorSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.issues }, 400);

    const data = parsed.data;
    const [donor] = await db
        .insert(individual_donors)
        .values({
            org_id: orgId,
            full_name_en: data.full_name_en,
            full_name_ar: data.full_name_ar,
            email: data.email,
            phone: data.phone,
            status: data.status,
            tier: data.tier,
            country: data.country,
            tags: data.tags,
            assigned_manager: data.assigned_manager,
            avatar: data.avatar,
            donor_since: data.donor_since ? new Date(data.donor_since) : null,
            last_donation_date: data.last_donation_date ? new Date(data.last_donation_date) : null,
            custom_fields: data.custom_fields,
        })
        .returning();

    return c.json(donor, 201);
});

donorsRouter.patch('/:id', async (c) => {
    const user = c.get('user');
    const orgId = await getOrgId(user.id, c.req.query('org_id'));
    if (!orgId) return c.json({ error: 'No organization found' }, 403);

    const body = await c.req.json();
    const parsed = updateDonorSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.issues }, 400);

    const data = parsed.data;
    const values: Record<string, unknown> = {};
    if (data.full_name_en !== undefined) values.full_name_en = data.full_name_en;
    if (data.full_name_ar !== undefined) values.full_name_ar = data.full_name_ar;
    if (data.email !== undefined) values.email = data.email;
    if (data.phone !== undefined) values.phone = data.phone;
    if (data.status !== undefined) values.status = data.status;
    if (data.tier !== undefined) values.tier = data.tier;
    if (data.country !== undefined) values.country = data.country;
    if (data.tags !== undefined) values.tags = data.tags;
    if (data.assigned_manager !== undefined) values.assigned_manager = data.assigned_manager;
    if (data.avatar !== undefined) values.avatar = data.avatar;
    if (data.donor_since !== undefined) values.donor_since = data.donor_since ? new Date(data.donor_since) : null;
    if (data.last_donation_date !== undefined) values.last_donation_date = data.last_donation_date ? new Date(data.last_donation_date) : null;
    if (data.custom_fields !== undefined) values.custom_fields = data.custom_fields;

    const [updated] = await db
        .update(individual_donors)
        .set(values)
        .where(and(eq(individual_donors.id, c.req.param('id')), eq(individual_donors.org_id, orgId)))
        .returning();

    if (!updated) return c.json({ error: 'Not found' }, 404);
    return c.json(updated);
});

donorsRouter.delete('/:id', async (c) => {
    const user = c.get('user');
    const orgId = await getOrgId(user.id, c.req.query('org_id'));
    if (!orgId) return c.json({ error: 'No organization found' }, 403);

    const [deleted] = await db
        .delete(individual_donors)
        .where(and(eq(individual_donors.id, c.req.param('id')), eq(individual_donors.org_id, orgId)))
        .returning();

    if (!deleted) return c.json({ error: 'Not found' }, 404);
    return c.json({ ok: true });
});

// --- Donations sub-routes ---

donorsRouter.get('/:id/donations', async (c) => {
    const user = c.get('user');
    const orgId = await getOrgId(user.id, c.req.query('org_id'));
    if (!orgId) return c.json({ error: 'No organization found' }, 403);

    const rows = await db
        .select()
        .from(donations)
        .where(and(eq(donations.donor_id, c.req.param('id')), eq(donations.org_id, orgId)));

    return c.json(rows);
});

donorsRouter.post('/:id/donations', async (c) => {
    const user = c.get('user');
    const orgId = await getOrgId(user.id, c.req.query('org_id'));
    if (!orgId) return c.json({ error: 'No organization found' }, 403);

    const body = await c.req.json();
    const parsed = createDonationSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.issues }, 400);

    const data = parsed.data;
    const [donation] = await db
        .insert(donations)
        .values({
            org_id: orgId,
            donor_id: data.donor_id,
            amount: String(data.amount),
            date: new Date(data.date),
            program: data.program,
            custom_fields: data.custom_fields,
        })
        .returning();

    return c.json(donation, 201);
});

export { donorsRouter };
