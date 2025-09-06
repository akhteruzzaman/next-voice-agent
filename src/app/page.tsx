/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./page.module.css";

interface Message {
  role: "user" | "agent";
  text: string;
}

export default function Home() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const recognitionRef = useRef<any>(null);

  const DEEPSEEK_API_KEY = "sk-2f62e2bb08ea45af91999c0a5ca3ce31"; // 🔑 Replace with your key
  const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions"; // Chat endpoint

  // Initialize SpeechRecognition
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

    recognition.onend = () => {
      // When speech ends, send transcript to DeepSeek chat
      if (transcript.trim() !== "") {
        sendMessage(transcript);
      }
      setListening(false);
      setTranscript("");
    };

    recognitionRef.current = recognition;
  }, [transcript]);

  // Toggle microphone
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

  // Send user message to DeepSeek
  const sendMessage = async (text: string) => {
    const userMessage: Message = { role: "user", text };
    setChat((prev) => [...prev, userMessage]);

    try {
      const response = await axios.post(
        DEEPSEEK_URL,
        {
          model: "deepseek-chat",
          messages: [
            { role: "user", content: text } // user voice message
          ],
          stream: false
        },
        {
          headers: {
            Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const agentText = response.data?.choices?.[0]?.message?.content || "No response";
      const agentMessage: Message = { role: "agent", text: agentText };
      setChat((prev) => [...prev, agentMessage]);
    } catch (err) {
      console.error("DeepSeek API error:", err);
      const agentMessage: Message = { role: "agent", text: "Error: could not get response" };
      setChat((prev) => [...prev, agentMessage]);
    }
  };

  const clearChat = () => setChat([]);

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Voice Chat with DeepSeek</h1>
      <p className={styles.subtitle}>
        Click the microphone and start speaking. DeepSeek will reply as a chat.
      </p>

      <button
        className={styles.micButton}
        onClick={toggleListening}
        style={{ backgroundColor: listening ? "#16a34a" : "#ef4444" }}
      >
        🎤
      </button>

      {/* Chat Window */}
      <div
        className={styles.textArea}
        style={{ height: "300px", overflowY: "auto", padding: "1rem" }}
      >
        {chat.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.role === "user" ? "right" : "left",
              margin: "8px 0",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: "12px",
                backgroundColor: msg.role === "user" ? "#3b82f6" : "#e5e7eb",
                color: msg.role === "user" ? "white" : "black",
                maxWidth: "70%",
                wordWrap: "break-word",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        <button className={styles.controlButton} onClick={clearChat}>
          Clear Chat
        </button>
      </div>
    </main>
  );
}
