declare module "didyoumean" {

    //T is generic type extending string means it always return string
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
