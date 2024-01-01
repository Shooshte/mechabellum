import { useMemo } from "react";
import styles from "./SquadSuggestions.module.css";
import type { SquadSuggestion } from "../../types/Squad";

interface Props {
  suggestions: SquadSuggestion[];
}

const SquadSuggestions = ({ suggestions }: Props) => {
  const showSuggestions = useMemo(() => {
    return suggestions.length > 0;
  }, [suggestions]);

  return (
    <section className={styles.container}>
      <h1>Squad Suggestions</h1>
      {showSuggestions ? (
        <ul className={styles.list}>
          {suggestions.map((squadSuggestion) => (
            <li key={squadSuggestion.name}>
              <span className={styles.suggestion}>
                {`${squadSuggestion.count} x ${squadSuggestion.name}`}
              </span>
              <span>
                {` to counter: ${squadSuggestion.countering.count} x ${squadSuggestion.countering.name}`}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.notification}>No suggestions to show.</p>
      )}
    </section>
  );
};

export default SquadSuggestions;
