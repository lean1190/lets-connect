type VariabilityTestCase<T, K> = {
  caseName: string;
  input: T;
  expected: K;
};

export const variabilityTest = <T, K>(cases: {
  [key: string]: { input: T; expected: K };
}): VariabilityTestCase<T, K>[] =>
  Object.entries(cases).map(([caseName, { input, expected }]) => ({
    caseName,
    input,
    expected
  }));
