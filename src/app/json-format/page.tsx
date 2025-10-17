"use client";

import { useState } from "react";
import { Button, Input, Typography, message } from "antd";
import styles from "./styles.module.css";

const { Title } = Typography;
const { TextArea } = Input;

export default function HelloPage() {
  const [inputJson, setInputJson] = useState("");
  const [formattedJson, setFormattedJson] = useState("");

  const handleFormat = () => {
    try {
      const parsedJson = JSON.parse(inputJson);
      const prettyJson = JSON.stringify(parsedJson, null, 2);
      setFormattedJson(prettyJson);
      message.success("JSON formatted successfully!");
    } catch (error) {
      message.error("Invalid JSON format. Please check your input.");
    }
  };

  return (
    <div className={styles.container}>
      <Title level={2}>JSON Formatter</Title>
      <div className={styles.inputContainer}>
        <TextArea
          rows={10}
          value={inputJson}
          onChange={(e) => setInputJson(e.target.value)}
          placeholder="Paste your unformatted JSON here"
          className={styles.textArea}
        />
        <Button
          type="primary"
          size="large"
          onClick={handleFormat}
          className={styles.formatButton}
        >
          Format JSON
        </Button>
        <TextArea
          rows={10}
          value={formattedJson}
          readOnly
          placeholder="Formatted JSON will appear here"
          className={styles.textArea}
        />
      </div>
    </div>
  );
}
