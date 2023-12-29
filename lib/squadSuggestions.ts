import squadsData from "../fixtures/squads.json";
import type { Squad } from "../types/Squad";

interface Args {
  opponentArmy: Squad[];
  yourArmy: Squad[];
}

export const getSquadSuggestions = ({
  opponentArmy,
  yourArmy,
}: Args): string[] => {
  // For every unit in opponents army
  const unitsToCounter = opponentArmy
    .map((currentSquad) => {
      const opponentSquadData = squadsData.squads.find(
        (squad) => currentSquad.name === squad.text
      );
      if (!opponentSquadData) {
        throw new Error(`${currentSquad.name} data not found!`);
      }

      // Get list of your army units it is countered by
      const fieldedCounters = yourArmy.reduce((acc: string[], yourSquad) => {
        const isCounter = opponentSquadData.counteredBy?.some(
          (squadName) => squadName === yourSquad.name
        );

        if (isCounter) {
          return [...acc, yourSquad.name];
        }

        return acc;
      }, []);

      return {
        ...currentSquad,
        fieldedCounters,
        tier: opponentSquadData.tier || 0,
        counters: opponentSquadData.counters,
        counteredBy: opponentSquadData.counteredBy,
      };
    })
    // Sort opponent army by number of counters the units have in your army (less is better), resolve tie by tier
    .sort((squadA, squadB) => {
      const squadACountersCount = squadA.fieldedCounters.length;
      const squadBCountersCount = squadB.fieldedCounters.length;

      if (squadACountersCount === squadBCountersCount) {
        return squadA.tier - squadB.tier;
      }

      return squadACountersCount - squadBCountersCount;
    });

  // For the first three units with the least counters
  const possibleSuggestions = unitsToCounter
    .slice(0, 3)
    // Find units currently not on the field that counter them to get list of possible suggestions
    .reduce((counters: string[], squadToCounter) => {
      const remainingCounters =
        squadToCounter.counteredBy
          ?.filter((squad) => !squadToCounter.fieldedCounters.includes(squad))
          .filter((squad) => !counters.includes(squad)) || [];

      return [...counters, ...remainingCounters];
    }, []);

  // For list of possible suggestions
  const sortedSuggestions = [...possibleSuggestions].sort(
    (suggestionA, suggestionB) => {
      // Sort by number of counters in opponents army (less is better), resolve tie by tier
      const suggestionAData = squadsData.squads.find(
        (squad) => squad.text === suggestionA
      );
      const suggestionBData = squadsData.squads.find(
        (squad) => squad.text === suggestionB
      );

      const suggestionACounters = opponentArmy.reduce(
        (acc: string[], oppSquad) => {
          const isCountered = suggestionAData?.counteredBy?.some(
            (squadName) => squadName === oppSquad.name
          );

          if (isCountered) {
            return [...acc, oppSquad.name];
          }

          return acc;
        },
        []
      );

      const suggestionBCounters = opponentArmy.reduce(
        (acc: string[], oppSquad) => {
          const isCountered = suggestionBData?.counteredBy?.some(
            (squadName) => squadName === oppSquad.name
          );

          if (isCountered) {
            return [...acc, oppSquad.name];
          }

          return acc;
        },
        []
      );

      const suggestionACountersCount = suggestionACounters.length;
      const suggestionBCountersCount = suggestionBCounters.length;

      if (suggestionACountersCount === suggestionBCountersCount) {
        return (suggestionAData?.tier || 0) - (suggestionBData?.tier || 0);
      }

      return suggestionACounters.length - suggestionBCounters.length;
    }
  );

  // Return unit suggestions
  return sortedSuggestions;

  // TODO
  // Add squad price and count to equation
};
