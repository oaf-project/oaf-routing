import {
  announce,
  elementFromHash,
  focusAndScrollIntoViewIfRequired,
  Hash,
  resetFocus,
} from "oaf-side-effects";
import {
  Action,
  disableAutoScrollRestoration,
  getPageState,
  PageState,
  RouterSettings,
  setPageState,
} from ".";
import { createPageStateMemory } from "./page-state-memory";

// tslint:disable: no-object-mutation
// tslint:disable: no-expression-statement
// tslint:disable: no-if-statement
// tslint:disable: interface-over-type-literal

export type OafRouter<Location> = {
  readonly handleFirstPageLoad: (location: Location) => Promise<void>;
  readonly handleLocationChanged: (
    previousLocation: Location,
    currentLocation: Location,
    action?: Action,
  ) => Promise<void>;
  readonly handleLocationWillChange: (
    currentLocation: Location,
    nextLocation: Location,
    action?: Action,
  ) => void;
  readonly resetAutoScrollRestoration: () => void;
};

export const createOafRouter = <Location, LocationKey>(
  settings: RouterSettings<Location>,
  hashFromLocation: (location: Location) => Hash,
  keyFromLocation: (location: Location) => LocationKey,
): OafRouter<Location> => {
  const resetAutoScrollRestoration = disableAutoScrollRestoration(
    settings.disableAutoScrollRestoration,
  );

  const pageStateMemory = createPageStateMemory<LocationKey, PageState>();

  return {
    handleFirstPageLoad: async (location: Location): Promise<void> => {
      if (settings.setPageTitle) {
        document.title = await settings.documentTitle(location);
      }

      if (settings.handleHashFragment) {
        setTimeout(() => {
          const focusTarget = elementFromHash(hashFromLocation(location));
          if (focusTarget !== undefined) {
            focusAndScrollIntoViewIfRequired(
              focusTarget,
              focusTarget,
              settings.focusOptions,
              settings.scrollIntoViewOptions,
            );
          }
        }, settings.renderTimeout);
      }
    },
    handleLocationChanged: async (
      previousLocation: Location,
      currentLocation: Location,
      action?: Action,
    ): Promise<void> => {
      const title = await settings.documentTitle(currentLocation);

      if (settings.setPageTitle) {
        document.title = title;
      }

      const shouldHandleAction = settings.shouldHandleAction(
        previousLocation,
        currentLocation,
        action,
      );

      if (shouldHandleAction) {
        if (settings.announcePageNavigation) {
          announce(
            settings.navigationMessage(title, currentLocation, action),
            settings.announcementsDivId,
            settings.setMessageTimeout,
            settings.clearMessageTimeout,
          );
        }

        const shouldRestorePageState =
          action === "POP" && settings.restorePageStateOnPop;

        // HACK: We use setTimeout to give React a chance to render before we repair focus.
        // This may or may not be future proof. Revisit when React 17 is released.
        // We may have to tap into componentDidMount() on the individual react-router Route
        // components to know when we can safely repair focus.
        if (shouldRestorePageState) {
          const previousPageState = pageStateMemory.pageState(
            keyFromLocation(currentLocation),
          );
          const pageStateToSet = {
            ...settings.defaultPageState,
            ...previousPageState,
          };

          setTimeout(
            () => setPageState(pageStateToSet, settings.primaryFocusTarget),
            settings.renderTimeout,
          );
        } else {
          setTimeout(() => {
            const focusTarget = settings.handleHashFragment
              ? elementFromHash(hashFromLocation(currentLocation))
              : undefined;
            resetFocus(
              settings.primaryFocusTarget,
              focusTarget,
              settings.focusOptions,
              settings.scrollIntoViewOptions,
            );
          }, settings.renderTimeout);
        }
      }
    },
    handleLocationWillChange: (
      currentLocation: Location,
      nextLocation: Location,
      action?: Action,
    ): void => {
      pageStateMemory.update(
        action,
        keyFromLocation(currentLocation),
        keyFromLocation(nextLocation),
        getPageState(),
      );
    },
    resetAutoScrollRestoration,
  };
};
