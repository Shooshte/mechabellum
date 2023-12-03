"use client";

import { useState } from "react";

import styles from "../../styles/AddSquads.module.css";
import squadsData from "../../fixtures/squads.json";

import type { Squad } from "../../types/Squad";

interface Props {
  onAdd: (squads: Squad[]) => void;
  onCancel: () => void;
  title: string;
}

interface SelectedSquad {
  count: number;
  text: string;
}

const INITIAL_SQUADS = squadsData.squads.map((squad) => {
  return {
    count: 0,
    text: squad.text,
  };
});

const AddSquads = (props: Props) => {
  const [selectedSquads, setSelectedSquads] =
    useState<SelectedSquad[]>(INITIAL_SQUADS);

  const onDecrement = (squadText: string) => {
    const newSelectedSquads = selectedSquads.map((squad) => {
      let newCount = squad.count - 1;
      if (newCount < 0) {
        newCount = 0;
      }

      if (squad.text === squadText) {
        return {
          count: newCount,
          text: squadText,
        };
      }
      return squad;
    });

    setSelectedSquads(newSelectedSquads);
  };

  const onIncrement = (squadText: string) => {
    const newSelectedSquads = selectedSquads.map((squad) => {
      if (squad.text == squadText) {
        return {
          count: squad.count + 1,
          text: squadText,
        };
      }

      return { ...squad };
    });

    setSelectedSquads(newSelectedSquads);
  };

  return (
    <section className={styles.container}>
      <h1>{props.title}</h1>
      <ul className={styles.listContainer}>
        {selectedSquads.map((squad) => {
          return (
            <li
              className={styles.squad}
              key={`${props.title}-${squad.text}-li`}
            >
              <div>{squad.text}</div>
              <div>{squad.count ? squad.count : null}</div>
              <button onClick={() => onDecrement(squad.text)}>-</button>
              <button onClick={() => onIncrement(squad.text)}>+</button>
            </li>
          );
        })}
      </ul>
      <div className={styles.buttonsContainer}>
        <button className={styles.mainButton}>Close Without Adding</button>
        <button className={styles.mainButton}>Add Squads</button>
      </div>
    </section>
  );
};

export default AddSquads;
