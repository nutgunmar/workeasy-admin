"use client"; // ระบุว่าไฟล์นี้เป็น Client Component เพื่อใช้ React Hooks

import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Collapse,
  Table,
  Typography,
  Spin,
  Switch,
} from "antd";

const { Panel } = Collapse;
const { Title, Text } = Typography;

// ฟังก์ชันสุ่มสี pastel สำหรับ highlight
const getRandomPastelColor = () => {
  const colors = [
    "#FFCCCB", // แดงอ่อน
    "#CCFFCC", // เขียวอ่อน
    "#CCCCFF", // ฟ้าอ่อน
    "#FFFFCC", // เหลืองอ่อน
    "#FFCCFF", // ชมพูอ่อน
    "#CCFFFF", // ฟ้าเทอร์ควอยซ์
    "#FFDAB9", // พีช
    "#E6E6FA", // ลาเวนเดอร์
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// ฟังก์ชัน highlight คีย์ที่เปลี่ยนในเนื้อหา
const highlightContent = (
  content: any,
  diffs: any[],
  enableHighlight: boolean
) => {
  if (!content || !enableHighlight) {
    return <pre>{JSON.stringify(content, null, 2)}</pre>;
  }

  // สร้าง map ของคีย์ที่เปลี่ยนและกำหนดสี
  const diffKeys = new Map<string, string>();
  diffs.forEach((diff) => {
    if (!diffKeys.has(diff.key)) {
      diffKeys.set(diff.key, getRandomPastelColor());
    }
  });

  // แปลง JSON เป็น string และ highlight คีย์
  const lines = JSON.stringify(content, null, 2).split("\n");
  const highlightedLines = lines.map((line, index) => {
    let modifiedLine = line;
    diffKeys.forEach((color, key) => {
      if (line.includes(`"${key}"`)) {
        modifiedLine = line.replace(
          `"${key}"`,
          `<span style="background-color: ${color}">"${key}"</span>`
        );
      }
    });
    return (
      <div key={index} dangerouslySetInnerHTML={{ __html: modifiedLine }} />
    );
  });

  return <pre>{highlightedLines}</pre>;
};

export default function SpringDiff() {
  const [oldTag, setOldTag] = useState("");
  const [newTag, setNewTag] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [enableHighlight, setEnableHighlight] = useState(true); // State สำหรับ toggle highlight

  // ฟังก์ชันจัดการการส่งฟอร์ม
  const handleSubmit = async (values: { oldTag: string; newTag: string }) => {
    setLoading(true); // เริ่มโหลด
    setError(null); // ล้างข้อผิดพลาด
    setResult(null); // ล้างผลลัพธ์เก่า

    try {
      // ส่ง POST request ไปยัง API
      const res = await fetch("/api/check-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldTag: values.oldTag, newTag: values.newTag }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setResult(data); // เก็บผลลัพธ์
    } catch (err: any) {
      setError(err.message); // เก็บข้อผิดพลาด
    } finally {
      setLoading(false); // หยุดโหลด
    }
  };

  // กำหนดคอลัมน์สำหรับตาราง diff
  const diffColumns = [
    {
      title: "คีย์",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "ค่าเก่า",
      dataIndex: "old",
      key: "old",
      render: (text: string | undefined) => text ?? "ไม่มี",
    },
    {
      title: "ค่าใหม่",
      dataIndex: "new",
      key: "new",
      render: (text: string | undefined) => text ?? "ไม่มี",
    },
    {
      title: "ประเภท",
      dataIndex: "type",
      key: "type",
      render: (text: string) =>
        text === "added" ? "เพิ่ม" : text === "removed" ? "ลบ" : "เปลี่ยน",
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>ตรวจสอบ Diff คอนฟิก</Title>
      {/* ฟอร์มสำหรับกรอก oldTag และ newTag */}
      <Form
        onFinish={handleSubmit}
        layout="inline"
        style={{ marginBottom: "24px" }}
      >
        <Form.Item
          name="oldTag"
          rules={[{ required: true, message: "กรุณากรอก Old Tag" }]}
        >
          <Input
            placeholder="Old Tag (เช่น b765fabd4c หรือ 3.6.17)"
            value={oldTag}
            onChange={(e) => setOldTag(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name="newTag"
          rules={[{ required: true, message: "กรุณากรอก New Tag" }]}
        >
          <Input
            placeholder="New Tag (เช่น 85bc2e62bf หรือ 3.7.90)"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            รัน
          </Button>
        </Form.Item>
      </Form>

      {/* Toggle การ highlight */}
      <div style={{ marginBottom: "16px" }}>
        <Switch
          checked={enableHighlight}
          onChange={(checked) => setEnableHighlight(checked)}
          checkedChildren="เปิด Highlight"
          unCheckedChildren="ปิด Highlight"
        />
      </div>

      {/* แสดงข้อผิดพลาด */}
      {error && <Text type="danger">ข้อผิดพลาด: {error}</Text>}

      {/* แสดงโหลด โดยห่อ Spin รอบ div เพื่อแก้ warning */}
      {loading && (
        <Spin tip="กำลังโหลด...">
          <div style={{ padding: "50px", textAlign: "center" }} />
        </Spin>
      )}

      {/* แสดงผลลัพธ์ */}
      {result && (
        <div>
          {Object.keys(result.envs).length === 0 ? (
            <Text>
              ไม่มีโฟลเดอร์ config/ หรือไม่มีเปลี่ยนแปลงใน tag ที่ระบุ
            </Text>
          ) : (
            <Collapse>
              {/* วนลูปแต่ละ env ด้วย Collapse ชั้นนอก เพื่อ expand/unexpand env */}
              {Object.entries(result.envs).map(
                ([env, services]: [string, any]) => (
                  <Panel
                    header={`Env: ${env} (บริการที่เปลี่ยน: ${
                      Object.keys(services).length
                    })`}
                    key={env}
                  >
                    <Collapse>
                      {/* วนลูปแต่ละไฟล์ใน env */}
                      {Object.entries(services).map(
                        ([file, { old, new: newContent, diffs }]: [
                          string,
                          any
                        ]) => (
                          <Panel
                            header={`${file} ${
                              diffs.length > 0
                                ? `(เปลี่ยนแปลง: ${diffs.length})`
                                : "(ถูกเพิ่ม/ลบ)"
                            }`}
                            key={file}
                          >
                            {/* ตรวจสอบว่าไฟล์ถูกเพิ่มหรือลบ */}
                            {old === null && (
                              <Text type="warning">
                                ไฟล์ถูกเพิ่มใน tag ใหม่
                              </Text>
                            )}
                            {newContent === null && (
                              <Text type="danger">ไฟล์ถูกลบใน tag ใหม่</Text>
                            )}

                            {/* แสดงตาราง diff */}
                            <Title level={5}>การเปลี่ยนแปลง:</Title>
                            {diffs.length === 0 ? (
                              <Text>ไม่มีการเปลี่ยนแปลง</Text>
                            ) : (
                              <Table
                                columns={diffColumns}
                                dataSource={diffs}
                                rowKey={(record, index) => index}
                                pagination={false}
                                size="small"
                              />
                            )}

                            {/* แสดงเนื้อหาเก่า */}
                            <Title level={5}>เนื้อหาเก่า:</Title>
                            {highlightContent(old, diffs, enableHighlight)}

                            {/* แสดงเนื้อหาใหม่ */}
                            <Title level={5}>เนื้อหาใหม่:</Title>
                            {highlightContent(
                              newContent,
                              diffs,
                              enableHighlight
                            )}
                          </Panel>
                        )
                      )}
                    </Collapse>
                  </Panel>
                )
              )}
            </Collapse>
          )}
        </div>
      )}
    </div>
  );
}
