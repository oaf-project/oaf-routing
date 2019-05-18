import {
  announce,
  elementFromHash,
  focusAndScrollIntoViewIfRequired,
  Hash,
  resetFocus,
  setTitle,
} from "oaf-side-effects";
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

// tslint:disable: no-expression-statement
// tslint:disable: no-if-statement
// tslint:disable: interface-over-type-literal
// tslint:disable: no-empty

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
    currentLocationKey: LocationKey | undefined,
    nextLocationKey: LocationKey | undefined,
    action: Action | undefined,
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
  } catch (e) {
    // tslint:disable-next-line: no-console
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
    title === null ||
    title === undefined ||
    typeof title !== "string" ||
    title.trim() === ""
  ) {
    // tslint:disable-next-line: no-console
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
): OafRouter<Location> => {
  const resetAutoScrollRestoration = settings.disableAutoScrollRestoration
    ? disableAutoScrollRestoration()
    : () => {};

  // HACK we need a way to track where focus and scroll were left on the first loaded page
  // but we won't have an entry in history for this initial page, so we just make up a key.
  const orInitialKey = (key: LocationKey | undefined): LocationKey =>
    key !== undefined ? key : "initial";

  const pageStateMemory = createPageStateMemoryWithFallback(settings);

  return {
    handleFirstPageLoad: async (location: Location): Promise<void> => {
      const title = documentTitle(location, settings);

      if (settings.setPageTitle && title) {
        setTitle(title);
      }

      if (settings.handleHashFragment) {
        const focusTarget = elementFromHash(hashFromLocation(location));
        if (focusTarget !== undefined) {
          focusAndScrollIntoViewIfRequired(
            focusTarget,
            focusTarget,
            settings.smoothScroll,
          );
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

      if (settings.setPageTitle && title) {
        setTitle(title);
      }

      const shouldHandleAction = settings.shouldHandleAction(
        previousLocation,
        currentLocation,
        action,
      );

      if (!shouldHandleAction) {
        return Promise.resolve();
      }

      if (settings.announcePageNavigation) {
        announce(
          settings.navigationMessage(
            title || settings.documentTitleAnnounceFallback,
            currentLocation,
            action,
          ),
          settings.announcementsDivId,
          settings.setMessageTimeout,
          settings.clearMessageTimeout,
        );
      }

      const primaryFocusTarget =
        typeof settings.primaryFocusTarget === "string"
          ? settings.primaryFocusTarget
          : settings.primaryFocusTarget(currentLocation);

      const shouldRestorePageState =
        action === "POP" && settings.restorePageStateOnPop;

      if (shouldRestorePageState) {
        const previousPageState = pageStateMemory.pageState(
          orInitialKey(currentLocationKey),
        );
        const pageStateToSet = {
          ...settings.defaultPageState,
          ...previousPageState,
        };

        return setPageState(pageStateToSet, primaryFocusTarget);
      } else {
        const focusTarget = settings.handleHashFragment
          ? elementFromHash(hashFromLocation(currentLocation))
          : undefined;
        // TODO: warn if resetFocus returns false?
        await resetFocus(
          primaryFocusTarget,
          focusTarget,
          settings.smoothScroll,
        );
        return;
      }
    },
    handleLocationWillChange: (
      currentLocationKey: LocationKey | undefined,
      nextLocationKey: LocationKey | undefined,
      action: Action | undefined,
    ): void => {
      if (settings.restorePageStateOnPop) {
        pageStateMemory.update(
          action,
          orInitialKey(currentLocationKey),
          orInitialKey(nextLocationKey),
          getPageState(),
        );
      }
    },
    resetAutoScrollRestoration,
  };
};
