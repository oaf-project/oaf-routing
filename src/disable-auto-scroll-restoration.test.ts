/* eslint-disable functional/no-return-void */
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statement */

import { disableAutoScrollRestoration } from ".";

describe("disableAutoScrollRestoration", () => {
  test("sets window.history.scrollRestoration to 'manual'", () => {
    // eslint-disable-next-line functional/immutable-data
    window.history.scrollRestoration = "auto";

    const restore = disableAutoScrollRestoration();

    expect(window.history.scrollRestoration).toEqual("manual");

    restore();

    expect(window.history.scrollRestoration).toEqual("auto");
  });
});
