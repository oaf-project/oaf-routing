/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable functional/no-expression-statement */
/* eslint-disable functional/no-try-statement */
/* eslint-disable functional/no-conditional-statement */
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-return-void */

import type { Hash } from "oaf-side-effects";
import {
  Action,
  createPageStateMemory,
  disableAutoScrollRestoration,
  getPageState,
  PageState,
  PageStateMemory,
  RouterSettings,
  setPageState,
} from ".";

export type LocationKey = string;

export type OafRouter<Location> = {
  readonly handleFirstPageLoad: (location: Location) => Promise<void>;
  readonly handleLocationChanged: (
    previousLocation: Location,
    currentLocation: Location,
    currentLocationKey: LocationKey | undefined,
    action: Action | undefined,
  ) => Promise<void>;
  readonly handleLocationWillChange: (
    currentLocationKey: LocationKey,
    nextLocationKey: LocationKey,
    action: Action,
  ) => void;
  readonly resetAutoScrollRestoration: () => void;
};

const createPageStateMemoryWithFallback = <Location>(
  settings: RouterSettings<Location>,
): PageStateMemory<LocationKey, PageState> => {
  const dummyPageStateMemory = {
    pageState: () => undefined,
    update: () => {},
  };

  if (!settings.restorePageStateOnPop) {
    return dummyPageStateMemory;
  }

  try {
    return createPageStateMemory<LocationKey, PageState>();
  } catch (e: unknown) {
    console.error(e);
    return dummyPageStateMemory;
  }
};

const documentTitle = <Location>(
  location: Location,
  settings: RouterSettings<Location>,
): string | undefined => {
  const title = settings.documentTitle(location);

  if (
    // Our users might be using raw JavaScript, so we want this warning to apply even in cases
    // that would normally not compile in TypeScript.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    title === null ||
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    title === undefined ||
    typeof title !== "string" ||
    title.trim() === ""
  ) {
    console.error(
      `Title [${title}] is invalid. See https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-title.html`,
    );

    return undefined;
  } else {
    return title;
  }
};

export const createOafRouter = <Location>(
  settings: RouterSettings<Location>,
  hashFromLocation: (location: Location) => Hash,
  // eslint-disable-next-line sonarjs/cognitive-complexity
): OafRouter<Location> => {
  const resetAutoScrollRestoration = settings.disableAutoScrollRestoration
    ? disableAutoScrollRestoration()
    : () => {};

  const pageStateMemory = createPageStateMemoryWithFallback(settings);

  return {
    handleFirstPageLoad: async (location: Location): Promise<void> => {
      const title = documentTitle(location, settings);

      if (settings.setPageTitle && title !== undefined) {
        settings.setTitle(title);
      }

      if (settings.handleHashFragment) {
        const hash = hashFromLocation(location);
        const focusTarget = settings.elementFromHash(hash);
        if (focusTarget !== undefined) {
          const didFocus = await settings.focusAndScrollIntoViewIfRequired(
            focusTarget,
            focusTarget,
            settings.smoothScroll,
          );
          if (!didFocus) {
            console.warn(`Unable to focus element for hash [${hash}].`);
          }
        }
      }
    },
    handleLocationChanged: async (
      previousLocation: Location,
      currentLocation: Location,
      currentLocationKey: LocationKey | undefined,
      action: Action | undefined,
    ): Promise<void> => {
      const title = documentTitle(currentLocation, settings);

      if (settings.setPageTitle && title !== undefined) {
        settings.setTitle(title);
      }

      const shouldHandleAction = settings.shouldHandleAction(
        previousLocation,
        currentLocation,
        action,
      );

      if (!shouldHandleAction) {
        return;
      }

      if (settings.announcePageNavigation) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        settings.announce(
          settings.navigationMessage(
            title ?? settings.documentTitleAnnounceFallback,
            currentLocation,
            action,
          ),
          settings.announcementsDivId,
          settings.setMessageTimeout,
          settings.clearMessageTimeout,
        );
      }

      if (settings.repairFocus) {
        const primaryFocusTarget =
          typeof settings.primaryFocusTarget === "string"
            ? settings.primaryFocusTarget
            : settings.primaryFocusTarget(currentLocation);

        const shouldRestorePageState =
          action === "POP" && settings.restorePageStateOnPop;

        if (shouldRestorePageState) {
          const previousPageState =
            currentLocationKey !== undefined
              ? pageStateMemory.pageState(currentLocationKey)
              : undefined;
          const pageStateToSet = {
            ...settings.defaultPageState,
            ...previousPageState,
          };

          await setPageState(pageStateToSet, primaryFocusTarget);
        } else {
          const hash = hashFromLocation(currentLocation);
          const focusTarget = settings.handleHashFragment
            ? settings.elementFromHash(hash)
            : undefined;
          const didFocus = await settings.resetFocus(
            primaryFocusTarget,
            focusTarget,
            settings.smoothScroll,
          );
          if (!didFocus) {
            console.warn(
              `Unable to focus element for primary focus target [${primaryFocusTarget}] and hash [${hash}].`,
            );
          }
        }
      }
    },
    handleLocationWillChange: (
      currentLocationKey: LocationKey,
      nextLocationKey: LocationKey,
      action: Action,
    ): void => {
      if (settings.restorePageStateOnPop) {
        pageStateMemory.update(
          action,
          currentLocationKey,
          nextLocationKey,
          getPageState(),
        );
      }
    },
    resetAutoScrollRestoration,
  };
};
