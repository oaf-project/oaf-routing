/* eslint-disable functional/no-expression-statement */
/* eslint-disable functional/no-conditional-statement */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-loop-statement */
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-return-void */

export type Action = "PUSH" | "POP" | "REPLACE";

export type PageStateMemory<LocationKey, PageState> = {
  readonly pageState: (key: LocationKey) => PageState | undefined;
  readonly update: (
    action: Action,
    previousLocationKey: LocationKey,
    nextLocationKey: LocationKey,
    previousPageState: PageState,
  ) => void;
};

export const createPageStateMemory = <
  LocationKey,
  PageState
>(): PageStateMemory<LocationKey, PageState> => {
  // TODO constrain the size of these collections?
  // TODO persist these?
  const locations = new Array<LocationKey>();
  const pageStateMap = new Map<LocationKey, PageState>();

  const handlePushAction = (
    previousLocationKey: LocationKey,
    nextLocationKey: LocationKey,
  ): void => {
    const desiredLocationsLength = locations.indexOf(previousLocationKey) + 1;

    while (locations.length > desiredLocationsLength) {
      const key = locations.pop();
      if (key !== undefined) {
        pageStateMap.delete(key);
      }
    }

    locations.push(nextLocationKey);
  };

  const handleReplaceAction = (
    previousLocationKey: LocationKey,
    nextLocationKey: LocationKey,
  ): void => {
    const indexToReplace = locations.indexOf(previousLocationKey);
    if (indexToReplace !== -1) {
      // TODO https://github.com/danielnixon/eslint-plugin-total-functions/issues/13
      // eslint-disable-next-line total-functions/no-array-subscript
      locations[indexToReplace] = nextLocationKey;
    }
    pageStateMap.delete(previousLocationKey);
  };

  return {
    pageState: (key: LocationKey): PageState | undefined => {
      return pageStateMap.get(key);
    },
    update: (
      action: Action,
      previousLocationKey: LocationKey,
      nextLocationKey: LocationKey,
      previousPageState: PageState,
    ): void => {
      pageStateMap.set(previousLocationKey, previousPageState);

      if (action === "PUSH") {
        handlePushAction(previousLocationKey, nextLocationKey);
      } else if (action === "REPLACE") {
        handleReplaceAction(previousLocationKey, nextLocationKey);
      }
    },
  };
};
