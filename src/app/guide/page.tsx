"use client";

import { Typography, Steps, Card, Button, Space, theme } from "antd";
import {
  BookOutlined,
  RightOutlined,
  ArrowUpOutlined,
  AimOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const { Title, Paragraph, Text } = Typography;
const { useToken } = theme;

const GuidePage: React.FC = () => {
  const { token } = useToken();

  const guideSteps = [
    {
      title: "Pick Your Subject",
      description: "Open the Subject dropdown and choose the A‑Level subject you want to practise.",
      icon: <BookOutlined />,
    },
    {
      title: "Choose Year & Type",
      description:
        "Select the exam year and paper type (MCQ, Structured Essay, etc.) from the dropdowns.",
      icon: <RightOutlined />,
    },
    {
      title: "Press Submit",
      description:
        "Hit the Submit button to fetch that paper. We'll load questions and keep track of your picks.",
      icon: <ArrowUpOutlined />,
    },
    {
      title: "Answer & Reveal",
      description: `Try each question yourself, then click "Show Answer" to reveal the official answer and learn instantly.`,
      icon: <AimOutlined />,
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: token.colorBgLayout }}>
      <Card
        bordered={false}
        style={{
          maxWidth: 900,
          margin: "0 auto",
          background: token.colorBgContainer,
          boxShadow: token.boxShadow,
        }}
      >
        <Typography style={{ textAlign: "center", marginBottom: 48 }}>
          <Title
            level={1}
            style={{
              background: `linear-gradient(to right, ${token.colorPrimary}, ${token.colorInfo})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            How to Use OpenPapers
          </Title>
          <Paragraph style={{ fontSize: 16, color: token.colorTextSecondary }}>
            Follow these quick steps to get practicing in seconds.
          </Paragraph>
        </Typography>

        <Steps
          direction="vertical"
          size="default"
          items={guideSteps.map((step, index) => ({
            title: (
              <Text strong style={{ fontSize: 18 }}>
                {step.title}
              </Text>
            ),
            description: (
              <Paragraph style={{ color: token.colorTextSecondary }}>{step.description}</Paragraph>
            ),
            icon: step.icon,
            status: "process",
          }))}
        />

        <div style={{ textAlign: "center", marginTop: 48 }}>
          <Space>
            <Text type="secondary">Ready? Head back to the</Text>
            <Link href="/" passHref>
              <Button type="primary" icon={<HomeOutlined />}>
                Home page
              </Button>
            </Link>
            <Text type="secondary">and start practising!</Text>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default GuidePage;
