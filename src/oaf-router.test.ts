/* eslint-disable functional/no-return-void */

/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statement */

import { createOafRouter, defaultSettings } from ".";

describe("oaf router", () => {
  test("sets page title upon first page load", async () => {
    const router = createOafRouter<Location>(
      { ...defaultSettings, documentTitle: () => "hello", setPageTitle: true },
      (l) => l.hash,
    );

    await router.handleFirstPageLoad(window.location);

    expect(document.title).toEqual("hello");

    router.handleLocationWillChange("location-a", "location-b", "PUSH");

    await router.handleLocationChanged(
      document.location,
      document.location,
      "location-b",
      "PUSH",
    );
  });
});
