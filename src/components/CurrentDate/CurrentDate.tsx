import styles from "./CurrentDate.module.scss";

export default function CurrentDate() {
  const now = new Date();
  const dateString = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return <div className={styles.date}>{dateString}</div>;
}

