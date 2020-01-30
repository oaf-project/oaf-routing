/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statement */
/* eslint-disable functional/no-conditional-statement */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/functional-parameters */

/**
 * Sets `window.history.scrollRestoration` to `manual` and returns a
 * function that will restore it to its previous value.
 */
export const disableAutoScrollRestoration = (): (() => void) => {
  // https://developer.mozilla.org/en-US/docs/Web/API/History#Browser_compatibility
  if ("scrollRestoration" in window.history) {
    const original = window.history.scrollRestoration;

    window.history.scrollRestoration = "manual";
    return () => (window.history.scrollRestoration = original);
  } else {
    return () => {};
  }
};
