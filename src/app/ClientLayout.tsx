// src/app/ClientLayout.tsx
"use client";

import { Layout, Drawer, Button } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  HomeOutlined,
  SafetyOutlined,
  FileTextOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useSettings } from "../context/SettingsContext";

const { Content } = Layout;

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true);
  const { settings } = useSettings();

  const menuItems = [
    // รายการเมนูเหมือนเดิม
  ];

  const selectedKey = pathname === "/" ? "home" : pathname.replace("/", "");
  const openKeys = menuItems
    .filter((item) => item.children?.some((child) => child.key === selectedKey))
    .map((item) => item.key);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Drawer
        placement="left"
        closable={false}
        onClose={() => setCollapsed(true)}
        open={!collapsed}
        width={settings.sidebarWidth}
        bodyStyle={{
          padding: 0,
          background: settings.appThemeMode === "dark" ? "#001529" : "#fff",
        }}
      >
        <div
          style={{
            height: 32,
            margin: 16,
            background: settings.logoUrl
              ? `url(${settings.logoUrl}) center/contain no-repeat`
              : "transparent",
            color: "var(--foreground)",
            textAlign: "center",
            lineHeight: "32px",
          }}
        >
          {settings.appName}
        </div>
        <Menu
          theme={settings.appThemeMode}
          mode="inline"
          selectedKeys={[selectedKey]}
          defaultOpenKeys={openKeys}
          items={menuItems}
          style={{
            background: "var(--background)",
            color: "var(--foreground)",
          }}
        />
      </Drawer>
      <Layout>
        <Content
          style={{
            margin: "16px",
            background: "var(--background)",
            padding: 24,
            color: "var(--foreground)",
          }}
        >
          <Button
            onClick={() => setCollapsed(false)}
            style={{ marginBottom: 16 }}
          >
            เปิดเมนู
          </Button>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
