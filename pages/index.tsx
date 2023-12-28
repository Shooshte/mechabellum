"use client";

import SquadComponent from "../components/Squad";

import styles from "../styles/Home.module.css";

import type { Squad } from "../types/Squad";

export default function Home() {
  const onAdd = (squads: Squad[]) => {};

  return (
    <main className={styles.container}>
      <>
        <SquadComponent onChange={onAdd} squadName="Opponent's Army" />
        <SquadComponent onChange={onAdd} squadName="Your Army" />
        <section className={styles.section}>
          <h1 className={styles.sectionHeading}>Squad Suggestions</h1>
          <p className={styles.notification}>WIP</p>
        </section>
      </>
    </main>
  );
}
