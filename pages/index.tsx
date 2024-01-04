"use client";

import { useEffect, useMemo, useState } from "react";
import { usePostHog } from "posthog-js/react";
import { getSquadSuggestions } from "../lib/squadSuggestions";

import SquadComponent from "../components/Squad";
import SquadSuggestions from "../components/SquadSuggestions";

import styles from "../styles/Home.module.css";

import type { Squad, SquadSuggestion } from "../types/Squad";

export default function Home() {
  const posthog = usePostHog();

  const [opponentArmy, setOpponentArmy] = useState<Squad[]>([]);
  const [yourArmy, setYourArmy] = useState<Squad[]>([]);
  const [squadSuggestions, setSquadSuggestions] = useState<SquadSuggestion[]>(
    []
  );

  const canClearSquads = useMemo(() => {
    return opponentArmy.length > 0 || yourArmy.length > 0;
  }, [opponentArmy, yourArmy]);

  const onOpponentArmyChange = (army: Squad[]) => {
    setOpponentArmy(army);
  };

  const onYourArmyChange = (army: Squad[]) => {
    setYourArmy(army);
  };

  const onClearSquads = () => {
    posthog.capture("clear_squads_click");

    setOpponentArmy([]);
    setYourArmy([]);
    setSquadSuggestions([]);
  };

  useEffect(() => {
    const suggestions = getSquadSuggestions({ opponentArmy, yourArmy });

    setSquadSuggestions(suggestions);
  }, [opponentArmy, yourArmy]);

  return (
    <main className={styles.container}>
      <>
        <SquadComponent
          onChange={onOpponentArmyChange}
          armyName="Opponent's Army"
          squads={opponentArmy}
        />
        <SquadComponent
          onChange={onYourArmyChange}
          armyName="Your Army"
          squads={yourArmy}
        />
        <SquadSuggestions suggestions={squadSuggestions} />
        <button
          className={styles.clearSquadsButton}
          disabled={!canClearSquads}
          onClick={onClearSquads}
        >
          Clear squads
        </button>
      </>
    </main>
  );
}
