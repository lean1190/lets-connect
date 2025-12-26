import type { PostgrestError } from '@supabase/supabase-js';

export const handleDatabaseResponse = <T>({
  data,
  error
}: {
  data: T;
  error: PostgrestError | null;
}) => {
  if (error) {
    console.error('---> ERROR:Database', error);
    throw error;
  }

  return data;
};

export const hasFirstElement = <T>(data: T): data is T => {
  return (
    !!data &&
    data !== null &&
    Array.isArray(data) &&
    data.length > 0 &&
    data[0] !== null &&
    data[0] !== undefined
  );
};
