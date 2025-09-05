"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { increment, decrement, reset } from "@/store/counterSlice";
import styles from "./Counter.module.css";

export default function Counter() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Counter Component</h2>
      <p className={styles.count}>{count}</p>
      <div className={styles.buttons}>
        <button
          className={`${styles.button} ${styles.increment}`}
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <button
          className={`${styles.button} ${styles.decrement}`}
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
        <button
          className={`${styles.button} ${styles.reset}`}
          onClick={() => dispatch(reset())}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
