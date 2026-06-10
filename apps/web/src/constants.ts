

import {
    CommunityServiceIcon,
    ResearchIcon,
    InnovationIcon,
    LeadershipProjectIcon,
    EnvironmentalIcon,
    EducationalIcon,
    CulturalIcon,
} from './components/icons/ProjectIcons';
import type { Role } from './types';
import {
    SIDEBAR_MODULES_FROM_REGISTRY,
    SIDEBAR_MODULES_FOR_PERMISSIONS as REGISTRY_PERMISSIONS_MODULES,
    PLATFORM_MODULE,
} from './moduleRegistry';

/** @deprecated Use moduleRegistry / useVisibleSidebarModules instead. */
export const SIDEBAR_MODULES = SIDEBAR_MODULES_FROM_REGISTRY;

export { PLATFORM_MODULE };

export const SIDEBAR_MODULES_FOR_PERMISSIONS = REGISTRY_PERMISSIONS_MODULES;

export const USER_ROLES: Role[] = ['Admin', 'Manager', 'Staff', 'Volunteer'];


export const EVENT_TYPES = [
    { id: 'lecture', color: 'blue' },
    { id: 'course', color: 'indigo' },
    { id: 'camp', color: 'teal' },
    { id: 'workshop', color: 'purple' },
    { id: 'activity', color: 'orange' },
    { id: 'ceremony', color: 'pink' },
    { id: 'meeting', color: 'gray' },
    { id: 'event', color: 'red' },
];

export const PROJECT_CATEGORIES = [
    { id: 'community-service', icon: CommunityServiceIcon },
    { id: 'research', icon: ResearchIcon },
    { id: 'innovation', icon: InnovationIcon },
    { id: 'leadership', icon: LeadershipProjectIcon },
    { id: 'environmental', icon: EnvironmentalIcon },
    { id: 'educational', icon: EducationalIcon },
    { id: 'cultural', icon: CulturalIcon },
] as const;

export const PROJECT_STATUSES = ['active', 'completed', 'planned', 'on-hold'] as const;
