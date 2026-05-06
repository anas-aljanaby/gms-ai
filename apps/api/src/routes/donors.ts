import { Hono } from 'hono';
import { User } from '@supabase/supabase-js';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '../db';
import { donor_interactions, donor_tasks, donations, individual_donors, memberships } from '../db/schema';
import { authMiddleware } from '../middleware/auth';
import { createDonationSchema, createDonorInteractionSchema, createDonorSchema, createDonorTaskSchema, updateDonorSchema, updateDonorTaskSchema } from '@gms/shared';

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

type DonationRow = typeof donations.$inferSelect;
type DonorRow = typeof individual_donors.$inferSelect;
type DonorTaskRow = typeof donor_tasks.$inferSelect;
type DonorInteractionRow = typeof donor_interactions.$inferSelect;

function asNumber(value: unknown): number {
    if (value === null || value === undefined) return 0;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
}

function toIso(value: Date | string | null | undefined): string | null {
    if (!value) return null;
    return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return !!value && typeof value === 'object' && !Array.isArray(value);
}

function getCustomString(row: { custom_fields: unknown }, key: string): string | null {
    if (!isRecord(row.custom_fields)) return null;
    const value = row.custom_fields[key];
    return typeof value === 'string' && value.trim() ? value : null;
}

function getCustomNumber(row: { custom_fields: unknown }, key: string): number | null {
    if (!isRecord(row.custom_fields)) return null;
    const value = row.custom_fields[key];
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}

function getPipelineStage(donor: DonorRow): string {
    return getCustomString(donor, 'pipeline_stage') || 'prospect';
}

function buildGivingSummary(rows: DonationRow[]) {
    const validRows = rows
        .filter((row) => !['void', 'refunded', 'cancelled'].includes((getCustomString(row, 'status') || '').toLowerCase()))
        .sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));
    const lifetimeGiving = validRows.reduce((sum, row) => sum + asNumber(row.amount), 0);
    const totalGifts = validRows.length;
    const largestGift = validRows.reduce((largest, row) => Math.max(largest, asNumber(row.amount)), 0);
    const programsSupported = Array.from(new Set(validRows.map((row) => row.program || getCustomString(row, 'designation')).filter(Boolean))) as string[];
    const lastGift = validRows[0];

    return {
        lifetimeGiving,
        totalGifts,
        lastGiftAmount: lastGift ? asNumber(lastGift.amount) : null,
        lastGiftDate: toIso(lastGift?.date),
        averageGift: totalGifts > 0 ? lifetimeGiving / totalGifts : null,
        largestGift: totalGifts > 0 ? largestGift : null,
        programsSupported,
        currentGivingStatus: totalGifts === 0 ? 'no_gifts' : lastGift && Date.now() - lastGift.date.getTime() > 365 * 86400000 ? 'lapsed' : 'active',
    };
}

function mapDonation(row: DonationRow) {
    return {
        id: row.id,
        donor_id: row.donor_id,
        amount: asNumber(row.amount),
        date: toIso(row.date),
        program: row.program || '',
        campaign: getCustomString(row, 'campaign'),
        designation: getCustomString(row, 'designation') || row.program || '',
        payment_method: getCustomString(row, 'payment_method'),
        status: getCustomString(row, 'status') || 'posted',
        receipt_state: getCustomString(row, 'receipt_state') || 'not_sent',
        refund_state: getCustomString(row, 'refund_state') || 'none',
        custom_fields: row.custom_fields || {},
    };
}

function mapTask(row: DonorTaskRow) {
    return {
        id: row.id,
        donor_id: row.donor_id,
        text: row.text,
        type: row.type,
        assigned_to: row.assigned_to || '',
        due_date: toIso(row.due_date),
        completed: row.completed,
        custom_fields: row.custom_fields || {},
    };
}

