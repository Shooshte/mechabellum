"use client";

import { useEffect, useMemo, useState } from "react";
import { getSquadSuggestions } from "../lib/squadSuggestions";

import SquadComponent from "../components/Squad";
import styles from "../styles/Home.module.css";

import type { Squad } from "../types/Squad";

export default function Home() {
  const [opponentArmy, setOpponentArmy] = useState<Squad[]>([]);
  const [yourArmy, setYourArmy] = useState<Squad[]>([]);
  const [squadSuggestions, setSquadSuggestions] = useState<Squad[]>([]);

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

  const showSuggestions = useMemo(() => {
    return squadSuggestions.length > 0;
  }, [squadSuggestions]);

  return (
    <main className={styles.container}>
      <>
        <SquadComponent
          onChange={onOpponentArmyChange}
          squadName="Opponent's Army"
        />
        <SquadComponent onChange={onYourArmyChange} squadName="Your Army" />
        <section className={styles.section}>
          <h1 className={styles.sectionHeading}>Squad Suggestions</h1>
          {showSuggestions ? (
            <ul>
              {squadSuggestions.map((squadSuggestion) => (
                <li
                  key={squadSuggestion.name}
                >{`${squadSuggestion.count} ${squadSuggestion.name}`}</li>
              ))}
            </ul>
          ) : (
            <p className={styles.notification}>No suggestions to show</p>
          )}
        </section>
      </>
    </main>
  );
}
