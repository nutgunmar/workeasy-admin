// src/app/page.tsx
import { Card, Row, Col, Space } from "antd";
import Link from "next/link";
import {
  SafetyOutlined,
  FileTextOutlined,
  DatabaseOutlined,
  DiffOutlined,
  IdcardOutlined,
  EnvironmentOutlined,
  LockOutlined,
  CodeOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const features = [
  {
    key: "decode-jwt",
    title: "Decode JWT",
    description: "ถอดรหัส JWT token อย่างรวดเร็วและปลอดภัย",
    icon: <SafetyOutlined />,
    path: "/decode-jwt",
  },
  {
    key: "json-format",
    title: "JSON Format",
    description: "จัดรูปแบบ JSON ให้อ่านง่าย พร้อม validate",
    icon: <FileTextOutlined />,
    path: "/json-format",
  },
  {
    key: "kibana-log",
    title: "Kibana Log",
    description: "วิเคราะห์และค้นหา logs จาก Kibana ได้ง่ายๆ",
    icon: <DatabaseOutlined />,
    path: "/kibana-log",
  },
  {
    key: "diff-checker",
    title: "Diff Checker",
    description: "เปรียบเทียบข้อความหรือไฟล์แบบ side-by-side",
    icon: <DiffOutlined />,
    path: "/diff-checker",
  },
  {
    key: "thai-id",
    title: "Thai ID Validator",
    description: "ตรวจสอบและ validate เลขบัตรประชาชนไทย",
    icon: <IdcardOutlined />,
    path: "/thai-id",
  },
  {
    key: "env-compare",
    title: "Env Compare",
    description: "เปรียบเทียบ environment variables ระหว่างสภาพแวดล้อม",
    icon: <EnvironmentOutlined />,
    path: "/env-compare",
  },
  {
    key: "hash-calculator",
    title: "Hash Calculator",
    description: "คำนวณ hash (MD5, SHA) สำหรับข้อมูลต่างๆ",
    icon: <LockOutlined />,
    path: "/hash-calculator",
  },
  {
    key: "spring-diff",
    title: "Spring Diff",
    description: "เปรียบเทียบ config Spring Boot application",
    icon: <CodeOutlined />,
    path: "/spring-diff",
  },
  {
    key: "settings",
    title: "Settings",
    description: "จัดการการตั้งค่าทั่วไปของแอป",
    icon: <SettingOutlined />,
    path: "/settings",
  },
];

export default function HomePage() {
  return (
    <div style={{ padding: "24px", background: "var(--background)", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", marginBottom: "32px", fontSize: "32px", color: "var(--foreground)" }}>
        ยินดีต้อนรับสู่ WorkEasy Admin Tools
      </h1>
      <p style={{ textAlign: "center", marginBottom: "48px", fontSize: "16px", color: "var(--foreground)" }}>
        เครื่องมืออรรถประโยชน์สำหรับนักพัฒนา สร้างด้วย Next.js และ Ant Design
      </p>

      <Row gutter={[16, 16]} justify="center">
        {features.map((feature) => (
          <Col xs={24} sm={12} md={8} lg={6} key={feature.key}>
            <Link href={feature.path} passHref>
              <Card
                hoverable
                cover={
                  <div style={{ height: "120px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px", color: "var(--color-primary)" }}>
                    {feature.icon}
                  </div>
                }
                style={{ textAlign: "center", height: "100%", background: "var(--background)", color: "var(--foreground)" }}
              >
                <Card
                  title={<h4 style={{ marginBottom: "8px", color: "var(--foreground)" }}>{feature.title}</h4>}
                  description={<span style={{ fontSize: "14px", color: "var(--foreground)" }}>{feature.description}</span>}
                />
              </Card>
            </Link>
          </Col>
        ))}
      </Row>

      <Space style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "48px" }}>
        <Link href="/decode-jwt" style={{ textDecoration: "none", color: "var(--color-primary)" }}>
          เริ่มใช้งานทันที
        </Link>
      </Space>
    </div>
  );
}