function mapInteraction(row: DonorInteractionRow) {
    return {
        id: row.id,
        donor_id: row.donor_id,
        interaction_type: row.interaction_type,
        occurred_at: toIso(row.occurred_at),
        subject: row.subject,
        status: row.status || 'logged',
        notes: row.notes || '',
        custom_fields: row.custom_fields || {},
    };
}

async function getOrgDonor(donorId: string, orgId: string) {
    const rows = await db
        .select()
        .from(individual_donors)
        .where(and(eq(individual_donors.id, donorId), eq(individual_donors.org_id, orgId)))
        .limit(1);

    return rows[0] ?? null;
}

function buildRecentActivity(donationRows: DonationRow[], taskRows: DonorTaskRow[], interactionRows: DonorInteractionRow[]) {
    return [
        ...donationRows.map((row) => ({
            id: row.id,
            type: 'donation' as const,
            occurred_at: toIso(row.date),
            title: row.program || 'Donation',
            amount: asNumber(row.amount),
            status: getCustomString(row, 'status') || 'posted',
        })),
        ...taskRows.map((row) => ({
            id: row.id,
            type: row.completed ? 'task_completed' as const : 'task_created' as const,
            occurred_at: toIso(row.updated_at || row.created_at || row.due_date),
            title: row.text,
            status: row.completed ? 'completed' : 'open',
        })),
        ...interactionRows.map((row) => ({
            id: row.id,
            type: 'interaction' as const,
            occurred_at: toIso(row.occurred_at),
            title: row.subject,
            channel: row.interaction_type,
            status: row.status || 'logged',
        })),
    ]
        .filter((activity) => !!activity.occurred_at)
        .sort((a, b) => new Date(b.occurred_at || '').getTime() - new Date(a.occurred_at || '').getTime())
        .slice(0, 8);
}

