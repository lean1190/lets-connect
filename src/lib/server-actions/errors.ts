export class ServerActionError extends Error {
  type: string;

  constructor(message: string, type: string) {
    super(message);
    this.type = type;
  }
}

export const defaultServerError = new ServerActionError(
  'Something unexpected happen. Please try again.',
  'UnknownServerError'
);

export function isServerActionError(error: unknown) {
  return error instanceof Error && error.name === 'ServerActionError';
}

export function createServerActionError({
  type,
  message
}: {
  type: string;
  message: string;
}): ServerActionError {
  return new ServerActionError(message, type);
}

export function handleServerActionResult<T, K>(result?: {
  data?: T;
  serverError?: string;
  validationErrors?: K;
}) {
  if (result?.validationErrors) {
    throw createServerActionError({
      type: 'ValidationError',
      message: JSON.stringify(result?.validationErrors)
    });
  }

  if (result?.serverError) {
    throw createServerActionError({
      type: 'ServerError',
      message: result?.serverError
    });
  }

  return result?.data;
}
