import { Hono } from 'hono';
import { User } from '@supabase/supabase-js';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '../db';
import { beneficiaries, memberships } from '../db/schema';
import { authMiddleware } from '../middleware/auth';
import { createBeneficiarySchema, updateBeneficiarySchema } from '@gms/shared';

type Variables = { user: User };

const beneficiariesRouter = new Hono<{ Variables: Variables }>();

beneficiariesRouter.use(authMiddleware);

async function getOrgId(userId: string, requestedOrgId?: string): Promise<string | null> {
    const where = requestedOrgId
        ? and(eq(memberships.user_id, userId), eq(memberships.org_id, requestedOrgId))
        : eq(memberships.user_id, userId);

    const rows = await db.select({ org_id: memberships.org_id }).from(memberships).where(where).limit(1);
    return rows[0]?.org_id ?? null;
}

type BeneficiaryRow = typeof beneficiaries.$inferSelect;

function isRecord(value: unknown): value is Record<string, unknown> {
    return !!value && typeof value === 'object' && !Array.isArray(value);
}

async function getOrgBeneficiary(id: string, orgId: string): Promise<BeneficiaryRow | null> {
    const rows = await db
        .select()
        .from(beneficiaries)
        .where(and(eq(beneficiaries.id, id), eq(beneficiaries.org_id, orgId)))
        .limit(1);
    return rows[0] ?? null;
}

function defaultPhoto(nameEn: string, nameAr: string): string {
    const label = (nameEn || nameAr || 'beneficiary').trim();
    return `https://picsum.photos/seed/${encodeURIComponent(label)}/200/200`;
}

beneficiariesRouter.get('/', async (c) => {
    const user = c.get('user');
    const orgId = await getOrgId(user.id, c.req.query('org_id'));
    if (!orgId) return c.json({ error: 'No organization found' }, 403);

    const rows = await db
        .select()
        .from(beneficiaries)
        .where(eq(beneficiaries.org_id, orgId))
        .orderBy(desc(beneficiaries.created_at));

    return c.json(rows);
});

beneficiariesRouter.get('/:id', async (c) => {
    const user = c.get('user');
    const orgId = await getOrgId(user.id, c.req.query('org_id'));
    if (!orgId) return c.json({ error: 'No organization found' }, 403);

    const row = await getOrgBeneficiary(c.req.param('id'), orgId);
    if (!row) return c.json({ error: 'Not found' }, 404);
    return c.json(row);
});

beneficiariesRouter.post('/', async (c) => {
    const user = c.get('user');
    const orgId = await getOrgId(user.id, c.req.query('org_id'));
    if (!orgId) return c.json({ error: 'No organization found' }, 403);

    const body = await c.req.json();
    const parsed = createBeneficiarySchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.issues }, 400);

    const data = parsed.data;
    const nameEn = data.name_en.trim() || data.name_ar.trim();
    const nameAr = data.name_ar.trim() || data.name_en.trim();
    const profile = isRecord(data.profile) ? data.profile : { type: data.beneficiary_type };

    const [row] = await db
        .insert(beneficiaries)
        .values({
            org_id: orgId,
            name_en: nameEn,
            name_ar: nameAr,
            beneficiary_type: data.beneficiary_type,
            photo: data.photo || defaultPhoto(nameEn, nameAr),
            status: data.status,
            support_type: data.support_type,
            country: data.country,
            project_id: data.project_id ?? null,
            profile,
            aid_log: data.aid_log ?? [],
            assessments: data.assessments ?? [],
            milestones: data.milestones ?? [],
            documents: data.documents ?? [],
            custom_fields: data.custom_fields ?? {},
        })
        .returning();

    return c.json(row, 201);
});

beneficiariesRouter.patch('/:id', async (c) => {
    const user = c.get('user');
    const orgId = await getOrgId(user.id, c.req.query('org_id'));
    if (!orgId) return c.json({ error: 'No organization found' }, 403);

    const existing = await getOrgBeneficiary(c.req.param('id'), orgId);
    if (!existing) return c.json({ error: 'Not found' }, 404);

    const body = await c.req.json();
    const parsed = updateBeneficiarySchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.issues }, 400);

    const data = parsed.data;
    const values: Record<string, unknown> = { updated_at: new Date() };

    if (data.name_en !== undefined) values.name_en = data.name_en;
    if (data.name_ar !== undefined) values.name_ar = data.name_ar;
    if (data.beneficiary_type !== undefined) values.beneficiary_type = data.beneficiary_type;
    if (data.photo !== undefined) values.photo = data.photo;
    if (data.status !== undefined) values.status = data.status;
    if (data.support_type !== undefined) values.support_type = data.support_type;
    if (data.country !== undefined) values.country = data.country;
    if (data.project_id !== undefined) values.project_id = data.project_id;
    if (data.profile !== undefined) values.profile = data.profile;
    if (data.aid_log !== undefined) values.aid_log = data.aid_log;
    if (data.assessments !== undefined) values.assessments = data.assessments;
    if (data.milestones !== undefined) values.milestones = data.milestones;
    if (data.documents !== undefined) values.documents = data.documents;
    if (data.custom_fields !== undefined) {
        values.custom_fields = {
            ...(isRecord(existing.custom_fields) ? existing.custom_fields : {}),
            ...data.custom_fields,
        };
    }

    if (Object.keys(values).length === 1) return c.json(existing);

    const [updated] = await db
        .update(beneficiaries)
        .set(values)
        .where(and(eq(beneficiaries.id, existing.id), eq(beneficiaries.org_id, orgId)))
        .returning();

    return c.json(updated);
});

beneficiariesRouter.delete('/:id', async (c) => {
    const user = c.get('user');
    const orgId = await getOrgId(user.id, c.req.query('org_id'));
    if (!orgId) return c.json({ error: 'No organization found' }, 403);

    const existing = await getOrgBeneficiary(c.req.param('id'), orgId);
    if (!existing) return c.json({ error: 'Not found' }, 404);

    await db
        .delete(beneficiaries)
        .where(and(eq(beneficiaries.id, existing.id), eq(beneficiaries.org_id, orgId)));

    return c.json({ ok: true });
});

export { beneficiariesRouter };
