import squadsData from "../fixtures/squads.json";
import type { Squad, SquadSuggestion } from "../types/Squad";

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
}: Args): SquadSuggestion[] => {
  const sortedOpponentsArmy = [...opponentArmy].sort((unitA, unitB) => {
    const unitAData = parseSquadData(unitA.name);
    const unitBData = parseSquadData(unitB.name);

    const aValue = unitA.count * unitAData.stats.price;
    const bValue = unitB.count * unitBData.stats.price;

    return bValue - aValue;
  });

  let availableFieldedUnits = [...yourArmy];

  const unitsToCounter = sortedOpponentsArmy
    .map((squad) => {
      const squadData = parseSquadData(squad.name);

      let neededCounterValue = squad.count * squadData.stats.price;

      const counterPriority = availableFieldedUnits.reduce(
        (acc: number, fieldedSquad) => {
          if (acc <= 0) {
            return 0;
          }

          const isCounter = squadData.counteredBy.some(
            (squadName) => squadName === fieldedSquad.name
          );
          if (isCounter) {
            const fieldedSquadData = parseSquadData(fieldedSquad.name);
            const counterValue =
              fieldedSquad.count * fieldedSquadData.stats.price;

            // if curent counter value is less than opp unit, all available are countering
            // if current counter value is equal opp unit, all available units are countering
            if (acc >= counterValue) {
              availableFieldedUnits = availableFieldedUnits.filter(
                (unit) => unit.name !== fieldedSquad.name
              );
            }

            // if current counter value is more than opp unit, calculate how many are left after countering
            if (acc < counterValue) {
              const neededUnits = Math.ceil(acc / fieldedSquadData.stats.price);
              availableFieldedUnits = availableFieldedUnits.map((unit) => {
                if (unit.name === fieldedSquad.name) {
                  return {
                    count: unit.count - neededUnits,
                    name: unit.name,
                  };
                }
                return {
                  ...unit,
                };
              });
            }

            return acc - counterValue;
          }

          return acc;
        },
        neededCounterValue
      );

      return { ...squad, counterPriority };
    })
    .filter((squad) => squad.counterPriority > 0);

  const possibleSuggestions = unitsToCounter
    .reduce(
      (
        counters: {
          count: number;
          countering: {
            counterPriority: number;
            count: number;
            name: string;
          };
          counterPriority: number;
          name: string;
        }[],
        squadToCounter
      ) => {
        // Find units that counter them
        const squadToCounterData = parseSquadData(squadToCounter.name);
        const possibleCounters = squadToCounterData.counteredBy
          .map((possibleCounter) => {
            const possibleCounterData = parseSquadData(possibleCounter);

            const neededCount =
              squadToCounter.counterPriority / possibleCounterData.stats.price;

            const counteredCount = Math.ceil(
              squadToCounter.counterPriority / squadToCounterData.stats.price
            );

            const roundedNeededCount = Math.ceil(neededCount);

            // Check how much they are countered by opponent
            const counterPriority = getCounterPriority({
              squad: { count: roundedNeededCount, name: possibleCounter },
              opponentArmy,
            });

            return {
              count: roundedNeededCount,
              countering: {
                count: counteredCount,
                counterPriority: squadToCounter.counterPriority,
                name: squadToCounter.name,
              },
              counterPriority,
              name: possibleCounter,
            };
          })
          // Find the least countered unit
          .sort((squadA, squadB) => {
            if (squadB.counterPriority === squadA.counterPriority) {
              // resolve tie with units that are already fielded
              const isAFielded = yourArmy.some(
                (squad) => squad.name === squadA.name
              );
              const isBFielded = yourArmy.some(
                (squad) => squad.name === squadB.name
              );

              if (isAFielded === isBFielded) {
                // resolve with unit tier
                const squadAData = parseSquadData(squadA.name);
                const squadBData = parseSquadData(squadB.name);

                return squadAData.tier - squadBData.tier;
              }

              if (isAFielded) {
                return -1;
              }
            }

            return squadB.counterPriority - squadA.counterPriority;
          });

        return [...counters, ...possibleCounters];
      },
      []
    )
    .sort((suggestionA, suggestionB) => {
      return suggestionB.counterPriority - suggestionA.counterPriority;
    });

  const suggestions = possibleSuggestions.slice(0, 3).map((suggestion) => {
    return {
      name: suggestion.name,
      count: suggestion.count,
      countering: suggestion.countering,
    };
  });

  // Return unit suggestions
  return suggestions;
};
