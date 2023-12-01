import AddSquadButton from "../components/AddSquadButton";
import SquadPlaceholder from "../components/SquadPlaceholder";

import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <main className={styles.container}>
      <section className={styles.section}>
        <h1 className={styles.sectionHeading}>Opponent's Army</h1>
        <div className={styles.squadContainer}>
          <AddSquadButton onClick={() => {}} />
          <SquadPlaceholder />
          <SquadPlaceholder />
          <SquadPlaceholder />
          <SquadPlaceholder />
          <SquadPlaceholder />
          <SquadPlaceholder />
          <SquadPlaceholder />
        </div>
      </section>
      <section className={styles.section}>
        <h1 className={styles.sectionHeading}>Your Army</h1>
        <div className={styles.squadContainer}>
          <AddSquadButton onClick={() => {}} />
          <SquadPlaceholder />
          <SquadPlaceholder />
          <SquadPlaceholder />
          <SquadPlaceholder />
          <SquadPlaceholder />
          <SquadPlaceholder />
          <SquadPlaceholder />
        </div>
      </section>
      <section className={styles.section}>
        <h1 className={styles.sectionHeading}>Squad Suggestions</h1>
        <p className={styles.notification}>
          Please add army squads in order to get suggestions on how to improve
          your army.
        </p>
      </section>
    </main>
  );
}
