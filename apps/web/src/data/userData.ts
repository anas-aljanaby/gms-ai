import type { AppRole, AppUser, RolePermissions } from '../types';
import { SIDEBAR_MODULES_FOR_PERMISSIONS } from '../constants';

const createPermissions = (overrides: Partial<RolePermissions>): RolePermissions => {
    const permissions: RolePermissions = {};
    SIDEBAR_MODULES_FOR_PERMISSIONS.forEach(module => {
        permissions[module.key] = { view: false, create: false, edit: false, delete: false };
    });
    
    for (const key in overrides) {
        if (permissions[key]) {
            permissions[key] = { ...permissions[key], ...overrides[key] };
        }
    }

    return permissions;
};

export const MOCK_ROLES: AppRole[] = [
    {
        id: 'role-admin',
        name: 'Admin',
        description: 'Full system access. Can manage settings, users, and all data.',
        userCount: 2,
        permissions: createPermissions(
            SIDEBAR_MODULES_FOR_PERMISSIONS.reduce((acc, module) => {
                acc[module.key] = { view: true, create: true, edit: true, delete: true };
                return acc;
            }, {} as RolePermissions)
        ),
    },
    {
        id: 'role-manager',
        name: 'Manager',
        description: 'Can manage most data within assigned modules but cannot change system settings.',
        userCount: 5,
        permissions: createPermissions({
            dashboard: { view: true, create: false, edit: false, delete: false },
            donors: { view: true, create: true, edit: true, delete: false },
            leadership: { view: true, create: true, edit: true, delete: false },
            sponsorship: { view: true, create: true, edit: true, delete: false },
            projects: { view: true, create: true, edit: true, delete: false },
            beneficiaries: { view: true, create: true, edit: true, delete: false },
            reports: { view: true, create: false, edit: false, delete: false },
        }),
    },
    {
        id: 'role-staff',
        name: 'Staff',
        description: 'Can view and edit data relevant to their daily tasks.',
        userCount: 15,
        permissions: createPermissions({
            dashboard: { view: true, create: false, edit: false, delete: false },
            donors: { view: true, create: false, edit: true, delete: false },
            leadership: { view: true, create: false, edit: true, delete: false },
            sponsorship: { view: true, create: false, edit: true, delete: false },
            beneficiaries: { view: true, create: false, edit: true, delete: false },
        }),
    },
    {
        id: 'role-volunteer',
        name: 'Volunteer',
        description: 'Limited access to view specific information and perform basic tasks.',
        userCount: 3,
        permissions: createPermissions({
            dashboard: { view: true, create: false, edit: false, delete: false },
            leadership: { view: true, create: false, edit: false, delete: false },
        }),
    },
];

export const MOCK_USERS: AppUser[] = [
    { id: 'user-1', name: 'Ali Veli', email: 'ali.veli@example.com', role: 'Admin', status: 'Active', lastLogin: '2024-07-21T10:00:00Z', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' },
    { id: 'user-2', name: 'Fatma Kaya', email: 'fatma.kaya@example.com', role: 'Manager', status: 'Active', lastLogin: '2024-07-20T14:30:00Z', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop' },
    { id: 'user-3', name: 'John Doe', email: 'john.doe@example.com', role: 'Staff', status: 'Active', lastLogin: '2024-07-21T09:15:00Z', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop' },
    { id: 'user-4', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Volunteer', status: 'Invited', lastLogin: '', avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=200&auto=format&fit=crop' },
    { id: 'user-5', name: 'Ahmed Khan', email: 'ahmed.khan@example.com', role: 'Staff', status: 'Deactivated', lastLogin: '2024-06-15T11:00:00Z', avatar: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=200&auto=format&fit=crop' },
];