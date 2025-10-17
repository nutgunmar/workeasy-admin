// src/app/ClientLayout.tsx
"use client";

import { Layout, Drawer, Button, Menu, App } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
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
  const [collapsed, setCollapsed] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { settings } = useSettings();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const menuItems = [
    {
      key: "home",
      icon: <HomeOutlined />,
      label: <Link href="/">Home</Link>,
    },
    {
      key: "decode-jwt",
      icon: <SafetyOutlined />,
      label: <Link href="/decode-jwt">Decode JWT</Link>,
    },
    {
      key: "json-format",
      icon: <FileTextOutlined />,
      label: <Link href="/json-format">JSON Format</Link>,
    },
    {
      key: "kibana-log",
      icon: <FileTextOutlined />,
      label: <Link href="/kibana-log">Kibana Log</Link>,
    },
    {
      key: "diff-checker",
      icon: <FileTextOutlined />,
      label: <Link href="/diff-checker">Diff Checker</Link>,
    },
    {
      key: "thai-id",
      icon: <SafetyOutlined />,
      label: <Link href="/thai-id">Thai ID</Link>,
    },
    {
      key: "env-compare",
      icon: <FileTextOutlined />,
      label: <Link href="/env-compare">Env Compare</Link>,
    },
    {
      key: "hash-calculator",
      icon: <SafetyOutlined />,
      label: <Link href="/hash-calculator">Hash Calculator</Link>,
    },
    {
      key: "spring-diff",
      icon: <FileTextOutlined />,
      label: <Link href="/spring-diff">Spring Diff</Link>,
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: <Link href="/settings">Settings</Link>,
    },
  ];

  const selectedKey = pathname === "/" ? "home" : pathname.replace("/", "");
  const openKeys = menuItems
    .filter((item) => item.children?.some((child) => child.key === selectedKey))
    .map((item) => item.key);

  return (
    <App> {/* Wrap ทั้ง layout ด้วย App */}
      <Layout style={{ minHeight: "100vh" }}>
        <Drawer
          placement="left"
          closable={false}
          onClose={() => setCollapsed(true)}
          open={isClient && !collapsed}
          width={settings.sidebarWidth}
          styles={{
            body: {
              padding: 0,
              background: settings.appThemeMode === "dark" ? "#001529" : "#fff",
            },
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
              onClick={() => setCollapsed(!collapsed)}
              style={{ marginBottom: 16 }}
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            >
              {collapsed ? "เปิดเมนู" : "ปิดเมนู"}
            </Button>
            {children}
          </Content>
        </Layout>
      </Layout>
    </App>
  );
}