/**
 * Type declarations for unique-selector.
 * See https://github.com/ericclemmons/unique-selector
 * Remove this when https://github.com/ericclemmons/unique-selector/issues/37 lands
 */
declare module "unique-selector" {
  export type Selector = string;

  export type SelectorType = "ID" | "Class" | "Tag" | "NthChild" | "Attributes";

  export type Options = {
    readonly selectorTypes?: readonly SelectorType[];
    readonly attributesToIgnore?: readonly string[];
    readonly excludeRegex?: RegExp | null;
  };

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  declare function unique(element: Element, options?: Options): Selector;

  export = unique;
}
