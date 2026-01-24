import type { Circle } from '@/lib/circles/types';

export interface Contact {
  id: string;
  name: string;
  profileLink: string;
  reason: string;
  dateAdded: string;
  favorite: boolean;
  circles?: Circle[];
}
