"use client";

import { useEffect, useState } from "react";
import { getSquadSuggestions } from "../lib/squadSuggestions";

import SquadComponent from "../components/Squad";
import SquadSuggestions from "../components/SquadSuggestions";

import styles from "../styles/Home.module.css";

import type { Squad, SquadSuggestion } from "../types/Squad";

export default function Home() {
  const [opponentArmy, setOpponentArmy] = useState<Squad[]>([]);
  const [yourArmy, setYourArmy] = useState<Squad[]>([]);
  const [squadSuggestions, setSquadSuggestions] = useState<SquadSuggestion[]>(
    []
  );

  const onOpponentArmyChange = (army: Squad[]) => {
    setOpponentArmy(army);
  };

  const onYourArmyChange = (army: Squad[]) => {
    setYourArmy(army);
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
          squadName="Opponent's Army"
        />
        <SquadComponent onChange={onYourArmyChange} squadName="Your Army" />
        <SquadSuggestions suggestions={squadSuggestions} />
      </>
    </main>
  );
}
