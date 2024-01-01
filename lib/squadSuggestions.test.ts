import { getSquadSuggestions } from "./squadSuggestions";
import type { Squad, SquadSuggestion } from "../types/Squad";

interface TestCase {
  expectedSuggestions: SquadSuggestion[];
  opponentArmy: Squad[];
  yourArmy: Squad[];
}

const TEST_CASES: TestCase[] = [
  {
    expectedSuggestions: [],
    opponentArmy: [],
    yourArmy: [],
  },
  {
    expectedSuggestions: [
      {
        count: 1,
        countering: {
          count: 1,
          counterPriority: 400,
          name: "Vulcan",
        },
        name: "Fortress",
      },
      {
        count: 2,
        countering: {
          count: 1,
          counterPriority: 400,
          name: "Vulcan",
        },
        name: "Phoenix",
      },
      {
        count: 2,
        countering: {
          count: 1,
          counterPriority: 400,
          name: "Vulcan",
        },
        name: "Rhino",
      },
    ],
    opponentArmy: [{ name: "Vulcan", count: 1 }],
    yourArmy: [],
  },
  {
    expectedSuggestions: [
      {
        count: 2,
        countering: {
          count: 2,
          counterPriority: 800,
          name: "Vulcan",
        },
        name: "Fortress",
      },
      {
        count: 4,
        countering: {
          count: 2,
          counterPriority: 800,
          name: "Vulcan",
        },
        name: "Rhino",
      },
      {
        count: 4,
        countering: {
          count: 2,
          counterPriority: 800,
          name: "Vulcan",
        },
        name: "Stormcaller",
      },
    ],
    opponentArmy: [
      { name: "Vulcan", count: 2 },
      { name: "Mustang", count: 4 },
    ],
    yourArmy: [],
  },
];

describe("getSquadSuggestion results", () => {
  TEST_CASES.forEach((testCase, index) => {
    it(`Test case number ${index}`, () => {
      const suggestions = getSquadSuggestions({
        opponentArmy: testCase.opponentArmy,
        yourArmy: testCase.yourArmy,
      });
      expect(suggestions).toEqual(testCase.expectedSuggestions);
    });
  });
});
