export interface CircleOutput {
  id: string;
  name: string;
  createdAt: string;
  contactCount?: number;
  color?: string | null;
  description?: string | null;
  icon?: string | null;
  favorite?: boolean;
}
