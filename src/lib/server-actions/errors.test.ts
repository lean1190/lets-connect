import { describe, expect, it } from 'vitest';
import { createServerActionError, handleServerActionResult, ServerActionError } from './errors';

describe('createServerActionError', () => {
  it('should create a ServerActionError with the given type and message', () => {
    const error = createServerActionError({
      type: 'TestError',
      message: 'Something went wrong'
    });
    expect(error).toBeInstanceOf(ServerActionError);
    expect(error.message).toBe('Something went wrong');
    expect(error.type).toBe('TestError');
  });
});

describe('handleServerActionResult', () => {
  it('should return data when there is no error', () => {
    const result = handleServerActionResult({ data: { success: true } });
    expect(result).toEqual({ success: true });
  });

  it('should throw a ValidationError when validationErrors are present', () => {
    expect(() => handleServerActionResult({ validationErrors: { field: 'Invalid' } })).toThrowError(
      ServerActionError
    );
  });

  it('should throw a ValidationError with the correct message', () => {
    try {
      handleServerActionResult({ validationErrors: { field: 'Invalid' } });
    } catch (_error) {
      expect(_error).toBeInstanceOf(ServerActionError);
      const error = _error as ServerActionError;
      expect(error.message).toBe(JSON.stringify({ field: 'Invalid' }));
      expect(error.type).toBe('ValidationError');
    }
  });

  it('should throw a ServerError when serverError is present', () => {
    expect(() => handleServerActionResult({ serverError: 'Internal server error' })).toThrowError(
      ServerActionError
    );
  });

  it('should throw a ServerError with the correct message', () => {
    try {
      handleServerActionResult({ serverError: 'Internal server error' });
    } catch (_error) {
      expect(_error).toBeInstanceOf(ServerActionError);
      const error = _error as ServerActionError;
      expect(error.message).toBe('Internal server error');
      expect(error.type).toBe('ServerError');
    }
  });

  it('should return undefined when no result is provided', () => {
    expect(handleServerActionResult()).toBeUndefined();
  });
});
