"use client";

import { useState } from "react";

import { MinusIcon, PlusIcon } from "../icons";
import styles from "./AddSquads.module.css";
import squadsData from "../../fixtures/squads.json";

import type { Squad } from "../../types/Squad";

interface Props {
  onAdd: (squads: Squad[]) => void;
  onCancel: () => void;
  title: string;
}

const INITIAL_SQUADS = squadsData.squads
  .sort((squadA, squadB) => {
    return (squadA?.tier || 0) - (squadB.tier || 0);
  })
  .map((squad) => {
    return {
      count: 0,
      name: squad.text,
    };
  });

const AddSquads = (props: Props) => {
  const [selectedSquads, setSelectedSquads] = useState<Squad[]>(INITIAL_SQUADS);

  const onDecrement = (squadText: string) => {
    const newSelectedSquads = selectedSquads.map((squad) => {
      let newCount = squad.count - 1;
      if (newCount < 0) {
        newCount = 0;
      }

      if (squad.name === squadText) {
        return {
          count: newCount,
          name: squadText,
        };
      }
      return squad;
    });

    setSelectedSquads(newSelectedSquads);
  };

  const onIncrement = (squadText: string) => {
    const newSelectedSquads = selectedSquads.map((squad) => {
      if (squad.name == squadText) {
        return {
          count: squad.count + 1,
          name: squadText,
        };
      }

      return { ...squad };
    });

    setSelectedSquads(newSelectedSquads);
  };

  const handleAddSquads = () => {
    const newSquads = selectedSquads.filter((squad) => squad.count > 0);

    props.onAdd(newSquads);
  };

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>{props.title}</h1>
      <ul className={styles.listContainer}>
        {selectedSquads.map((squad) => {
          return (
            <li
              className={styles.squad}
              key={`${props.title}-${squad.name}-li`}
            >
              <div className={styles.squadName}>{squad.name}</div>
              {squad.count ? (
                <div className={styles.squadCount}>{squad.count}</div>
              ) : null}
              <button
                className={styles.squadButton}
                disabled={!squad.count}
                onClick={() => onDecrement(squad.name)}
              >
                <MinusIcon />
              </button>
              <button
                className={styles.squadButton}
                onClick={() => onIncrement(squad.name)}
              >
                <PlusIcon />
              </button>
            </li>
          );
        })}
      </ul>
      <div className={styles.buttonsContainer}>
        <button className={styles.mainButton} onClick={props.onCancel}>
          Close Without Adding
        </button>
        <button className={styles.mainButton} onClick={handleAddSquads}>
          Add Squads
        </button>
      </div>
    </section>
  );
};

export default AddSquads;
