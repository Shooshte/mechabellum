import Image from "next/image";

import styles from "./AddSquadButton.module.css";

interface Props {
  onClick: () => void;
}

const AddSquadButton = ({ onClick }: Props) => {
  const handleAddClick = () => {
    onClick();
  };

  return (
    <button className={styles.button} onClick={handleAddClick}>
      <Image
        alt="plus sign"
        className={styles.plusSign}
        height={21.5}
        src="/svg/add.svg"
        width={21.5}
      />
      Add New Squads
    </button>
  );
};

export default AddSquadButton;
