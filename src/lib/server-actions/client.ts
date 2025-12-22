import { createSafeActionClient } from "next-safe-action";
import { defaultServerError, type ServerActionError } from "./errors";

export const actionClient = createSafeActionClient({
  handleServerError(error: Error | ServerActionError) {
    console.error("Server action error", {
      serverError: error.message ?? defaultServerError.message,
      type: (error as ServerActionError).type ?? defaultServerError.type,
      error,
    });

    return error.message ?? defaultServerError.message;
  },
});
