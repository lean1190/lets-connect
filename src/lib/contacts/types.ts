import type { Circle } from '@/lib/circles/types';
import type { Tables } from '../database/types';

export type Contact = Tables<'contacts'> & {
  circles?: Circle[];
};
