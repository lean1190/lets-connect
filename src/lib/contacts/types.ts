import type { CircleOutput } from '@/lib/circles/types';

export interface ContactOutput {
  id: string;
  name: string;
  profileLink: string;
  reason: string;
  dateAdded: string;
  favorite: boolean;
  circles?: CircleOutput[];
}
