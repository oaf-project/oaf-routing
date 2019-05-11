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

const documentTitle = async <Location>(
  location: Location,
  settings: RouterSettings<Location>,
): Promise<string | undefined> => {
  const title = await settings.documentTitle(location);

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
      const title = await documentTitle(location, settings);

      if (settings.setPageTitle && title) {
        setTitle(title);
      }

      if (settings.handleHashFragment) {
        setTimeout(() => {
          const focusTarget = elementFromHash(hashFromLocation(location));
          if (focusTarget !== undefined) {
            focusAndScrollIntoViewIfRequired(
              focusTarget,
              focusTarget,
              settings.smoothScroll,
            );
          }
        }, settings.renderTimeout);
      }
    },
    handleLocationChanged: async (
      previousLocation: Location,
      currentLocation: Location,
      currentLocationKey: LocationKey | undefined,
      action: Action | undefined,
    ): Promise<void> => {
      const title = await documentTitle(currentLocation, settings);

      if (settings.setPageTitle && title) {
        setTitle(title);
      }

      const shouldHandleAction = settings.shouldHandleAction(
        previousLocation,
        currentLocation,
        action,
      );

      if (shouldHandleAction) {
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

        // HACK: We use setTimeout to give React a chance to render before we repair focus.
        // This may or may not be future proof. Revisit when React 17 is released.
        // We may have to tap into componentDidMount() on the individual react-router Route
        // components to know when we can safely repair focus.
        if (shouldRestorePageState) {
          const previousPageState = pageStateMemory.pageState(
            orInitialKey(currentLocationKey),
          );
          const pageStateToSet = {
            ...settings.defaultPageState,
            ...previousPageState,
          };

          setTimeout(
            () => setPageState(pageStateToSet, primaryFocusTarget),
            settings.renderTimeout,
          );
        } else {
          setTimeout(() => {
            const focusTarget = settings.handleHashFragment
              ? elementFromHash(hashFromLocation(currentLocation))
              : undefined;
            resetFocus(primaryFocusTarget, focusTarget, settings.smoothScroll);
          }, settings.renderTimeout);
        }
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
