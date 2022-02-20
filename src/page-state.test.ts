/* eslint-disable functional/no-return-void */
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statement */

import { getPageState } from ".";

describe("getPageState", () => {
  test('returns "body" focus selector by default', () => {
    const state = getPageState();

    expect(state).toEqual({
      focusSelector: "body",
      x: 0,
      y: 0,
    });
  });
});
