"use client";

import { useState } from "react";
import { usePostHog } from "posthog-js/react";

import AddSquadButton from "../AddSquadButton";
import AddSquads from "../AddSquads";
import SquadButton from "./SquadButton";

import styles from "../../styles/Home.module.css";

import type { Squad } from "../../types/Squad";

interface Props {
  onChange: (squads: Squad[]) => void;
  armyName: string;
  squads: Squad[];
}

const POSTHOG_COMPONENT_NAME = "Squad";

const SquadComponent = ({ onChange, armyName, squads }: Props) => {
  const posthog = usePostHog();

  const [showMenu, setShowMenu] = useState(false);

  const handleAddSquads = (addedSquads: Squad[]) => {
    const updatedCurrentSquads = squads.reduce((acc: Squad[], currentSquad) => {
      const addedSquad = addedSquads.find(
        (addedSquad) => addedSquad.name === currentSquad.name
      );

      if (addedSquad) {
        const newCount = currentSquad.count + addedSquad.count;

        return [
          ...acc,
          {
            count: newCount,
            name: currentSquad.name,
          },
        ];
      }

      return [...acc, currentSquad];
    }, []);

    const newSquads = addedSquads.filter(
      (addedSquad) => !squads.some((squad) => squad.name === addedSquad.name)
    );

    const finalSquads: Squad[] = [...updatedCurrentSquads, ...newSquads];
    onChange(finalSquads);
    handleMenuClose();
  };

  const handleMenuClose = () => {
    setShowMenu(false);
  };

  const handleAddSquadClick = () => {
    setShowMenu(true);

    posthog.capture("add_new_squads_click", {
      component: POSTHOG_COMPONENT_NAME,
      armyName,
    });
  };

  const onDecrement = (squadName: string) => {
    const newSquads = squads
      .map((squad) => {
        if (squad.name === squadName) {
          const newCount = squad.count - 1;

          return {
            count: newCount,
            name: squadName,
          };
        }
        return squad;
      })
      .filter((squad) => squad.count > 0);

    onChange(newSquads);

    posthog.capture("squad_decrement_click", {
      component: POSTHOG_COMPONENT_NAME,
      armyName,
      squadName,
    });
  };

  const onIncrement = (squadName: string) => {
    const newSelectedSquads = squads.map((squad) => {
      if (squad.name == squadName) {
        return {
          count: squad.count + 1,
          name: squadName,
        };
      }

      return { ...squad };
    });

    onChange(newSelectedSquads);

    posthog.capture("squad_increment_click", {
      component: POSTHOG_COMPONENT_NAME,
      armyName,
      squadName,
    });
  };

  return (
    <>
      {showMenu && (
        <AddSquads
          onAdd={handleAddSquads}
          onCancel={handleMenuClose}
          title={`Adding Squads To ${armyName}`}
        />
      )}
      <section className={styles.squadSection}>
        <h1 className={styles.sectionHeading}>{armyName}</h1>
        <div className={styles.squadContainer}>
          <AddSquadButton onClick={handleAddSquadClick} />
          {squads.map((squad) => {
            return (
              <SquadButton
                key={squad.name}
                onDecrement={() => onDecrement(squad.name)}
                onIncrement={() => onIncrement(squad.name)}
                squad={squad}
              />
            );
          })}
        </div>
      </section>
    </>
  );
};

export default SquadComponent;
