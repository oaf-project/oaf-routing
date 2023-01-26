/* eslint-disable functional/no-return-void */
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statement */

import { defaultSettings } from ".";

describe("The default router settings", () => {
  test("get the page title from document.title", () => {
    const settings = defaultSettings;

    // eslint-disable-next-line functional/immutable-data
    document.title = "hello";

    expect(settings.documentTitle(undefined)).toEqual("hello");
  });
});
