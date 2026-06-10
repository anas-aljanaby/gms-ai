import { Hono } from 'hono';
import { and, asc, eq } from 'drizzle-orm';
import { patchOrgModulesSchema } from '@gms/shared';
import { db } from '../db';
import { modules } from '../db/schema';
import { authMiddleware } from '../middleware/auth';
import { OrgContextVars, orgContext, requirePermission } from '../middleware/orgContext';
import {
    ensureOrgModuleCatalog,
    isLockedModuleKey,
    mapOrgModule,
    migrateLegacyModuleRows,
} from '../lib/orgModules';

const modulesRouter = new Hono<{ Variables: OrgContextVars }>();

modulesRouter.use(authMiddleware);
modulesRouter.use(orgContext);

async function listOrgModules(orgId: string) {
    await migrateLegacyModuleRows(orgId);
    await ensureOrgModuleCatalog(orgId);

    const rows = await db
        .select()
        .from(modules)
        .where(eq(modules.org_id, orgId))
        .orderBy(asc(modules.sort_order), asc(modules.name));

    return rows.map(mapOrgModule);
}

modulesRouter.get('/', async (c) => {
    const orgId = c.get('orgId');
    const list = await listOrgModules(orgId);
    return c.json(list);
});

modulesRouter.patch('/', requirePermission('settings', 'write'), async (c) => {
    const orgId = c.get('orgId');
    const body = await c.req.json().catch(() => null);
    const parsed = patchOrgModulesSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.issues }, 400);

    await migrateLegacyModuleRows(orgId);
    await ensureOrgModuleCatalog(orgId);

    const now = new Date();

    for (const item of parsed.data.modules) {
        const [existing] = await db
            .select()
            .from(modules)
            .where(and(eq(modules.org_id, orgId), eq(modules.name, item.name)))
            .limit(1);

        if (!existing) continue;

        const updates: Partial<typeof modules.$inferInsert> = { updated_at: now };

        if (item.enabled !== undefined) {
            if (isLockedModuleKey(item.name) && !item.enabled) {
                return c.json({ error: `Cannot disable locked module: ${item.name}` }, 400);
            }
            updates.enabled = item.enabled;
        }

        if (item.sort_order !== undefined) {
            updates.sort_order = item.sort_order;
        }

        if (item.label_en !== undefined) {
            updates.label_en = item.label_en;
        }

        if (item.label_ar !== undefined) {
            updates.label_ar = item.label_ar;
        }

        await db
            .update(modules)
            .set(updates)
            .where(eq(modules.id, existing.id));
    }

    const list = await listOrgModules(orgId);
    return c.json(list);
});

export { modulesRouter };
