"use client";

import { useState } from "react";
import { Form, Input, Button, Collapse, Table, Typography, Spin, Switch } from "antd";

const { Panel } = Collapse;
const { Title, Text } = Typography;

// ฟังก์ชันสุ่มสี pastel สำหรับ highlight
const getRandomPastelColor = () => {
  const colors = [
    '#FFCCCB', // แดงอ่อน
    '#CCFFCC', // เขียวอ่อน
    '#CCCCFF', // ฟ้าอ่อน
    '#FFFFCC', // เหลืองอ่อน
    '#FFCCFF', // ชมพูอ่อน
    '#CCFFFF', // ฟ้าเทอร์ควอยซ์
    '#FFDAB9', // พีช
    '#E6E6FA', // ลาเวนเดอร์
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// ฟังก์ชัน highlight คีย์ที่ต่างในเนื้อหา
const highlightContent = (content: any, diffs: any[], enableHighlight: boolean) => {
  if (!content || !enableHighlight) {
    return <pre>{JSON.stringify(content, null, 2)}</pre>;
  }

  const diffKeys = new Map<string, string>();
  diffs.forEach(diff => {
    if (!diffKeys.has(diff.key)) {
      diffKeys.set(diff.key, getRandomPastelColor());
    }
  });

  const lines = JSON.stringify(content, null, 2).split('\n');
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
    return <div key={index} dangerouslySetInnerHTML={{ __html: modifiedLine }} />;
  });

  return <pre>{highlightedLines}</pre>;
};

export default function EnvCompare() {
  const [tag, setTag] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [enableHighlight, setEnableHighlight] = useState(true);
  const [enableFilter, setEnableFilter] = useState(true);

  // ฟังก์ชันจัดการการส่งฟอร์ม
  const handleSubmit = async (values: { tag: string }) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/compare-envs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag: values.tag, filter: enableFilter.toString() }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // คำนวณจำนวน diffs รวม
  const getTotalDiffs = (result: any) => {
    if (!result || !result.diffs) return 0;
    return Object.values(result.diffs).reduce((sum: number, file: any) => sum + file.diffs.length, 0);
  };

  // กำหนดคอลัมน์สำหรับตาราง diff
  const diffColumns = [
    { title: "คีย์", dataIndex: "key", key: "key" },
    {
      title: "ค่า pt",
      dataIndex: "pt",
      key: "pt",
      render: (text: string | undefined) => (text ?? "ไม่มี"),
    },
    {
      title: "ค่า prod",
      dataIndex: "prod",
      key: "prod",
      render: (text: string | undefined) => (text ?? "ไม่มี"),
    },
    {
      title: "ประเภท",
      dataIndex: "type",
      key: "type",
      render: (text: string) =>
        text === "added_in_prod" ? "เพิ่มใน prod" : text === "added_in_pt" ? "เพิ่มใน pt" : "เปลี่ยน",
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>เปรียบเทียบ Config ระหว่าง pt และ prod</Title>
      <Form onFinish={handleSubmit} layout="inline" style={{ marginBottom: "16px" }}>
        <Form.Item
          name="tag"
          rules={[{ required: true, message: "กรุณากรอก Tag" }]}
        >
          <Input
            placeholder="Tag (เช่น 85bc2e62 หรือ 3.6.17)"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            รัน
          </Button>
        </Form.Item>
      </Form>

      {/* Toggle การ highlight และ filter */}
      <div style={{ marginBottom: "16px" }}>
        <Switch
          checked={enableHighlight}
          onChange={(checked) => setEnableHighlight(checked)}
          checkedChildren="เปิด Highlight"
          unCheckedChildren="ปิด Highlight"
          style={{ marginRight: "16px" }}
        />
        <Switch
          checked={enableFilter}
          onChange={(checked) => setEnableFilter(checked)}
          checkedChildren="กรองคีย์ที่คาดว่าจะต่าง"
          unCheckedChildren="แสดงทุก Diff"
        />
      </div>

      {/* แสดงข้อผิดพลาด */}
      {error && <Text type="danger">ข้อผิดพลาด: {error}</Text>}

      {/* แสดงจำนวน diffs */}
      {result && (
        <Text style={{ display: "block", marginBottom: "16px" }}>
          จำนวนความแตกต่างทั้งหมด: {getTotalDiffs(result)}
        </Text>
      )}

      {/* แสดงโหลด */}
      {loading && (
        <Spin tip="กำลังโหลด...">
          <div style={{ padding: "50px", textAlign: "center" }} />
        </Spin>
      )}

      {/* แสดงผลลัพธ์ */}
      {result && (
        <div>
          {Object.keys(result.diffs).length === 0 ? (
            <Text>ไม่มีโฟลเดอร์ config/pt หรือ prod หรือไม่มีความแตกต่างใน tag ที่ระบุ</Text>
          ) : (
            <Collapse>
              {Object.entries(result.diffs).map(([file, { pt, prod, diffs }]: [string, any]) => (
                <Panel
                  header={`${file} ${
                    diffs.length > 0
                      ? `(แตกต่าง: ${diffs.length})`
                      : "(ถูกเพิ่ม/ลบ)"
                  }`}
                  key={file}
                >
                  {pt === null && <Text type="warning">ไฟล์ถูกเพิ่มใน prod</Text>}
                  {prod === null && <Text type="danger">ไฟล์ถูกเพิ่มใน pt</Text>}
                  <Title level={5}>ความแตกต่าง:</Title>
                  {diffs.length === 0 ? (
                    <Text>ไม่มีความแตกต่าง</Text>
                  ) : (
                    <Table
                      columns={diffColumns}
                      dataSource={diffs}
                      rowKey={(record, index) => index}
                      pagination={false}
                      size="small"
                    />
                  )}
                  <Title level={5}>เนื้อหา pt:</Title>
                  {highlightContent(pt, diffs, enableHighlight)}
                  <Title level={5}>เนื้อหา prod:</Title>
                  {highlightContent(prod, diffs, enableHighlight)}
                </Panel>
              ))}
            </Collapse>
          )}
        </div>
      )}
    </div>
  );
}