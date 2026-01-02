import type { Tables } from '../database/types';

export enum ContactsListMode {
  Card = 'card',
  Compact = 'compact'
}

export enum Theme {
  Light = 'light',
  Dark = 'dark'
}

export type Settings = Tables<'settings'> & {
  contacts_list_mode: ContactsListMode;
  theme: Theme;
};
