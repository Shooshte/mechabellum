"use client";

import { useState } from "react";
import { usePostHog } from "posthog-js/react";

import Image from "next/image";
import { MinusIcon, PlusIcon } from "../icons";
import styles from "./AddSquads.module.css";
import squadsData from "../../fixtures/squads.json";

import type { Squad } from "../../types/Squad";

interface Props {
  onAdd: (squads: Squad[]) => void;
  onCancel: () => void;
  title: string;
}

const POSTHOG_COMPONENT_NAME = "AddSquads";

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
  const posthog = usePostHog();

  const [selectedSquads, setSelectedSquads] = useState<Squad[]>(INITIAL_SQUADS);

  const onDecrement = (squadName: string) => {
    const newSelectedSquads = selectedSquads.map((squad) => {
      let newCount = squad.count - 1;
      if (newCount < 0) {
        newCount = 0;
      }

      if (squad.name === squadName) {
        return {
          count: newCount,
          name: squadName,
        };
      }
      return squad;
    });

    setSelectedSquads(newSelectedSquads);

    posthog.capture("squad_decrement_click", {
      component: POSTHOG_COMPONENT_NAME,
      squadName: squadName,
    });
  };

  const onIncrement = (squadName: string) => {
    const newSelectedSquads = selectedSquads.map((squad) => {
      if (squad.name == squadName) {
        return {
          count: squad.count + 1,
          name: squadName,
        };
      }

      return { ...squad };
    });

    setSelectedSquads(newSelectedSquads);

    posthog.capture("squad_increment_click", {
      component: POSTHOG_COMPONENT_NAME,
      squadName: squadName,
    });
  };

  const handleAddSquads = () => {
    const newSquads = selectedSquads.filter((squad) => squad.count > 0);

    props.onAdd(newSquads);

    posthog.capture("add_squads_click", {
      component: POSTHOG_COMPONENT_NAME,
    });
  };

  const handleCancel = () => {
    props.onCancel();

    posthog.capture("close_without_adding_click", {
      component: POSTHOG_COMPONENT_NAME,
    });
  };

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>{props.title}</h1>
      <ul className={styles.listContainer}>
        {selectedSquads.map((squad) => {
          const imageSrc = `/images/squadsMenu/${squad.name.replace(
            " ",
            "_"
          )}.png`;

          return (
            <li
              className={styles.squad}
              key={`${props.title}-${squad.name}-li`}
            >
              <div className={styles.squadImage}>
                <Image
                  alt={squad.name}
                  fill
                  src={imageSrc}
                  style={{
                    objectFit: "cover",
                  }}
                />
              </div>
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
        <button className={styles.mainButton} onClick={handleCancel}>
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
