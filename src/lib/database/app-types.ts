export interface Contact {
  id: string;
  created_at: string;
  user_id: string;
  url: string;
  reason: string;
  name: string;
}

export interface Circle {
  id: string;
  created_at: string;
  name: string;
  updated_at: string;
  user_id: string;
}

export interface ContactCircle {
  id: string;
  created_at: string;
  contact_id: string;
  circle_id: string;
  user_id: string;
}

export interface CreateContactInput {
  name: string;
  profileLink: string;
  reason: string;
  circleIds?: string[];
}

export interface CreateCircleInput {
  name: string;
}

export interface ContactOutput {
  id: string;
  name: string;
  profileLink: string;
  reason: string;
  dateAdded: string;
  circles?: CircleOutput[];
}

export interface CircleOutput {
  id: string;
  name: string;
  createdAt: string;
  contactCount?: number;
  color?: string | null;
  description?: string | null;
  icon?: string | null;
}