async function refreshDonorGivingCache(donorId: string, orgId: string) {
    const donationRows = await db
        .select()
        .from(donations)
        .where(and(eq(donations.donor_id, donorId), eq(donations.org_id, orgId)));
    const giving = buildGivingSummary(donationRows);
    const programCounts = donationRows.reduce<Record<string, number>>((counts, donation) => {
        if (!donation.program) return counts;
        counts[donation.program] = (counts[donation.program] || 0) + 1;
        return counts;
    }, {});
    const primaryProgramInterest = Object.entries(programCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    await db
        .update(individual_donors)
        .set({
            total_donations: String(giving.lifetimeGiving.toFixed(2)),
            donations_count: giving.totalGifts,
            last_donation_date: giving.lastGiftDate ? new Date(giving.lastGiftDate) : null,
            avg_gift: giving.averageGift !== null ? String(giving.averageGift.toFixed(2)) : null,
            primary_program_interest: primaryProgramInterest,
        })
        .where(and(eq(individual_donors.id, donorId), eq(individual_donors.org_id, orgId)));
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

donorsRouter.get('/:id/profile-summary', async (c) => {
    const user = c.get('user');
    const orgId = await getOrgId(user.id, c.req.query('org_id'));
    if (!orgId) return c.json({ error: 'No organization found' }, 403);

    const donor = await getOrgDonor(c.req.param('id'), orgId);
    if (!donor) return c.json({ error: 'Not found' }, 404);

    const [donationRows, taskRows, interactionRows] = await Promise.all([
        db
            .select()
            .from(donations)
            .where(and(eq(donations.donor_id, donor.id), eq(donations.org_id, orgId)))
            .orderBy(desc(donations.date)),
        db
            .select()
            .from(donor_tasks)
            .where(and(eq(donor_tasks.donor_id, donor.id), eq(donor_tasks.org_id, orgId)))
            .orderBy(donor_tasks.due_date),
        db
            .select()
            .from(donor_interactions)
            .where(and(eq(donor_interactions.donor_id, donor.id), eq(donor_interactions.org_id, orgId)))
            .orderBy(desc(donor_interactions.occurred_at)),
    ]);

    const giving = buildGivingSummary(donationRows);
    const openTasks = taskRows.filter((task) => !task.completed).sort((a, b) => a.due_date.getTime() - b.due_date.getTime());
    const lastContact = interactionRows[0];
    const pipelineStage = getPipelineStage(donor);
    const suggestedAskAmount = getCustomNumber(donor, 'suggested_ask_amount');

    return c.json({
        donor: {
            id: donor.id,
            full_name_en: donor.full_name_en,
            full_name_ar: donor.full_name_ar || donor.full_name_en,
            email: donor.email,
            phone: donor.phone || '',
            status: donor.status,
            tier: donor.tier,
            country: donor.country || '',
            tags: donor.tags || [],
            assigned_manager: donor.assigned_manager || '',
            avatar: donor.avatar || '',
            donor_since: toIso(donor.donor_since),
            donor_category: donor.donor_category,
            primary_program_interest: donor.primary_program_interest,
            custom_fields: donor.custom_fields || {},
        },
        giving,
        relationship: {
            owner: donor.assigned_manager || '',
            pipelineStage,
            stageEnteredAt: getCustomString(donor, 'stage_entered_at') || toIso(donor.created_at),
            health: getCustomString(donor, 'relationship_health'),
            likelihood: getCustomString(donor, 'relationship_likelihood'),
            lastContact: lastContact ? mapInteraction(lastContact) : null,
            openTaskCount: openTasks.length,
        },
        nextAction: openTasks[0] ? mapTask(openTasks[0]) : null,
        recentActivity: buildRecentActivity(donationRows, taskRows, interactionRows),
        computed: {
            suggestedAskAmount,
            suggestedAskSource: suggestedAskAmount ? 'manual_override' : 'unavailable',
            suggestedAskConfidence: suggestedAskAmount ? 'manager' : 'not_enough_data',
            relationshipHealthSource: getCustomString(donor, 'relationship_health') ? 'manual_override' : 'unavailable',
        },
        sourceMeta: {
            giving: 'donations',
            tasks: 'donor_tasks',
            lastContact: 'donor_interactions',
            pipeline: 'individual_donors.custom_fields',
        },
    });
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

    const donor = await getOrgDonor(c.req.param('id'), orgId);
    if (!donor) return c.json({ error: 'Not found' }, 404);

    const rows = await db
        .select()
        .from(donations)
        .where(and(eq(donations.donor_id, c.req.param('id')), eq(donations.org_id, orgId)));

    return c.json(rows.map(mapDonation));
});

donorsRouter.post('/:id/donations', async (c) => {
    const user = c.get('user');
    const orgId = await getOrgId(user.id, c.req.query('org_id'));
    if (!orgId) return c.json({ error: 'No organization found' }, 403);

    const donor = await getOrgDonor(c.req.param('id'), orgId);
    if (!donor) return c.json({ error: 'Not found' }, 404);

    const body = await c.req.json();
    const parsed = createDonationSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.issues }, 400);

    const data = parsed.data;
    const [donation] = await db
        .insert(donations)
        .values({
            org_id: orgId,
            donor_id: donor.id,
            amount: String(data.amount),
            date: new Date(data.date),
            program: data.program,
            custom_fields: data.custom_fields,
        })
        .returning();

    await refreshDonorGivingCache(donor.id, orgId);

    return c.json(mapDonation(donation), 201);
});

donorsRouter.get('/:id/tasks', async (c) => {
    const user = c.get('user');
    const orgId = await getOrgId(user.id, c.req.query('org_id'));
    if (!orgId) return c.json({ error: 'No organization found' }, 403);

    const donor = await getOrgDonor(c.req.param('id'), orgId);
    if (!donor) return c.json({ error: 'Not found' }, 404);

    const rows = await db
        .select()
        .from(donor_tasks)
        .where(and(eq(donor_tasks.donor_id, donor.id), eq(donor_tasks.org_id, orgId)))
        .orderBy(donor_tasks.due_date);

    return c.json(rows.map(mapTask));
});

