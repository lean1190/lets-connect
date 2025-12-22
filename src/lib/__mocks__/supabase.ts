import type { User } from "@supabase/supabase-js";
import { vi } from "vitest";

export const getFakeSupabaseUser = (user?: Partial<User>) => ({
  id: "123",
  email: "linkedin-user@example.com",
  identities: [{ id: "fake-linkedin-id" }],
  user_metadata: { picture: "fake-picture" },
  ...user,
});

export const createFakeSupabaseClient = () => {
  const fakeUsers: { id: string; email: string }[] = [];
  // biome-ignore lint/suspicious/noExplicitAny: This is only for a fake
  const fakeDB: Record<string, any[]> = {};
  return {
    auth: {
      signInWithOAuth: vi.fn(async ({ provider }) => {
        if (provider !== "linkedin") {
          return { data: null, error: { message: "Unsupported provider" } };
        }

        const user = getFakeSupabaseUser();
        if (!fakeUsers.some((u) => u.email === user.email)) {
          fakeUsers.push(user); // Simulate user creation on first sign-in
        }

        return {
          data: { url: "https://linkedin.com/oauth", user },
          error: null,
        };
      }),

      signOut: vi.fn(async () => {
        return { error: null };
      }),

      getSession: vi.fn(async () => {
        return {
          data: {
            session: {
              access_token: "fake-token",
              provider_token: "fake-linkedin-token",
              user: fakeUsers[0] || null,
            },
          },
          error: null,
        };
      }),

      getUser: vi.fn(async () => {
        return {
          data: {
            user: fakeUsers[0] || null,
          },
          error: null,
        };
      }),

      onAuthStateChange: vi.fn((callback) => {
        if (fakeUsers.length > 0) {
          callback("SIGNED_IN", {
            access_token: "fake-token",
            user: fakeUsers[0],
          });
        }
        return () => {}; // Unsubscribe function
      }),
    },

    from: (table: string) => ({
      select: vi.fn(async (_columns: string) => {
        const data = fakeDB[table] || [];
        return { data, error: null };
      }),

      insert: vi.fn(async (data) => {
        if (!data) {
          return { data: null, error: { message: "No data provided" } };
        }

        const newData = { id: Date.now(), ...data };
        if (!fakeDB[table]) {
          fakeDB[table] = [];
        }
        fakeDB[table].push(newData);
        return { data: newData, error: null };
      }),

      update: vi.fn(async (updates) => {
        if (!updates) {
          return { data: null, error: { message: "No update data provided" } };
        }

        let updatedData = null;
        if (fakeDB[table]) {
          fakeDB[table] = fakeDB[table].map((item) => {
            if (item.id === updates.id) {
              updatedData = { ...item, ...updates };
              return updatedData;
            }
            return item;
          });
        }

        return updatedData
          ? { data: updatedData, error: null }
          : { data: null, error: { message: "Item not found" } };
      }),

      delete: vi.fn(async (id) => {
        if (!id) {
          return { data: null, error: { message: "No ID provided" } };
        }

        const beforeDeleteCount = fakeDB[table]?.length || 0;
        fakeDB[table] = (fakeDB[table] || []).filter((item) => item.id !== id);
        const afterDeleteCount = fakeDB[table]?.length || 0;

        return beforeDeleteCount > afterDeleteCount
          ? { data: { id }, error: null }
          : { data: null, error: { message: "Item not found" } };
      }),
    }),
  };
};

const fakeClient = createFakeSupabaseClient();

vi.mock("@/lib/supabase/server", async () => ({
  createClient: async () => fakeClient,
}));

vi.mock("@/lib/supabase/client", async () => ({
  supabaseClient: fakeClient,
  createClient: () => fakeClient,
}));
