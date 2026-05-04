import 'dotenv/config';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import * as schema from './schema';

const client = postgres(process.env.DIRECT_URL || process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

const SEED_ORG_NAME = 'MSS Test Organization';

const SEED_DONORS = [
    {
        full_name_en: 'Aisha Al-Farsi',
        full_name_ar: 'عائشة الفارسي',
        email: 'aisha.f@example.com',
        phone: '+971 50 123 4567',
        status: 'Active',
        tier: 'Gold',
        country: 'UAE',
        tags: ['Education', 'Annual Gala'],
        assigned_manager: 'Fatma Kaya',
        donor_since: new Date('2021-03-15'),
        donor_category: 'Recurring',
        total_donations: '15250.00',
        donations_count: 12,
        avg_gift: '1270.83',
        primary_program_interest: 'Education',
    },
    {
        full_name_en: 'John Smith',
        full_name_ar: 'جون سميث',
        email: 'john.smith@example.com',
        phone: '+1 202 555 0191',
        status: 'Active',
        tier: 'Silver',
        country: 'USA',
        tags: ['Healthcare'],
        assigned_manager: 'Ahmad Noor',
        donor_since: new Date('2022-01-10'),
        donor_category: 'Hero',
        total_donations: '7800.00',
        donations_count: 5,
        avg_gift: '1560.00',
        primary_program_interest: 'Healthcare',
    },
    {
        full_name_en: 'Fatima Al-Rashid',
        full_name_ar: 'فاطمة الراشد',
        email: 'fatima.r@example.com',
        phone: '+966 55 987 6543',
        status: 'Active',
        tier: 'Platinum',
        country: 'Saudi Arabia',
        tags: ['Orphan Care', 'Ramadan Campaign', 'Water Projects'],
        assigned_manager: 'Fatma Kaya',
        donor_since: new Date('2019-06-01'),
        donor_category: 'Recurring',
        total_donations: '85000.00',
        donations_count: 30,
        avg_gift: '2833.33',
        primary_program_interest: 'Orphan Care',
    },
    {
        full_name_en: 'Omar Khalil',
        full_name_ar: 'عمر خليل',
        email: 'omar.k@example.com',
        phone: '+962 79 555 1234',
        status: 'Lapsed',
        tier: 'Bronze',
        country: 'Jordan',
        tags: ['Seasonal'],
        assigned_manager: 'Ahmad Noor',
        donor_since: new Date('2023-11-20'),
        donor_category: 'Seasonal',
        total_donations: '500.00',
        donations_count: 1,
        avg_gift: '500.00',
        primary_program_interest: 'Emergency Relief',
    },
    {
        full_name_en: 'Sarah Johnson',
        full_name_ar: 'سارة جونسون',
        email: 'sarah.j@example.com',
        phone: '+44 20 7946 0958',
        status: 'Active',
        tier: 'Gold',
        country: 'UK',
        tags: ['Education', 'Water Projects'],
        assigned_manager: 'Fatma Kaya',
        donor_since: new Date('2020-09-12'),
        donor_category: 'Recurring',
        total_donations: '22400.00',
        donations_count: 18,
        avg_gift: '1244.44',
        primary_program_interest: 'Water Projects',
    },
    {
        full_name_en: 'Mohammed Al-Sayed',
        full_name_ar: 'محمد السيد',
        email: 'mohammed.s@example.com',
        phone: '+20 100 555 7890',
        status: 'Active',
        tier: 'Major Donor',
        country: 'Egypt',
        tags: ['Orphan Care', 'Education', 'Annual Gala', 'Board Member'],
        assigned_manager: 'Ahmad Noor',
        donor_since: new Date('2018-01-05'),
        donor_category: 'Hero',
        total_donations: '250000.00',
        donations_count: 45,
        avg_gift: '5555.56',
        primary_program_interest: 'Education',
    },
    {
        full_name_en: 'Layla Hassan',
        full_name_ar: 'ليلى حسن',
        email: 'layla.h@example.com',
        phone: '+971 56 789 0123',
        status: 'On Hold',
        tier: 'Silver',
        country: 'UAE',
        tags: ['Healthcare', 'Ramadan Campaign'],
        assigned_manager: 'Fatma Kaya',
        donor_since: new Date('2022-06-15'),
        donor_category: 'Event',
        total_donations: '4200.00',
        donations_count: 3,
        avg_gift: '1400.00',
        primary_program_interest: 'Healthcare',
    },
    {
        full_name_en: 'Yusuf Demir',
        full_name_ar: 'يوسف دمير',
        email: 'yusuf.d@example.com',
        phone: '+90 532 111 2233',
        status: 'Active',
        tier: 'Gold',
        country: 'Turkey',
        tags: ['Emergency Relief', 'Water Projects'],
        assigned_manager: 'Ahmad Noor',
        donor_since: new Date('2021-08-22'),
        donor_category: 'Recurring',
        total_donations: '18700.00',
        donations_count: 14,
        avg_gift: '1335.71',
        primary_program_interest: 'Emergency Relief',
    },
];

const SAMPLE_PROGRAMS = ['Education', 'Healthcare', 'Orphan Care', 'Water Projects', 'Emergency Relief', 'Ramadan Campaign'];

function randomDonations(donorId: string, orgId: string, count: number) {
    const rows = [];
    for (let i = 0; i < count; i++) {
        const daysAgo = Math.floor(Math.random() * 730) + 30;
        rows.push({
            org_id: orgId,
            donor_id: donorId,
            amount: String((Math.floor(Math.random() * 5000) + 100).toFixed(2)),
            date: new Date(Date.now() - daysAgo * 86400000),
            program: SAMPLE_PROGRAMS[Math.floor(Math.random() * SAMPLE_PROGRAMS.length)],
        });
    }
    return rows;
}

async function lookupUserId(email: string): Promise<string> {
    const rows = await client`SELECT id FROM auth.users WHERE email = ${email} LIMIT 1`;
    if (!rows.length) throw new Error(`No Supabase user found with email: ${email}`);
    return rows[0].id;
}

async function reset() {
    console.log('Resetting: deleting all seed data...');
    await db.delete(schema.donations);
    await db.delete(schema.individual_donors);
    await db.delete(schema.audit_log);
    await db.delete(schema.modules);
    await db.delete(schema.memberships);
    await db.delete(schema.organizations);
    console.log('All tables truncated.');
}

async function seed() {
    const userEmail = process.env.SEED_USER_EMAIL;
    if (!userEmail) {
        throw new Error('Set SEED_USER_EMAIL in .env (the email you sign in with)');
    }

    const userId = await lookupUserId(userEmail);
    console.log(`Found user: ${userEmail} → ${userId}`);

    const [org] = await db
        .insert(schema.organizations)
        .values({ name: SEED_ORG_NAME })
        .returning();
    console.log(`Created org: ${org.name} (${org.id})`);

    await db.insert(schema.memberships).values({
        org_id: org.id,
        user_id: userId,
        role: 'admin',
    });
    console.log(`Created membership for ${userEmail} as admin`);

    const moduleNames = ['donors', 'beneficiaries', 'projects', 'stakeholders', 'hr', 'finance'];
    await db.insert(schema.modules).values(
        moduleNames.map((name) => ({ org_id: org.id, name })),
    );
    console.log(`Registered ${moduleNames.length} modules`);

    for (const donor of SEED_DONORS) {
        const [inserted] = await db
            .insert(schema.individual_donors)
            .values({ org_id: org.id, ...donor })
            .returning();

        const donationCount = Math.floor(Math.random() * 5) + 2;
        await db.insert(schema.donations).values(
            randomDonations(inserted.id, org.id, donationCount),
        );
        console.log(`  Donor: ${inserted.full_name_en} + ${donationCount} donations`);
    }

    console.log('\nSeed complete.');
}

const isReset = process.argv.includes('--reset');

(async () => {
    try {
        if (isReset) await reset();
        await seed();
    } catch (err) {
        console.error(err);
        process.exit(1);
    } finally {
        await client.end();
    }
})();