donorsRouter.post('/:id/tasks', async (c) => {
    const user = c.get('user');
    const orgId = await getOrgId(user.id, c.req.query('org_id'));
    if (!orgId) return c.json({ error: 'No organization found' }, 403);

    const donor = await getOrgDonor(c.req.param('id'), orgId);
    if (!donor) return c.json({ error: 'Not found' }, 404);

    const body = await c.req.json();
    const parsed = createDonorTaskSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.issues }, 400);

    const data = parsed.data;
    const [task] = await db
        .insert(donor_tasks)
        .values({
            org_id: orgId,
            donor_id: donor.id,
            text: data.text,
            type: data.type,
            assigned_to: data.assigned_to,
            due_date: new Date(data.due_date),
            completed: data.completed,
            custom_fields: data.custom_fields,
        })
        .returning();

    return c.json(mapTask(task), 201);
});

donorsRouter.patch('/:id/tasks/:taskId', async (c) => {
    const user = c.get('user');
    const orgId = await getOrgId(user.id, c.req.query('org_id'));
    if (!orgId) return c.json({ error: 'No organization found' }, 403);

    const donor = await getOrgDonor(c.req.param('id'), orgId);
    if (!donor) return c.json({ error: 'Not found' }, 404);

    const body = await c.req.json();
    const parsed = updateDonorTaskSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.issues }, 400);

    const data = parsed.data;
    const values: Partial<typeof donor_tasks.$inferInsert> = { updated_at: new Date() };
    if (data.text !== undefined) values.text = data.text;
    if (data.type !== undefined) values.type = data.type;
    if (data.assigned_to !== undefined) values.assigned_to = data.assigned_to;
    if (data.due_date !== undefined) values.due_date = new Date(data.due_date);
    if (data.completed !== undefined) values.completed = data.completed;
    if (data.custom_fields !== undefined) values.custom_fields = data.custom_fields;

    const [task] = await db
        .update(donor_tasks)
        .set(values)
        .where(and(eq(donor_tasks.id, c.req.param('taskId')), eq(donor_tasks.donor_id, donor.id), eq(donor_tasks.org_id, orgId)))
        .returning();

    if (!task) return c.json({ error: 'Not found' }, 404);
    return c.json(mapTask(task));
});

donorsRouter.get('/:id/interactions', async (c) => {
    const user = c.get('user');
    const orgId = await getOrgId(user.id, c.req.query('org_id'));
    if (!orgId) return c.json({ error: 'No organization found' }, 403);

    const donor = await getOrgDonor(c.req.param('id'), orgId);
    if (!donor) return c.json({ error: 'Not found' }, 404);

    const rows = await db
        .select()
        .from(donor_interactions)
        .where(and(eq(donor_interactions.donor_id, donor.id), eq(donor_interactions.org_id, orgId)))
        .orderBy(desc(donor_interactions.occurred_at));

    return c.json(rows.map(mapInteraction));
});

donorsRouter.post('/:id/interactions', async (c) => {
    const user = c.get('user');
    const orgId = await getOrgId(user.id, c.req.query('org_id'));
    if (!orgId) return c.json({ error: 'No organization found' }, 403);

    const donor = await getOrgDonor(c.req.param('id'), orgId);
    if (!donor) return c.json({ error: 'Not found' }, 404);

    const body = await c.req.json();
    const parsed = createDonorInteractionSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.issues }, 400);

    const data = parsed.data;
    const [interaction] = await db
        .insert(donor_interactions)
        .values({
            org_id: orgId,
            donor_id: donor.id,
            interaction_type: data.interaction_type,
            occurred_at: new Date(data.occurred_at),
            subject: data.subject,
            status: data.status,
            notes: data.notes,
            custom_fields: data.custom_fields,
        })
        .returning();

    return c.json(mapInteraction(interaction), 201);
});

export { donorsRouter };
