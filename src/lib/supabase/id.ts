export function hasId<T>(obj: T): obj is T & { id: string } {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    typeof obj.id === "string"
  );
}

export function newId() {
  return crypto.randomUUID();
}

export function validateUuid(uuid: unknown) {
  const uuidPattern =
    /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i;
  return typeof uuid === "string" && uuidPattern.test(uuid);
}
