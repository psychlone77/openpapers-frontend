"use client";

import { Typography } from "antd";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center p-24">
      <Typography.Title level={1} className="text-4xl font-bold text-center">
        404 - Page Not Found
      </Typography.Title>
      <Typography.Paragraph className="text-lg text-center mt-4">
        The page you are looking for does not exist or has been moved.
      </Typography.Paragraph>
    </main>
  );
}
