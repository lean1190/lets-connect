import type { Contact } from '@/lib/contacts/types';
import type { Tables } from '../database/types';

export type Circle = Tables<'circles'> & {
  contactCount?: number;
  contacts?: Contact[];
};
