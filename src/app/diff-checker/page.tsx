"use client";

import { useState } from "react";
import { Button, Input, Typography, Space, Alert, message } from "antd";
import * as Diff from "diff"; // นำเข้า diff library
import styles from "./styles.module.css";

const { Title } = Typography;
const { TextArea } = Input;

interface DiffResult {
  left: string;
  right: string;
  isAdded?: boolean;
  isRemoved?: boolean;
  isChanged?: boolean;
}

export default function DiffCheckerPage() {
  const [leftText, setLeftText] = useState("");
  const [rightText, setRightText] = useState("");
  const [diffResult, setDiffResult] = useState<DiffResult[]>([]);
  const [showDiff, setShowDiff] = useState(false);
  const [viewMode, setViewMode] = useState<"side" | "inline">("side"); // side-by-side หรือ inline

  const handleCompare = () => {
    if (!leftText && !rightText) {
      message.warning("Please enter text in both fields.");
      return;
    }

    try {
      const diff = Diff.diffLines(leftText, rightText);
      const result: DiffResult[] = diff.map((part) => ({
        left: part.value,
        right: part.value,
        isAdded: part.added,
        isRemoved: part.removed,
        isChanged:
          !part.added && !part.removed && part.originalNo && part.newNo, // สำหรับ unchanged
      }));
      setDiffResult(result);
      setShowDiff(true);
      message.success("Diff calculated successfully!");
    } catch (error) {
      message.error("Error calculating diff.");
    }
  };

  const handleClear = () => {
    setLeftText("");
    setRightText("");
    setDiffResult([]);
    setShowDiff(false);
  };

  const handleCopy = (side: "left" | "right") => {
    const text = side === "left" ? leftText : rightText;
    navigator.clipboard
      .writeText(text)
      .then(() => message.success("Copied to clipboard!"));
  };

  const handleDownload = (side: "left" | "right") => {
    const text = side === "left" ? leftText : rightText;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `diff-${side}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderDiffLine = (line: DiffResult, index: number) => {
    const className =
      styles.diffLine +
      (line.isAdded ? ` ${styles.added}` : "") +
      (line.isRemoved ? ` ${styles.removed}` : "") +
      (line.isChanged ? ` ${styles.changed}` : "");

    if (viewMode === "side") {
      return (
        <div key={index} className={className}>
          <pre className={styles.diffLeft}>{line.left}</pre>
          <pre className={styles.diffRight}>{line.right}</pre>
        </div>
      );
    } else {
      // Inline mode: แสดง diff แบบรวม
      return (
        <div key={index} className={className}>
          <pre>
            {line.isRemoved ? "-" : ""}
            {line.isAdded ? "+" : ""} {line.left || line.right}
          </pre>
        </div>
      );
    }
  };

  return (
    <div className={styles.container}>
      <Title level={1}>Text Diff Checker</Title>
      <p className={styles.instruction}>
        Compare two texts and find the differences, just like Diffchecker.
      </p>

      <div className={styles.inputSection}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div className={styles.inputGroup}>
            <Title level={4}>Original Text (Left)</Title>
            <TextArea
              rows={10}
              value={leftText}
              onChange={(e) => setLeftText(e.target.value)}
              placeholder="Paste your original text here..."
              className={styles.textArea}
            />
            <Space>
              <Button onClick={() => handleCopy("left")}>Copy</Button>
              <Button onClick={() => handleDownload("left")}>Download</Button>
            </Space>
          </div>

          <div className={styles.inputGroup}>
            <Title level={4}>Modified Text (Right)</Title>
            <TextArea
              rows={10}
              value={rightText}
              onChange={(e) => setRightText(e.target.value)}
              placeholder="Paste your modified text here..."
              className={styles.textArea}
            />
            <Space>
              <Button onClick={() => handleCopy("right")}>Copy</Button>
              <Button onClick={() => handleDownload("right")}>Download</Button>
            </Space>
          </div>
        </Space>

        <div className={styles.actionButtons}>
          <Button type="primary" size="large" onClick={handleCompare}>
            Compare
          </Button>
          <Button size="large" onClick={handleClear}>
            Clear
          </Button>
          <Select
            value={viewMode}
            onChange={(value) => setViewMode(value)}
            style={{ width: 120 }}
          >
            <option value="side">Side-by-Side</option>
            <option value="inline">Inline</option>
          </Select>
        </div>
      </div>

      {showDiff && (
        <div className={styles.diffSection}>
          <Title level={3}>Differences</Title>
          {diffResult.length === 0 ? (
            <Alert
              message="No differences found. Texts are identical."
              type="success"
              showIcon
            />
          ) : (
            <div
              className={
                viewMode === "side" ? styles.sideBySide : styles.inlineView
              }
            >
              {diffResult.map((line, index) => renderDiffLine(line, index))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
