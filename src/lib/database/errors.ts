export const isDuplicatedConstraintError = (error: unknown) => {
  // biome-ignore lint/suspicious/noExplicitAny: We don't know upfront what the error is
  return (error as any)?.code === "23505";
};
