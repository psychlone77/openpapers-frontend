"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Button, Dropdown, Layout } from "antd";
import { MenuOutlined, MoonOutlined, SunOutlined, GithubOutlined } from "@ant-design/icons";
import { useTheme } from "@/contexts/ThemeProvider";

const { Header } = Layout;
const routes = [
  { name: "Papers", path: "/papers" },
  { name: "Guide", path: "/guide" },
  { name: "About Us", path: "/about" },
];

export function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme();
  const pathname = usePathname();

  const menuItems = routes.map((route) => ({
    key: route.path,
    label: <Link href={route.path}>{route.name}</Link>,
  }));

  const mobileMenuItems = [
    ...menuItems,
    {
      key: "contribute",
      label: (
        <Link
          href="https://github.com/psychlone77/openpapers-data-collecting"
          target="_blank"
          rel="noopener noreferrer"
        >
          Contribute
        </Link>
      ),
      icon: <GithubOutlined />,
    },
  ];

  return (
    <Header style={{ padding: 0 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <span className="text-primary font-bold text-xl">OpenPapers</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-grow justify-center w-full">
            <Menu
              style={{ width: "250px", display: "flex", justifyContent: "center" }}
              mode="horizontal"
              selectedKeys={[pathname]}
              items={menuItems}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <Button
              onClick={toggleTheme}
              icon={isDarkMode ? <MoonOutlined /> : <SunOutlined />}
              className="flex justify-center items-center"
              aria-label="Toggle dark mode"
              type="text"
            />

            {/* Contribute Button (Desktop) */}
            <div className="hidden md:block">
              <Button type="primary">
                <Link
                  href="https://github.com/psychlone77/openpapers-data-collecting"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GithubOutlined className="mr-2" />
                  Contribute
                </Link>
              </Button>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Dropdown
                menu={{
                  items: mobileMenuItems,
                }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <Button
                  type="text"
                  icon={<MenuOutlined />}
                  className="flex items-center justify-center"
                  aria-label="Open main menu"
                />
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </Header>
  );
}
