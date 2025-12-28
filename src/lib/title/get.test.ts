import { describe, expect, it } from 'vitest';
import { AppRoute } from '../constants/navigation';
import { getTitle } from './get';

describe('getTitle', () => {
  const mockTitles: Record<string, string> = {
    '/contacts': 'Contacts',
    '/contacts/new': 'New contact',
    '/contacts/': 'Edit contact',
    '/circles': 'Circles',
    '/circles/new': 'New circle'
  };

  describe('exact pathname match', () => {
    it('should return the title when pathname exactly matches a key in titles', () => {
      expect(getTitle({ pathname: '/contacts', titles: mockTitles })).toBe('Contacts');
    });

    it('should return the title for new contact route', () => {
      expect(getTitle({ pathname: '/contacts/new', titles: mockTitles })).toBe('New contact');
    });

    it('should return the title for circles route', () => {
      expect(getTitle({ pathname: '/circles', titles: mockTitles })).toBe('Circles');
    });
  });

  describe('partial route matching', () => {
    it('should return partial route title when pathname starts with partialRoute', () => {
      expect(
        getTitle({
          pathname: '/contacts/123',
          titles: mockTitles,
          partialRoute: AppRoute.EditContact
        })
      ).toBe('Edit contact');
    });

    it('should return partial route title for nested routes', () => {
      expect(
        getTitle({
          pathname: '/contacts/abc-123/edit',
          titles: mockTitles,
          partialRoute: AppRoute.EditContact
        })
      ).toBe('Edit contact');
    });

    it('should not match partial route if pathname does not start with it', () => {
      expect(
        getTitle({
          pathname: '/circles/123',
          titles: mockTitles,
          partialRoute: AppRoute.EditContact
        })
      ).toBe('');
    });
  });

  describe('default title fallback', () => {
    it('should return defaultTitle when pathname does not match and no partialRoute matches', () => {
      expect(
        getTitle({
          pathname: '/unknown',
          titles: mockTitles,
          defaultTitle: 'Default Title'
        })
      ).toBe('Default Title');
    });

    it('should return empty string when no matches and no defaultTitle provided', () => {
      expect(
        getTitle({
          pathname: '/unknown',
          titles: mockTitles
        })
      ).toBe('');
    });

    it('should return defaultTitle when partialRoute is provided but does not match', () => {
      expect(
        getTitle({
          pathname: '/unknown',
          titles: mockTitles,
          partialRoute: AppRoute.EditContact,
          defaultTitle: 'Default'
        })
      ).toBe('Default');
    });
  });

  describe('priority order', () => {
    it('should prioritize partial route match over exact match when both exist', () => {
      const titles = {
        '/contacts/123': 'Specific Contact',
        '/contacts/': 'Edit contact'
      };
      // Note: The function prioritizes partial route over exact match
      expect(
        getTitle({
          pathname: '/contacts/123',
          titles,
          partialRoute: AppRoute.EditContact
        })
      ).toBe('Edit contact');
    });

    it('should prioritize partial route over defaultTitle', () => {
      expect(
        getTitle({
          pathname: '/contacts/123',
          titles: mockTitles,
          partialRoute: AppRoute.EditContact,
          defaultTitle: 'Default'
        })
      ).toBe('Edit contact');
    });

    it('should use defaultTitle when neither exact nor partial match', () => {
      expect(
        getTitle({
          pathname: '/unknown',
          titles: mockTitles,
          partialRoute: AppRoute.EditContact,
          defaultTitle: 'Default'
        })
      ).toBe('Default');
    });
  });

  describe('edge cases', () => {
    it('should handle empty pathname', () => {
      expect(
        getTitle({
          pathname: '',
          titles: mockTitles,
          defaultTitle: 'Default'
        })
      ).toBe('Default');
    });

    it('should handle empty titles object', () => {
      expect(
        getTitle({
          pathname: '/contacts',
          titles: {},
          defaultTitle: 'Default'
        })
      ).toBe('Default');
    });

    it('should handle undefined partialRoute', () => {
      expect(
        getTitle({
          pathname: '/contacts/123',
          titles: mockTitles,
          partialRoute: undefined,
          defaultTitle: 'Default'
        })
      ).toBe('Default');
    });

    it('should handle pathname that matches partialRoute exactly', () => {
      expect(
        getTitle({
          pathname: '/contacts/',
          titles: mockTitles,
          partialRoute: AppRoute.EditContact
        })
      ).toBe('Edit contact');
    });

    it('should handle titles with empty string values', () => {
      const titles = {
        '/test': ''
      };
      // Note: Empty string is falsy, so it falls back to defaultTitle
      expect(
        getTitle({
          pathname: '/test',
          titles,
          defaultTitle: 'Default'
        })
      ).toBe('Default');
    });
  });

  describe('real-world scenarios', () => {
    it('should work with contacts layout scenario', () => {
      const titles = {
        '/contacts': 'Contacts',
        '/contacts/new': 'New contact',
        '/contacts/': 'Edit contact'
      };
      expect(
        getTitle({
          pathname: '/contacts/abc-123',
          titles,
          partialRoute: AppRoute.EditContact
        })
      ).toBe('Edit contact');
    });

    it('should work with circles layout scenario', () => {
      const titles = {
        '/circles': 'Circles',
        '/circles/new': 'New circle',
        '/circles/': 'Circle Details'
      };
      expect(
        getTitle({
          pathname: '/circles/xyz-789',
          titles,
          partialRoute: AppRoute.ViewCircle
        })
      ).toBe('Circle Details');
    });
  });
});
