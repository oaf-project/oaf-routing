/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statement */

import { createPageStateMemory } from ".";

describe("createPageStateMemory", () => {
  test("keeps track of page state", () => {
    const memory = createPageStateMemory<string, string>();

    expect(memory.pageState("asdf")).toBeUndefined();

    memory.update("PUSH", "previous-key", "next-key", "some-previous-state");

    expect(memory.pageState("previous-key")).toEqual("some-previous-state");

    memory.update("POP", "previous-key", "next-key", "some-previous-state");

    expect(memory.pageState("previous-key")).toEqual("some-previous-state");

    memory.update("REPLACE", "previous-key", "next-key", "some-previous-state");

    expect(memory.pageState("previous-key")).toBeUndefined();
  });
});
