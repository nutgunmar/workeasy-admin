"use client";

import { useState } from "react";
import {
  Button,
  Upload,
  Select,
  Input,
  Typography,
  Spin,
  message,
  Space,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import styles from "./styles.module.css";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface HashResult {
  algorithm: string;
  hash: string;
}

export default function HashCalculatorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState("");
  const [selectedAlgo, setSelectedAlgo] = useState("SHA-256");
  const [result, setResult] = useState<HashResult | null>(null);
  const [loading, setLoading] = useState(false);

  const algorithms = ["MD5", "SHA-1", "SHA-256", "SHA-512"];

  const calculateHash = async (
    data: Uint8Array,
    algo: string
  ): Promise<string> => {
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest(algo.toLowerCase(), data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const handleCalculate = async () => {
    if (!file && !textInput) {
      message.warning("Please select a file or enter text to hash.");
      return;
    }

    setLoading(true);
    try {
      let data: Uint8Array;
      if (file) {
        const arrayBuffer = await file.arrayBuffer();
        data = new Uint8Array(arrayBuffer);
      } else {
        const encoder = new TextEncoder();
        data = encoder.encode(textInput);
      }

      const hash = await calculateHash(data, selectedAlgo);
      setResult({ algorithm: selectedAlgo, hash });
      message.success(`Hash calculated successfully with ${selectedAlgo}!`);
    } catch (error) {
      message.error("Error calculating hash. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard
        .writeText(result.hash)
        .then(() => message.success("Hash copied to clipboard!"));
    }
  };

  const handleClear = () => {
    setFile(null);
    setTextInput("");
    setResult(null);
    setSelectedAlgo("SHA-256");
  };

  const uploadProps = {
    beforeUpload: (uploadedFile: File) => {
      setFile(uploadedFile);
      return false; // Prevent auto-upload
    },
    accept: "*/*", // All file types
    showUploadList: false,
  };

  return (
    <div className={styles.container}>
      <Title level={1} className={styles.title}>
        Hash File Online
      </Title>
      <p className={styles.instruction}>
        Calculate file or text hash locally in your browser. Privacy-focused and
        offline-capable.
      </p>

      <div className={styles.steps}>
        <div className={styles.step}>1. Select a file or enter text</div>
        <div className={styles.step}>2. Choose hash algorithm</div>
        <div className={styles.step}>3. Calculate hash</div>
      </div>

      <div className={styles.inputSection}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Upload {...uploadProps} className={styles.upload}>
            <Button icon={<UploadOutlined />}>
              Select File (or drag & drop)
            </Button>
          </Upload>
          {file && (
            <p className={styles.fileName}>
              Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p>
          )}

          <div className={styles.textInputSection}>
            <Title level={5}>Or enter text to hash:</Title>
            <TextArea
              rows={4}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Enter your text here..."
              className={styles.textArea}
            />
          </div>

          <Select
            value={selectedAlgo}
            onChange={setSelectedAlgo}
            style={{ width: "100%" }}
            className={styles.algoSelect}
          >
            {algorithms.map((algo) => (
              <Option key={algo} value={algo}>
                {algo}
              </Option>
            ))}
          </Select>

          <Space>
            <Button
              type="primary"
              size="large"
              onClick={handleCalculate}
              loading={loading}
              disabled={!file && !textInput}
            >
              {loading ? <Spin size="small" /> : "Calculate Hash"}
            </Button>
            <Button size="large" onClick={handleClear}>
              Clear
            </Button>
          </Space>
        </Space>
      </div>

      {result && (
        <div className={styles.resultSection}>
          <Title level={3}>Hash Result ({result.algorithm})</Title>
          <div className={styles.hashOutput}>
            <pre className={styles.hashText}>{result.hash}</pre>
            <Button onClick={handleCopy} type="link">
              Copy Hash
            </Button>
          </div>
          <p className={styles.privacyNote}>
            All calculations are done locally in your browser. No data is sent
            to any server.
          </p>
        </div>
      )}
    </div>
  );
}
