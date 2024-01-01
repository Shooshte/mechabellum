import Image from "next/image";
import { useState } from "react";
import { MinusIcon, PlusIcon, TrashIcon } from "../../icons";

import styles from "./SquadButton.module.css";

import type { Squad } from "../../../types/Squad";

interface Props {
  onDecrement: () => void;
  onIncrement: () => void;
  squad: Squad;
}

const SquadButton = ({ onDecrement, onIncrement, squad }: Props) => {
  const imageSrc = `/images/squads/${squad.name.replace(" ", "_")}.png`;
  const fallBackSrc = `/images/squads/error.png`;

  const [src, setSrc] = useState(imageSrc);

  return (
    <div className={styles.container}>
      <div className={styles.countBadge}>{squad.count}</div>
      <div className={styles.nameContainer}>
        <div className={styles.name}>{squad.name}</div>
      </div>
      <Image
        alt={squad.name}
        className={styles.image}
        fill
        objectFit="contain"
        objectPosition="left top"
        onError={() => setSrc(fallBackSrc)}
        src={src}
      />
      <div className={styles.controls}>
        <button className={styles.button} onClick={onDecrement}>
          {squad.count === 1 ? <TrashIcon /> : <MinusIcon />}
        </button>
        <button className={styles.button} onClick={onIncrement}>
          <PlusIcon />
        </button>
      </div>
    </div>
  );
};

export default SquadButton;
