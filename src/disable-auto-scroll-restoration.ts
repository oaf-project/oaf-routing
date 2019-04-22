// tslint:disable: no-if-statement
// tslint:disable: no-object-mutation
// tslint:disable: no-expression-statement

export const disableAutoScrollRestoration = (
  shouldDisable: boolean,
): (() => void) => {
  // https://developer.mozilla.org/en-US/docs/Web/API/History#Browser_compatibility
  if (shouldDisable && "scrollRestoration" in window.history) {
    const original = window.history.scrollRestoration;

    window.history.scrollRestoration = "manual";
    return () => (window.history.scrollRestoration = original);
  } else {
    return () => {
      return;
    };
  }
};
