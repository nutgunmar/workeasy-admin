"use client"; // เปิดใช้งานฟีเจอร์ฝั่งไคลเอนต์

import { useState } from "react";
import { Select, Input, Button, Card, Space, message } from "antd";
const { Option } = Select;

export default function Home() {
  const [correlationId, setCorrelationId] = useState("");
  const [selectedEnv, setSelectedEnv] = useState("prod"); // ค่าเริ่มต้นเป็น prod

  // กำหนดโดเมนตาม environment
  const domains: { [key: string]: string } = {
    dev: "https://dev.example.com",
    staging: "https://staging.example.com",
    prod: "https://example.com",
  };

  // เทมเพลต URL
  const urlTemplate1 = `${domains[selectedEnv]}/app/discover#/?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-15m,to:now))&_a=(columns:!(api.command,reqBody,respBody,respStatus,service),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'cpx-request-*',key:api.correlationid,negate:!f,params:(query:'CORRELATION_ID'),type:phrase),query:(match_phrase:(api.correlationid:'CORRELATION_ID')))),hideChart:!t,index:'cpx-request-*',interval:auto,query:(language:kuery,query:''),sort:!(!('@timestamp',desc)))`;

  const urlTemplate2 = `${domains[selectedEnv]}//app/discover#/?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-15m,to:now))&_a=(columns:!(service,loglevel,logmessage,logtime),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'cpx-request-*',key:api.correlationid,negate:!f,params:(query:'CORRELATION_ID'),type:phrase),query:(match_phrase:(api.correlationid:'CORRELATION_ID')))),hideChart:!t,index:'cpx-api-log-ms-current-*',interval:auto,query:(language:kuery,query:''),sort:!(!('@timestamp',desc)))`;

  const handleOpenTabs = () => {
    if (!correlationId.trim()) {
      message.error("กรุณาใส่ correlation ID ที่ถูกต้อง.");
      return;
    }

    // แทนที่ 'CORRELATION_ID' ด้วยค่าที่ผู้ใช้ป้อน
    const url1 = urlTemplate1.replace(/CORRELATION_ID/g, correlationId);
    const url2 = urlTemplate2.replace(/CORRELATION_ID/g, correlationId);

    // ตรวจสอบว่า URL ถูกต้อง
    if (!url1.startsWith("https://") || !url2.startsWith("https://")) {
      message.error("เกิดข้อผิดพลาด: URL ไม่ถูกต้อง.");
      return;
    }

    // เปิดแท็บแรก
    window.open(url1, "_blank");

    // เปิดแท็บที่สองหลังจาก delay 200ms
    setTimeout(() => {
      window.open(url2, "_blank");
      message.success("เปิดทั้งสองแท็บเรียบร้อยแล้ว!");
    }, 200);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f0f2f5",
      }}
    >
      <Card
        title="ตัวสร้าง URL จาก Correlation ID"
        style={{ width: 600, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <label>เลือก Environment (เปลี่ยน Domain):</label>
            <Select
              value={selectedEnv}
              onChange={(value) => setSelectedEnv(value)}
              style={{ width: "100%", marginTop: 8 }}
            >
              <Option value="dev">Dev ({domains.dev})</Option>
              <Option value="staging">Staging ({domains.staging})</Option>
              <Option value="prod">Prod ({domains.prod})</Option>
            </Select>
          </div>

          <div>
            <label>ใส่ Correlation ID:</label>
            <Input
              value={correlationId}
              onChange={(e) => setCorrelationId(e.target.value)}
              placeholder="เช่น: 000f729f-f134-9187-a8d0-eddca28f284b"
              style={{ marginTop: 8 }}
            />
          </div>

          <Button
            type="primary"
            onClick={handleOpenTabs}
            style={{ width: "100%" }}
          >
            เปิด Tabs
          </Button>
        </Space>
      </Card>
    </div>
  );
}
