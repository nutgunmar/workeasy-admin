// src/app/decode-jwt/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Input, Typography, Select, Badge, Alert, App } from "antd";
import { jwtDecode } from "jwt-decode";
import { jwtVerify } from "jose";
import styles from "./styles.module.css";

const { Title } = Typography;
const { TextArea } = Input;

interface DecodedToken {
  header: any;
  payload: any;
}

export default function DecodeJwtPage() {
  const { message } = App.useApp(); // ใช้ useApp เพื่อดึง message instance
  const [encodedJwt, setEncodedJwt] = useState("");
  const [secret, setSecret] = useState("your-secret-key");
  const [encoding, setEncoding] = useState("base64url");
  const [decoded, setDecoded] = useState<DecodedToken | null>(null);
  const [isValidJwt, setIsValidJwt] = useState(false);
  const [signatureVerified, setSignatureVerified] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (encodedJwt) {
      try {
        const parts = encodedJwt.split(".");
        if (parts.length !== 3) {
          throw new Error("Invalid JWT format");
        }

        const decodePart = (part: string) => {
          if (encoding === "base64") {
            return atob(part.replace(/-/g, "+").replace(/_/g, "/"));
          } else {
            return atob(part);
          }
        };

        const header = JSON.parse(decodePart(parts[0]) || "{}");
        const payload = jwtDecode(encodedJwt);
        setDecoded({ header, payload });

        setIsValidJwt(true);
        setError("");
        verifySignature();
      } catch (err: any) {
        setDecoded(null);
        setIsValidJwt(false);
        setError(err.message);
        setSignatureVerified(false);
      }
    } else {
      setDecoded(null);
      setIsValidJwt(false);
      setSignatureVerified(false);
      setError("");
    }
  }, [encodedJwt, encoding]);

  const verifySignature = async () => {
    if (!secret || !encodedJwt) return;

    try {
      const secretKey = new TextEncoder().encode(secret);
      await jwtVerify(encodedJwt, secretKey, { algorithms: ["HS256"] });
      setSignatureVerified(true);
      message.success("Signature verified successfully!");
    } catch (err) {
      setSignatureVerified(false);
      message.error("Signature verification failed.");
    }
  };

  const prettyJson = (obj: any) => JSON.stringify(obj, null, 2);

  return (
    <App> {/* Wrap ด้วย App component */}
      <div className={styles.container}>
        <Title level={1}>JSON Web Token (JWT) Debugger</Title>
        <p className={styles.instruction}>
          Paste a JWT below that you'd like to decode, validate, and verify.
        </p>

        <div className={styles.section}>
          <Title level={4}>Encoded value</Title>
          <TextArea
            rows={3}
            value={encodedJwt}
            onChange={(e) => setEncodedJwt(e.target.value)}
            placeholder="Paste your JWT here (e.g., eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)"
            className={styles.textArea}
          />
          <Badge
            status={isValidJwt ? "success" : "error"}
            text={isValidJwt ? "Valid JWT" : "Invalid JWT"}
          />
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            className={styles.errorAlert}
          />
        )}

        {decoded && (
          <>
            <div className={styles.section}>
              <Title level={4}>Decoded Header</Title>
              <pre className={styles.jsonOutput}>
                {prettyJson(decoded.header)}
              </pre>
            </div>

            <div className={styles.section}>
              <Title level={4}>Decoded Payload</Title>
              <pre className={styles.jsonOutput}>
                {prettyJson(decoded.payload)}
              </pre>
            </div>
          </>
        )}

        <div className={styles.verificationSection}>
          <Title level={3}>JWT Signature Verification (Optional)</Title>
          <Title level={4}>Secret</Title>
          <Input.Password
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Enter the secret used to sign the JWT"
            className={styles.input}
          />
          <Badge
            status={secret ? "success" : "default"}
            text={secret ? "Valid secret" : "Enter secret"}
          />

          <div className={styles.encodingRow}>
            <label>Encoding Format</label>
            <Select
              value={encoding}
              onChange={setEncoding}
              style={{ width: 150 }}
            >
              <Select.Option value="base64url">Base64Url</Select.Option>
              <Select.Option value="base64">Base64</Select.Option>
            </Select>
          </div>

          <Badge
            status={signatureVerified ? "success" : "error"}
            text={
              signatureVerified ? "Signature Verified" : "Signature Not Verified"
            }
          />
        </div>
      </div>
    </App>
  );
}