// src/app/settings/page.tsx
"use client";

import {
  Button,
  Form,
  Input,
  Slider,
  Upload,
  ColorPicker,
  Select,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useSettings } from "../../context/SettingsContext";
import type { UploadFile } from "antd";
import type { Color } from "antd/es/color-picker";

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings();
  const [form] = Form.useForm();

  const handleUpload = ({ file }: { file: UploadFile }) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      updateSettings({ logoUrl: e.target?.result as string });
      message.success("อัปโหลดโลโก้สำเร็จ");
    };
    reader.readAsDataURL(file.originFileObj as Blob);
    return false;
  };

  const onFinish = (values: any) => {
    const colorPrimary =
      typeof values.colorPrimary === "string"
        ? values.colorPrimary
        : values.colorPrimary.toHexString();

    updateSettings({ ...values, colorPrimary });
    message.success("บันทึกการตั้งค่าเรียบร้อย");
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h1>การตั้งค่า</h1>
      <Form
        form={form}
        initialValues={{
          appName: settings.appName || "",
          logoUrl: settings.logoUrl || "",
          colorPrimary: settings.colorPrimary || "#1890ff",
          fontSize: settings.fontSize || 14,
          sidebarWidth: settings.sidebarWidth || 200,
          appThemeMode: settings.appThemeMode || "dark",
        }}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item name="appName" label="ชื่อโปรเจกต์">
          <Input placeholder="ชื่อแอป" />
        </Form.Item>

        <Form.Item label="โลโก้ (อัปโหลดรูป)">
          <Upload
            name="logo"
            beforeUpload={() => false}
            customRequest={handleUpload}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>อัปโหลดโลโก้</Button>
          </Upload>
          {settings.logoUrl && (
            <img
              src={settings.logoUrl}
              alt="โลโก้"
              style={{ width: 100, marginTop: 10 }}
            />
          )}
        </Form.Item>

        <Form.Item
          name="colorPrimary"
          label="สีหลัก"
          rules={[{ required: true, message: "กรุณาเลือกสีหลัก" }]}
        >
          <ColorPicker
            showText
            presets={[
              {
                label: "ตัวเลือกสีแนะนำ",
                colors: ["#1890ff", "#52c41a", "#f5222d", "#722ed1"],
              },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="appThemeMode"
          label="โหมดธีม"
          rules={[{ required: true, message: "กรุณาเลือกโหมดธีม" }]}
        >
          <Select
            options={[
              { label: "Dark", value: "dark" },
              { label: "Light", value: "light" },
            ]}
          />
        </Form.Item>

        <Form.Item name="fontSize" label="ขนาดฟอนต์ (px)">
          <Slider min={10} max={24} />
        </Form.Item>

        <Form.Item name="sidebarWidth" label="ขนาดเมนูด้านซ้าย (px)">
          <Slider min={150} max={300} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            บันทึก
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
