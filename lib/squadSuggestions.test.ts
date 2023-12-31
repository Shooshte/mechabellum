import { getSquadSuggestions } from "./squadSuggestions";
import type { Squad } from "../types/Squad";

interface TestCase {
  expectedSuggestions: Squad[];
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
        name: "Fortress",
      },
      {
        count: 2,
        name: "Phoenix",
      },
      {
        count: 2,
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
        name: "Fortress",
      },
      {
        count: 4,
        name: "Rhino",
      },
      {
        count: 4,
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
