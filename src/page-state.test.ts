/* eslint-disable functional/no-return-void */
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statement */

import { getPageState, setPageState } from ".";
import unique from "unique-selector";

beforeEach(() => {
  // eslint-disable-next-line functional/immutable-data
  window.document.title = "";
  // eslint-disable-next-line functional/immutable-data
  window.document.body.innerHTML = "";

  // JSDOM doesn't implement window.scrollTo but oaf-side-effects calls it as part of `setPageState`.
  // eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-empty-function
  window.scrollTo = () => {};
});

describe("getPageState", () => {
  test('returns "body" focus selector by default', () => {
    const state = getPageState(unique);

    expect(state).toEqual({
      focusSelector: "body",
      x: 0,
      y: 0,
    });
  });
});

describe("setPageState", () => {
  test("sets focus to the indicated target", async () => {
    // Given that the document body has focus.
    expect(document.activeElement).toBe(window.document.body);

    // And the document contains a button.
    const arbitraryButton = document.createElement("button");
    document.body.append(arbitraryButton);

    // When we set page state specifying that the button should be focused.
    await setPageState({ x: 0, y: 0, focusSelector: "button" }, "body");

    // Then focus is moved to the button.
    expect(document.activeElement).toBe(arbitraryButton);
  });

  test("falls back on the primary focus target", async () => {
    // Given that the document body has focus.
    expect(document.activeElement).toBe(window.document.body);

    // And the document contains a button.
    const arbitraryButton = document.createElement("button");
    document.body.append(arbitraryButton);

    // When we set page state specifying that a (non existent) anchor should receive focus, with the button as the primary focus target.
    await setPageState({ x: 0, y: 0, focusSelector: "anchor" }, "button");

    // Then focus falls back on the primary focus target (the button).
    expect(document.activeElement).toBe(arbitraryButton);
  });

  test("falls back on the document body", async () => {
    // Given that an arbitrary input has focus.
    const arbitraryInput = document.createElement("input");
    document.body.append(arbitraryInput);
    arbitraryInput.focus();
    expect(document.activeElement).toBe(arbitraryInput);

    // And the document also contains a button.
    const arbitraryButton = document.createElement("button");
    document.body.append(arbitraryButton);

    // When we set page state specifying that a (non existent) anchor should receive focus, with another non-existent element as the primary focus target.
    await setPageState({ x: 0, y: 0, focusSelector: "anchor" }, "textarea");

    // Then focus falls back on the document body as a last resort.
    expect(document.activeElement).toBe(window.document.body);
  });
});
