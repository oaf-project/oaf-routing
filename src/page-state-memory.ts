// tslint:disable: no-expression-statement
// tslint:disable: no-if-statement
// tslint:disable: interface-over-type-literal
// tslint:disable: object-literal-sort-keys

export type Action = "PUSH" | "POP" | "REPLACE";

export type PageStateMemory<LocationKey, PageState> = {
  readonly pageState: (key: LocationKey) => PageState | undefined;
  readonly update: (
    action: Action,
    previousLocationKey: LocationKey,
    nextLocationKey: LocationKey,
    previousPageState: PageState,
    shouldHandleAction: boolean,
  ) => void;
  readonly shouldHandleAction: (key: LocationKey) => boolean | undefined;
};

export const createPageStateMemory = <
  LocationKey,
  PageState
>(): PageStateMemory<LocationKey, PageState> => {
  // TODO constrain the size of these collections?
  // TODO persist these?
  const locations = new Array<LocationKey>();
  const pageStateMap = new Map<LocationKey, PageState>();
  const shouldHandleActionMap = new Map<LocationKey, boolean>();

  const purgeStateForKey = (key: LocationKey): void => {
    pageStateMap.delete(key);
    shouldHandleActionMap.delete(key);
  };

  const handlePushAction = (
    previousLocationKey: LocationKey,
    nextLocationKey: LocationKey,
  ): void => {
    const desiredLocationsLength = locations.indexOf(previousLocationKey) + 1;

    while (locations.length > desiredLocationsLength) {
      const key = locations.pop();
      if (key !== undefined) {
        purgeStateForKey(key);
      }
    }

    locations.push(nextLocationKey);
    return;
  };

  const handleReplaceAction = (
    previousLocationKey: LocationKey,
    nextLocationKey: LocationKey,
  ): void => {
    const indexToReplace = locations.indexOf(previousLocationKey);
    if (indexToReplace !== -1) {
      // tslint:disable-next-line: no-object-mutation
      locations[indexToReplace] = nextLocationKey;
    }
    purgeStateForKey(previousLocationKey);
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
      shouldHandleAction: boolean,
    ): void => {
      pageStateMap.set(previousLocationKey, previousPageState);

      if (action === "PUSH") {
        handlePushAction(previousLocationKey, nextLocationKey);
      } else if (action === "REPLACE") {
        handleReplaceAction(previousLocationKey, nextLocationKey);
      }

      shouldHandleActionMap.set(nextLocationKey, shouldHandleAction);
    },
    shouldHandleAction: (key: LocationKey): boolean | undefined => {
      return shouldHandleActionMap.get(key);
    },
  };
};
