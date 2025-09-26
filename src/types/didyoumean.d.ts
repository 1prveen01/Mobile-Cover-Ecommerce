declare module "didyoumean" {
  function didYouMean<T extends string>(
    input: string,
    list: readonly T[]
  ): T | null;

  namespace didYouMean {
    let returnFirstMatch: boolean;
    let caseSensitive: boolean;
  }

  export = didYouMean;
}
