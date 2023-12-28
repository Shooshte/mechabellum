"use client";

import { useEffect, useState } from "react";

import AddSquadButton from "../AddSquadButton";
import AddSquads from "../AddSquads";
import SquadButton from "./SquadButton";
import SquadPlaceholder from "../SquadPlaceholder";

import styles from "../../styles/Home.module.css";

import type { Squad } from "../../types/Squad";

interface Props {
  onChange: (squads: Squad[]) => void;
  squadName: string;
}

type SquadState = (Squad | "placeholder")[];

const MIN_SQUADS_DISPLAYED = 5;

const Squad = ({ onChange, squadName }: Props) => {
  const [squads, setSquads] = useState<SquadState>([]);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const newSquad = [...squads];

    while (newSquad.length < MIN_SQUADS_DISPLAYED) {
      newSquad.push("placeholder");
    }

    setSquads(newSquad);
  }, []);

  const handleAddSquads = (addedSquads: Squad[]) => {
    // @ts-ignore
    const currentSquads: Squad[] = squads.filter(
      (squad) => squad !== "placeholder"
    );

    const updatedCurrentSquads = currentSquads.reduce(
      (acc: Squad[], currentSquad) => {
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
      },
      []
    );

    const newSquads = addedSquads.filter(
      (addedSquad) =>
        !currentSquads.some((squad) => squad.name === addedSquad.name)
    );

    const finalSquads: Squad[] = [...updatedCurrentSquads, ...newSquads];
    onChange(finalSquads);

    const displayedSquads: SquadState = [...finalSquads];

    while (displayedSquads.length < MIN_SQUADS_DISPLAYED) {
      displayedSquads.push("placeholder");
    }

    setSquads(finalSquads);
    handleMenuClose();
  };

  const handleMenuClose = () => {
    setShowMenu(false);
  };

  const handleAddSquadClick = () => {
    setShowMenu(true);
  };

  const onDecrement = (squadText: string) => {
    const newSquads = squads
      .map((squad) => {
        if (squad === "placeholder") {
          return squad;
        }

        if (squad.name === squadText) {
          const newCount = squad.count - 1;

          return {
            count: newCount,
            name: squadText,
          };
        }
        return squad;
      })
      .filter((squad) => squad === "placeholder" || squad.count > 0);

    while (newSquads.length < MIN_SQUADS_DISPLAYED) {
      newSquads.push("placeholder");
    }

    setSquads(newSquads);
  };

  const onIncrement = (squadText: string) => {
    const newSelectedSquads = squads.map((squad) => {
      if (squad === "placeholder") {
        return squad;
      }

      if (squad.name == squadText) {
        return {
          count: squad.count + 1,
          name: squadText,
        };
      }

      return { ...squad };
    });

    setSquads(newSelectedSquads);
  };

  return showMenu ? (
    <AddSquads
      onAdd={handleAddSquads}
      onCancel={handleMenuClose}
      title={`Adding Squads To ${squadName}`}
    />
  ) : (
    <section className={styles.squadSection}>
      <h1 className={styles.sectionHeading}>{squadName}</h1>
      <div className={styles.squadContainer}>
        <AddSquadButton onClick={handleAddSquadClick} />
        {squads.map((squad, index) => {
          if (squad === "placeholder") {
            return (
              <SquadPlaceholder key={`${squadName}-placeholder-${index}`} />
            );
          }

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
  );
};

export default Squad;
