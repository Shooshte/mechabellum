import squadsData from "../fixtures/squads.json";
import type { Squad } from "../types/Squad";

interface Args {
  opponentArmy: Squad[];
  yourArmy: Squad[];
}

const parseSquadData = (squadText: string) => {
  const squadData = squadsData.squads.find((squad) => squadText === squad.text);

  if (!squadData) {
    throw new Error(`${squadText} data not found!`);
  }

  return squadData;
};

const getCounterPriority = ({
  squad,
  opponentArmy,
}: {
  squad: Squad;
  opponentArmy: Squad[];
}) => {
  const squadData = parseSquadData(squad.name);

  const requiredCounterValue = squad.count * squadData.stats.price;
  const fieldedCounterValue = opponentArmy.reduce((acc: number, oppSquad) => {
    const isCounter = squadData.counteredBy?.some(
      (squadName) => squadName === oppSquad.name
    );

    const oppSquadData = parseSquadData(oppSquad.name);

    if (isCounter) {
      return oppSquad.count * oppSquadData.stats.price + acc;
    }

    return acc;
  }, 0);

  return requiredCounterValue - fieldedCounterValue;
};

export const getSquadSuggestions = ({
  opponentArmy,
  yourArmy,
}: Args): Squad[] => {
  // For every unit in opponents army
  const unitsToCounter = opponentArmy
    .map((currentSquad) => {
      const counterPriority = getCounterPriority({
        squad: currentSquad,
        opponentArmy: yourArmy,
      });

      return {
        ...currentSquad,
        counterPriority,
      };
    })
    // Sort opponent army by number of counters the units have in your army (less is better), resolve tie by tier
    .sort((squadA, squadB) => {
      if (squadA.counterPriority === squadB.counterPriority) {
        return squadA.count - squadB.count;
      }

      return squadA.counterPriority - squadB.counterPriority;
    });

  // For the first three units with the biggest counter priority
  const possibleSuggestions = unitsToCounter
    .slice(0, 3)
    .reduce((counters: Squad[], squadToCounter) => {
      // Find units that counter them
      const squadToCounterData = parseSquadData(squadToCounter.name);
      const possibleCounters = squadToCounterData.counteredBy
        .map((possibleCounter) => {
          const possibleCounterData = parseSquadData(possibleCounter);

          const neededCount =
            squadToCounter.counterPriority / possibleCounterData.stats.price;

          const roundedNeededCount = Math.ceil(neededCount);

          const counterPriority = getCounterPriority({
            squad: { count: roundedNeededCount, name: possibleCounter },
            opponentArmy,
          });

          return {
            count: roundedNeededCount,
            counterPriority,
            name: possibleCounter,
          };
          // Check how much they are countered by opponent
        })
        // Filter out all unneded counters
        .filter((squad) => squad.count > 0)
        // Find the least countered unit
        .sort((squadA, squadB) => {
          if (squadB.counterPriority === squadA.counterPriority) {
            const squadAData = parseSquadData(squadA.name);
            const squadBData = parseSquadData(squadB.name);

            return squadAData.tier - squadBData.tier;
          }

          return squadB.counterPriority - squadA.counterPriority;
        });

      return [...counters, ...possibleCounters];
    }, []);

  const suggestions = possibleSuggestions.slice(0, 3).map((suggestion) => {
    return {
      name: suggestion.name,
      count: suggestion.count,
    };
  });

  // Return unit suggestions
  return suggestions;
};
