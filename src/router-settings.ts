import { Selector } from "oaf-side-effects";
import { Action, PageState } from ".";

// tslint:disable: no-commented-code
// tslint:disable: interface-name
// tslint:disable: no-mixed-interface
// tslint:disable: object-literal-sort-keys

export interface RouterSettings<Location> {
  readonly announcementsDivId: string;
  readonly primaryFocusTarget: Selector;

  readonly documentTitle: (location: Location) => Promise<string>;
  readonly navigationMessage: (
    title: string,
    location: Location,
    action?: Action,
  ) => string;
  readonly shouldHandleAction: (
    previousLocation: Location,
    nextLocation: Location,
    action?: Action,
  ) => boolean;
  readonly disableAutoScrollRestoration: boolean;
  readonly announcePageNavigation: boolean;
  readonly setPageTitle: boolean;
  readonly handleHashFragment: boolean;
  readonly restorePageStateOnPop: boolean;
  readonly renderTimeout: number;
  readonly defaultPageState: PageState;
  readonly focusOptions?: FocusOptions;
  readonly scrollIntoViewOptions?: ScrollIntoViewOptions;
  readonly setMessageTimeout?: number;
  readonly clearMessageTimeout?: number;
}

export const defaultSettings: RouterSettings<unknown> = {
  announcementsDivId: "announcements",
  primaryFocusTarget: "main h1, [role=main] h1",
  documentTitle: () =>
    new Promise(resolve => setTimeout(() => resolve(document.title))),
  // TODO i18n
  navigationMessage: (title: string): string => `Navigated to ${title}.`,
  shouldHandleAction: () => true,
  disableAutoScrollRestoration: true,
  announcePageNavigation: true,
  setPageTitle: false,
  handleHashFragment: true,
  restorePageStateOnPop: true,
  renderTimeout: 0,
  defaultPageState: { x: 0, y: 0 },
  focusOptions: undefined,
  scrollIntoViewOptions: undefined,
  setMessageTimeout: undefined,
  clearMessageTimeout: undefined,
};
