/* eslint-disable functional/no-expression-statement */

import {
  elementFromTarget,
  focusElement,
  getScrollPosition,
  ScrollPosition,
  Selector,
  setScrollPosition,
} from "oaf-side-effects";

/**
 * Aspects of page state that should be restored after POP history
 * actions (i.e. after the user navigates back or forward in their browser).
 */
export type PageState = ScrollPosition & {
  /**
   * A CSS selector that uniquely specifies the element that has keyboard focus (if any).
   */
  readonly focusSelector?: Selector;
};

/**
 * Get the current page state.
 */
export const getPageState = (
  unique: (element: Element) => Selector | undefined,
): PageState => {
  const focusSelector =
    document.activeElement !== null
      ? unique(document.activeElement)
      : undefined;

  return {
    ...getScrollPosition(),
    focusSelector,
  };
};

/**
 * Set the page state.
 * @param pageState the page state to set
 * @param primaryFocusTarget a CSS selector for your primary focus target, e.g. `[main h1]`
 */
export const setPageState = async (
  pageState: PageState,
  primaryFocusTarget: Selector,
): Promise<void> => {
  const previouslyFocusedElement =
    pageState.focusSelector !== undefined
      ? elementFromTarget(pageState.focusSelector)
      : undefined;
  const elementToFocus =
    previouslyFocusedElement ??
    elementFromTarget(primaryFocusTarget) ??
    document.body;

  await focusElement(elementToFocus, true);

  setScrollPosition(pageState);
};
