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
      {
        count: 2,
        countering: {
          count: 1,
          counterPriority: 400,
          name: "Vulcan",
        },
        name: "Stormcaller",
      },
    ],
    opponentArmy: [{ name: "Vulcan", count: 1 }],
    yourArmy: [],
  },
  {
    expectedSuggestions: [
      {
        count: 1,
        countering: {
          count: 2,
          counterPriority: 400,
          name: "Mustang",
        },
        name: "Vulcan",
      },
      {
        count: 2,
        countering: {
          count: 2,
          counterPriority: 400,
          name: "Mustang",
        },
        name: "Rhino",
      },
      {
        count: 1,
        countering: {
          count: 2,
          counterPriority: 400,
          name: "Mustang",
        },
        name: "Fortress",
      },
    ],
    opponentArmy: [
      { name: "Phoenix", count: 2 },
      { name: "Mustang", count: 2 },
      { name: "Crawler", count: 4 },
    ],
    yourArmy: [
      {
        name: "Mustang",
        count: 2,
      },
      {
        name: "Crawler",
        count: 2,
      },
    ],
  },
  {
    expectedSuggestions: [
      {
        count: 2,
        countering: {
          count: 4,
          counterPriority: 400,
          name: "Crawler",
        },
        name: "Mustang",
      },
      {
        count: 2,
        countering: {
          count: 4,
          counterPriority: 400,
          name: "Crawler",
        },
        name: "Rhino",
      },
      {
        count: 1,
        countering: {
          count: 4,
          counterPriority: 400,
          name: "Crawler",
        },
        name: "Vulcan",
      },
    ],
    opponentArmy: [
      { name: "Phoenix", count: 2 },
      { name: "Mustang", count: 2 },
      { name: "Crawler", count: 4 },
    ],
    yourArmy: [
      {
        name: "Mustang",
        count: 2,
      },
      {
        name: "Rhino",
        count: 2,
      },
    ],
  },
  {
    expectedSuggestions: [
      {
        count: 4,
        countering: {
          count: 2,
          counterPriority: 800,
          name: "Vulcan",
        },
        name: "Phoenix",
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
    opponentArmy: [{ name: "Vulcan", count: 4 }],
    yourArmy: [
      {
        name: "Phoenix",
        count: 4,
      },
    ],
  },
  {
    expectedSuggestions: [
      {
        count: 1,
        countering: {
          count: 1,
          counterPriority: 200,
          name: "Vulcan",
        },
        name: "Phoenix",
      },
      {
        count: 1,
        countering: {
          count: 1,
          counterPriority: 200,
          name: "Vulcan",
        },
        name: "Rhino",
      },
      {
        count: 1,
        countering: {
          count: 1,
          counterPriority: 200,
          name: "Vulcan",
        },
        name: "Stormcaller",
      },
    ],
    opponentArmy: [{ name: "Vulcan", count: 2 }],
    yourArmy: [
      {
        name: "Phoenix",
        count: 3,
      },
    ],
  },
];

describe("getSquadSuggestion results", () => {
  TEST_CASES.forEach((testCase, index) => {
    it(`Test case number ${index + 1}`, () => {
      const suggestions = getSquadSuggestions({
        opponentArmy: testCase.opponentArmy,
        yourArmy: testCase.yourArmy,
      });
      expect(suggestions).toEqual(testCase.expectedSuggestions);
    });
  });
});
