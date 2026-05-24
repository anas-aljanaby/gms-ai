import { createOptimisticId, isOptimisticId } from './optimisticSubmit';
import type { Contact } from '../components/pages/donors_institutional/ContactsTab';

export const OPTIMISTIC_CONTACT_PREFIX = 'optimistic-contact-';

export function isOptimisticContact(id: string): boolean {
  return isOptimisticId(id, OPTIMISTIC_CONTACT_PREFIX);
}

export function buildOptimisticContact(
  data: Omit<Contact, 'id' | 'isPrimary'> & { isPrimary?: boolean }
): Contact {
  return {
    ...data,
    id: createOptimisticId(OPTIMISTIC_CONTACT_PREFIX),
    isPrimary: data.isPrimary || false,
  };
}
