export type ResolverFnOf<T> =
  T extends (...args: infer P) => infer R
    ? (...args: P) => R
    : T extends { resolve: (...args: infer P) => infer R }
      ? (...args: P) => R
      : never
