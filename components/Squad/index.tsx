"use client";

import { useEffect, useState } from "react";

import AddSquadButton from "../AddSquadButton";
import AddSquads from "../AddSquads";
import SquadPlaceholder from "../SquadPlaceholder";

import styles from "../../styles/Home.module.css";

import type { Squad } from "../../types/Squad";

interface Props {
  onChange: (squads: Squad[]) => void;
  squadName: string;
}

type SquadState = (Squad | "placeholder")[];

const MIN_SQUADS_DISPLAYED = 7;

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

  const handleAddSquads = (newSquads: Squad[]) => {
    setSquads(newSquads);
    onChange(newSquads);
    handleMenuClose();
  };

  const handleMenuClose = () => {
    setShowMenu(false);
  };

  const handleAddSquadClick = () => {
    setShowMenu(true);
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

          // TODO: add displaying squad info here
          return <></>;
        })}
      </div>
    </section>
  );
};

export default Squad;
