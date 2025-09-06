/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null); // ✅ ref for SpeechRecognition

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
    };

    recognitionRef.current = recognition;
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const clearTranscript = () => {
    setTranscript("");
  };

  const copyTranscript = () => {
    navigator.clipboard.writeText(transcript);
    alert("Copied to clipboard!");
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Voice to Text Agent</h1>
      <p className={styles.subtitle}>
        Click the microphone and start speaking.
      </p>

      <button
        className={styles.micButton}
        onClick={toggleListening}
        style={{ backgroundColor: listening ? "#16a34a" : "#ef4444" }}
      >
        🎤
      </button>

      <textarea
        className={styles.textArea}
        placeholder="Your speech will appear here..."
        value={transcript}
        readOnly
      />

      <div className={styles.controls}>
        <button className={styles.controlButton} onClick={clearTranscript}>
          Clear
        </button>
        <button className={styles.controlButton} onClick={copyTranscript}>
          Copy
        </button>
      </div>
    </main>
  );
}
