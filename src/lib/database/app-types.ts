export interface Contact {
  id: string;
  created_at: string;
  user_id: string;
  url: string;
  reason: string;
  name: string;
}

export interface Group {
  id: string;
  created_at: string;
  name: string;
  updated_at: string;
  user_id: string;
}

export interface ContactGroup {
  id: string;
  created_at: string;
  contact_id: string;
  group_id: string;
  user_id: string;
}

export interface CreateContactInput {
  name: string;
  profileLink: string;
  reason: string;
  groupIds?: string[];
}

export interface CreateGroupInput {
  name: string;
}

export interface ContactOutput {
  id: string;
  name: string;
  profileLink: string;
  reason: string;
  dateAdded: string;
  groups?: GroupOutput[];
}

export interface GroupOutput {
  id: string;
  name: string;
  createdAt: string;
  contactCount?: number;
}
